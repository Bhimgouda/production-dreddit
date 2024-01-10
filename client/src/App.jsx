import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import NewPostForm from "./components/NewPostForm/NewPostForm";
import Dashboard from "./components/Dashboard";
import { VoyageProvider, Wallet, getLogicDriver } from "js-moi-sdk";
import LoginModal from "./components/LoginModal";

const provider = new VoyageProvider("babylon");

// ------- Update with your logic Id ------------------ //
const logicId = process.env.REACT_APP_LOGIC_ID;

function App() {
  const [posts, setPosts] = useState([]);
  const [isNewPostFormOpen, setIsNewPostFormOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logicDriver, setLogicDriver] = useState();

  useEffect(() => {
    if (!logicDriver) return;

    getPosts();
  }, [logicDriver]);

  const handleLogin = async (iomeObj) => {
    setIsModalOpen(false);
    const mnemonic = iomeObj.user.SRP();
    // --- Init Wallet with users mnemonic ---- //
    try {
      const wallet = new Wallet(provider);
      await wallet.fromMnemonic(mnemonic, "m/44'/6174'/7020'/0/0");
      const lDriver = await getLogicDriver(logicId, wallet);
      setLogicDriver(lDriver);
      setMnemonic(mnemonic);
    } catch (error) {}
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showLoginModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setMnemonic("");
    setPosts([]);
  };

  const getPosts = async () => {
    try {
      setLoadingPost(true);
      let ixResponse = await logicDriver.routines.GetPosts().call({
        fuelPrice: 1,
        fuelLimit: 10000,
      });
      let { allPosts } = (await ixResponse.result()).output;
      allPosts = await getUserVote(allPosts);
      allPosts.reverse();
      setPosts(allPosts);
      setLoadingPost(false);
    } catch (error) {
      setLoadingPost(false);
      console.log(error);
    }
  };

  const getUserVote = async (posts) => {
    for (let i = 0; i < posts.length; i++) {
      const readIx = await logicDriver.routines.GetUserVote([posts[i].id]).call({
        fuelPrice: 1,
        fuelLimit: 1000,
      });
      const { vote } = (await readIx.result()).output;
      posts[i].usersVote = vote;
    }
    return posts;
  };

  const handleCreatePost = async (content) => {
    try {
      const ix = await logicDriver.routines.CreatePost([content]).send({
        fuelPrice: 1,
        fuelLimit: 1000,
      });
      const { post: newPost } = (await ix.result()).output;
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const ix = await logicDriver.routines.Upvote([id]).send({
        fuelPrice: 1,
        fuelLimit: 1000,
      });
      await ix.wait();
      const tPost = posts.map((post) => {
        if (post.id === id) {
          if (post.usersVote == 2) {
            post.downvotes--;
          }
          post.upvotes++;
          post.usersVote = 1;
        }
        return post;
      });
      setPosts(tPost);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownvote = async (id) => {
    try {
      const ix = await logicDriver.routines.Downvote([id]).send({
        fuelPrice: 1,
        fuelLimit: 1000,
      });
      await ix.wait();
      const tPost = posts.map((post) => {
        if (post.id === id) {
          if (post.usersVote == 1) {
            post.upvotes--;
          }
          post.usersVote = 2;
          post.downvotes++;
        }
        return post;
      });
      setPosts(tPost);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} mnemonic={mnemonic} showLoginModal={showLoginModal} />
      <Toaster />
      <LoginModal handleCancel={handleCancel} handleLogin={handleLogin} isModalOpen={isModalOpen} />
      {isNewPostFormOpen && (
        <NewPostForm
          handleCreatePost={handleCreatePost}
          isNewPostFormOpen={isNewPostFormOpen}
          setIsNewPostFormOpen={setIsNewPostFormOpen}
        />
      )}
      <Dashboard
        loadingPost={loadingPost}
        mnemonic={mnemonic}
        showLoginModal={showLoginModal}
        handleUpvote={handleUpvote}
        handleDownvote={handleDownvote}
        posts={posts}
        setIsNewPostFormOpen={setIsNewPostFormOpen}
      />
    </>
  );
}

export default App;

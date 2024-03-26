import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import NewPostForm from "./components/NewPostForm/NewPostForm";
import Dashboard from "./components/Dashboard";
import { VoyageProvider, Wallet, getLogicDriver } from "js-moi-sdk";
import LoginModal from "./components/LoginModal";
import { error, info, success } from "./utils/toastWrapper";

const provider = new VoyageProvider("babylon");
const logicId = process.env.REACT_APP_LOGIC_ID;
const wallet = new Wallet(provider);
await wallet.fromMnemonic(process.env.REACT_APP_BASE_MNEMONIC, "m/44'/6174'/7020'/0/0");
const baseLogicDriver = await getLogicDriver(logicId, wallet);

function App() {
  const [posts, setPosts] = useState([]);
  const [isNewPostFormOpen, setIsNewPostFormOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logicDriver, setLogicDriver] = useState();
  const [userName, setUserName] = useState();

  useEffect(() => {
    getPosts();
  }, [logicDriver]);

  const handleLogin = async (iomeObj) => {
    setIsModalOpen(false);
    const mnemonic = iomeObj.user.SRP();
    try {
      const wallet = new Wallet(provider);
      await wallet.fromMnemonic(mnemonic, "m/44'/6174'/7020'/0/0");
      const lDriver = await getLogicDriver(logicId, wallet);
      setLogicDriver(lDriver);
      setUserName(iomeObj.userName);
    } catch (e) {}
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showLoginModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setLogicDriver();
  };

  const getPosts = async () => {
    try {
      setLoadingPost(true);
      let { allPosts } = await baseLogicDriver.routines.GetPosts();
      if (logicDriver) {
        allPosts = await getUserVote(allPosts);
      }
      allPosts.reverse();
      setPosts(allPosts);
      setLoadingPost(false);
    } catch (e) {
      setLoadingPost(false);

      error(
        e.message.startsWith("account not found")
          ? "Account Not Found, Please claim faucet from Voyage"
          : e.message
      );
    }
  };

  const getUserVote = async (posts) => {
    for (let i = 0; i < posts.length; i++) {
      const { vote } = await logicDriver.routines.GetUserVote(posts[i].postId);
      posts[i].usersVote = vote;
    }
    return posts;
  };

  const handleCreatePost = async (imageUri, content) => {
    try {
      info("Creating Post");
      const ixResponse = await logicDriver.routines.CreatePost(userName, imageUri, content);

      const { post: newPost } = await ixResponse.result();
      setPosts([newPost, ...posts]);
    } catch (e) {
      error(
        e.message.startsWith("account not found")
          ? "Account Not Found, Please claim faucet from Voyage"
          : e.message
      );
    }
  };

  const handleUpvote = async (id) => {
    if (!logicDriver) return showLoginModal();

    try {
      info("Upvoting");
      const ix = await logicDriver.routines.Upvote(id);
      await ix.wait();
      const tPost = posts.map((post) => {
        if (post.postId === id) {
          if (post.usersVote == 2) {
            post.downvotes--;
          }
          post.upvotes++;
          post.usersVote = 1;
        }
        return post;
      });
      setPosts(tPost);
      success("Succesfully Upvoted");
    } catch (e) {
      // Need to change later
      error(
        e.message.startsWith("account not found")
          ? "Account Not Found, Please claim faucet from Voyage"
          : e.message
      );
    }
  };

  const handleDownvote = async (id) => {
    if (!logicDriver) return showLoginModal();

    try {
      info("Downvoting");
      const ix = await logicDriver.routines.Downvote(id);
      await ix.wait();
      const tPost = posts.map((post) => {
        if (post.postId === id) {
          if (post.usersVote == 1) {
            post.upvotes--;
          }
          post.usersVote = 2;
          post.downvotes++;
        }
        return post;
      });
      setPosts(tPost);
      success("Succesfully Downvoted");
    } catch (e) {
      error(
        e.message.startsWith("account not found")
          ? "Account Not Found, Please claim faucet from Voyage"
          : e.message
      );
    }
  };

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        logicDriver={logicDriver}
        showLoginModal={showLoginModal}
        userName={userName}
      />
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
        logicDriver={logicDriver}
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

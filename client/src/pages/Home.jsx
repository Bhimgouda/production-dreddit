import { VoyageProvider, getLogicDriver } from "js-moi-sdk";
import React, { useEffect, useState } from "react";
import NewPostForm from "../components/NewPostForm/NewPostForm";
import Dashboard from "../components/Dashboard";

const provider = new VoyageProvider("babylon");
const logicId = "0x08000071a79661f083eb97e48c09860d120b315516209f4376fee63389705552178fac";
const baseLogicDriver = await getLogicDriver(logicId, provider);

const Home = ({ logicDriver, showLoginModal }) => {
  const [posts, setPosts] = useState([]);
  const [isNewPostFormOpen, setIsNewPostFormOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  useEffect(() => {
    getPosts();
  }, [logicDriver]);

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
};

export default Home;

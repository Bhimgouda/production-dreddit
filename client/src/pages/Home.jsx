import { VoyageProvider, getLogicDriver } from "js-moi-sdk";
import React, { useEffect, useState } from "react";
import NewPostForm from "../components/NewPostForm/NewPostForm";
import Dashboard from "../components/Dashboard";
import logic from "../interface/logic";
import { toastError, toastInfo, toastSuccess } from "../utils/toastWrapper";

const Home = ({ user, showConnectModal }) => {
  const [posts, setPosts] = useState({});
  const [isNewPostFormOpen, setIsNewPostFormOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  useEffect(() => {
    getPosts();
  }, [user]);

  const getPosts = async () => {
    try {
      setLoadingPost(true);
      let data = await logic.GetPosts();
      console.log(data);
      setPosts(allPosts);

      setLoadingPost(false);
    } catch (e) {
      setLoadingPost(false);
      console.log(e);
      toastError(
        e.message.startsWith("account not found")
          ? "Account Not Found, Please claim faucet from Voyage"
          : e.message
      );
    }
  }; 
  const map = new Map()
  map.get()

  const handleCreatePost = async (imageUri, content) => {
    try {
      toastInfo("Creating Post");
      const { post: newPost } = await logic.CreatePost(user.wallet, user.name, imageUri, content);

      setPosts([newPost, ...posts]);
    } catch (e) {
      console.log(e);
      toastError(
        e.message.startsWith("account not found")
          ? "Account Not Found, Please claim faucet from Voyage"
          : e.message
      );
    }
  };

  const handleUpvote = async (id) => {
    if (!user.wallet) return showConnectModal(true);

    try {
      toastInfo("Upvoting");
      await logic.Upvote(user.wallet, id);

      setPosts({ ...posts });
      toastSuccess("Succesfully Upvoted");
    } catch (e) {
      console.log(e);
      toastError(
        e.message.startsWith("account not found")
          ? "Account Not Found, Please claim faucet from Voyage"
          : e.message
      );
    }
  };

  const handleDownvote = async (id) => {
    if (!user.wallet) return showConnectModal(true);

    try {
      toastInfo("Downvoting");
      await logic.Downvote(user.wallet, id);

      // Changes
      toastSuccess("Succesfully Downvoted");
    } catch (e) {
      console.log(e);
      toastError(
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
        showConnectModal={showConnectModal}
        handleUpvote={handleUpvote}
        handleDownvote={handleDownvote}
        posts={posts}
        setIsNewPostFormOpen={setIsNewPostFormOpen}
        user={user}
      />
    </>
  );
};

export default Home;

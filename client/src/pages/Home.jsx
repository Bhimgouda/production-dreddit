import { VoyageProvider, getLogicDriver } from "js-moi-sdk";
import React, { useEffect, useState } from "react";
import NewPostForm from "../components/NewPostForm/NewPostForm";
import Dashboard from "../components/Dashboard";
import logic from "../interface/logic";
import { toastError, toastInfo, toastSuccess } from "../utils/toastWrapper";
import { useNavigate } from "react-router-dom";

const Home = ({ user, showConnectModal }) => {
  const [posts, setPosts] = useState([]);
  const [isNewPostFormOpen, setIsNewPostFormOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  useEffect(() => {
    getPosts();
  }, [user]);

  const navigate = useNavigate();

  const getPosts = async () => {
    try {
      setLoadingPost(true);
      let { posts: allPosts } = await logic.GetPosts();
      allPosts.reverse();

      if (user.wallet) {
        allPosts = await getUserVote(allPosts);
      }

      setPosts(allPosts);
      setLoadingPost(false);
    } catch (e) {
      setLoadingPost(false);
      toastError(e.message);
    }
  };

  const getUserVote = async (allPosts) => {
    const promises = allPosts.map(async (post) => {
      const { vote } = await logic.GetUserVote(user.wallet.address, post.id);
      post.userVote = vote;
      return post;
    });

    return Promise.all(promises);
  };

  const handleCreatePost = async (imageUri, content) => {
    try {
      const { post: newPost } = await logic.CreatePost(
        user.wallet,
        user.userName,
        imageUri,
        content
      );

      setPosts([newPost, ...posts]);
    } catch (e) {
      console.log(e);
      if (e.message.includes("account not found")) {
        toastError("Please claim KMOI tokens to start");
        return navigate("/faucet");
      }
      toastError(e.message);
    }
  };

  const handleUpvote = async (index) => {
    if (!user.wallet) return showConnectModal(true);
    if (posts[index].userVote == 1) return toastError("Already Upvoted");

    try {
      await logic.Upvote(user.wallet, posts[index].id);

      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts];
        const updatedPost = { ...updatedPosts[index] };

        if (updatedPost.userVote === 2) {
          updatedPost.downvotes--;
        }
        updatedPost.upvotes++;
        updatedPost.userVote = 1;

        updatedPosts[index] = updatedPost;
        return updatedPosts;
      });

      toastSuccess("Succesfully Upvoted");
    } catch (e) {
      console.log(e);
      if (e.message.includes("account not found")) {
        toastError("Please claim KMOI tokens to start");
        return navigate("/faucet");
      }
      toastError(e.message);
    }
  };

  const handleDownvote = async (index) => {
    if (!user.wallet) return showConnectModal(true);
    if (posts[index].userVote == 2) return toastError("Already Downvoted");

    try {
      await logic.Downvote(user.wallet, posts[index].id);

      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts];
        const updatedPost = { ...updatedPosts[index] };

        if (updatedPost.userVote === 1) {
          updatedPost.upvotes--;
        }
        updatedPost.downvotes++;
        updatedPost.userVote = 2;

        updatedPosts[index] = updatedPost;
        return updatedPosts;
      });

      toastSuccess("Succesfully Downvoted");
    } catch (e) {
      console.log(e);
      if (e.message.includes("account not found")) {
        toastError("Please claim KMOI tokens to start");
        return navigate("/faucet");
      }
      toastError(e.message);
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

import React, { useState } from "react";
import Post from "./Post";
import Loader from "./Loader";
import { INITIAL_POSTS } from "./utils/constants";

const Dashboard = ({
  setIsNewPostFormOpen,
  loadingPost,
  user,
  showConnectModal,
  posts,
  handleUpvote,
  handleDownvote,
}) => {
  const [visiblePosts, setVisiblePosts] = useState(INITIAL_POSTS);
  const [loadingMore, setLoadingMore] = useState(false);
  const popupHandler = () => {
    setIsNewPostFormOpen(true);
  };
  async function loadMorePosts() {
    setLoadingMore(true);
    setTimeout(() => {
      setVisiblePosts(visiblePosts + 2);
      setLoadingMore(false);
    }, 300);
  }

  return !loadingPost ? (
    <section className="middleSection iPadView">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-sm-3 col-md-3">{/* Voters Leaderboard */}</div>
          <div className="col-12 col-sm-6 col-md-6 orderTop dashboard">
            <div className="postBox">
              <div className="postRight">
                <div
                  className="createyourpost"
                  onClick={user.wallet ? popupHandler : () => showConnectModal(true)}
                >
                  <div className="yourProfile">{/* Profile Pic */}</div>
                  <input type="text" className="postText" value="" placeholder="Create New Post" />
                </div>
              </div>
            </div>
            {posts?.slice(0, visiblePosts).map((post, index) => (
              <Post
                id={index}
                key={index}
                handleUpvote={handleUpvote}
                handleDownvote={handleDownvote}
                post={post}
              />
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              {!loadingPost && posts.length > visiblePosts ? (
                <button onClick={loadMorePosts} disabled={loadingMore} className="btn btn--primary">
                  {loadingMore ? (
                    <Loader loading={true} size={"25px"} color={"#fff"} />
                  ) : (
                    "Load more"
                  )}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <div style={{ marginTop: "25px" }}>
      <Loader loading={loadingPost} size={"25px"} color={"#fff"} />
    </div>
  );
};

export default Dashboard;

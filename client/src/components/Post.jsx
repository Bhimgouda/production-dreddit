import upvoteSvg from "../assets/upvote.svg";
import downvoteSvg from "../assets/downvote.svg";
import { useState } from "react";
import Loader from "./Loader";
import { minidenticonSvg } from "https://cdn.jsdelivr.net/npm/minidenticons@4.2.1/minidenticons.min.js";

const Post = ({ index, post, handleUpvote, handleDownvote }) => {
  // Loader
  const [downvoting, setDownvoting] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  return (
    <div className="post">
      <div className="postinfo">
        <minidenticon-svg username={post.creator}></minidenticon-svg>
        <p className="post-creator">{`${post.creator}`}</p>
        <pre className="post-content">{post.content.replace(/\\n/g, "\n")}</pre>
        <div className="postimg">
          {post.imageUri && (
            <img
              src={post.imageUri.replace("/image/upload/", "/image/upload/w_600/")}
              alt="picture"
            />
          )}
        </div>
        <div className="post-action">
          <div className="row">
            <div
              className="col-6 col-sm-6 col-md-6"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                setUpvoting(true);
                await handleUpvote(index);
                setUpvoting(false);
              }}
            >
              {!upvoting ? (
                <button disabled={post.userVote === 1} className={"btnDao agreeBTN"}>
                  <img className="icon" src={upvoteSvg} alt="check" />{" "}
                  {/* {post.userVote === 1 ? "Upvoted" : "Upvote"} */}
                  <span className="votes">{post.upvotes}</span>
                </button>
              ) : (
                <button disabled={upvoting} className="btnDao agreeBTN">
                  <Loader loading={upvoting} color="#fff" />
                </button>
              )}
            </div>
            <div
              className="col-6 col-sm-6 col-md-6"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                setDownvoting(true);
                await handleDownvote(index);
                setDownvoting(false);
              }}
            >
              {!downvoting ? (
                <button disabled={post.userVote === 2} className={"btnDao disagreeBTN"}>
                  <img className="icon" src={downvoteSvg} alt="x" />{" "}
                  {/* {post.userVote === 2 ? "Downvoted" : "Downvote"} */}
                  <span className="votes">{post.downvotes}</span>
                </button>
              ) : (
                <button disabled={upvoting} className="btnDao disagreeBTN">
                  <Loader loading={downvoting} color="#fff" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

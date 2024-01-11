import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./NewPostForm.module.css";
import { error, info, success } from "../../utils/toastWrapper";
import Loader from "../../components/Loader";
import axios from "axios";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose}></div>;
};

const ModalOverlay = (props) => {
  const [postContent, setPostContent] = useState("");
  const [imageFile, setImageFile] = useState();
  const [loadingStatus, setLoadingStatus] = useState({
    isLoading: false,
    isSuccess: false,
  });

  const errorWrapper = (message) => {
    setLoadingStatus({ isLoading: false, isSuccess: false });
    error(message);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      if (postContent < 10) return error("Post Content needs to be more than 10 characters");
      if (!imageFile) return error("Please upload an Image to proceed");
      setLoadingStatus({ isLoading: true, isSuccess: false });

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "kvqwkw2q");

      const { secure_url: imageUri } = (
        await axios.post("https://api.cloudinary.com/v1_1/dxgbnqbew/image/upload", formData)
      ).data;

      await props.handleCreatePost(imageUri, postContent);

      setLoadingStatus({ isLoading: false, isSuccess: true });
      props.onClose();
    } catch (e) {
      errorWrapper("Something went wrong");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSizeInBytes = 50097152; // 50MB

    if (file && file.size > maxSizeInBytes) {
      return error("Image file size exceeds 50mb");
    }
    setImageFile(file);
    success("Image selected successfully");
  };

  return (
    <div className={classes.modal}>
      <div className={classes.popupHeader}>
        <h3 style={{ color: "#000" }} className={classes.formHeading}>
          Create post
        </h3>
        <span className={classes.closeBtn} onClick={() => props.setIsNewPostFormOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </span>
      </div>
      <form onSubmit={handleCreatePost} className={classes.formEl}>
        <div className={classes.inputEl}>
          <textarea
            id="post"
            type="text"
            placeholder="Add your post..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className={classes.textarea}
            rows={5}
            maxLength={500} // Added maxLength attribute
          />
        </div>
        <div className={classes.submitBtn}>
          <div className={classes.btnEl}>
            {!loadingStatus.isSuccess && !loadingStatus.isLoading ? (
              <button className={classes.btn}>Post</button>
            ) : (
              <button
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                className={classes.btn}
              >
                <Loader loading={loadingStatus.isLoading} color="#fff" />
                ``
              </button>
            )}
          </div>
          <div className={classes.browseEl}>
            <label htmlFor="file" className={classes.browseTxt}>
              <i className="fa-solid fa-image"></i>
            </label>
            <input
              id="file"
              type="file"
              className={classes.fileInput}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const NewPostForm = ({ handleCreatePost, isNewPostFormOpen, setIsNewPostFormOpen }) => {
  const portalElement = document.getElementById("overlays");
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={() => setIsNewPostFormOpen(false)} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          handleCreatePost={handleCreatePost}
          onClose={() => setIsNewPostFormOpen(false)}
          setIsNewPostFormOpen={setIsNewPostFormOpen}
        />,
        portalElement
      )}
    </>
  );
};

export default NewPostForm;

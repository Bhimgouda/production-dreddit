import { VoyageProvider, Wallet, getLogicDriver } from "js-moi-sdk";
import { toastInfo } from "../utils/toastWrapper";

const provider = new VoyageProvider("babylon");
const logicId = import.meta.env.VITE_LOGIC_ID;

////////////////////////
// Mutate/Write Calls
///////////////////////

const CreatePost = async (wallet, creator, imageUri, content) => {
  const logicDriver = await getLogicDriver(logicId, wallet);
  const ixResponse = await logicDriver.routines.CreatePost(creator, imageUri, content);
  toastInfo("Creating post");
  return ixResponse.result();
};

const Upvote = async (wallet, postId) => {
  const logicDriver = await getLogicDriver(logicId, wallet);
  const ixResponse = await logicDriver.routines.Upvote(postId);
  toastInfo("Upvoting");
  return ixResponse.result();
};

const Downvote = async (wallet, postId) => {
  const logicDriver = await getLogicDriver(logicId, wallet);
  const ixResponse = await logicDriver.routines.Downvote(postId);
  toastInfo("Downvoting");
  return ixResponse.result();
};

////////////////////////
// Observe/Read Calls
///////////////////////

const GetPosts = async () => {
  const logicDriver = await getLogicDriver(logicId, provider);
  return logicDriver.routines.GetPosts();
};

const GetPost = async (postId) => {
  const logicDriver = await getLogicDriver(logicId, provider);
  return logicDriver.routines.GetPost(postId);
};

const GetUserVote = async (userAddress, postId) => {
  const logicDriver = await getLogicDriver(logicId, provider);
  return logicDriver.routines.GetUserVote(userAddress, postId);
};

const logic = {
  GetPosts,
  GetPost,
  GetUserVote,
  CreatePost,
  Upvote,
  Downvote,
};

export default logic;

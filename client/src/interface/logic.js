import { VoyageProvider, Wallet, getLogicDriver } from "js-moi-sdk";

const provider = new VoyageProvider("babylon");
const logicId = import.meta.env.VITE_LOGIC_ID;

////////////////////////
// Mutate/Write Calls
///////////////////////

const CreatePost = async (wallet, creator, imageUri, content) => {
  const logicDriver = await getLogicDriver(logicId, wallet);
  const ixResponse = await logicDriver.routines.CreatePost(creator, imageUri, content);
  return ixResponse.result();
};

const Upvote = async (wallet, id) => {
  const logicDriver = await getLogicDriver(logicId, wallet);
  const ixResponse = await logicDriver.routines.Upvote(id);
  return ixResponse.result();
};

const Downvote = async (wallet, id) => {
  const logicDriver = await getLogicDriver(logicId, wallet);
  const ixResponse = await logicDriver.routines.Downvote(id);
  return ixResponse.result();
};

////////////////////////
// Observe/Read Calls
///////////////////////

const GetPosts = async () => {
  const logicDriver = await getLogicDriver(logicId, provider);
  return logicDriver.routines.GetPosts();
};

const GetUserVote = async (id, userAddress) => {
  const logicDriver = await getLogicDriver(logicId, provider);
  return logicDriver.routines.GetUserVote(id, userAddress);
};

const logic = {
  GetPosts,
  GetUserVote,
  CreatePost,
  Upvote,
  Downvote,
};

export default logic;

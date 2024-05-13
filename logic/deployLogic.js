require("dotenv").config();
const { VoyageProvider, Wallet, LogicFactory } = require("js-moi-sdk");
const DRedditManifest = require("./coco/DReddit.json");

// ------- Update with your Mnemonic ------------------ //
const MNEMONIC = process.env.MNEMONIC;

// JsonRpcProvider to interact with MOI Network (Here we are using public RPC from Voyage)
const provider = new VoyageProvider("babylon");

// Function to instantiate a wallet with provider and sender account
const constructWallet = async () => {
  const accountPath = "m/44'/6174'/7020'/0/0";
  const wallet = await Wallet.fromMnemonic(MNEMONIC, accountPath);
  wallet.connect(provider);
  return wallet;
};

const deployDRedditLogic = async () => {
  // getting wallet To sign and send the ix to the network
  const wallet = await constructWallet();

  // LogicFactory creates a new instance of Logic with it's manifest and sender's wallet
  const DRedditLogic = new LogicFactory(DRedditManifest, wallet);

  // Submitting the Interaction to the network to deploy the logic
  const ixResponse = await DRedditLogic.deploy("Init", { fuelLimit: 5000 });

  console.log("------ Deploying Logic ----------");
  console.log(ixResponse);

  // Polling the network for the Interaction Receipt and print it
  const ixReceipt = await ixResponse.wait();
  console.log("------ Deployed Logic Successfully!! ----------");
  console.log(ixReceipt);
};

deployDRedditLogic();

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { VoyageProvider, Wallet, getLogicDriver } from "js-moi-sdk";
import LoginModal from "./components/ConnectModal";
import Home from "./pages/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import Faucet from "./pages/Faucet";
import ConnectModal from "./components/ConnectModal";
import { toastInfo } from "./utils/toastWrapper";
import { getUserBalance } from "./utils/getUserBalance";

const DEFAULT_USER = { userName: undefined, wallet: undefined, moiId: undefined };
const provider = new VoyageProvider("babylon");

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER);

  const navigate = useNavigate();

  useEffect(() => {
    const initWallet = async () => {
      const mnemonic = localStorage.getItem("mnemonic");
      const userName = localStorage.getItem("userName");
      const moiId = localStorage.getItem("moiId");

      if (mnemonic && userName && moiId) {
        const wallet = await Wallet.fromMnemonic(mnemonic, "m/44'/6174'/7020'/0/0");
        wallet.connect(provider);
        wallet.balance = await getUserBalance(provider, wallet.address);

        setUser({ wallet, userName, moiId });
      } else {
        showConnectModal(true);
      }
    };
    initWallet();
  }, []);

  const updateUser = (newUser) => {
    if (newUser) return setUser(newUser);

    localStorage.clear("mnemonic");
    localStorage.clear("userName");
    localStorage.clear("moiId");

    setUser(DEFAULT_USER);
  };

  const showConnectModal = (value) => {
    setIsModalOpen(value);
  };

  return (
    <>
      <Navbar showConnectModal={showConnectModal} user={user} updateUser={updateUser} />
      <Toaster />
      <ConnectModal
        get
        isModalOpen={isModalOpen}
        showConnectModal={showConnectModal}
        updateUser={updateUser}
      />

      <Routes>
        <Route path="/" element={<Home user={user} showConnectModal={showConnectModal} />} />
        <Route
          path="/faucet"
          element={<Faucet user={user} showConnectModal={showConnectModal} />}
        />
      </Routes>
    </>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { VoyageProvider, Wallet, getLogicDriver } from "js-moi-sdk";
import LoginModal from "./components/ConnectModal";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Faucet from "./pages/Faucet";
import ConnectModal from "./components/ConnectModal";

const DEFAULT_USER = { name: undefined, wallet: undefined, moiId: undefined };

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER);

  const updateUser = (newUser) => {
    if (!user) return setUser(DEFAULT_USER);
    setUser(newUser);
  };
  const showConnectModal = (value) => {
    setIsModalOpen(value);
  };

  return (
    <>
      <Navbar showConnectModal={showConnectModal} user={user} updateUser={updateUser} />
      <Toaster />
      <ConnectModal
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

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { VoyageProvider, Wallet, getLogicDriver } from "js-moi-sdk";
import LoginModal from "./components/LoginModal";
import { error, info, success } from "./utils/toastWrapper";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logicDriver, setLogicDriver] = useState();
  const [userName, setUserName] = useState();

  const handleLogin = async (iomeObj) => {
    setIsModalOpen(false);
    const mnemonic = iomeObj.user.SRP();
    try {
      const wallet = await Wallet.fromMnemonic(mnemonic, "m/44'/6174'/7020'/0/0");
      wallet.connect(provider);
      const lDriver = await getLogicDriver(logicId, wallet);
      setLogicDriver(lDriver);
      setUserName(iomeObj.userName);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showLoginModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setLogicDriver();
  };

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        logicDriver={logicDriver}
        showLoginModal={showLoginModal}
        userName={userName}
      />
      <Toaster />
      <LoginModal
        handleCancel={handleCancel}
        handleLogin={handleLogin}
        showLoginModal={showLoginModal}
        isModalOpen={isModalOpen}
      />
      <Routes>
        <Route path="/" element={<Home logicDriver={logicDriver} />} />
      </Routes>
    </>
  );
}

export default App;

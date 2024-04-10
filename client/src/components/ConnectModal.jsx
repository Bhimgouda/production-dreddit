import React, { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { Connect, IOMe } from "@iome/react-widget";
import Loader from "./Loader";
import { VoyageProvider, Wallet } from "js-moi-sdk";
import { toastError, toastInfo } from "../utils/toastWrapper";
import { useNavigate } from "react-router-dom";
import { getUserBalance } from "../utils/getUserBalance";

const provider = new VoyageProvider("babylon");

const ConnectModal = ({ isModalOpen, showConnectModal, updateUser }) => {
  const [iome, setIome] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const initializeIome = async () => {
      try {
        let newIome = new IOMe(
          "0x2b6e53d2Cd28a4882b7BA60CEc663A8bD735cD81",
          "0x55b66e4ce328aca8367847c8f9f74d9f6a10168f499235041fa83da77fecd1b5"
        );
        await newIome.InitDev();
        await newIome.InitApp();
        setIome(newIome);
      } catch (e) {
        console.log(e);
        toastInfo(e.message);
      }
    };
    initializeIome();
  }, []);

  const handleConnect = async (iomeObj) => {
    showConnectModal(false);
    try {
      const wallet = await Wallet.fromMnemonic(iomeObj.user.SRP(), "m/44'/6174'/7020'/0/0");
      wallet.connect(provider);

      localStorage.setItem("mnemonic", iomeObj.user.SRP());
      localStorage.setItem("userName", iomeObj.userName);
      localStorage.setItem("moiId", iomeObj.user.ParticipantID);

      updateUser({ wallet, userName: iomeObj.userName, moiId: iomeObj.user.ParticipantID });
    } catch (e) {
      console.log(e);
      toastError(e.message);
    }
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={() => showConnectModal(false)}
        onOk={() => {}}
        destroyOnClose={true}
      >
        {iome ? (
          <Connect onSuccess={handleConnect} iome={iome} />
        ) : (
          <Loader color={"#080c84"} loading={true} />
        )}
      </Modal>
    </>
  );
};
export default ConnectModal;

import React, { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { Connect, IOMe } from "@iome/react-widget";
import Loader from "./Loader";

const LoginModal = ({ isModalOpen, handleLogin, handleCancel }) => {
  const [iome, setIome] = useState();

  useEffect(() => {
    initializeIome();
  }, []);

  const initializeIome = async () => {
    let newIome = new IOMe(
      "0x2b6e53d2Cd28a4882b7BA60CEc663A8bD735cD81",
      "0x55b66e4ce328aca8367847c8f9f74d9f6a10168f499235041fa83da77fecd1b5"
    );
    await newIome.InitDev();
    await newIome.InitApp();
    setIome(newIome);
  };

  return (
    <>
      <Modal open={isModalOpen} onCancel={handleCancel} onOk={handleCancel} destroyOnClose={true}>
        {iome ? (
          <Connect onSuccess={handleLogin} iome={iome} />
        ) : (
          <Loader color={"#080c84"} loading={true} />
        )}
      </Modal>
    </>
  );
};
export default LoginModal;

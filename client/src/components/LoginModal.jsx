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
    let newIome = new IOMe(process.env.REACT_APP_DEVELOPER_ID, process.env.REACT_APP_APP_SECRET);
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

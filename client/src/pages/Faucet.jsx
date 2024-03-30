import { Card, Skeleton } from "antd";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import axios from "axios";
import { calculateRemainingTime } from "../utils/calculateRemainingTime";
import { toastError } from "../utils/toastWrapper";

const BASE_URL = import.meta.env.VITE_VOYAGE_API_URL;
const client_name = import.meta.env.VITE_CLIENT_NAME;

const Faucet = ({ user, showConnectModal }) => {
  const [isLoading, setLoading] = useState(false);
  const [refillTime, setRefillTime] = useState("00:00:00");
  const [isClaiming, setIsClaiming] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState({
    balance: "0.0",
    isLocked: false,
  });

  const handleClaim = async (moiId, address) => {
    try {
      setIsClaiming(true);
      const response = await axios.post(`${BASE_URL}/faucet/claim/token/${client_name}`, {
        moi_id: moiId,
        address,
        amount: 20000,
      });

      setBalanceInfo({
        balance: response.data.balance,
        isLocked: response.data.is_locked,
      });
      setIsClaiming(false);
    } catch (error) {
      setIsClaiming(false);
      console.error("Error requesting token from faucet:", error);
      throw error;
    }
  };

  const fetchBalance = async () => {
    try {
      const { balance, is_locked: isLocked } = (
        await axios.get(import.meta.env.VITE_VOYAGE_API_URL + "/faucet/" + user.moiId + "/balance")
      ).data.data;
      setBalanceInfo({ balance, isLocked });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setBalanceInfo({ isLocked: false, balance: "20k" });
    }
  };

  useEffect(() => {
    if (!user.moiId) return;

    fetchBalance();
    setRefillTime(calculateRemainingTime());

    const intervalId = setInterval(() => {
      setRefillTime(calculateRemainingTime());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    if (!balanceInfo.isLocked) {
      return;
    }
    // Precautionary if claim handler
    const id = setInterval(fetchBalance, 5 * 1000);
    return () => clearInterval(id);
  }, [balanceInfo.isLocked]);

  return user.wallet ? (
    <div className="">
      <Card className="faucet" classNames={"card"} type="primary">
        <div className="">
          <Skeleton loading={isLoading} active paragraph={{ rows: 7 }} />
          {!isLoading && (
            <>
              <div className="">
                <div className="">Available Limit</div>
                <h2 className="">{balanceInfo.balance} KMOI Tokens</h2>
                <div className=""></div>
              </div>
              <div className="">
                <button
                  className="btn btn--primary"
                  disabled={balanceInfo.isLocked || !parseInt(balanceInfo.balance)}
                  loading={isClaiming}
                  // participant_id = moi_id  in iome response object
                  onClick={() => handleClaim(user.moiId, user.wallet.address)}
                >
                  <span>Claim Tokens</span>
                  <Loader loading={isClaiming} size={25} color="#fff" />
                </button>
                {balanceInfo.isLocked && (
                  <p className="">Please wait while the current request is being processed</p>
                )}
                <div style={{ marginTop: "20px" }} className="">
                  Refills in {refillTime}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  ) : (
    <>Please Login To continue</>
  );
};

export default Faucet;

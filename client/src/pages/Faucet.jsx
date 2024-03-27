import { Card, Skeleton } from "antd";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import axios from "axios"

const Faucet = () => {
  const [isLoading, setLoading] = useState(false);
  const [isClaiming, setClaiming] = useState(false);
  const [refillTime, setRefillTime] = useState("00:00:00");
  const [error, setError] = useState("");
  const [nextClaim, setNextClaim] = useState();
    const [balanceInfo, setBalanceInfo] = useState({
    balance: '0',
    isLocked: false,
  });

  const moi_id="0x0207e368758a62f2d8dc0f1f38ca1b7b09404af0faa268f42c3f541ec64774c63a";
  const amount=200;
  const calculateRemainingTime = () => {
    // Get the current date and time in UTC
    const now = new Date();

    // Create a new Date object for 12:00 AM UTC
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setUTCHours(0, 0, 0, 0);

    // Calculate the difference between now and 12:00 AM UTC
    const diff = tomorrow.getTime() - now.getTime();

    // Convert the difference to hours, minutes, and seconds
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    // Format the remaining time as a string in the "23:00:00" format
    const remainingTime = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return remainingTime;
  };

  const onClaimHandler = async (moiId, address, amount) => {
  try {
      const BASE_URL = import.meta.env.VITE_VOYAGE_API_URL;
      const client_name=import.meta.env.VITE_CLIENT_NAME;
      const response = await axios.post(`${BASE_URL}/faucet/claim/${client_name}/token`, {
      moi_id: moiId,
      address,
      amount,
    });
    setBalanceInfo({
          balance: response.data.balance,
          isLocked: response.data.is_locked,
        });
    
  } catch (error) {
    console.error('Error requesting token from faucet:', error);
    throw error; 
  }
};
 const fetchBalance = (withLoader = false) => {
    if (withLoader) {
      setLoading(true);
    }
    axios
      .get(import.meta.env.VITE_VOYAGE_API_URL + '/faucet/' + moi_id + '/balance')
      .then((res) => {
        const response = res.data;
        setBalanceInfo({
          balance: response.data.balance,
          isLocked: response.data.is_locked,
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (withLoader) {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      });
  };

  useEffect(() => {
    if (moi_id) {
      fetchBalance(true);

      setRefillTime(calculateRemainingTime());
      // Call the calculateRemainingTime function every second to update the remaining time in real-time
      const intervalId = setInterval(() => {
        setRefillTime(calculateRemainingTime());
      }, 1000);

      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    } else {
      setBalanceInfo({
        balance: '0',
        isLocked: false,
      });
    }
  }, []);

   useEffect(() => {
    if (!balanceInfo.isLocked) {
      return;
    }

    const id = setInterval(fetchBalance, 10 * 1000);
    return () => clearInterval(id);
  }, [balanceInfo.isLocked]);

  return (
    <div className="faucet">
      <Card classNames={"card"} type="primary">
        <div className="">
          <Skeleton loading={isLoading} active paragraph={{ rows: 7 }} />
          {!isLoading && (
            <>
              <div className="">
                <div className="">{balanceInfo.balance}</div>
                <div className="">
                  <div className="">Available Limit</div>
                  <h1>
                    <div className="text-overline">Refills in {refillTime}</div>
                  </h1>
                </div>
              </div>
              <div className="">
                {" "}
                {error && <p className="">{error}</p>}
                <button
                  disabled={balanceInfo.isLocked}
                  loading={isClaiming}
                  // participant_id = moi_id  in iome response object
                    onClick={ ()=> onClaimHandler('0x0207e368758a62f2d8dc0f1f38ca1b7b09404af0faa268f42c3f541ec64774c63a', '0x1a3838377efb823532a709c373e232bc762af73da7262b34f5653f7f8b2cecc8', amount)}
                >
                  <span>Claim Tokens</span>
                  <Loader loading={isClaiming} size={25} color="#fff" />
                </button>
                {isClaiming && (
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
  );
};

export default Faucet;

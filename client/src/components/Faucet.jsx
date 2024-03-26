import React from 'react'
import {Card, Skeleton,Loader} from 'antd'

function Faucet() {
      const [isLoading, setLoading] = useState(false);
  const [isClaiming, setClaiming] = useState(false);
  const [refillTime, setRefillTime] = useState("00:00:00");
  const [error, setError] = useState("");
  const [claimAmount, setClaimAmount] = useState();
  const [nextClaim, setNextClaim] = useState();
  return (
<div className="faucet">
<Card classNames={"card"} type="primary" className=" ">
<div className="">
<Skeleton loading={isLoading} active paragraph={{ rows: 7 }} />
          {!isLoading && (
<>
<div className="">
<div className=""></div>
<div className="">
<div className="">Available Limit</div>
<h1>
    {refillTime === "00:00:00" ? claimAmount : 0}{" "}
                    {/* {tokenDetails.name} */}
</h1>
</div>
</div>
<div className="">
                {" "}
                {error && <p className="">{error}</p>}
<button
                  disabled={refillTime !== "00:00:00"}
                  className="btn btn--blue"
                //   onClick={onClaimHandler}
>
<span>Claim Tokens</span>
<Loader loading={isClaiming} size={25} color="#fff" />
</button>
                {isClaiming && (
<p className="">
                    Please wait while the current request is being processed
</p>
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
  )
}

export default Faucet

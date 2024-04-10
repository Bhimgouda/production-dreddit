import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import { truncateStr } from "../utils/truncate";
import logo from "../assets/socupt-logo.png";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { formatNumber } from "../utils/formatNumber";

const Navbar = ({ showConnectModal, user, updateUser, walletBalance }) => {
  const [toggleValue, setToggle] = useState(false);

  const navRef = useRef(null);

  const handleToggle = () => {
    setToggle(!toggleValue);
  };

  const closeNavOnScroll = () => {
    if (toggleValue) {
      setToggle(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", closeNavOnScroll);
    return () => {
      window.removeEventListener("scroll", closeNavOnScroll);
    };
  }, [toggleValue]);

  return (
    <nav className="navbar navbar-container">
      <div className="nav__header">
        <div
          onClick={handleToggle}
          className={(toggleValue && "nav__burger nav__burger--close") || "nav__burger"}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <Link to="/">
          <img style={{ height: 50 }} src={logo} />
        </Link>
      </div>
      <ul
        ref={navRef}
        className={(toggleValue && "nav__links nav__links--expanded") || "nav__links"}
      >
        {/* <a href="https://moi.technology/" target="_blank" rel="noopener noreferrer">
          Built on MOI
        </a> */}
        <Link to="/faucet">Faucet</Link>
        <div>
          <MetaMaskAvatar address={"0x8daffdb1dea6a1208a969afb5598527ccb7d47"} size={48} />
          {console.log(user.wallet?.address.slice(0, 40))}
        </div>
        {user.wallet && <div className="balance">{formatNumber(walletBalance || 0)} KMOI</div>}
        <button
          className="btn btn--primary btn--connect"
          onClick={!user.wallet ? () => showConnectModal(true) : () => updateUser(null)}
          rel="noopener noreferrer"
        >
          {!user.wallet ? "Login" : `Logout: ${user.userName}`}
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;

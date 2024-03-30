import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import { truncateStr } from "../utils/truncate";
import logo from "../assets/socupt-logo.png";

const Navbar = ({ showConnectModal, user, updateUser }) => {
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
        <a href="/" className="">
          <img style={{ height: 50 }} src={logo} />
        </a>
      </div>
      <ul
        ref={navRef}
        className={(toggleValue && "nav__links nav__links--expanded") || "nav__links"}
      >
        {/* <a href="https://moi.technology/" target="_blank" rel="noopener noreferrer">
          Built on MOI
        </a> */}
        <Link to="/faucet">Faucet</Link>
        <button
          className="btn btn--primary btn--connect"
          onClick={!user.wallet ? () => showConnectModal(true) : () => updateUser(null)}
          rel="noopener noreferrer"
        >
          {!user.wallet ? "Login" : "Logout"}
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;

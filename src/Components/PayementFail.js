import React from "react";
import "../App.css";
import "../Styles/Login.css";
import "../Styles/PaymentFail.css";
import { useState } from "react";
import Otp from "./Otp";
import { Alert, Snackbar } from "@mui/material";
import { ButtonLoader } from "../Components2/Loader";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import logo from "../images/groomerLogo.png";
import mobileBanking from "../images/mobileBanking.png";
import Hamburger from "./Hamburger";
import { loginUserAPI } from "../Apis/User_Login_Auth";
import MetaData from "../context/MetaData";

const PayementFail = () => {
  return (
    <>
      <MetaData title="Account Login" />
      <div className="registerContainer">
        <div className="registerRow">
          <div className="resgisterCol">
            <img
              src={mobileBanking}
              alt="register"
              className="mobileBankingImage"
            />
            <div className="registerLogo">
              <NavLink to="/">
                <img src={logo} alt="Logo" className="logo" />
              </NavLink>
            </div>
          </div>
          <div className="resgisterCol">
            <div className="accountMenu menu">
              <Hamburger />
            </div>
            <div className="float-end">
              <a href="/" className="closeBtn">
                close
              </a>
            </div>
            <div className="paymentContainer">
              <h3 className="paymentHeading">Payment processing failed.</h3>
              <p className="paymentPara text-grey">
                If Money deducted from your account please contact groomer
                support learn.
              </p>
              <h5>Transaction details:</h5>
              <div className="display-flex">
                <p className="text-grey">Transaction ID: ABCDE12345</p>
                <p className="justify-between text-grey">Booking ID: BNG0091</p>
              </div>
              <h5>Groomer Support:</h5>
              <div className="display-flex">
                <p className="text-grey">Email: Supportteam@groomer.com</p>
                <p className="justify-between text-grey">
                  Mobile: +91 9876543210
                </p>
              </div>
              <p className="text-grey fontSize">
                Money will be credit in your account if booking if failed to
                proceed by same payement method{" "}
                <span style={{ color: "white" }}>Terms and Conditions.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayementFail;

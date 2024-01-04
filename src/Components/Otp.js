import React, { useState } from "react";
import OtpInput from "./OtpInput";
import "../Styles/Login.css";
import MetaData from "../context/MetaData";
import { Alert, Snackbar } from "@mui/material";
import { loginUserAPI } from "../Apis/User_Login_Auth";
import OTPTimer from "../Components2/OtpTimmer";
import {
  GeneratingOTP,
  WRONG_OTP,
  WRONG_OTP_3_TIMES,
} from "../context/ErrorCodes";

const Otp = (props) => {
  const { email, AccountType } = props;

  // State variable to track whether the entered OTP is incorrect
  const [isincorrect, setIsIncorrect] = useState(false);
  const [sendLoading, setsendLoading] = useState(false);
  const [showSend, setshowSend] = useState(true);
  const [successSnack, setsuccessSnack] = useState(false);
  const [successmessage, setsuccessmessage] = useState(
    "otp send success fully"
  );
  const [errorSnack, seterrorSnack] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const [timer, setTimer] = useState(180);

  const sendAgainOTPHandler = async () => {
    setsendLoading(true);
    setshowSend(false);
    let response = null;
    if (AccountType === "login") {
      response = await loginUserAPI(email);
      if (response.code === 200 && response.message === GeneratingOTP) {
        setsendLoading(false);
        setshowSend(true);
        setsuccessmessage(response.message);
        setsuccessSnack(true);
        setTimer(180);
      }
      // ! otp wrong entered
      if (response.code === 400 && response.message === WRONG_OTP) {
        seterrormessage(response.message);
        seterrorSnack(true);
        setshowSend(false);
        setshowSend(true);
      }

      // ! if it otp enter wrong for 3 times
      if (response.code === 400 && response.message === WRONG_OTP_3_TIMES) {
        seterrormessage(response.message);
        seterrorSnack(true);
        setTimer(0);
        setshowSend(false);
        setTimeout(() => {
          setshowSend(true);
        }, 120000);
      }
    }

    if (AccountType === "register") {
      alert("not implemented");
    }
  };

  const handleTimeout = () => {
    setsendLoading(true);
    seterrormessage("OTP is expired now. Please generate New OTP");
    seterrorSnack(true);
  };

  return (
    <>
      <MetaData
        title={AccountType === "login" ? "Login OTP" : "Register OTP"}
      />
      <div className="info">
        <div>
          <div className="login">
            <b>OTP</b>
          </div>
          <p>
            OTP not received?{" "}
            {showSend && (
              <span className="register" onClick={sendAgainOTPHandler}>
                Send again
              </span>
            )}
          </p>{" "}
          {/* Prompt to resend OTP */}
        </div>
        <div>
          {/* OTP input component */}
          {sendLoading ? (
            <div className="otp-boxes">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <input
                  className="otp-box"
                  style={{ background: "rgba(123, 123, 123, 0.25)" }}
                  size="1"
                  key={index}
                  type="number"
                  maxLength={1}
                  readOnly={true}
                  disabled={true}
                />
              ))}
            </div>
          ) : (
            <OtpInput
              isincorrect={isincorrect}
              setIsIncorrect={setIsIncorrect}
              email={email}
              AccountType={AccountType}
              setTimer={setTimer}
              setshowSend={setshowSend}
              setsendLoading={setsendLoading}
              seterrorSnack={seterrorSnack}
              seterrormessage={seterrormessage}
            />
          )}
          <br />
          <p>
            OTP sent on <strong>E-MAIL</strong>, Please check spam too
          </p>
          <OTPTimer
            expirationTime={180}
            onTimeout={handleTimeout}
            timer={timer}
            setTimer={setTimer}
          />
          {/* Error message for incorrect OTP */}

          <div
            style={{
              fontSize: "15px",
              color: "red",
              marginTop: "5px",
              opacity: isincorrect ? "1" : "0",
            }}
          >
            The entered OTP is incorrect. Please try again
          </div>
        </div>
      </div>

      {successSnack && (
        <Snackbar
          open={successSnack}
          autoHideDuration={6000}
          onClose={() => setsuccessSnack(false)}
        >
          <Alert
            onClose={() => setsuccessSnack(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {successmessage}
          </Alert>
        </Snackbar>
      )}

      {errorSnack && (
        <Snackbar
          open={errorSnack}
          autoHideDuration={6000}
          onClose={() => seterrorSnack(false)}
        >
          <Alert
            onClose={() => seterrorSnack(false)}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {errormessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Otp;

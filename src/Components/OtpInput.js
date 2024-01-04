import React, { useState, useRef, useEffect, useContext } from "react";
// import { MdLock } from 'react-icons/md';
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTPAPI } from "../Apis/User_Register_Auth";
import { addToken } from "../context/StorageToken";
import { Store, Store2 } from "../App";
import { verifyLoginOtpAPI } from "../Apis/User_Login_Auth";
import { WRONG_OTP, WRONG_OTP_3_TIMES } from "../context/ErrorCodes";

const OTPInput = ({
  setIsIncorrect,
  email,
  AccountType,
  setTimer,
  setshowSend,
  seterrorSnack,
  seterrormessage,
  setsendLoading,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [, setisAuth] = useContext(Store);
  const { setsingleSalon } = useContext(Store2);
  // State for managing the OTP input as an array of individual digits
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const otpBoxesRef = useRef([]); // Ref for OTP input boxes
  const [loading, setloading] = useState(false);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    setOTP((prevOTP) => {
      const newOTP = [...prevOTP];
      newOTP[index] = value;
      return newOTP;
    });

    if (value !== "") {
      focusNextBox(index);
    }
  };

  // Effect to check OTP validity when all digits are entered
  useEffect(() => {
    const otpString = otp.join("");

    // TODO : redirecting function depending upon came from salon or from menu
    const redirectFunc = () => {
      setTimer(0);
      let redirect = location.search.replace("?redirect=", "");
      if (redirect) {
        redirect = redirect.replace("&", "/");
        navigate(`/${redirect}`);
        setsingleSalon([]);
      } else {
        navigate("/");
      }
    };

    // TODO : verify the register otp
    async function fetchRegisterApi() {
      let userOTP = otpString;
      let response = await verifyOTPAPI(email, userOTP);

      if (response.code === 200) {
        setIsIncorrect(false);
        setTimer(0);
        let redirect = location.search.replace("?redirect=", "");
        if (redirect) {
          navigate(`/login?redirect=${redirect}`);
        } else {
          navigate("/login");
        }
      }
      if (response.code === 400) {
        setIsIncorrect(true);
      }
      setloading(false);
    }

    // TODO : verfify the login otp
    async function fetchLoginOtp() {
      let userOTP = otpString;
      let response = await verifyLoginOtpAPI(email, userOTP);

      if (response.code === 200) {
        setIsIncorrect(false);
        addToken(response.data.token);
        setisAuth(response.data.token);
        redirectFunc();
      }
      if (response.code === 400 && response.message === WRONG_OTP) {
        setIsIncorrect(true);
      }
      if (response.code === 400 && response.message === WRONG_OTP_3_TIMES) {
        seterrormessage(response.message);
        seterrorSnack(true);
        setTimer(150);
        setshowSend(false);
        setsendLoading(true);
        setTimeout(() => {
          setshowSend(true);
          setIsIncorrect(false);
        }, 120000);
      }
      setloading(false);
    }

    if (otpString.length === 6) {
      setloading(true);
      if (AccountType === "register") {
        fetchRegisterApi();
      }
      if (AccountType === "login") {
        fetchLoginOtp();
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ind3dy5tb2hkc2hhaGlkMzAzQGdtYWlsLmNvbSIsImZ1bGxOYW1lIjoibW9oYW1tZWQgc2hhaGlkIiwibW9iaWxlIjoiOTYzNTYzNTU2NCIsInV1aWQiOiJhYmE2N2U0YS1kMDIwLTRmMGMtYTg3Mi02YjBkNjM5MTdkZDMiLCJpYXQiOjE2OTk2ODc3NzMsImV4cCI6MTcwNDg3MTc3M30.bioJPa_BAyHzZvliHRqx3RiSke1NJo5CYNpksFai6Lg
      }
    }
  }, [
    otp,
    AccountType,
    navigate,
    setIsIncorrect,
    setTimer,
    email,
    setisAuth,
    location,
  ]);

  // Handler for pasting OTP from clipboard
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim().slice(0, 4);
    const newOTP = Array(4).fill("");

    for (let i = 0; i < pasteData.length; i++) {
      newOTP[i] = pasteData[i];
    }

    setOTP(newOTP);
  };

  // Function to focus on the next input box
  const focusNextBox = (index) => {
    if (index < otpBoxesRef.current.length - 1) {
      otpBoxesRef.current[index + 1].focus();
    }
  };

  // Function to focus on the previous input box
  const focusPrevBox = (index) => {
    if (index > 0) {
      otpBoxesRef.current[index - 1].focus();
    }
  };

  // Effect to focus on the first input box when the component mounts
  useEffect(() => {
    otpBoxesRef.current[0].focus();
  }, []);

  return (
    <>
      <div className="otp-input-container">
        <div className="otp-boxes">
          {otp.map((value, index) => (
            <input
              className="otp-box"
              size="1"
              key={index}
              ref={(ref) => (otpBoxesRef.current[index] = ref)}
              type="number"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && value === "") {
                  focusPrevBox(index);
                }
              }}
              disabled={loading ? true : false}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default OTPInput;

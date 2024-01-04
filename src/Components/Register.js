import "../App.css";
import "../Styles/Login.css";
import { useState } from "react";
import Otp from "./Otp";
import { Alert, Snackbar } from "@mui/material";
import { generateOtpPAPI, registerUserAPI } from "../Apis/User_Register_Auth";
import { ButtonLoader } from "../Components2/Loader";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import logo from "../images/groomerLogo.png";
import register from "../images/register.png";
import Hamburger from "./Hamburger";
import MetaData from "../context/MetaData";

function Register() {
  // ? ------------------------------------------------------------
  //  ?  ----------- React-Router-Dom-----------------------------
  // ? -----------------------------------------------------------
  const navigate = useNavigate();
  const location = useLocation();

  // ? ------------------------------------------------------------
  //  ?  ----------- useStates-------------------------------------
  // ? -----------------------------------------------------------
  const [isMobileNumberRegistered, setIsMobileNumberRegistered] =
    useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userDetails, setuserDetails] = useState({
    full_name: "",
    email: "",
    mobile: "",
  });
  const [terms_condition, setterms_condition] = useState(false);
  const [loading, setloading] = useState(false);
  const [errorsnack, seterrorsnack] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const changeHanlder = (e) => {
    setuserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // ? ------------------------------------------------------------
  //  ?  ----------- functions -------------------------------------
  // ? -----------------------------------------------------------

  const redirectFunc = () => {
    let redirect = location.search.replace("?redirect=", "");
    if (redirect) {
      navigate(`/login?redirect=${redirect}`);
    } else {
      navigate("/login");
    }
  };

  // TODO : register submit handler function
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let check = Object.values(userDetails);
    if (check.some((item) => item === "")) {
      seterrormessage("fileds should not be empty");
      seterrorsnack(true);
      return;
    } else if (!terms_condition) {
      seterrormessage("please accept the terms and condition policies");
      seterrorsnack(true);
      return;
    }

    let response = await registerUserAPI(userDetails);

    let resCode = response.code;
    if (resCode === 409) {
      setIsMobileNumberRegistered(true);
      seterrormessage(response.message);
      seterrorsnack(true);
    } else if (resCode === 406) {
      seterrormessage(response.message);
      seterrorsnack(true);
    }

    if (resCode === 201) {
      setIsMobileNumberRegistered(false);
      setloading(true);
      let otpResponse = await generateOtpPAPI(userDetails.email);
      if (otpResponse.code === 200) {
        setIsRegistered(true);
        setloading(false);
      }
    }
  };

  return (
    <>
      <MetaData title="Account Register" />
      <div className="registerContainer">
        <div className="registerRow">
          <div className="resgisterCol">
            <img src={register} alt="register" className="registerImage" />
            <div className="registerLogo">
              <NavLink to="/">
                <img src={logo} alt="Logo" className="logo" />
              </NavLink>
            </div>
          </div>
          <div className="resgisterCol">
            <div className="accountMenu">
              <Hamburger />
            </div>
            {!isRegistered && (
              <form className="inforegister" onSubmit={handleRegisterSubmit}>
                <div>
                  <div className="login">
                    <b>Register</b>
                  </div>
                  <p>
                    {isMobileNumberRegistered
                      ? "This account already exists. Please "
                      : "Already have an account?"}{" "}
                    <span className="register" onClick={redirectFunc}>
                      Login
                    </span>
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="Mobile Number"
                    id="mobileNumber"
                    name="full_name"
                    value={userDetails.full_name}
                    onChange={changeHanlder}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="Mobile Number"
                    id="mobileNumber"
                    name="email"
                    value={userDetails.email}
                    onChange={changeHanlder}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Mobile Number"
                    className="Mobile Number"
                    id="mobileNumber"
                    name="mobile"
                    value={userDetails.mobile}
                    onChange={changeHanlder}
                  />
                </div>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      onChange={(e) => setterms_condition(e.target.checked)}
                    />
                    <span className="checkbox-custom"></span>I accept the terms
                    and conditions, including the Privacy
                  </label>
                </div>
                <div>
                  {loading ? (
                    <button className="LoginButton" disabled={true}>
                      <ButtonLoader />
                    </button>
                  ) : (
                    <button type="submit" className="RegisterButton">
                      Register
                    </button>
                  )}
                </div>
              </form>
            )}
            {isRegistered && (
              <Otp email={userDetails.email} AccountType="register" />
            )}
            {errorsnack && (
              <Snackbar
                open={errorsnack}
                autoHideDuration={6000}
                onClose={() => seterrorsnack(false)}
              >
                <Alert
                  onClose={() => seterrorsnack(false)}
                  severity="error"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  {errormessage}
                </Alert>
              </Snackbar>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

import "../App.css";
import "../Styles/Login.css";
import { useState } from "react";
import Otp from "./Otp";
import { Alert, Snackbar } from "@mui/material";
import { ButtonLoader } from "../Components2/Loader";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import logo from "../images/groomerLogo.png";
import register from "../images/register.png";
import Hamburger from "./Hamburger";
import { loginUserAPI } from "../Apis/User_Login_Auth";
import MetaData from "../context/MetaData";

function Login() {
  // ? ------------------------------------------------------------
  //  ?  ----------- React-Router_Dom-----------------------------
  // ? -----------------------------------------------------------

  let location = useLocation();
  let navigate = useNavigate();

  // ? ------------------------------------------------------------
  //  ?  -------------UseStates-----------------------------------
  // ? -----------------------------------------------------------

  const [email, setemail] = useState("");
  const [loading, setloading] = useState(false);
  const [errorsnack, seterrorsnack] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const [isRegistered, setisRegistered] = useState(false);

  // ? ------------------------------------------------------------
  //  ?  ----------- functions------------------------------------
  // ? -----------------------------------------------------------

  const redirectFunc = () => {
    let redirect = location.search.replace("?redirect=", "");
    if (redirect) {
      navigate(`/register?redirect=${redirect}`);
    } else {
      navigate("/register");
    }
  };

  // TODO : login submit handler function
  const loginCheckSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    if (email === "") {
      seterrorsnack(true);
      seterrormessage("Fields should not be empty");
      setloading(false);
      return;
    }
    let response = await loginUserAPI(email);
    let code = response.code;
    if (code === 406) {
      seterrorsnack(true);
      seterrormessage("Enter the Valid Email");
      setloading(false);
      return;
    }
    if (code === 404) {
      seterrorsnack(true);
      seterrormessage(response.message);
      setloading(false);
      return;
    }
    if (code === 200) {
      setisRegistered(true);
      setloading(false);
    }
  };

  return (
    <>
      <MetaData title="Account Login" />
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
              <form className="inforegister" onSubmit={loginCheckSubmit}>
                <div>
                  <div className="login">
                    <b>Login</b>
                  </div>
                  <p>
                    Don't have an account?
                    <span> </span>
                    <span className="register" onClick={redirectFunc}>
                      Register
                    </span>
                  </p>
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Enter the Email"
                    className="Mobile Number"
                    id="mobileNumber"
                    name="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  {loading ? (
                    <button className="LoginButton" disabled={true}>
                      <ButtonLoader />
                    </button>
                  ) : (
                    <button type="submit" className="RegisterButton">
                      Login
                    </button>
                  )}
                </div>
              </form>
            )}
            {isRegistered && <Otp email={email} AccountType="login" />}
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

export default Login;

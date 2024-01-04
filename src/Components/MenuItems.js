import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
// import Logo from './Logo'
// import TopNav from './TopNav';
import Header from "./Header";
import "../Styles/Login.css";
import { useContext } from "react";
import { Store } from "../App";
import { removeToken } from "../context/StorageToken";
import MetaData from "../context/MetaData";
// The MenuItems component renders navigation links.

function MenuItems() {
  // ? ------------------------------------------------------------
  //  ?  ----------- React-Router-Dom-------------------------------
  // ? -----------------------------------------------------------
  const navigate = useNavigate();

  // ? ------------------------------------------------------------
  //  ?  ----------- UseStates--------------------------------------
  // ? -----------------------------------------------------------

  const [isAuth, setisAuth] = useContext(Store);

  // ? ------------------------------------------------------------
  //  ?  ----------- functions--------------------------------------
  // ? -----------------------------------------------------------

  // TODO : logout purpose submit handler
  const logoutHandler = () => {
    removeToken();
    setisAuth(null);
    navigate("/");
  };
  return (
    <div>
      <MetaData title="Groomers' Menu" />
      <Header />
      <div className="content">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Create navigation links for "Home," "Salons," "About us," and "Log out." */}
          <NavLink to="/">
            <span style={{ color: "#FFF", fontSize: "30px" }}>Home</span>
          </NavLink>
          <NavLink to="/salons">
            <span style={{ color: "#FFF", fontSize: "30px" }}>Salons</span>
          </NavLink>
          <NavLink to="/aboutUs">
            <span style={{ color: "#FFF", fontSize: "30px" }}>About us</span>
          </NavLink>
          {!isAuth && (
            <NavLink to="/register">
              <span style={{ color: "#FFF", fontSize: "30px" }}>Register</span>
            </NavLink>
          )}
          {isAuth && (
            <div style={{ cursor: "pointer" }} onClick={logoutHandler}>
              <span style={{ color: "#FFF", fontSize: "30px" }}>Log out</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItems;

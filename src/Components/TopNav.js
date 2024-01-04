import "../App.css";
import Search from "./Search";
import Profile from "./Profile";
import Hamburger from "./Hamburger";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../App";

// The TopNav component renders the top navigation bar.
function TopNav() {
  const [isAuth] = useContext(Store);

  const style = [
    {
      fontWeight: "700",
      marginTop: "3px",
    },
    {
      color: "white",
      cursor: "pointer",
    },
  ];

  return (
    <div className="topNav" style={{ zIndex: "999" }}>
      <Search />
      {/* <Profile /> */}
      {isAuth ? (
        <Profile />
      ) : (
        <div style={style[0]}>
          <Link to="/login" style={style[1]}>
            Login
          </Link>
        </div>
      )}
      <Hamburger />
    </div>
  );
}

export default TopNav;

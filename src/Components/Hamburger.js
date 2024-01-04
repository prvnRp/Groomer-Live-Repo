// Hamburger component for displaying a menu icon or a close icon based on the window width and current route

import "../App.css";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useBlur } from "../context/blurContext";

function Hamburger() {
  const { isBlur } = useBlur();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 700);
    };

    // Initial check and event listener setup
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Check if the current route is '/menu' to determine the icon to display
  const changeIcon = window.location.pathname === "/menu";

  //   if(location)

  // Handle the click event on the grid icon
  const handleGridIconClick = () => {
    if (window.location.pathname === "/menu") {
      // If the current route is '/menu', navigate back (-1)
      navigate(-1);
    } else {
      // Otherwise, navigate to '/menu'
      navigate("/menu");
    }
  };

  return (
    // Apply blur effect to the hamburger icon when the isBlur state is true
    <div style={{ filter: isBlur ? "blur(10px)" : "none" }}>
      {isMobileView && (
        <Grid
          className="hamburger-background"
          style={{
            padding: "2px 4px",
            cursor: "pointer",
            borderRadius: "50%",
            float: "right",
          }}
          item
          xs={1}
          onClick={handleGridIconClick}
        >
          {/* {changeIcon ? <div style={{ fontSize: "17px", padding: "0 5px", color: "#000" }}>&times;</div> : <MenuIcon className='menu-icon' />} */}
          {changeIcon ? (
            <div
              style={{ fontSize: "50px", position: "relative", top: "-25px" }}
            >
              &times;
            </div>
          ) : (
            <MenuIcon className="menu-icon" />
          )}
        </Grid>
      )}
      {!isMobileView && (
        <Grid
          className="hamburger-background"
          style={{
            padding: "2px 4px",
            cursor: "pointer",
            borderRadius: "50%",
            float: "right",
          }}
          item
          xs={1}
          onClick={handleGridIconClick}
        >
          {changeIcon ? (
            <CloseIcon className="menu-icon" style={{ color: "white" }} />
          ) : (
            <MenuIcon
              className="menu-icon"
              style={{
                color:
                  location.pathname === "/login" ||
                  location.pathname === "/register" ||
                  location.pathname === "/ranu"
                    ? "black"
                    : "white",
              }}
            />
          )}
        </Grid>
      )}
    </div>
  );
}

export default Hamburger;

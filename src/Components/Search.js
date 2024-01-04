import "../App.css";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useBlur } from "../context/blurContext";
import { Store2 } from "../App";
import { useNavigate } from "react-router-dom";

function Search() {
  const [opensearch, setOpensearch] = useState(false);
  const [searchInputTerm, setsearchInputTerm] = useState("");
  const dropdownRef = useRef(null);
  const { toggleBlur, setIsBlur } = useBlur();
  // console.log(isBlur);

  const { searchSalon } = useContext(Store2);

  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpensearch(false);
        setIsBlur(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleScroll = () => {
    setOpensearch(false);
    setIsBlur(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOnClick = () => {
    setOpensearch(!opensearch);
    toggleBlur();
  };

  const redirectToSalon = (item) => {
    navigate(`/salon/${item.salonId}`);
    setsearchInputTerm("");
    handleOnClick();
  };

  // console.log(isBlur);
  const renderdropdownlist =
    searchSalon &&
    searchSalon
      .filter((item) => {
        const searchterm = searchInputTerm.toLowerCase();
        const fullName = item.salonName.toLowerCase();
        return (
          searchterm &&
          fullName.startsWith(searchterm) &&
          fullName !== searchterm
        );
      })
      .slice(0, 10)
      .map((item) => {
        return (
          <p
            className="fontFamily"
            onClick={() => redirectToSalon(item)}
            key={item.salonId}
          >
            {item.salonName}
          </p>
        );
      });

  return (
    <div
      className="search-icon"
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "row-reverse",
      }}
      ref={dropdownRef}
    >
      {" "}
      {/* Add this container to center the search bar */}
      <div style={{ textAlign: "right" }}>
        <SearchIcon
          style={{ fontSize: "35px", color: "#FFF", cursor: "pointer" }}
          onClick={() => {
            handleOnClick();
          }}
        />
      </div>
      {opensearch && (
        <>
          <div className="parentSearchBox">
            <div className="searchBar">
              <input
                className="search"
                placeholder="Search Salon"
                onChange={(e) => setsearchInputTerm(e.target.value)}
              />
            </div>
            <div className="search-box">{renderdropdownlist}</div>
          </div>
        </>
      )}
    </div>
  );
}

export default Search;

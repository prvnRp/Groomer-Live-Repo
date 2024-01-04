import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
const NotFound = () => {
  return (
    <>
      <Header />
      <div
        style={{
          backgroundColor: "#000",
          color: "#fff",
          textAlign: "center",
          padding: "10% 0",
        }}
      >
        <h1 style={{ fontSize: "3rem", color: "#ff6600" }}>Page Not Found</h1>
        <p style={{ fontSize: "1.5rem" }}>
          Sorry, the page you're looking for doesn't exist.
        </p>
        <div className="button-container">
          <Link to="/" style={{ marginRight: "20px" }}>
            <button className="button">Home Page</button>
          </Link>
          <Link to="/salons">
            <button className="button">All Salons Page</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;

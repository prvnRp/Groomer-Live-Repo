import "../App.css";
import manCircle from "../images/mans-face-in-a-circle.svg";
import MenuBar from "./MenuBar";
import { useState, useEffect, useRef } from "react";
import { useBlur } from "../context/blurContext";
import { Badge } from "@mui/material";
import { getAppointmentsApi } from "../Apis/Booking_service";
import { removeToken } from "../context/StorageToken";
import { useNavigate } from "react-router-dom";

function Avatar() {
  const { isBlur } = useBlur(); // Access the isBlur state from the blurContext
  const dropdownRef = useRef(null); // Create a ref for the dropdown menu
  const navigate = useNavigate();

  // State to track the visibility of the dropdown menu
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [bookingCount, setbookingCount] = useState(0);

  // Handler for clicking the user avatar circle
  const handleCircleClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Effect to close the dropdown menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    // Add a click event listener to the entire document
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts to prevent memory leaks
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchBookings() {
      let response = await getAppointmentsApi(15, 1);
      if (response.code === 200) {
        let count = response.data.appointments.filter(
          (item) => item.appointment_status === "booked"
        ).length;
        setbookingCount(count);
      } else if (response.code === 401) {
        removeToken();
        navigate("/login");
      }
    }
    fetchBookings();
  }, []);

  return (
    <div style={{ filter: isBlur ? "blur(10px)" : "none", cursor: "pointer" }}>
      {/* Render the user avatar circle */}
      <Badge color="success" overlap="circular" badgeContent={bookingCount}>
        <img
          style={{
            transform: "scale(0.6)",
            position: "relative",
            top: "-15px",
          }}
          src={manCircle}
          alt="user"
          ref={dropdownRef}
          onClick={handleCircleClick}
        />
      </Badge>
      {/* Render the dropdown menu when isDropdownVisible is true */}
      {isDropdownVisible && (
        <div>
          <MenuBar />
        </div>
      )}
    </div>
  );
}

export default Avatar;

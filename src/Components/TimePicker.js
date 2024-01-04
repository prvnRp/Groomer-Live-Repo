import React, { useState, useRef, useEffect } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const TimePicker = ({ slotDetails, setslotDetails, completeTimeOptions }) => {
  const [selectedTime, setSelectedTime] = useState(slotDetails.time);
  const [showCompleteDropdown, setShowCompleteDropdown] = useState(false);

  completeTimeOptions = completeTimeOptions.map((item) => {
    if (item.slot_time.length === 7) {
      item.slot_time = "0" + item.slot_time;
      return item;
    } else {
      return item;
    }
  });

  // Function to handle complete time change
  const handleCompleteTimeChange = (timeOption) => {
    setShowCompleteDropdown(false);
    setSelectedTime(timeOption.slot_time);
    let update = { ...slotDetails };
    update.time = timeOption.slot_time;
    update.slot_uuid = timeOption.slot_uuid;
    setslotDetails(update);
  };

  const handleCompleteDropdownClick = () => {
    setShowCompleteDropdown(!showCompleteDropdown);
  };

  // Ref for the dropdown container
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCompleteDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="time-picker-container" ref={dropdownRef}>
      <div className="time-picker-input">
        <input
          type="text"
          value={selectedTime}
          readOnly
          // onClick={togglePicker}
          placeholder="Select Time"
          onClick={handleCompleteDropdownClick}
        />
        <span
          className="time-picker-icon"
          onClick={handleCompleteDropdownClick}
        >
          <AccessTimeIcon style={{ fontSize: "20px" }} />
        </span>
      </div>

      {/* Complete time dropdown */}
      {showCompleteDropdown && (
        <div
          className="complete-time-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "#525252",
            borderRadius: "15px",
            color: "#fff",
            zIndex: 9999,
            padding: "5px 6px",
            maxHeight: "10rem",
            overflow: "auto",
          }}
        >
          {completeTimeOptions.map((timeOption, index) => (
            <div
              key={index}
              onClick={() => handleCompleteTimeChange(timeOption)}
              style={{ cursor: "pointer" }}
              className={
                selectedTime === timeOption.slot_time
                  ? "selected time-picker-complete-option"
                  : "time-picker-complete-option"
              }
            >
              {timeOption.slot_time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimePicker;

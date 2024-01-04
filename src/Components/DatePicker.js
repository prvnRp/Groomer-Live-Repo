import React, { useEffect, useRef, useState } from "react";
import "../Styles/style.css";
import calendar from "../images/tear-off-calendar1.svg";
import moment from "moment";

const DatePicker = ({ color, slotDetails, setslotDetails, blockeddates }) => {
  // Ref to track clicks outside the custom dropdown
  const dropdownRef = useRef(null);
  const Today = moment().format("DD/MM/YYYY");
  const Tomorrow = moment().add(1, "days").format("DD/MM/YYYY");
  const dropdownOptions = [];

  const [showCustomDropdown, setShowCustomDropdown] = useState(false);

  if (!blockeddates.some((item) => item === Today)) {
    dropdownOptions.push({ general: "Today", full: Today });
  }

  if (!blockeddates.some((item) => item === Tomorrow)) {
    dropdownOptions.push({ general: "Tomorrow", full: Tomorrow });
  }

  function isBlocked(value) {
    return blockeddates.includes(value);
  }

  for (let i = 2; dropdownOptions.length < 7; i++) {
    let x = moment().add(i, "days").format("D MMM");
    let y = moment().add(i, "days").format("DD/MM/YYYY");
    if (!isBlocked(y)) {
      dropdownOptions.push({ general: x, full: y });
    }
  }

  const [selectedDate, setSelectedDate] = useState(
    dropdownOptions[0]["general"]
  );

  // Handle selection of shortcut options
  const handleShortcutSelection = (shortcut, full) => {
    setSelectedDate(shortcut);
    setslotDetails({ ...slotDetails, ["date"]: shortcut, ["full_date"]: full });
    setShowCustomDropdown(false);
  };

  useEffect(() => {
    if (dropdownOptions.length > 0) {
      let update = { ...slotDetails };
      update.date = dropdownOptions[0]["general"];
      update.full_date = dropdownOptions[0]["full"];
      setslotDetails(update);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCustomDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="datepicker-container">
      <div
        style={{ position: "relative" }}
        className="outline-element-container"
      >
        <input
          type="text"
          value={selectedDate}
          color="#fff"
          objtype="7"
          name="action_element"
          placeholder="select date"
          onClick={() => setShowCustomDropdown(!showCustomDropdown)}
          style={{
            backgroundColor: color,
            padding: "5px",
            border: "0",
            outline: "none",
            caretColor: "transparent",
            color: "#fff",
            fontSize: "15px",
            position: "relative",
            top: "3px",
            cursor: "pointer",
            width: "6rem",
            marginLeft: "5px",
          }}
          readOnly
        />
        {/* <span className="correct-incorrect-icon"> */}
        <img
          src={calendar}
          alt="calendar"
          style={{
            position: "absolute",
            top: "8px",
            right: "44px",
            cursor: "pointer",
          }}
          onClick={() => setShowCustomDropdown(!showCustomDropdown)}
        />
        {/* </span> */}
        {showCustomDropdown && (
          <div className="custom-date-dropdown" ref={dropdownRef}>
            {dropdownOptions.map((option, index) => (
              <div
                key={index}
                className={
                  selectedDate === option.general
                    ? "custom-date-option selected"
                    : "custom-date-option"
                }
                onClick={() =>
                  handleShortcutSelection(option.general, option.full)
                }
              >
                {option.general}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;

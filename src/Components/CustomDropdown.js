// A custom dropdown
// Send prop label if the label should be displayed for that dropdown and the Label name in {Label}
// Send prop width and fontSize according to the need
// Send prop searchFilter if the filter option is to be enabled for this dropwdown.
// Send dropdown options in prop {options}

import React, { useState, useEffect, useRef } from "react";

// Custom dropdown component with search and select functionality
const CustomDropdown = ({
  label,
  Label,
  value,
  options,
  onChange,
  searchFilter,
  width,
  fontSize,
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to track whether the dropdown is open
  const [selectedOption, setSelectedOption] = useState(value || options[0]); // State to track the currently selected option
  const [inputValue, setInputValue] = useState(""); // State to manage the input value for search filtering
  const dropdownRef = useRef(null); // Reference to the dropdown element

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Handle selecting an option from the dropdown
  const handleSelect = (option) => {
    setSelectedOption(option);
    setInputValue("");
    onChange(option);
    setIsOpen(false);
  };

  // Handle input change for search filtering
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Filter options based on the input value
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Move the selected option to the top of the list
  if (selectedOption && filteredOptions.includes(selectedOption)) {
    filteredOptions.splice(filteredOptions.indexOf(selectedOption), 1);
    filteredOptions.unshift(selectedOption);
  }

  // Check if a "Not Found" message should be displayed
  const showNotFound = searchFilter && isOpen && filteredOptions.length === 0;

  return (
    <div className="locationdropdown" ref={dropdownRef}>
      {/* Render input for search filtering if enabled */}
      {searchFilter && (
        <input
          style={{ opacity: isOpen ? "1" : "0" }}
          disabled={!isOpen}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search"
        />
      )}
      {/* Render the dropdown container */}
      <div className="location-conatiner">
        {Label && <span style={{ color: "#FFF" }}>{label}:</span>}{" "}
        {/* Display optional label */}
        <div className="custom-dropdown" style={{ minWidth: "167px" }}>
          {" "}
          {/* Render the main dropdown */}
          <div
            style={{ opacity: isOpen ? "0" : "1" }}
            className="dropdown-selected"
          >
            {selectedOption || "Select Location"}
          </div>
          {/* Display options when the dropdown is open */}
          {isOpen && !showNotFound && (
            <div style={{ fontSize: fontSize }} className="dropdown-options">
              {filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`dropdown-option ${
                    selectedOption === option ? "selected" : "notselected"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
          {showNotFound && (
            <div className="dropdown-options">
              <div
                style={{ textAlign: "center" }}
                className="dropdown-option notselected"
              >
                {label} Not Found
              </div>
            </div>
          )}
        </div>
        {/* Toggle the dropdown open/close */}
        <span style={{ marginLeft: "5px" }} onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? "arrow down" : "arrow up"}></i>
        </span>
      </div>
    </div>
  );
};

export default CustomDropdown;

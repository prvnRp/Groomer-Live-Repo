// A custom dropdown
// Send prop label if the label should be displayed for that dropdown
// Send prop fontSize according to the need
// Send prop searchFilter if the filter option is to be enabled for this dropwdown.
// Send dropdown options in prop {options}
// the search input displays directly unlike the CustomDropdown (where the search appears when dropdwon is opened)

import React, { useState, useEffect, useRef } from "react";

const LocationDropdown = ({
  label,
  value,
  options,
  onChange,
  searchFilter,
  fontSize,
  setFilteredCardsLocation,
}) => {
  const [isOpen, setIsOpen] = useState(false); // State for dropdown open/close
  const [selectedOption, setSelectedOption] = useState(value || options[0]); // State for selected option
  const [inputValue, setInputValue] = useState(""); // State for input value
  const dropdownRef = useRef(null); // Ref for the dropdown container

  // Handle click outside to close dropdown
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

  // Handle option selection
  const handleSelect = (option) => {
    setSelectedOption(option);
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  // Handle input value change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsOpen(true);
    if (event.target.value === "") {
      setIsOpen(false);
      setFilteredCardsLocation(null);
    }
  };

  // Filter options based on input value
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Move selected option to the top of the filtered options list
  if (selectedOption && filteredOptions.includes(selectedOption)) {
    filteredOptions.splice(filteredOptions.indexOf(selectedOption), 1);
    filteredOptions.unshift(selectedOption);
  }

  // Show 'Not Found' message if search filter is active and no options match
  const showNotFound = searchFilter && isOpen && filteredOptions.length === 0;

  return (
    <div className="locationdropdown">
      <div className="location-conatiner" ref={dropdownRef}>
        <span style={{ color: "#FFF", position: "relative", top: "5px" }}>
          {label}:
        </span>
        <div className="custom-dropdown">
          <div className="dropdown-selected">
            {/* {selectedOption || "Select Location"} */}
            {searchFilter && (
              <input
                // style={{ opacity: isOpen ? '1' : '0' }}
                // disabled={!isOpen}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search"
                onClick={() => setIsOpen(true)}
              />
            )}
          </div>
          {isOpen && !showNotFound && (
            <div style={{ fontSize: fontSize }} className="location-options">
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
            <div className="location-options">
              <div
                style={{ textAlign: "center" }}
                className="dropdown-option notselected"
              >
                {label} Not Found
              </div>
            </div>
          )}
        </div>
        <span style={{ marginLeft: "5px" }} onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? "arrow down" : "arrow up"}></i>
        </span>
      </div>
    </div>
  );
};

export default LocationDropdown;

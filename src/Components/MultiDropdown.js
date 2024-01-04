import React, { useState, useEffect, useRef } from 'react';

const LocationDropdown = ({ values, options, onChange, searchFilter, fontSize }) => {
    // State variables for managing the dropdown
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(values || []);
    const [searchInput, setSearchInput] = useState('');
    const dropdownRef = useRef(null);

    // Effect to handle clicks outside of the dropdown
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                if (selectedOptions.length > 0) {
                    setSearchInput(selectedOptions[0]);
                }
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [selectedOptions]);

    // Function to toggle the selection of an option
    const toggleOption = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([option, ...selectedOptions]);
        }
    };

    // Function to toggle the dropdown visibility
    const DropdownToggle = () => {
        setIsOpen(!isOpen);
        if (selectedOptions.length > 0) {
            setSearchInput(selectedOptions[0]);
        }
    }

    // Function to handle input changes
    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
        setIsOpen(true);
        if (event.target.value === '') {
            setIsOpen(false);
        }
    };

    // Filter options based on search input
    const filteredOptions = options.filter(option => option.toLowerCase().includes(searchInput.toLowerCase()));

    // Determine if a "Service Not Found" message should be displayed
    const showNotFound = searchFilter && isOpen && filteredOptions.length === 0;

    return (
        <div className='locationdropdown'>
            <div className='location-conatiner' ref={dropdownRef}>
                <span style={{ color: "#FFF" }}>Services:</span>
                <div className="custom-dropdown" style={{ minWidth: "100px" }}>
                    <div
                        className="dropdown-selected"
                    >
                        {searchFilter && <input
                            style={{ backgroundColor: "#2C2C2C", color: "#FFF", position: "relative", top: "-2px" }}
                            type="text"
                            value={searchInput}
                            onChange={handleInputChange}
                            placeholder="Search"
                            onClick={() => setIsOpen(true)}
                        />}
                    </div>
                    {isOpen && !showNotFound && (
                        <div style={{ fontSize: fontSize }} className="location-options">
                            {options.map((option) => (
                                <label key={option} className="dropdown-option checkbox-group">
                                    <div>
                                        <label style={{ paddingLeft: "20px" }} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                value={option}
                                                checked={selectedOptions.includes(option)}
                                                onChange={() => toggleOption(option)}
                                            />
                                            <span className="checkbox-custom"></span>
                                            {option}
                                        </label>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                    {showNotFound && (
                        <div className="location-options">
                            <div style={{ textAlign: "center" }} className="dropdown-option notselected">Service Not Found</div>
                        </div>
                    )}
                </div>
                <span style={{ marginLeft: "5px" }} onClick={DropdownToggle}>
                    <i className={isOpen ? 'arrow down' : 'arrow up'}></i>
                </span>
            </div>
        </div >
    );
};

export default LocationDropdown;

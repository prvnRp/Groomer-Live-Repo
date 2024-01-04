import React, { useState } from "react";
import "../App.css";
import "../Styles/Filter.css";
import CustomDropdown from "./CustomDropdown";
import MultiDropdown from "./MultiDropdown";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { cardData } from "./Data";
import Slider from "@mui/material/Slider";

function FilterSortPopup({
  close,
  filterOptions,
  setFilterOptions,
  resetFiltersFunc,
}) {
  // Get unique service names from card data
  const uniqueServiceNames = Array.from(
    new Set(
      cardData
        .flatMap((item) => item.services)
        .filter((service) => service.ServiceName)
        .map((service) => service.ServiceName)
    )
  );

  // Handle change in filter options
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  };

  const [selectedServices, setSelectedServices] = useState([]);
  const serviceResult = selectedServices.join(",");

  const Allservices = [
    "face painting",
    "facial",
    "hair cut",
    "manicure",
    "pedicure",
    "shaving",
  ];

  // Handle reset filters button
  const handleResetFilters = () => {
    // Reset filter options
    setFilterOptions({
      distance: "",
      priceFrom: "",
      priceTo: "",
      ratings: "",
      services: "",
      sort: "",
      sortOrder: "",
      combos: "",
      time: "",
      selectedDate: "",
      manhood: "", // Default value for Manhood
    });

    setSelectedServices([]);
    resetFiltersFunc();
  };

  // const handleDateChange = (selectedDate) => {
  //   setFilterOptions((prevOptions) => ({
  //     ...prevOptions,
  //     selectedDate: selectedDate,
  //   }));
  // };

  // Handle change in sort option
  const handleSortChange = (e) => {
    const { value } = e.target;
    const newSort = filterOptions.sort === value ? "None" : value;
    let defaultSortOrder;
    switch (newSort) {
      case "distance":
      case "price":
        defaultSortOrder = "asc";
        break;
      case "ratings":
        defaultSortOrder = "desc";
        break;
      default:
        defaultSortOrder = "asc";
        break;
    }

    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      sort: newSort,
      sortOrder: defaultSortOrder,
    }));
  };

  // Handle change in sort order
  const handleSortOrderChange = () => {
    // If the current sort order is 'asc', set it to 'desc', and vice versa
    const newSortOrder = filterOptions.sortOrder === "asc" ? "desc" : "asc";
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      sortOrder: newSortOrder,
    }));
  };

  // Handle change in price slider
  const handlePriceSliderChange = (priceFrom, priceTo) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      priceFrom: priceFrom,
      priceTo: priceTo,
    }));
  };

  // Handle change in distance filter
  const handleDistanceFilterChange = (value) => {
    let distanceValue;

    // Check if value is numeric
    const numericValue = parseFloat(value.match(/\d+/));
    if (!isNaN(numericValue)) {
      // Use numeric value if available
      distanceValue = numericValue;
    } else {
      // Set "All" if no numeric value
      distanceValue = "all";
    }
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      distance: distanceValue,
    }));
  };

  // Handle change in service filter
  const handleFilterServiceChange = (value) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      services: value,
    }));
  };

  const distances = [
    "All",
    "Less than 3km",
    "Less than 5km",
    "Less than 7km",
    "Less than 10km",
  ];

  const handleServiceChange = (service) => {
    let update = [...selectedServices];
    let checkService = update.some((item) => item === service);
    if (!checkService) {
      update.push(service);
    }

    setSelectedServices(update);

    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      services: update,
    }));
  };

  const handleRemoveService = (service) => {
    setSelectedServices(selectedServices.filter((s) => s !== service));
  };

  return (
    <div className="filter-sort-popup">
      <div className="filter-popup-content">
        <div
          style={{
            position: "absolute",
            right: "2vw",
            fontSize: "30px",
            cursor: "pointer",
            color: "#FF6548",
            fontWeight: "bold",
          }}
          onClick={close}
        >
          &times;
        </div>

        <div className="filter-section">
          <p>
            <u>Filter</u>
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <label style={{ marginRight: "20px" }}>Manhood:</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label style={{ marginRight: "6px" }}>Male</label>
              <input
                type="radio"
                name="manhood"
                value="male"
                checked={filterOptions.manhood === "male"}
                onChange={handleFilterChange}
                style={{ marginRight: "10px" }}
              />
              <label style={{ marginRight: "6px" }}>Female</label>
              <input
                type="radio"
                name="manhood"
                value="female"
                checked={filterOptions.manhood === "female"}
                onChange={handleFilterChange}
              />
              <label style={{ marginRight: "6px", marginLeft: "6px" }}>
                Both
              </label>
              <input
                type="radio"
                name="manhood"
                value="unisex"
                checked={filterOptions.manhood === "unisex"}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div>
            <CustomDropdown
              label="Distance"
              Label={true}
              value={filterOptions.distance}
              options={distances}
              onChange={(value) => handleDistanceFilterChange(value)}
              searchFilter={false}
              width={"90px"}
            />
          </div>
          {/* <div> */}
          {/* <MultiDropdown
              label="Services"
              Label={true}
              value={filterOptions.service}
              options={uniqueServiceNames}
              onChange={(value) => handleFilterServiceChange(value)}
              searchFilter={true}
            />
          </div> */}

          <div className="d-flex pd-top">
            <label className="pr-23 pd-top">Service: </label>
            <div className="filter-services">
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {selectedServices.map((service) => (
                  <div className="service" key={service}>
                    {service}{" "}
                    <span
                      className="remove-btn"
                      onClick={() => handleRemoveService(service)}
                    >
                      X
                    </span>
                  </div>
                ))}
              </div>
              <div className="searchService">
                <select
                  className="service-box"
                  name="selectedServices"
                  value={filterOptions.service}
                  onChange={(e) => handleServiceChange(e.target.value)}
                >
                  <option value="">Select a service</option>
                  {Allservices.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* <div className="price">
            <label style={{ marginRight: "25px" }} htmlFor="priceFrom">
              Price:
            </label>
            <input
              type="number"
              id="priceFrom"
              name="priceFrom"
              value={filterOptions.priceFrom}
              onChange={handleFilterChange}
              placeholder="From"
            />
            To
            <input
              type="number"
              id="priceTo"
              name="priceTo"
              value={filterOptions.priceTo}
              onChange={handleFilterChange}
              placeholder="To"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "15px",
              alignItems: "center",
            }}
          >
            <small>Min</small>
            <div style={{ marginTop: "3px", width: "100%" }}>
              <Slider
                value={[filterOptions.priceFrom, filterOptions.priceTo]}
                onChange={(event, newValue) => {
                  handlePriceSliderChange(newValue[0], newValue[1]);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                sx={{
                  color: "#FFF",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#FF6548",
                  },
                }}
              />
            </div>
            <small>Max</small>
          </div> */}
          <div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
            <label htmlFor="ratings">Ratings:</label>
            <div>
              <Rating
                name="ratings"
                value={parseFloat(filterOptions.ratings)}
                precision={1}
                onChange={(event, newValue) => {
                  handleFilterChange({
                    target: {
                      name: "ratings",
                      value: newValue.toString(),
                    },
                  });
                }}
                sx={{ "& .MuiRating-iconFilled": { color: "#fff" } }}
                emptyIcon={<StarBorderIcon style={{ color: "white" }} />}
              />
            </div>
          </div>
        </div>
        <div className="sort-section">
          <p>
            <u>Sort</u>
          </p>
          <div className="sort-buttons">
            <button
              className={`sort-button ${
                filterOptions.sort === "distance" ? "active" : ""
              }`}
              onClick={() =>
                handleSortChange({ target: { value: "distance" } })
              }
            >
              Sort&nbsp;by&nbsp;distance
            </button>
            <br />
            {/* <button
              className={`sort-button ${
                filterOptions.sort === "price" ? "active" : ""
              }`}
              onClick={() => handleSortChange({ target: { value: "price" } })}
            >
              Sort&nbsp;by&nbsp;price
            </button> */}
            {/* <button
              className={`sort-button ${
                filterOptions.sort === "popularity" ? "active" : ""
              }`}
              onClick={() =>
                handleSortChange({ target: { value: "popularity" } })
              }
            >
              Sort&nbsp;by&nbsp;popularity
            </button> */}
            <button
              className={`sort-button ${
                filterOptions.sort === "ratings" ? "active" : ""
              }`}
              onClick={() => handleSortChange({ target: { value: "ratings" } })}
            >
              Sort&nbsp;by&nbsp;ratings
            </button>
          </div>
          <div>
            <p>
              <u>Order:</u>
            </p>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              Low
              <button className="sort-order" onClick={handleSortOrderChange}>
                {filterOptions.sortOrder === "asc" ? (
                  <>
                    <EastIcon fontSize="small" />
                  </>
                ) : (
                  <>
                    <WestIcon fontSize="small" />
                  </>
                )}
              </button>
              High
            </div>
          </div>
        </div>
      </div>
      <div className="actions">
        <button onClick={handleResetFilters}>Reset</button>
      </div>
    </div>
  );
}

export default FilterSortPopup;

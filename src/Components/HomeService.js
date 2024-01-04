import React, { useState } from "react";
import Logo from "./Logo";
import Hamburger from "./Hamburger";
import "../App.css";
import "../Styles/HomeService.css";
import "../Styles/Login.css";
import { HomeServiceAppointAPI } from "../Apis/Home_service";
import { Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from "../Components2/Loader";
import { removeToken } from "../context/StorageToken";

const HomeService = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [successSnack, setSuccesSnack] = useState(false);
  const [succesMessage, setSuccessMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [errorSnack, setErrorSnack] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userDetails, setuserDetails] = useState({
    appointmentDate: "",
    appointmentTime: "",
    fullName: "",
    mobileNumber: "",
    fullAddress: "",
    suggestions: "",
  });

  const categories = ["Men", "Women", "Both", "Kids", "All"];
  const servicesByCategory = {
    Men: ["Haircut - ₹150", "Shave - ₹50", "Facial - ₹500"],
    Women: ["Haircut - ₹350", "Manicure - ₹250", "Pedicure - ₹250"],
    Both: [
      "Haircut - ₹250",
      "Shave - ₹50",
      "Manicure - ₹250",
      "Pedicure - ₹250",
      "Facial - ₹500",
    ],
    Kids: ["Haircut - ₹150", "Face Painting - ₹250"],
    All: [
      "Haircut - ₹150",
      "Shave - ₹50",
      "Facial - ₹500",
      "Manicure - ₹250",
      "Pedicure - ₹250",
      "Face Painting - ₹250",
    ],
  };

  const changeHanlder = (e) => {
    setuserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const getServicePrice = (service) => {
    const match = service.match(/₹(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const handleServiceChange = (service) => {
    let update = [...selectedServices];
    let checkService = update.some((item) => item === service);
    if (!checkService) {
      update.push(service);
    }

    setSelectedServices(update);
    const newTotalPrice = update.reduce(
      (total, service) => total + getServicePrice(service),
      0
    );
    setTotalPrice(newTotalPrice);
  };

  const handleRemoveService = (service) => {
    const removedIndex = selectedServices.findIndex((s) => s === service);

    if (removedIndex !== -1) {
      const updatedServices = [...selectedServices];
      updatedServices.splice(removedIndex, 1);
      const newTotalPrice = updatedServices.reduce(
        (total, service) => total + getServicePrice(service),
        0
      );
      setSelectedServices(updatedServices);
      setTotalPrice(newTotalPrice);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    let response = await HomeServiceAppointAPI(
      userDetails,
      selectedCategory,
      selectedServices,
      totalPrice
    );

    if (response.code === 201) {
      setloading(false);
      setSuccesSnack(true);
      setSuccessMessage(
        "Home service appointment successfully booked. Please check your email..."
      );
      setTimeout(() => {
        navigate("/");
      }, 7000);
    } else if (response.code === 401) {
      removeToken();
      navigate("/login");
    } else {
      setloading(false);
      setErrorSnack(true);
      setSuccessMessage(response.message);
    }
  };

  return (
    <>
      <div>
        <div style={{ position: "fixed", top: "0", left: "0" }}>
          <Logo />
        </div>
        <div className="hamburger">
          <Hamburger />
        </div>
      </div>
      <div className="serviceDetails">
        <form className="homeServiceForm" onSubmit={handleSubmit}>
          <h3 className="pt-3">Service details</h3>
          <div className="dflex">
            <label className="pd-top">To whom: </label>
            <div className="mobileviewCheckbox">
              {categories.map((category) => (
                <label key={category} className="pd-left">
                  <div className="dflex pd-top">
                    <input
                      type="checkbox"
                      checked={selectedCategory === category}
                      className="checkbox"
                      onChange={() => handleCategoryChange(category)}
                      name="targetGender"
                      value={userDetails.targetGender}
                    />
                    <span>{category}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="d-flex pd-top">
            <label className="pd-right pd-top">Service: </label>
            <div className="selected-services">
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
                {selectedCategory && (
                  <select
                    className="select-box"
                    name="selectedServices"
                    value={userDetails.selectedServices}
                    onChange={(e) => handleServiceChange(e.target.value)}
                  >
                    <option value="">Select a service</option>
                    {servicesByCategory[selectedCategory].map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
          <div className="dflex">
            <label className="pd-top">Total: </label>
            <span className="pdLeft">₹{totalPrice}</span>
          </div>
          <div className="d-flex">
            <label className="pd-top pd-right">When: </label>
            <div className="dflex">
              <div className="pd-top">
                <label className="pr-2">Date : </label>
                <input
                  type="date"
                  placeholder="Date"
                  className="styleDateTime"
                  name="appointmentDate"
                  value={userDetails.appointmentDate}
                  onChange={changeHanlder}
                  required
                />
              </div>
              <div className="pd-top">
                <label className="pdleft pr-2">Time : </label>
                <input
                  type="time"
                  placeholder="Time"
                  className="styleDateTime"
                  name="appointmentTime"
                  value={userDetails.appointmentTime}
                  onChange={changeHanlder}
                  required
                />
              </div>
            </div>
          </div>
          <div className="pd-top">
            <h3>Customer details</h3>
            <div className="dflex justify-content-between pd-top">
              <div>
                <input
                  type="text"
                  placeholder="Full name"
                  className="inputField"
                  name="fullName"
                  value={userDetails.fullName}
                  onChange={changeHanlder}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Mobile number"
                  className="inputField mobileNum"
                  name="mobileNumber"
                  value={userDetails.mobileNumber}
                  onChange={changeHanlder}
                  required
                />
              </div>
            </div>
            <div className="pd-top">
              <input
                type="text"
                placeholder="Full address"
                className="inputField inputwidth"
                name="fullAddress"
                value={userDetails.fullAddress}
                onChange={changeHanlder}
                required
              />
            </div>
            <div className="pd-top">
              <input
                type="text"
                placeholder="Suggestion"
                className="inputField suggestion"
                name="suggestions"
                value={userDetails.suggestions}
                onChange={changeHanlder}
              />
            </div>
          </div>
          <div className="text-center pd-top">
            {loading ? (
              <Loader />
            ) : (
              <button type="submit" className="btn-style">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
      {successSnack ? (
        <Snackbar
          open={successSnack}
          autoHideDuration={6000}
          onClose={() => setSuccesSnack(false)}
        >
          <Alert
            onClose={() => setSuccesSnack(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {succesMessage}
          </Alert>
        </Snackbar>
      ) : (
        <Snackbar
          open={errorSnack}
          autoHideDuration={6000}
          onClose={() => setErrorSnack(false)}
        >
          <Alert
            onClose={() => setErrorSnack(false)}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {succesMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
export default HomeService;

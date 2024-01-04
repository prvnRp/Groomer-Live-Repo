import React, { useState, useEffect, useContext, useRef } from "react";
import "../App.css";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Ac from "../images/air-conditioner.svg";
import wifi from "../images/wi-fi.svg";
import parking from "../images/parking.svg";
import noparking from "../images/noparking.svg";
import noac from "../images/nooac.png";
import nowifi from "../images/nowifi.svg";
import language from "../images/language.svg";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WestIcon from "@mui/icons-material/West";
import CardPayment from "../images/card-payment.svg";
import laptopCredit from "../images/laptop-and-credit-card.svg";
import PaymentProcessed from "../images/payment-processed.svg";
import search from "../images/search.svg";
import { useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaceMarker from "../images/place-marker.svg";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "./DatePicker";
import hourglass from "../images/hourglass-with-glasmorphism-effect.svg";
import TimePicker from "./TimePicker";
import { getReviewsApi, getSignleSalon } from "../Apis/Salons_service";
import Loader, { ButtonLoader } from "../Components2/Loader";
import {
  makeAppointAPI,
  makeGuetAppointAPI,
  resheduleAppointAPI,
  showTimingsAPI,
} from "../Apis/Booking_service";
import moment from "moment";
import { getToken, removeToken } from "../context/StorageToken";
import Header from "./Header";
import { Store2 } from "../App";
import { addWishlistApi } from "../Apis/Wishlist_service";
import { addPayment } from "../context/PaymentStorage";
import MetaData from "../context/MetaData";
import { Alert, Snackbar } from "@mui/material";

const Today = moment().format("DD/MM/YYYY");
const token = getToken();

function SalonPage() {
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef(null);
  // ? ------------------------------------------------------------
  // ? ---------- Related To React-Router-Dom ---------------------
  // ? ------------------------------------------------------------

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const Reschedule = location.state?.Reschedule;
  const BookingID = location.state?.BookingID;

  // ? ------------------------------------------------------------
  // ? ---------- Use Context -------------------------------------
  // ? ------------------------------------------------------------
  const { bookingDetails, singleSalon, setsingleSalon, user } =
    useContext(Store2);

  // ? ------------------------------------------------------------
  // ? ---------- All the usestates -------------------------------
  // ? ------------------------------------------------------------
  const [loading, setloading] = useState(true);
  const [wishlistloading, setwishlistloading] = useState(false);
  const [salonData, setsalonData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedNavOption, setSelectedNavOption] = useState("info");
  const [reviewsToShow, setReviewsToShow] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredCombos, setFilteredCombos] = useState([]);
  const [opensearch, setOpensearch] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [SalonBlockMessage, setSalonBlockMessage] = useState(null);
  const [userdetails, setUserDetails] = useState({
    name: "Example",
    email: "example@gmail.com",
    phone: "123-456-7890",
  });
  const [slotDetails, setslotDetails] = useState({
    date: null,
    time: null,
    slot_uuid: null,
    full_date: null,
  });
  const [Activityloader, setActivityloader] = useState({
    timeLoader: false,
    showTime: false,
    payLoader: false,
  });
  const [allSlotTimings, setallSlotTimings] = useState([]);
  const [errorsnack, seterrorsnack] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const [isGuest, setisGuest] = useState(false);
  // ? ------------------------------------------------------------
  //  ?  ----------- useEffect for Reschedule---------------------
  // ? -----------------------------------------------------------
  useEffect(() => {
    // If Reschedule is true, find the selected booking data based on BookingID
    if (Reschedule && salonData && bookingDetails) {
      const booking = {
        BookingID: bookingDetails.Appt_id,
        Services: bookingDetails.Services,
        Pricing: bookingDetails.Pricing,
        Combos: bookingDetails.Combo,
      };

      setUserDetails({
        ...userdetails,
        ["name"]: bookingDetails.User_Name,
        ["email"]: bookingDetails.User_Email,
        ["phone"]: bookingDetails.User_Phone,
      });

      if (booking) {
        const serviceNames = booking.Services?.split(",").map((serviceName) =>
          serviceName.trim()
        );

        const ListSalon = salonData.services.filter((service) =>
          serviceNames.includes(service.ServiceName)
        );

        const initialCartItems = [
          ...ListSalon.map((service) => ({
            ...service,
            added: true,
            type: "service",
            DiscountedPrice: service.DiscountedPrice, // Set the price for each item in cart
          })),
        ];

        let comboInitialCart = booking.Combos.map((item) => ({
          ComboName: item.combo_name,
          ComboPrice: Number(item.combo_price),
          ComboServices: item.combo_services_name,
          Duration: Number(item.combo_duration),
          type: "combo",
        }));

        setCartItems([...initialCartItems, ...comboInitialCart]);
      } else {
        // Handle the case where the booking with the specified BookingID is not found
        console.error(`Booking with BookingID ${BookingID} not found.`);
      }
    }
    if (Reschedule && !bookingDetails) {
      navigate("/bookings");
    }
  }, [BookingID, Reschedule, salonData]);

  // ? ------------------------------------------------------------
  //  ? -------------- usestates ----------------------------------
  // ? ------------------------------------------------------------

  const [isPopupOpen, setIsPopupOpen] = useState(Reschedule);
  const [checkoutStage, setCheckoutStage] = useState(
    Reschedule ? "userDetails" : "services"
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpensearch(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // ? ------------------------------------------------------------
  //  ? -------------- functions ----------------------------------
  // ? ------------------------------------------------------------

  //  TODO : adding wishlist handler Api related function
  const addWishlistHandler = async () => {
    setwishlistloading(true);
    const response = await addWishlistApi(id);
    if (response.code === 201) {
      setIsFavourite(true);
      setWishlistMessage("Added to  wishlist");
      setsingleSalon({ ...singleSalon, ["Wishlist"]: true });
      setwishlistloading(false);
    }
  };

  // TODO : remove from wishlist related to Api function
  const removeWishlistHandler = () => {
    // setwishlistloading(true);
    // setIsFavourite(false);
    // setWishlistMessage("Removed from wishlist");
  };

  // ? ------------------------------------------------------------
  //  ? -------------- useEffect ----------------------------------
  // ? ------------------------------------------------------------

  // TODO : wishlist message will disappear

  useEffect(() => {
    const timer = setTimeout(() => {
      setWishlistMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [wishlistMessage]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    const filteredServices = salonData.services.filter((service) =>
      service.ServiceName.toLowerCase().includes(value.toLowerCase())
    );

    const filteredCombos = salonData.Combos.filter(
      (combo) =>
        combo.ComboName.toLowerCase().includes(value.toLowerCase()) ||
        combo.ComboServices.some((serviceName) =>
          serviceName.toLowerCase().includes(value.toLowerCase())
        )
    );

    setFilteredServices(filteredServices);
    setFilteredCombos(filteredCombos);
  };

  const handleToggleCombo = (combo) => {
    if (isComboAdded(combo.ComboName)) {
      handleRemoveFromCart(combo);
    } else {
      handleAddToCart(combo);
    }
  };

  const isServiceAdded = (serviceName) => {
    return cartItems.some(
      (cartItem) =>
        cartItem.type === "service" &&
        cartItem.ServiceName === serviceName &&
        cartItem.added
    );
  };

  const isComboAdded = (comboName) => {
    return cartItems.some(
      (cartItem) =>
        cartItem.type === "combo" &&
        cartItem.ComboName === comboName &&
        cartItem.added
    );
  };

  const handleAddToCart = (item) => {
    if (selectedNavOption === "info") {
      setCartItems((prevCartItems) => [
        ...prevCartItems,
        { ...item, added: true, type: "service" },
      ]);
    } else if (selectedNavOption === "combo") {
      setCartItems((prevCartItems) => [
        ...prevCartItems,
        { ...item, added: true, type: "combo" },
      ]);
    }
  };

  const handleRemoveFromCart = (item) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((cartItem) =>
        selectedNavOption === "info"
          ? !(
              cartItem.type === "service" &&
              cartItem.ServiceName === item.ServiceName
            )
          : !(
              cartItem.type === "combo" && cartItem.ComboName === item.ComboName
            )
      )
    );
  };

  const calculateTotalAmount = () => {
    let totalAmount = cartItems.reduce((total, item) => {
      if (item.type === "service") {
        return total + item.DiscountedPrice;
      } else if (item.type === "combo") {
        return total + item.ComboPrice;
      }
      return total;
    }, 0);
    return totalAmount;
  };
  const countServicesInCart = () => {
    return cartItems.filter((item) => item.type === "service").length;
  };

  // Function to count the number of combos in the cart
  const countCombosInCart = () => {
    return cartItems.filter((item) => item.type === "combo").length;
  };

  const displayCartItems = () => {
    const numServices = countServicesInCart();
    const numCombos = countCombosInCart();
    var text = "";
    if (numServices > 0 || numCombos > 0) {
      text = "For ";
    }
    if (numServices > 0) {
      text += `${numServices} service${numServices > 1 ? "s" : ""}`;
    }

    if (numCombos > 0) {
      if (numServices > 0) {
        text += ` and\n `;
      }

      text += `${numCombos} combo${numCombos > 1 ? "s" : ""}`;
    }
    return text;
  };

  // ? ------------------------------------------------------------
  //  ? -------------- functions ----------------------------------
  // ? ------------------------------------------------------------

  const writeReviewHandler = () => {
    navigate(`/review/${id}`);
  };

  // TODO : book now button function
  const handleOpenPopup = () => {
    if (!token) {
      navigate(`/login?redirect=salon&${id}`);
      return;
    }
    setIsPopupOpen(true);
  };

  //  TODO : closing the  popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleShowMoreReviews = () => {
    setReviewsToShow((prevReviews) =>
      setReviewsToShow(salonData.reviewData.length)
    );
  };

  // TODO : check out function and will go to userdetails page
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      seterrormessage("select the services please...");
      seterrorsnack(true);
      return;
    }
    if (slotDetails.time) {
      setslotDetails({ ...slotDetails, ["time"]: null });
    }
    setCheckoutStage("userDetails");
  };

  // TODO : paynow function for booking a appointment
  const handlePayNow = async () => {
    let response;

    const selectedServies = {
      services: [],
      combos: [],
    };
    cartItems.forEach((item) => {
      if (item.hasOwnProperty("ServiceName")) {
        selectedServies.services.push(item.ServiceName);
      } else if (item.hasOwnProperty("ComboName")) {
        selectedServies.combos.push(item.ComboName);
      }
    });

    const total_duration = cartItems.reduce(
      (acc, obj) => acc + obj.Duration,
      0
    );

    if (isGuest) {
      let t = Object.values(userdetails);
      if (t.some((item) => item === "")) {
        seterrormessage("fields should not be empty");
        seterrorsnack(true);
        return;
      } else {
        setActivityloader({ ...Activityloader, payLoader: true });
        response = await makeGuetAppointAPI(
          id,
          userdetails,
          slotDetails,
          total_duration,
          selectedServies
        );
      }
    } else {
      setActivityloader({ ...Activityloader, payLoader: true });
      response = await makeAppointAPI(
        id,
        slotDetails,
        total_duration,
        selectedServies
      );
    }

    if (response.code === 201) {
      setCheckoutStage("processing");
      addPayment({
        count: 1,
        initiated: true,
        Reschedule: false,
      });
      let url = response.data.order.data.instrumentResponse.redirectInfo.url;
      setTimeout(() => {
        window.open(url, "_blank");
      }, 2000);
    }
    // ! error for not founding a token
    else if (response.code === 400) {
      seterrormessage("Please login first...");
      seterrorsnack(true);
      setActivityloader({ ...Activityloader, payLoader: false });
      setslotDetails({ ...slotDetails, date: null });
    } else if (response.code === 401) {
      removeToken();
      seterrormessage("Please login first...");
      seterrorsnack(true);
      setIsPopupOpen(false);
    } else if (response.code === 500) {
      seterrormessage(response.message + " please try after some time");
      seterrorsnack(true);
      setActivityloader({ ...Activityloader, payLoader: false });
      setslotDetails({ ...slotDetails, date: null });
    }
  };

  // TODO : reschedule  paynow api
  const reschulePaynow = async () => {
    // alert(BookingID);
    // return;
    if (!BookingID) {
      navigate("/bookings");
      return;
    }
    let response = await resheduleAppointAPI(BookingID, slotDetails);
    if (response.code === 201) {
      setCheckoutStage("processing");
      addPayment({
        count: 1,
        initiated: true,
        Reschedule: true,
      });
      let url = response.data.order.data.instrumentResponse.redirectInfo.url;
      setTimeout(() => {
        window.open(url, "_blank");
      }, 2000);
    } else {
      seterrormessage(response.message);
      seterrorsnack(true);
    }
  };

  // TODO : update the states function
  const updateStates = (update) => {
    setsalonData(update);
    setsingleSalon(update);
    setSelectedImage(update.imageSrc[0]);
    setIsFavourite(update.Wishlist);
    setFilteredServices([...update.services]);
    setFilteredCombos([...update.Combos]);
    if (update.salonOpen.length === 7) {
      update.salonOpen = "0" + update.salonOpen;
    }
    if (update.blockedDates.some((item) => item === Today)) {
      setSalonBlockMessage("Today salon is closed...");
    }
    setloading(false);
  };

  const changeUserHandler = (e) => {
    if (isGuest === false) {
      setisGuest(true);
    }
    setUserDetails({ ...userdetails, [e.target.name]: e.target.value });
  };

  // TODO : fetching the all reviews of a salon;
  const fetchSalonsReviews = async () => {
    const response = await getReviewsApi(id);
    if (response.code === 200) {
      let update = response.data.map((item) => ({
        id: item.feedback_uuid,
        user: item?.user_full_name || "Groomer",
        rating: parseInt(item.feedback_rating),
        review: item.feedback_message,
      }));
      return update;
    }
  };

  // TODO : fetching the salons details
  const fetchSalonDetails = async (uuid, userID) => {
    let update = null;
    const response = await getSignleSalon(uuid, userID);
    if (response.code === 200) {
      update = {
        id: response.data.salon.salon_uuid,
        content: response.data.salon.salon_name,
        imageSrc: response.data.salon.salon_photos,
        Location: response.data.salon.salon_location.coordinates,
        address: response.data.salon.salon_address,
        salonOpen: response.data.salon.salon_opening_time,
        services: response.data.salon.salon_services.map((item) => ({
          ServiceName: item.service_name,
          DiscountedPrice: parseInt(item.service_discount),
          OriginalPrice: parseInt(item.service_original_price),
          Duration: parseInt(item.service_duration),
        })),
        Combos: response.data.salon.salon_combo_services.map((item) => ({
          ComboName: item.combo_name,
          ComboPrice: parseInt(item.combo_price),
          ComboServices: item.combo_services_name,
          Duration: parseInt(item.combo_duration),
        })),
        blockedDates: response.data.salon.salon_block_dates,
        // blockedDates: [],
        Features: response.data.salon.salon_features,
        Languages: Object.values(response.data.salon.salon_languages),
        Wishlist: response.data.isWishlisted,
        isAbleToRate: response.data.ableToRating,
      };

      update.reviewData = await fetchSalonsReviews();
      update.NoR = update.reviewData.length;
      let tempRating = update.reviewData.reduce(
        (acc, currVal) => acc + currVal.rating,
        0
      );
      update.ratings = tempRating.toFixed(1);
      updateStates(update);
    }
    // ! if error not found
    else if (response.code === 404) {
      navigate(`/not/${uuid}`);
    }
    // ! if server error occured
    else if (response.code === 500) {
      navigate("/");
    }
  };

  //  TODO : fetching  the slot timings related Api
  const fetchSlotTimings = async (date) => {
    setActivityloader({ ...Activityloader, ["timeLoader"]: true });

    const total_duration = cartItems.reduce(
      (acc, obj) => acc + obj.Duration,
      0
    );

    const response = await showTimingsAPI(id, total_duration, date);
    if (response.code === 200) {
      setActivityloader({ ...Activityloader, timeLoader: false });
      if (response.data.length === 0) {
        setslotDetails({ ...slotDetails, date: null });
        return;
      }
      setallSlotTimings(response.data);
    }
    // ! error for not founding a token
    else if (response.code === 401) {
      removeToken();
      seterrormessage("Please login first...");
      seterrorsnack(true);
      setIsPopupOpen(false);
    }
    // ! error occured if
    else if (response.code === 500) {
      // setIsPopupOpen(false);
      setslotDetails({ ...slotDetails, date: null });
      setActivityloader({ ...Activityloader, timeLoader: false });
      alert(response.message);
    }
  };

  const NavigateToMaps = (coordinates) => {
    const [latitude, longitude] = coordinates;
    let url = `https://maps.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
    return;
  };

  // ? ------------------------------------------------------------
  //  ? -------------- useEffect's --------------------------------
  // ? -----------------------------------------------------------

  // TODO : useeffect when ever id will change
  useEffect(() => {
    if (id !== singleSalon?.id && !getToken()) {
      fetchSalonDetails(id);
    }
    if (singleSalon?.id === id && getToken()) {
      updateStates(singleSalon);
    }

    if (user) {
      fetchSalonDetails(id, user.user_uuid);
    }
  }, [id, singleSalon?.id, user]);

  //  TODO : if there is date then only slot timings api will call
  useEffect(() => {
    if (slotDetails.date) {
      fetchSlotTimings(slotDetails.full_date);
    }
  }, [slotDetails.full_date, slotDetails.date]);

  useEffect(() => {
    if (user) {
      let update = {
        name: user.user_full_name,
        email: user.user_email,
        phone: user.user_mobile,
      };
      setUserDetails(update);
    }
  }, [user]);

  return (
    <>
      <Header />
      {loading && !salonData ? (
        <Loader x="loader-full" />
      ) : (
        // ?------------------------------------------------------------
        // ----------------- Salon Page--------------------------------
        // ?------------------------------------------------------------
        <div className="salon-page">
          <MetaData title={salonData.content} />
          <div className="MobileView">
            <div className="salon-big-image">
              <img src={selectedImage} alt="Big Salon" />
            </div>
          </div>
          <div className="small-images">
            {salonData.imageSrc &&
              salonData.imageSrc.map((image, index) => (
                <div
                  key={index}
                  onMouseOver={() => setSelectedImage(image)}
                  className="small-image-wrapper"
                >
                  <img
                    src={image}
                    alt={`SmallImage-${index}`}
                    className="small-image"
                  />
                </div>
              ))}
          </div>
          <div className="big-image-and-details">
            <div className="desktopView">
              <div className="salon-big-image">
                <img src={selectedImage} alt="Big Salon" />
              </div>
            </div>
            <div className="salon-details">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                className="salon-name-wrapper"
              >
                <div style={{ fontSize: "25px" }} className="salon-name">
                  <b>{salonData.content}</b>
                </div>
                <div>
                  <span className="MobileView">
                    {isFavourite ? (
                      <FavoriteIcon
                        onClick={removeWishlistHandler}
                        style={{
                          fontSize: "35px",
                          // position: "relative",
                          // top: "5px",
                          cursor: "pointer",
                          // right: "-208px",
                          color: "#FF0000",
                        }}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        onClick={addWishlistHandler}
                        style={{
                          fontSize: "35px",
                          // position: "relative",
                          // top: "5px",
                          cursor: "pointer",
                          // right: "-208px",
                        }}
                      />
                    )}
                  </span>
                </div>
              </div>
              <div
                className="salon-address"
                onClick={() => NavigateToMaps(salonData.Location)}
              >
                <div>
                  <img
                    alt="place"
                    src={`${PlaceMarker}`}
                    style={{
                      transform: "scale(0.7)",
                      position: "relative",
                      top: "-14px",
                      left: "-7px",
                    }}
                  />
                </div>
                <div>
                  <div className="address1">{salonData?.address}</div>
                </div>
              </div>
              <div
                style={{ margin: "0 15vw", marginTop: "20px" }}
                className="MobileView"
              >
                <button className="book-button" onClick={handleOpenPopup}>
                  Book slot
                </button>
              </div>
              {/* </div> */}
              <div className="info-nav">
                Info Guide
                <hr
                  style={{ margin: "0 85% 0 2%", border: "2px solid #FF6548" }}
                />
              </div>
              <div>
                <div className="info-guide">
                  {salonData.Features.feature_AC ? (
                    <div className="info-item">
                      <img src={Ac} alt="AC" />
                      AC <br />
                      available
                    </div>
                  ) : (
                    <div className="info-item not-available">
                      <img src={noac} alt="Not Available" width="45px" />
                      No <br />
                      AC
                    </div>
                  )}
                  {salonData.Features.feature_wifi ? (
                    <div className="info-item">
                      <img src={wifi} alt="wifi" />
                      Free <br />
                      Wi-Fi
                    </div>
                  ) : (
                    <div className="info-item not-available">
                      <img src={nowifi} alt="Not Available" width="45px" />
                      No <br />
                      wifi
                    </div>
                  )}
                  {salonData.Features.feature_parking ? (
                    <div className="info-item">
                      <img src={parking} alt="parking" />
                      Bike and <br /> car parking
                    </div>
                  ) : (
                    <div className="info-item not-available">
                      <img src={noparking} alt="Not Available" width="45px" />
                      No <br />
                      Car Parking
                    </div>
                  )}
                  <div className="info-item custom-tooltip">
                    <img src={language} alt="language" />
                    <span className="tooltip-text">
                      Languages spoken in the salon
                    </span>
                    {salonData.Languages[0] && "Hindi, "}
                    {salonData.Languages[1] && "English, "}
                    <br />
                    {salonData.Languages[2] && "Telugu"}
                  </div>
                </div>
              </div>
              {/* )} */}

              {salonData.reviewData && (
                <div className="ratings-review">
                  <div
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      marginBottom: "30px",
                    }}
                  >
                    Ratings and Reviews
                    <hr
                      style={{
                        margin: "0 50% 0 2%",
                        border: "2px solid #FF6548",
                      }}
                    />
                  </div>
                  <div className="ratings desktopView">
                    <div className="star-rating">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "left",
                          alignItems: "center",
                        }}
                      >
                        <div className="SalonRatings">{salonData.ratings}</div>
                        <Rating
                          size="large"
                          value={salonData.ratings}
                          precision={0.25}
                          readOnly
                          emptyIcon={
                            <StarBorderIcon
                              style={{ color: "white", fontSize: "30px" }}
                            />
                          }
                        />
                        <div
                          style={{
                            fontSize: "12px",
                            position: "relative",
                            top: "50px",
                            left: "-250px",
                          }}
                        >
                          of {salonData.reviewData.length} reviews
                        </div>
                      </div>

                      {token && (
                        <div className="tooltip-container">
                          <button
                            className="writeReviewBtn"
                            onClick={writeReviewHandler}
                            disabled={salonData.isAbleToRate ? false : true}
                            style={
                              salonData.isAbleToRate
                                ? { cursor: "pointer" }
                                : { cursor: "no-drop" }
                            }
                          >
                            {" "}
                            Write a review{" "}
                          </button>
                          {!salonData.isAbleToRate && (
                            <div className="tooltip">
                              Utilize service to write a review
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                      marginTop: "-27px",
                    }}
                    className="ratings MobileView"
                  >
                    <div className="star-rating MobileView">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Rating
                          size="large"
                          value={salonData.ratings}
                          precision={0.25}
                          readOnly
                          emptyIcon={
                            <StarBorderIcon
                              style={{ color: "white", fontSize: "30px" }}
                            />
                          }
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          position: "relative",
                          top: "3px",
                          left: "6px",
                        }}
                      >
                        of {salonData.reviewData.length} reviews
                      </div>
                    </div>
                    <div className="SalonRatings MobileView">
                      {salonData.ratings}
                    </div>
                  </div>
                  {token && (
                    <div className="tooltip-container">
                      <button
                        className="writeReviewBtn MobileView"
                        onClick={writeReviewHandler}
                        disabled={salonData.isAbleToRate ? false : true}
                      >
                        {" "}
                        Write a review{" "}
                      </button>
                      {!salonData.isAbleToRate && (
                        <div className="tooltip">
                          Utilize service to write a review
                        </div>
                      )}
                    </div>
                  )}

                  <div className="reviews">
                    <div className="ratings-reviews">
                      {salonData?.reviewData
                        .slice(0, reviewsToShow)
                        .map((review) => (
                          <div key={review.id} className="review-card">
                            <div className="rating-container">
                              <div className="imageInratings">
                                <span className="imageee">
                                  {review.user?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="user-rating">
                                <div className="star-rating">
                                  <Rating
                                    size="small"
                                    value={review.rating}
                                    precision={0.25}
                                    readOnly
                                    emptyIcon={
                                      <StarBorderIcon
                                        style={{
                                          color: "white",
                                          fontSize: "18px",
                                        }}
                                      />
                                    }
                                  />
                                </div>
                                <div>{review.review}</div>
                                <div>
                                  <b>{review.user}</b>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      {salonData.reviewData.length > reviewsToShow && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                          }}
                        >
                          <button
                            className="showmore"
                            onClick={handleShowMoreReviews}
                          >
                            Show All Reviews
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="salon-wrapper1 desktopView">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  {token &&
                    (wishlistloading ? (
                      <span style={{ marginRight: "12px" }}>
                        <ButtonLoader />
                      </span>
                    ) : (
                      <span>
                        {isFavourite ? (
                          <FavoriteIcon
                            onClick={removeWishlistHandler}
                            disabled={wishlistloading}
                            style={{
                              fontSize: "35px",
                              cursor: "pointer",
                              marginRight: "2vw",
                              color: "#FF0000",
                            }}
                          />
                        ) : (
                          <FavoriteBorderIcon
                            onClick={addWishlistHandler}
                            style={{
                              fontSize: "35px",
                              cursor: "pointer",
                              marginRight: "2vw",
                            }}
                          />
                        )}
                      </span>
                    ))}

                  <button className="book-button" onClick={handleOpenPopup}>
                    Book slot
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* // ?------------------------------------------------------------ */}
      {/* -------------- Pop up -------------------------------------- */}
      {/* // ?------------------------------------------------------------ */}
      {salonData && isPopupOpen && (
        <div className="popup popup-open" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {checkoutStage === "services" && !Reschedule && (
              <div className="popupContent">
                <div>
                  <div
                    className="popup-header"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      margin: "0 40px",
                    }}
                  ></div>
                  <div
                    ref={searchRef}
                    className="pcontent"
                    style={{ position: "absolute", right: "1vw", top: "4vh" }}
                  >
                    <img
                      style={{
                        position: "absolute",
                        right: "21px",
                        top: "-15px",
                      }}
                      onClick={() => setOpensearch(!opensearch)}
                      src={search}
                      alt="search"
                    />
                    <input
                      style={{
                        display: opensearch ? "block" : "none",
                        position: "absolute",
                        right: "52px",
                        width: "151px",
                        top: "-18px",
                        fontSize: "12px",
                      }}
                      disabled={!opensearch}
                      type="text"
                      onChange={handleSearchChange}
                      placeholder="Search for service"
                    />
                  </div>
                </div>

                <div className="nav-options">
                  <button
                    className={
                      selectedNavOption === "info" ? "selected-nav" : "nav"
                    }
                    onClick={() => setSelectedNavOption("info")}
                  >
                    Services
                  </button>
                  <button
                    className={
                      selectedNavOption === "combo" ? "selected-nav" : "nav"
                    }
                    onClick={() => setSelectedNavOption("combo")}
                  >
                    Combo
                  </button>
                </div>
                {selectedNavOption === "info" && (
                  <div
                    className="info-services"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    {filteredServices.map((service) => (
                      <div
                        key={service.ServiceName}
                        onClick={() =>
                          isServiceAdded(service.ServiceName)
                            ? handleRemoveFromCart(service)
                            : handleAddToCart(service)
                        }
                        style={{
                          background: isServiceAdded(service.ServiceName)
                            ? "#FF6548"
                            : "rgba(109, 109, 109, 0.50)",
                          cursor: "pointer",
                          borderRadius: "25px",
                          padding: "5px 10px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ marginLeft: "20px", fontSize: "16px" }}>
                          {service.ServiceName}
                        </div>
                        <div>
                          <b style={{ marginRight: "30px", fontSize: "16px" }}>
                            {/* <strong
                              style={{
                                position: "relative",
                                top: "-2px",
                                right: " 12px",
                              }}
                            >
                              :
                            </strong> */}
                            ₹{service.DiscountedPrice}
                          </b>
                        </div>
                        {/* <div>
                          <b> ₹{service.DiscountedPrice}</b>
                        </div> */}
                      </div>
                    ))}
                  </div>
                )}
                {selectedNavOption === "combo" && (
                  <div
                    className="info-services"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    {filteredCombos.map((combo) => (
                      <div
                        key={combo.ComboName}
                        style={{
                          background: isComboAdded(combo.ComboName)
                            ? "#FF6548"
                            : "rgba(109, 109, 109, 0.50)",
                          cursor: "pointer",
                          borderRadius: "25px",
                          padding: "5px 10px",
                        }}
                      >
                        <div
                          onClick={() => handleToggleCombo(combo)}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ marginLeft: "20px", fontSize: "20px" }}>
                            {combo.ComboName}
                          </div>
                          <div>
                            <b
                              style={{ marginRight: "30px", fontSize: "25px" }}
                            >
                              {/* <strong
                                style={{
                                  position: "relative",
                                  top: "-2px",
                                  right: " 12px",
                                }}
                              >
                                :
                              </strong> */}
                              ₹{combo.ComboPrice}
                            </b>
                          </div>
                        </div>
                        <div>
                          <div
                            colSpan="2"
                            style={{ fontSize: "14px", marginLeft: "20px" }}
                          >
                            <u>{combo.ComboServices.join(", ")}</u>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <hr style={{ width: "60%" }} />
                <div
                  className="info-services"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <b>Total amount :</b>
                  {/* <b>{calculateTotalAmount()}</b> */}
                  <span
                    id="displayCart"
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    {displayCartItems()}
                  </span>
                </div>
                <b className="totalAmount">{calculateTotalAmount()}</b>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <button className="checkout-button" onClick={handleCheckout}>
                    Let's Select Date & Time
                  </button>
                  {/*  */}
                </div>
                <span className="close-button" onClick={handleClosePopup}>
                  <WestIcon fontSize="medium" />
                  <span style={{ marginLeft: "4px" }}>Back</span>
                </span>
              </div>
            )}

            {/* //Todo ----USER-DETAILS BLOCK------- */}
            {checkoutStage === "userDetails" && (
              <div className="popupContent">
                <div className="user-details">
                  <h3>
                    <u>Slot Details:</u>
                  </h3>
                  <table
                    id="slotDetails"
                    style={{
                      width: Reschedule ? "90%" : "60%",
                      marginLeft: "40px",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td>Date:</td>
                        <td>
                          <DatePicker
                            color={"#232323"}
                            slotDetails={slotDetails}
                            setslotDetails={setslotDetails}
                            blockeddates={salonData.blockedDates}
                          />
                        </td>
                      </tr>

                      <tr>
                        {Activityloader.timeLoader ? (
                          <td colSpan={2}>
                            <Loader />
                          </td>
                        ) : (
                          <>
                            <td>Time:</td>
                            <td>
                              {slotDetails.date === null ? (
                                "not available"
                              ) : (
                                <TimePicker
                                  slotDetails={slotDetails}
                                  setslotDetails={setslotDetails}
                                  completeTimeOptions={allSlotTimings}
                                />
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                  <h3>
                    <u>User Details</u>
                  </h3>
                  <table
                    id="slotDetails"
                    style={{ width: "90%", marginLeft: "40px" }}
                  >
                    <tbody className="detailsuser">
                      <tr>
                        <td>Name:</td>
                        <td>
                          <input
                            value={userdetails.name}
                            name="name"
                            onChange={changeUserHandler}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Email:</td>
                        <td>
                          <input
                            value={userdetails.email}
                            name="email"
                            onChange={changeUserHandler}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mobile:</td>
                        <td>
                          <input
                            value={userdetails.phone}
                            name="phone"
                            onChange={changeUserHandler}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <hr
                    style={{
                      margin: "0 15%",
                      marginBottom: "20px",
                      color: "#FFF",
                    }}
                  />
                  <h3>
                    <u>Selected Services</u>
                  </h3>
                  <div className="serviceScroll">
                    <table id="servicesSelected" style={{ marginLeft: "40px" }}>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.ServiceName || item.ComboName}>
                            <td>{item.ServiceName || item.ComboName}</td>
                            <td>{item.DiscountedPrice || item.ComboPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="finalPrice">
                    <p style={{ textAlign: "right", paddingRight: "107px" }}>
                      <b>
                        Total&nbsp;amount&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </b>
                      {calculateTotalAmount()}
                    </p>
                    {Reschedule && (
                      <p style={{ textAlign: "right", paddingRight: "107px" }}>
                        <b>
                          Reschedule&nbsp;amount&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </b>
                        {calculateTotalAmount() * 0.1}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  {slotDetails.time && (
                    <>
                      {Activityloader.payLoader ? (
                        <Loader />
                      ) : (
                        <button
                          className="checkout-button"
                          onClick={Reschedule ? reschulePaynow : handlePayNow}
                        >
                          Pay Now
                        </button>
                      )}
                      <div style={{ fontSize: "12px" }}>
                        Please be at the salon 5 minutes before your selected
                        time.
                      </div>
                    </>
                  )}
                  {Reschedule && (
                    <div style={{ fontSize: "10px", marginTop: "5px" }}>
                      10% of Rescheduling charges are applicable
                    </div>
                  )}
                </div>
                <span
                  className="close-button"
                  onClick={() =>
                    Reschedule ? navigate(-1) : setCheckoutStage("services")
                  }
                >
                  <WestIcon fontSize="medium" />
                  <span style={{ marginLeft: "4px" }}>
                    {Reschedule ? "Close" : "Back"}
                  </span>
                </span>
              </div>
            )}

            {/* //Todo ----PROCCESSING BLOCK------- */}
            {checkoutStage === "processing" && (
              <div className="popupContent" style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "40px" }}>
                  <span className="payment">Payment is Processing...</span>
                </div>
                <div>
                  <img
                    src={CardPayment}
                    style={{ width: "90%" }}
                    alt="cardpayment"
                  />
                </div>
              </div>
            )}

            {/* //Todo ----COMPLETED BLOCK------- */}
            {checkoutStage === "completed" && (
              <div className="popupContent" style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "40px" }}>
                  <span className="payment">Payment is Completed.</span>
                </div>
                <div>
                  <img
                    src={laptopCredit}
                    style={{ width: "100%" }}
                    alt="laptopcredit"
                  />
                </div>
              </div>
            )}

            {/* //Todo ----BOOKING CONFIRMED BLOCK------- */}
            {!Reschedule && checkoutStage === "bookingConfirmed" && (
              <div className="popupContent" style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "40px" }}>
                  <span className="payment">Booking Confirmed.</span>
                </div>
                <div>
                  <img src={PaymentProcessed} alt="payment processed" />
                </div>
              </div>
            )}

            {/* //Todo ----RESCHEDULED CONFIRMED BLOCK------- */}

            {Reschedule && checkoutStage === "bookingConfirmed" && (
              <div className="popupContent" style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "40px" }}>
                  <span className="payment">Reschedule has been done</span>
                </div>
                <div>
                  <img src={hourglass} alt="hourglass" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* // ? ------------------------------------------------------------ */}
      {/* -------------- wishlist message -------------------------  */}
      {/* // ?------------------------------------------------------------ */}
      {wishlistMessage && (
        <div className="popup-wishlist">
          <div className="popup-content-wishlist">
            <span className="wishlistmessage">{wishlistMessage}</span>
          </div>
        </div>
      )}
      {/* // ? ------------------------------------------------------------ */}
      {/* -------------- salon block message -------------------------- */}
      {/* // ? ------------------------------------------------------------ */}
      {SalonBlockMessage && (
        <div className="popup-wishlist">
          <div className="popup-content-wishlist">
            <span className="wishlistmessage">{SalonBlockMessage}</span>
          </div>
        </div>
      )}

      {errorsnack && (
        <Snackbar
          open={errorsnack}
          autoHideDuration={6000}
          onClose={() => seterrorsnack(false)}
        >
          <Alert
            onClose={() => seterrorsnack(false)}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {errormessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

export default SalonPage;

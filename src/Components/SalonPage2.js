import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Ac from "../images/air-conditioner.svg";
import wifi from "../images/wi-fi.svg";
import parking from "../images/parking.svg";
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
import { BookingDetails } from "./Data";
import DatePicker from "./DatePicker";
import hourglass from "../images/hourglass-with-glasmorphism-effect.svg";
import TimePicker from "./TimePicker";
import { getSignleSalon } from "../Apis/Salons_service";
import Loader, { ButtonLoader, DotLoader } from "../Components2/Loader";
import { makeAppointAPI, showTimingsAPI } from "../Apis/Booking_service";
import moment from "moment";
import { getToken } from "../context/StorageToken";
import Header from "./Header";
import { Store2 } from "../App";
import { addWishlistApi } from "../Apis/Wishlist_service";

const Today = moment().format("DD/MM/YYYY");
const token = getToken();

function SalonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const Reschedule = location.state?.Reschedule;
  const BookingID = location.state?.BookingID;
  const { bookingDetails, singleSalon, setsingleSalon } = useContext(Store2);
  const { id } = useParams();

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
    name: "John Doe",
    email: "john@example.com",
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
  });
  const [allSlotTimings, setallSlotTimings] = useState([]);

  useEffect(() => {
    // If Reschedule is true, find the selected booking data based on BookingID
    if (Reschedule && salonData && bookingDetails) {
      const booking = {
        BookingID: bookingDetails.Appt_id,
        Services: bookingDetails.Services,
        Pricing: bookingDetails.Pricing,
      };
      // const booking = BookingDetails.find(
      //   (booking) => booking.BookingID === BookingID
      // );

      // console.log(bookingDetails);
      setUserDetails({
        ...userdetails,
        ["name"]: bookingDetails.User_Name,
        ["email"]: "@gmail.com",
        ["phone"]: bookingDetails.User_Phone,
      });

      // console.log(booking);

      if (booking) {
        const serviceNames = booking.Services?.split(",").map((serviceName) =>
          serviceName.trim()
        );
        console.log("serviceNames:", serviceNames);

        const ListSalon = salonData.services.filter((service) =>
          serviceNames.includes(service.ServiceName)
        );
        console.log(ListSalon);
        const initialCartItems = [
          ...ListSalon.map((service) => ({
            ...service,
            added: true,
            type: "service",
            DiscountedPrice: service.DiscountedPrice, // Set the price for each item in cart
          })),
        ];
        console.log("initialCartItems:", initialCartItems);
        setCartItems(initialCartItems);
      } else {
        // Handle the case where the booking with the specified BookingID is not found
        console.error(`Booking with BookingID ${BookingID} not found.`);
      }
    }
  }, [BookingID, Reschedule, salonData]);

  const [isPopupOpen, setIsPopupOpen] = useState(Reschedule);
  const [checkoutStage, setCheckoutStage] = useState(
    Reschedule ? "userDetails" : "services"
  );

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

  const removeWishlistHandler = () => {
    // setwishlistloading(true);
    // setIsFavourite(false);
    // setWishlistMessage("Removed from wishlist");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setWishlistMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [wishlistMessage]);

  const handleSearchChange = (event) => {
    const { value } = event.target;

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
        text += " and ";
      }
      text += `${numCombos} combo${numCombos > 1 ? "s" : ""}`;
    }
    return text;
  };

  // TODO : book now button function
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    if (!token) {
      navigate(`/register?redirect=/salon/${id}`);
      return;
    }
  };

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
      alert("add items");
      return;
    }
    setCheckoutStage("userDetails");
  };

  // const handlePayNow = () => {
  //   setCheckoutStage("processing");
  //   // Simulate the payment processing for 2 seconds
  //   setTimeout(() => {
  //     setCheckoutStage("completed");
  //     // Simulate booking confirmation for 1 second after payment completion
  //     setTimeout(() => {
  //       setCheckoutStage("bookingConfirmed");
  //     }, 1000);
  //     // setTimeout(() => {
  //     //   navigate(`/review/${salonData.id}`);
  //     // }, 2000);
  //   }, 2000);
  // };

  // TODO : paynow function for booking a appointment
  const handlePayNow = async () => {
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

    console.log(total_duration, selectedServies, slotDetails);

    // const response = await makeAppointAPI(
    //   id,
    //   slotDetails,
    //   total_duration,
    //   selectedServies
    // );
  };

  // TODO : update the states
  const updateStates = (update) => {
    setsalonData(update);
    setsingleSalon(update);
    setSelectedImage(update.imageSrc[0]);
    setIsFavourite(update.Wishlist);
    setFilteredServices([...filteredServices, ...update.services]);
    setFilteredCombos([...filteredCombos, ...update.Combos]);
    if (update.salonOpen.length === 7) {
      update.salonOpen = "0" + update.salonOpen;
    }
    setslotDetails({ ...slotDetails, ["time"]: update.salonOpen });
    if (update.blockedDates.some((item) => item === Today)) {
      setSalonBlockMessage("Today salon is closed...");
    }
    setloading(false);
  };

  // TODO : fetching the salons details
  const fetchSalonDetails = async (uuid) => {
    let update = null;
    const response = await getSignleSalon(uuid);
    if (response.code === 200) {
      update = {
        id: response.data.salon.salon_uuid,
        content: response.data.salon.salon_name,
        imageSrc: response.data.salon.salon_photos,
        Location: "Nijampet",
        address: response.data.salon.salon_address,
        ratings: 4.5,
        salonOpen: response.data.salon.salon_opening_time,
        NoR: 260,
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
        reviewData: [
          {
            id: 1,
            user: "John Doe",
            rating: 4,
            review: "Great service and friendly staff!",
          },
          {
            id: 2,
            user: "Jane Smith",
            rating: 5,
            review: "Amazing experience! Highly recommended!",
          },
          {
            id: 3,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 4,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 5,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 6,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 7,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 8,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
          {
            id: 9,
            user: "Alice Johnson",
            rating: 3,
            review: "Good, but could be better.",
          },
        ],
        blockedDates: response.data.salon.salon_block_dates,
        // blockedDates: ["28/10/2023", "29/10/2023"],
        Features: response.data.salon.salon_features,
        Languages: Object.values(response.data.salon.salon_languages),
        Wishlist: false,
      };

      updateStates(update);
    } else {
      alert("not found");
      navigate("/salons");
    }
  };

  const fetchSlotTimings = async (date) => {
    setActivityloader({ ...Activityloader, ["timeLoader"]: true });

    const total_duration = cartItems.reduce(
      (acc, obj) => acc + obj.Duration,
      0
    );

    const response = await showTimingsAPI(
      id,
      total_duration,
      // slotDetails.full_date
      date
    );
    if (response.code === 200) {
      setActivityloader({ ...Activityloader, ["timeLoader"]: false });
      if (response.data.length === 0) {
        alert("slot is full");
        return;
      }
      setallSlotTimings(response.data);
    }
  };

  // TODO : useeffect when ever id will change
  useEffect(() => {
    if (id !== singleSalon?.id) {
      fetchSalonDetails(id);
    } else {
      updateStates(singleSalon);
    }
  }, [id, singleSalon?.id]);

  useEffect(() => {
    if (slotDetails.date) {
      fetchSlotTimings(slotDetails.full_date);
    }
  }, [slotDetails.full_date, slotDetails.date]);

  return (
    <>
      <Header />

      {loading && !salonData ? (
        <Loader x="loader-full" />
      ) : (
        <div className="salon-page">
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
              <div className="salon-address">
                <div>
                  <img
                    alt="place"
                    src={PlaceMarker}
                    style={{
                      transform: "scale(0.7)",
                      position: "relative",
                      top: "-14px",
                      left: "-7px",
                    }}
                  />
                </div>
                <div>
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
                    <span className="MobileView">
                      {isFavourite ? (
                        <FavoriteIcon
                          onClick={removeWishlistHandler}
                          style={{
                            fontSize: "35px",
                            position: "relative",
                            top: "10px",
                            cursor: "pointer",
                            marginRight: "2vw",
                          }}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          onClick={addWishlistHandler}
                          style={{
                            fontSize: "35px",
                            position: "relative",
                            top: "10px",
                            cursor: "pointer",
                            marginRight: "2vw",
                          }}
                        />
                      )}
                    </span>
                  </div>
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
                  {salonData.Features.feature_AC && (
                    <div className="info-item">
                      <img src={Ac} alt="AC" />
                      Ac available
                    </div>
                  )}
                  {salonData.Features.feature_wifi && (
                    <div className="info-item">
                      <img src={wifi} alt="wifi" />
                      Free wi-fi
                    </div>
                  )}
                  {salonData.Features.feature_parking && (
                    <div className="info-item">
                      <img src={parking} alt="parking" />
                      Bike and car parking
                    </div>
                  )}
                  <div className="info-item custom-tooltip">
                    <img src={language} alt="language" />
                    <span className="tooltip-text">
                      Languages spoken in the salon
                    </span>
                    {salonData.Languages[0] && "Hindi, "}
                    {salonData.Languages[1] && "English, "}
                    {salonData.Languages[2] && "Telugu"}
                  </div>
                </div>
              </div>
              {/* )} */}

              {salonData.reviewData && (
                <div>
                  <div className="">
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
                    {/* <div className="ratings desktopView">
                      <div className="">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div className="SalonRatings">
                            {salonData.ratings}
                          </div>
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
                            top: "-5px",
                          }}
                        >
                          of {salonData.reviewData.length} reviews
                        </div>
                      </div>
                    </div> */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                      }}
                      className="ratings MobileView"
                    >
                      <div className="star-rating MobileView">
                        {/* <div
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
                        </div> */}
                        {/* <div
                          style={{
                            fontSize: "12px",
                            position: "relative",
                            top: "-5px",
                          }}
                        >
                          of {salonData.reviewData.length} reviews
                        </div> */}
                        {/* </div> */}
                        {/* <div className="SalonRatings MobileView">
                        {salonData.ratings}
                      </div> */}
                        {/*rating and reviews*/}
                        <div className="reviewSection">
                          {/* <div className="ratings desktopView"> */}
                          <div className="">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <div className="SalonRatings">
                                {salonData.ratings}
                              </div>
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
                                top: "-5px",
                                marginBottom: "20px",
                              }}
                            >
                              of {salonData.reviewData.length} reviews
                            </div>
                          </div>

                          {/* </div> */}
                          {/* <button className="writeReviewBtn"> Write a review </button> */}
                        </div>
                        {/*rating and reviews*/}
                      </div>
                    </div>
                  </div>

                  {/*rating and reviews*/}
                  <div className="reviewSection">
                    <div className="ratings desktopView">
                      <div className="">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div className="SalonRatings">
                            {salonData.ratings}
                          </div>
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
                            top: "-5px",
                            marginBottom: "20px",
                          }}
                        >
                          of {salonData.reviewData.length} reviews
                        </div>
                      </div>
                    </div>
                    <button className="writeReviewBtn"> Write a review </button>
                  </div>
                  {/*rating and reviews*/}

                  <div className="reviews">
                    <div className="s">
                      {salonData.reviewData
                        .slice(0, reviewsToShow)
                        .map((review) => (
                          <div key={review.id} className="review-card">
                            <div className="rating-container">
                              <div className="imageInratings">
                                <span className="imageee">
                                  {review.user.charAt(0).toUpperCase()}
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
                    className="pcontent"
                    style={{ position: "absolute", right: "1vw", top: "4vh" }}
                  >
                    <img
                      style={{ transform: "scale(1)", marginRight: "10px" }}
                      onClick={() => setOpensearch(!opensearch)}
                      src={search}
                      alt="search"
                    />
                    <input
                      style={{
                        display: opensearch ? "block" : "none",
                        position: "absolute",
                        right: "30px",
                        top: "5px",
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
                        <div style={{ marginLeft: "20px", fontSize: "20px" }}>
                          {service.ServiceName}
                        </div>
                        <div>
                          <b style={{ marginRight: "30px", fontSize: "25px" }}>
                            :₹{service.DiscountedPrice}
                          </b>
                        </div>
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
                              :₹{combo.ComboPrice}
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
                  <b style={{ marginLeft: "5vw" }}>Total amount:</b>
                  <b>{calculateTotalAmount()}</b>
                  <span id="displayCart" style={{ fontSize: "15px" }}>
                    {displayCartItems()}
                  </span>
                </div>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <button className="checkout-button" onClick={handleCheckout}>
                    let select time now
                  </button>
                  {/*  */}
                </div>
                <span className="close-button" onClick={handleClosePopup}>
                  <WestIcon fontSize="medium" />
                  <span style={{ marginLeft: "4px" }}>Back</span>
                </span>
              </div>
            )}

            {checkoutStage === "userDetails" && (
              <div className="popupContent">
                <div className="user-details">
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
                            onChange={(e) =>
                              setUserDetails((prevDetails) => ({
                                ...prevDetails,
                                name: e.target.value,
                              }))
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Email:</td>
                        <td>
                          <input
                            value={userdetails.email}
                            onChange={(e) =>
                              setUserDetails((prevDetails) => ({
                                ...prevDetails,
                                email: e.target.value,
                              }))
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mobile:</td>
                        <td>
                          <input
                            value={userdetails.phone}
                            onChange={(e) =>
                              setUserDetails((prevDetails) => ({
                                ...prevDetails,
                                phone: e.target.value,
                              }))
                            }
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
                  <table id="servicesSelected" style={{ marginLeft: "40px" }}>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.ServiceName || item.ComboName}>
                          <td>{item.ServiceName || item.ComboName}</td>
                          <td>{item.DiscountedPrice || item.ComboPrice}</td>
                        </tr>
                      ))}
                      <tr>
                        <td
                          style={{ textAlign: "right", paddingRight: "15px" }}
                        >
                          <b>Total amount:</b>
                        </td>
                        <td>{calculateTotalAmount()}</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3>
                    <u>Slot Details:</u>
                  </h3>
                  <table
                    id="slotDetails"
                    style={{
                      width: Reschedule ? "100%" : "60%",
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
                              {slotDetails.date && (
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
                </div>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  {slotDetails.time && (
                    <>
                      <button
                        className="checkout-button"
                        onClick={handlePayNow}
                      >
                        Pay Now
                      </button>
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
      {wishlistMessage && (
        <div className="popup-wishlist">
          <div className="popup-content-wishlist">
            <span className="wishlistmessage">{wishlistMessage}</span>
          </div>
        </div>
      )}
      {SalonBlockMessage && (
        <div className="popup-wishlist">
          <div className="popup-content-wishlist">
            <span className="wishlistmessage">{SalonBlockMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default SalonPage;

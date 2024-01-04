import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Ac from "../images/air-conditioner.svg";
import wifi from "../images/wi-fi.svg";
import parking from "../images/parking.svg";
import language from "../images/language.svg";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CardPayment from "../images/card-payment.svg";
import laptopCredit from "../images/laptop-and-credit-card.svg";
import PaymentProcessed from "../images/payment-processed.svg";
import { Link, useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaceMarker from "../images/place-marker.svg";
import { useNavigate } from "react-router-dom";
import hourglass from "../images/hourglass-with-glasmorphism-effect.svg";
import { getSignleSalon } from "../Apis/Salons_service";
import Loader, { ButtonLoader } from "../Components2/Loader";
import moment from "moment";
import Header from "./Header";
import { Store2 } from "../App";
import { addWishlistApi } from "../Apis/Wishlist_service";
import {
  addPayment,
  getPayment,
  removePayment,
} from "../context/PaymentStorage";
import { verifyPaymentAPI } from "../Apis/Booking_service";
import MetaData from "../context/MetaData";

const Today = moment().format("DD/MM/YYYY");
const Payment_token = getPayment();

function SalonPay() {
  const navigate = useNavigate();
  const Reschedule = Payment_token?.Reschedule;
  const { singleSalon, setsingleSalon } = useContext(Store2);
  const { id, pay, transactionID } = useParams();

  const [loading, setloading] = useState(true);
  const [wishlistloading, setwishlistloading] = useState(false);
  const [salonData, setsalonData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviewsToShow, setReviewsToShow] = useState(1);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredCombos, setFilteredCombos] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [SalonBlockMessage, setSalonBlockMessage] = useState(null);

  const [slotDetails, setslotDetails] = useState({
    date: null,
    time: null,
    slot_uuid: null,
    full_date: null,
  });

  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [checkoutStage, setCheckoutStage] = useState("processing");

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

  const handleShowMoreReviews = () => {
    setReviewsToShow((prevReviews) =>
      setReviewsToShow(salonData.reviewData.length)
    );
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

  const handleClosePopup = () => {
    // setIsPopupOpen(false);
  };
  const handleOpenPopup = () => {
    navigate(`/salon/${id}`);
    removePayment();
  };

  const verifyTransaction = async () => {
    setCheckoutStage("completed");

    if (Payment_token.count > 3) {
      alert("connect to groomer as verification is done for 2 times");
      return;
    }

    const respose = await verifyPaymentAPI(transactionID);
    if (respose.code === 202) {
      setCheckoutStage("bookingConfirmed");
      removePayment();
    }
    if (respose.code === 409) {
      alert(respose.message);
      removePayment();
    }
    if (respose.code === 500) {
      let update = Payment_token;
      update.count = update.count + 1;
      addPayment(update);
      verifyTransaction();
    }
  };

  const verifyRescheduleTransaction = async () => {
    setCheckoutStage("completed");

    if (Payment_token.count > 3) {
      alert("connect to groomer as verification is done for 2 times");
      return;
    }

    const respose = await verifyPaymentAPI(transactionID);
    if (respose.code === 202) {
      setCheckoutStage("bookingConfirmed");
      removePayment();
    }
    if (respose.code === 409) {
      alert(respose.message);
      removePayment();
    }
    if (respose.code === 500) {
      let update = Payment_token;
      update.count = update.count + 1;
      addPayment(update);
      verifyRescheduleTransaction();
    }
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
        reviewData: [],
        blockedDates: response.data.salon.salon_block_dates,
        // blockedDates: ["28/10/2023", "29/10/2023"],
        Features: response.data.salon.salon_features,
        Languages: Object.values(response.data.salon.salon_languages),
        Wishlist: false,
      };

      updateStates(update);
    } else {
      alert("not found");
      removePayment();
      navigate("/salons");
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
    if (pay === "true" && Payment_token.initiated) {
      if (!Payment_token.Reschedule) {
        verifyTransaction();
      } else {
        verifyRescheduleTransaction();
      }
    } else if (pay === "false") {
      console.log("not is unsuccessfull");
      alert("payment is not done");
    } else {
      navigate(`/salon/${id}`);
    }
  }, []);

  return (
    <>
      <Header />

      {loading && !salonData ? (
        <Loader x="loader-full" />
      ) : (
        <div className="salon-page">
          <MetaData title="Payment" />
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
                    </div>
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
                            top: "-5px",
                          }}
                        >
                          of {salonData.reviewData.length} reviews
                        </div>
                      </div>
                      <div className="SalonRatings MobileView">
                        {salonData.ratings}
                      </div>
                    </div>
                  </div>
                  <div className="reviews">
                    <div className="ratings-reviews">
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
                  {Payment_token &&
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
        <div className="popup popup-open">
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
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
                  <Loader />
                  <br />
                  <h2>verifying</h2>
                </div>
              </div>
            )}

            {!Reschedule && checkoutStage === "bookingConfirmed" && (
              <div className="popupContent" style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "40px" }}>
                  <span className="payment">Booking Confirmed.</span>
                </div>
                <div>
                  <img
                    src={PaymentProcessed}
                    alt="payment processed"
                    className="confirmedImage"
                  />
                </div>
                <div className="gotoPage">
                  <div>
                    <Link to="/salons" className="salon-button">
                      Go To Salons
                    </Link>
                  </div>
                  <div>
                    <Link to="/bookings" className="booking-button">
                      Go To Bookings
                    </Link>
                  </div>
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
                <br />
                <div className="gotoPage">
                  <div>
                    <Link to="/salons" className="salon-button">
                      Go To Salons
                    </Link>
                  </div>
                  <div>
                    <Link to="/bookings" className="booking-button">
                      Go To Bookings
                    </Link>
                  </div>
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

export default SalonPay;

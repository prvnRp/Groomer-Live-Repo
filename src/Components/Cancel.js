import "../App.css";
import Logo from "./Logo";
import Hamburger from "./Hamburger";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import banking from "../images/mobile-banking-cashback.svg";
import { removeCancelToken } from "../context/CancelStorage";
import { CancelBookingAPI } from "../Apis/Booking_service";
import Loader from "../Components2/Loader";

function Cancel() {
  // ? ------------------------------------------------------------
  //  ? -------------- React-Route-Dom -----------------------------
  // ? ------------------------------------------------------------
  const navigate = useNavigate();
  const location = useLocation();

  // ? ------------------------------------------------------------
  //  ? -------------- useStates --------------------------------
  // ? ------------------------------------------------------------

  const [Cancelpage, setCancelPage] = useState("confirmation"); // State to track the cancellation page stage
  const [loading, setloading] = useState(false);

  // ? ------------------------------------------------------------
  //  ? -------------- Functions --------------------------------
  // ? ------------------------------------------------------------
  // TODO : Function to handle the cancellation process
  const submitCancelAppointHandler = async () => {
    setloading(true);
    const response = await CancelBookingAPI(location.state.BookingID);

    if (response.code === 200) {
      removeCancelToken();
      setloading(false);
      //  Function to handle the cancellation process
      setCancelPage("cancelled");
      // Simulate the payment processing for 2 seconds
      setTimeout(() => {
        // Once the processing is done, show money refund page
        setCancelPage("moneyRefund");
      }, 2000);
    }
  };

  //   TODO : when we cancel token will also will remove
  const cancelAppointMentBooking = () => {
    removeCancelToken();
    navigate(-1);
  };
  return (
    // Render different content based on Cancelpage state
    <div
      className="cancel-image"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "25px",
        textAlign: "center",
      }}
    >
      {/* Display the confirmation page */}
      {Cancelpage === "confirmation" && (
        <>
          <div>
            <div style={{ position: "fixed", top: "0", left: "0" }}>
              <Logo />
            </div>
            <div style={{ position: "fixed", top: "2vw", right: "6vh" }}>
              <Hamburger />
            </div>
          </div>
          <div className="reschedule">Are you sure to Cancel?</div>
          <div className="reschedule-buttons">
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="button-cancel"
            >
              NO
            </button>
            {loading ? (
              <Loader />
            ) : (
              <button
                onClick={submitCancelAppointHandler}
                className="button-reschedule"
              >
                YES
              </button>
            )}
          </div>
          <div style={{ fontSize: "10px" }}>
            15% of cancellation charges will be applicable on your booking .{" "}
            <b>Terms and conditions</b>{" "}
          </div>
        </>
      )}
      {/* Display the cancellation completed page */}
      {Cancelpage === "cancelled" && (
        <>
          <div>
            <div style={{ position: "fixed", top: "0", left: "0" }}>
              <Logo />
            </div>
            <div style={{ position: "fixed", top: "2vw", right: "6vh" }}>
              <Hamburger />
            </div>
          </div>
          <div
            className="money-refund"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <img src={banking} />
            </div>
            <div className="reschedule">Your booking has been cancelled</div>
          </div>
        </>
      )}
      {/* Display the money refund page */}
      {Cancelpage === "moneyRefund" && (
        <>
          <div>
            <div style={{ position: "fixed", top: "0", left: "0" }}>
              <Logo />
            </div>
            <div style={{ position: "fixed", top: "2vw", right: "6vh" }}>
              <Hamburger />
            </div>
            <div
              className="close-review"
              style={{ position: "fixed", cursor: "pointer" }}
              onClick={cancelAppointMentBooking}
            >
              <u>Close</u>
            </div>
          </div>
          <div
            className="money-refund"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              <img src={banking} />
            </div>
            <div>
              <div className="reschedule">
                Your money will be credited with in 24hours.
              </div>
              <div className="reschedule">Thank you.</div>
              <div style={{ fontSize: "10px", marginTop: "20px" }}>
                The money will be credited to the same payment mode and same
                details . <b>Terms and conditions</b>{" "}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cancel;

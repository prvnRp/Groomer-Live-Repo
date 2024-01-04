import "../App.css";
import Logo from "./Logo";
import Hamburger from "./Hamburger";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { Rating } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import envolope from "../images/envelope-with-checkmark-icon.svg";
import Box from "@mui/material/Box";
import MetaData from "../context/MetaData";
import { Alert, Snackbar } from "@mui/material";
import { createReviewAPI } from "../Apis/Salons_service";
import Loader from "../Components2/Loader";
import { Store2 } from "../App";

function Review() {
  // ? ------------------------------------------------------------
  //  ? -------------- React-Router-Dom ---------------------------
  // ? ------------------------------------------------------------
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // ? ------------------------------------------------------------
  //  ? -------------- use Context----- ---------------------------
  // ? ------------------------------------------------------------
  const { setsingleSalon } = useContext(Store2);

  // ? ------------------------------------------------------------
  //  ? -------------- All useStates ------------------------------
  // ? ------------------------------------------------------------
  const [value, setValue] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [errorsnack, seterrorsnack] = useState(false);
  const [errormessage, seterrormessage] = useState("");

  const maxCharacterCount = 500;

  // ? ------------------------------------------------------------
  //  ? -------------- functions ----------------------------------
  // ? ------------------------------------------------------------
  //TODO : Handle message change while respecting character limit
  const handleMessageChange = (event) => {
    const inputMessage = event.target.value;
    if (inputMessage.length <= maxCharacterCount) {
      setMessage(inputMessage);
    }
  };

  // Auto-expand the textarea as the message grows
  useEffect(() => {
    // Resize the textarea when the component mounts and whenever the message changes
    const textarea = document.getElementById("messageTextarea");
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [message]);

  // Handle cancel and simulate payment processing
  const [Cancelpage, setCancelPage] = useState("confirmation");
  const BookingID = location.state?.BookingID;

  // Labels for the star rating
  const labels = {
    0: "",
    1: "Terrible",
    2: "Bad",
    3: "Ok",
    4: "Good",
    5: "Excellent",
  };

  // Get label text for the rating
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  // TODO : post a review submit handler
  const postReviewSubmitHandler = async () => {
    if (message === "") {
      seterrormessage("Please...write a review");
      seterrorsnack(true);
      return;
    }
    setloading(true);
    const response = await createReviewAPI({
      salon_uuid: id,
      rating: value,
      message,
    });

    if (response.code === 400) {
      seterrormessage(response.message);
      seterrorsnack(true);
      setTimeout(() => {
        navigate(`/salon/${id}`);
      }, 2000);
      return;
    }
    if (response.code === 201) {
      setCancelPage("cancelled");
      setsingleSalon(null);
    }
  };
  return (
    <>
      <MetaData title="Review" />
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        {Cancelpage === "confirmation" && (
          <>
            <div>
              <div style={{ position: "fixed", top: "0", left: "0" }}>
                <Logo />
              </div>
              <div className="reviewHamburger">
                <Hamburger />
              </div>
            </div>
            <div className="reschedule">Rate and Write a review</div>
            <div className="rating-card">
              <div>
                <Box
                  sx={{
                    width: 200,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Rating
                    size="large"
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={
                      <StarBorderIcon
                        style={{ color: "white", fontSize: "30px" }}
                      />
                    }
                  />
                  {value !== null && (
                    <Box sx={{ ml: 2 }}>
                      {labels[hover !== -1 ? hover : value]}
                    </Box>
                  )}
                </Box>
              </div>
              <div style={{ position: "relative" }}>
                <textarea
                  style={{
                    width: "100%",
                    resize: "none", // Prevent manual resizing by the user
                    minHeight: "20px", // Set a minimum height to prevent it from collapsing completely
                    overflow: "hidden", // Hide the scrollbar
                    boxSizing: "border-box", // Include padding and border in height calculation
                    backgroundColor: "#1E1E1E",
                  }}
                  rows="1"
                  id="messageTextarea"
                  placeholder="Review"
                  value={message}
                  onChange={handleMessageChange}
                  className="Mobile Number"
                />
                <div
                  style={{
                    position: "absolute",
                    right: 10,
                    bottom: -25,
                    color:
                      message.length > maxCharacterCount
                        ? "red"
                        : "rgba(255, 255, 255, 0.45)",
                  }}
                >
                  {message.length}/{maxCharacterCount}
                </div>
              </div>
            </div>
            <div className="reschedule-buttons">
              {loading ? (
                <Loader />
              ) : (
                <button
                  onClick={postReviewSubmitHandler}
                  className="button-cancel"
                >
                  Submit Review
                </button>
              )}
            </div>
          </>
        )}
        {Cancelpage === "cancelled" && (
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
                onClick={() => {
                  navigate(`/salon/${id}`);
                }}
              >
                <u>Close</u>
              </div>
            </div>
            <div className="rating-card">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "25px",
                }}
              >
                <img src={envolope} alt="banking" />
                <div style={{ fontSize: "16px", textAlign: "center" }}>
                  Thank you for your feedback
                </div>
              </div>
            </div>
          </>
        )}
      </div>
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

export default Review;

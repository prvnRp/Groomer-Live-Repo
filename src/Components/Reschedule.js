import "../App.css";
import Logo from "./Logo";
import Hamburger from "./Hamburger";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract id and booking ID from route parameters and location state respectively
  var { id } = useParams();
  console.log(id);
  const BookingID = location.state?.BookingID;
  console.log(BookingID);

  return (
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
      <div>
        <div style={{ position: "fixed", top: "0", left: "0" }}>
          <Logo />
        </div>
        <div style={{ position: "fixed", top: "2vw", right: "6vh" }}>
          <Hamburger />
        </div>
      </div>
      <div className="reschedule">Are you sure to Reschedule?</div>
      <div className="reschedule-buttons">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="button-cancel"
        >
          NO
        </button>
        <button
          onClick={() => {
            // Navigate to the salon page with Reschedule status and BookingID
            navigate(`/salon/${id}`, {
              state: { Reschedule: true, BookingID: BookingID },
            });
          }}
          className="button-reschedule"
        >
          YES
        </button>
      </div>
      <div style={{ fontSize: "10px", textAlign: "center" }}>
        10% of Rescheduling charges will be applicable on your booking . <br />
        <b>Terms and conditions</b>{" "}
      </div>
    </div>
  );
}

export default App;

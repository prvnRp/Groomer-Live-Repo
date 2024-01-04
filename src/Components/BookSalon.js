import "../App.css";
import Logo from "./Logo";
import Hamburger from "./Hamburger";
import { useNavigate } from "react-router-dom";
import { getToken } from "../context/StorageToken";

function BookSalon() {
  const navigate = useNavigate();
  const token = getToken();

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
        <div className="hamburger">
          <Hamburger />
        </div>
      </div>
      <div className="reschedule">
        Are you really looking for Home salon services
      </div>
      <div className="reschedule-buttons">
        <button
          onClick={() => {
            // Navigate to the salon page with Reschedule status and BookingID
            if (token) {
              navigate("/homeService");
            } else {
              navigate("/login");
            }
          }}
          className="button-bookpage"
        >
          YES
        </button>
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="button-reschedule"
        >
          NO
        </button>
      </div>
    </div>
  );
}

export default BookSalon;

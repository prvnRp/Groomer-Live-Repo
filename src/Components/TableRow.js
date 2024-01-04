import React from "react";
import "../Styles/TableRow.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Store2 } from "../App";
import { addCancelToken } from "../context/CancelStorage";

function TableRow(props) {
  console.log(props, "chckng");
  const navigate = useNavigate();
  const { setbookingDetails } = useContext(Store2);

  // Define a mapping of booking statuses to their corresponding color codes
  var Status = { Booked: "yellow", Completed: "green", Cancelled: "red" };
  const [expandedRow, setExpandedRow] = useState(null); // State to manage the expanded row

  // Function to handle row click and toggle the expanded row
  const handleRowClick = (bookingID) => {
    if (expandedRow === bookingID) {
      setExpandedRow(null);
    } else {
      setExpandedRow(bookingID);
    }
  };

  const CancelAppointmentHandler = (item) => {
    addCancelToken("cancel Appointment Initiated");
    navigate(`/cancel/${item.SalonId}`, {
      state: { BookingID: item.Appt_id },
    });
  };

  // Generate JSX elements for each booking in the list
  const bookings = props.BookingDetails.map((item, index) => {
    const isExpanded = expandedRow === item.BookingID; // Check if the current booking is expanded

    return (
      <React.Fragment key={item.BookingID}>
        {/* Display booking details if expanded */}
        {isExpanded && (
          <div
            style={{
              borderTopLeftRadius: "25px",
              borderTopRightRadius: "25px",
            }}
            className="grid-item item1"
          >
            <u style={{ display: "flex", textAlign: "left" }}>
              Booking Details:
            </u>
            <i
              onClick={() => handleRowClick(item.BookingID)}
              style={{ float: "right", position: "inherit" }}
              className={isExpanded ? "arrow1 arrow-up" : "arrow1 arrow-down"}
            />
          </div>
        )}
        <div
          style={{
            marginBottom: isExpanded ? "0px" : "10px",
            borderTopLeftRadius: isExpanded ? "0px" : "25px",
            borderBottomLeftRadius: isExpanded ? "0px" : "25px",
          }}
          className="grid-item"
        >
          <span style={{ paddingLeft: "20px" }}>{item.BookingID}</span>
        </div>
        <div
          style={{
            marginBottom: isExpanded ? "0px" : "10px",
            cursor: "pointer",
          }}
          className="grid-item"
          onClick={() => navigate(`/salon/${item.SalonId}`)}
        >
          <span style={{ borderBottom: "1px solid grey" }}>
            {item.SalonName}
          </span>
        </div>
        <div
          style={{ marginBottom: isExpanded ? "0px" : "10px" }}
          className="grid-item"
        >
          {item.SlotDetails}
        </div>
        <div
          style={{ marginBottom: isExpanded ? "0px" : "10px" }}
          className="grid-item"
        >
          <div className="services-container">
            {item.Services !== "" && (
              <div className="each-service">{item.Services}</div>
            )}
            <br />
            {item.Combo.length > 0 && (
              <div className="each-combo">
                <span>
                  {item.Combo.map((comboItem, index) => {
                    return (
                      <p>
                        {comboItem.combo_name} :{" "}
                        <span>{comboItem.combo_services_name.join(", ")}</span>
                      </p>
                    );
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* <div
          style={{ marginBottom: isExpanded ? "0px" : "10px" }}
          className="grid-item"
        >
          {item.Combo === "" ? "-" : item.Combo}
        </div> */}
        <div
          style={{ marginBottom: isExpanded ? "0px" : "10px" }}
          className="grid-item"
        >
          {item.Pricing}
        </div>
        <div
          style={{
            color: Status[item.Status],
            marginBottom: isExpanded ? "0px" : "10px",
            borderTopRightRadius: isExpanded ? "0px" : "25px",
            borderBottomRightRadius: isExpanded ? "0px" : "25px",
          }}
          className="grid-item"
        >
          {!isExpanded && (
            <span>
              {(item.isReappointment &&
                item.Status === "Booked" &&
                "ReBooked") ||
                item.Status}
            </span>
          )}
          {!isExpanded && (
            <i
              onClick={() => handleRowClick(item.BookingID)}
              style={{ float: "right", position: "inherit" }}
              className={isExpanded ? "arrow1 arrow-up" : "arrow1 arrow-down"}
            />
          )}
        </div>
        {isExpanded && (
          <>
            {/* Display additional details for expanded row */}
            <span class="grid-item gridItemColor">
              <span style={{ paddingLeft: "20px" }}>{item.User_Name}</span>
            </span>
            <span className="grid-item gridItemColor">{item.User_Phone}</span>
            <span className="grid-item gridItemColor">{item.User_Email}</span>
            <span className="grid-item item2 gridItemColor">
              {item.BookingID}
            </span>
            <span className="grid-item gridItemColor">{item.Payment_Mode}</span>
            <span
              style={{ color: Status[item.Status] }}
              className="grid-item gridItemColor"
            >
              {item.Status}
            </span>

            <span
              style={{
                borderBottomRightRadius: "25px",
                borderBottomLeftRadius: "25px",
              }}
              className="grid-item item3"
            >
              {item.Status === "Booked" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  {!item.isReappointment && (
                    <button
                      style={{ background: "#515151" }}
                      onClick={() => {
                        setbookingDetails(item);
                        navigate(`/reschedule/${item.SalonId}`, {
                          state: { BookingID: item.Appt_id },
                        });
                      }}
                    >
                      Reschedule
                    </button>
                  )}
                  <button
                    style={{ background: "#FF6548" }}
                    onClick={() => CancelAppointmentHandler(item)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </span>
          </>
        )}
      </React.Fragment>
    );
  });
  return bookings;
}

export default TableRow;

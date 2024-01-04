import React, { useState } from "react";
import "../Styles/BookingMobile.css";
import "../Styles/TableRow.css";
import PlaceMarker from "../images/place-marker.svg";
import { useNavigate } from "react-router-dom";

function BookingMobile(props) {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState(null);
  // Mapping of status values to their respective colors
  var Status = { Booked: "yellow", Completed: "green", Cancelled: "red" };

  // Function to handle clicking on a card to expand or collapse it
  const handleCardClick = (index) => {
    setExpandedCard(index === expandedCard ? null : index);
  };

  const NavigateToMaps = (coordinates) => {
    const [latitude, longitude] = coordinates;
    console.log(coordinates);
    let url = `https://maps.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
    return;
  };

  // Create an array of JSX elements representing booking details
  const bookings = props.BookingDetails.map((item, index) => {
    const isExpanded = index === expandedCard;
    return (
      <React.Fragment key={item.BookingID}>
        <div className="Card" onClick={() => handleCardClick(index)}>
          <div
            style={{ flexDirection: isExpanded ? "column" : "row" }}
            className="Card-item"
          >
            {isExpanded ? null : (
              <div className={"circle3 " + Status[item.Status]}></div>
            )}
            <div
              style={{
                paddingTop: isExpanded ? "15px" : "6px",
                paddingLeft: isExpanded ? "8px" : "0px",
              }}
              className="Carditem"
            >
              <div style={{ fontSize: "14px", fontWeight: "700" }}>
                Booking ID: {item.BookingID}
                {!isExpanded ? null : (
                  <span style={{ float: "right" }}>
                    Status:{" "}
                    <span style={{ color: Status[item.Status] }}>
                      {item.Status}
                    </span>
                  </span>
                )}
              </div>
              {isExpanded ? null : (
                <React.Fragment>
                  <div>
                    <span
                      style={{
                        paddingRight: "15px",
                      }}
                    >
                      {item.SalonName}
                    </span>{" "}
                    <span>{item.SlotDetails}</span>
                    <img
                      src={PlaceMarker}
                      className="locationIconSize"
                      onClick={() => NavigateToMaps(item.Location)}
                    />
                    <span></span>
                  </div>
                  <div style={{ position: "relative", top: "-3px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "700" }}>
                      {item.Pricing}
                    </span>{" "}
                    <span style={{ fontSize: "12px" }}>
                      For {item.Services.split(",").length} Service
                      {item.Services.split(",").length === 1 ? "" : "s"}
                    </span>
                  </div>
                </React.Fragment>
              )}
            </div>
            {isExpanded ? (
              <>
                {/* Display additional details in a table */}
                <table style={{ position: "relative", top: "-12px" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: "0 9px" }} width="90vm">
                        <b>Salon Name:</b>
                      </td>
                      <td
                        style={{ padding: "0 0", textDecoration: "underline" }}
                        onClick={() => {
                          navigate(`/salon/${item.SalonId}`);
                        }}
                      >
                        {item.SalonName}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "0 9px" }}>
                        <b>Slot details:</b>
                      </td>
                      <td style={{ padding: "0 0" }}>{item.SlotDetails}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "0 9px" }}>
                        <b>Services:</b>
                      </td>
                      {/* <td style={{ padding: "0 0" }}>{item.Services}</td> */}
                      <td>
                        <div className="services-container">
                          {item.Services !== "" && (
                            <div className="each-service">{item.Services}</div>
                          )}
                          {/* {item.ComboName !== "" && (
                            <div className="each-combo">
                              <span>{item.ComboName}</span> :{" "}
                              <span
                                style={{ fontSize: "0.8em", color: "gray" }}
                              >
                                {item.Combo}
                              </span>
                            </div>
                          )} */}

                          <div className="each-combo">
                            {item.Combo !== "" && (
                              <span>
                                {item.Combo.map((comboItem, index) => {
                                  return (
                                    <p>
                                      {comboItem.combo_name} :{" "}
                                      <span>
                                        {comboItem.combo_services_name.join(
                                          ", "
                                        )}
                                      </span>
                                    </p>
                                  );
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                                   
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "0 9px" }}>
                        <b>Price:</b>
                      </td>
                      <td style={{ padding: "0 0" }}>{item.Pricing}</td>
                    </tr>
                  </tbody>
                </table>
                {/* Display user details and action buttons */}
                <div
                  style={{
                    fontSize: "12px",
                    padding: "0 9px",
                    position: "relative",
                    top: "-30px",
                  }}
                >
                  <div>User details:</div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Name: {item.User_Name}</div>
                    <div>Mobile: {item.User_Phone}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Email: {item.User_Email}</div>
                  </div>
                  {item.Status === "Booked" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        className="button-reschedule"
                        onClick={() => {
                          navigate(`/reschedule/${item.SalonId}`, {
                            state: { BookingID: item.BookingID },
                          });
                        }}
                      >
                        Reschedule
                      </button>
                      <button
                        className="button-cancel"
                        onClick={() => {
                          navigate(`/cancel/${item.SalonId}`, {
                            state: { BookingID: item.BookingID },
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  });

  return <>{bookings}</>;
}

export default BookingMobile;

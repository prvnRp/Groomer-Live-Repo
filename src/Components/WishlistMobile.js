import React, { useState } from "react";
import "../Styles/BookingMobile.css";
import "../Styles/TableRow.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

// The WishlistMobile component is responsible for rendering wishlist items in a mobile view.
function WishlistMobile(props) {
  const navigate = useNavigate();
  const { BookingDetails, removeFromWishlist } = props;

  const handleRemoveFromWishlist = (item) => {
    removeFromWishlist(item.ID);
  };

  // Generate the list of wishlist items to be displayed
  const bookings = BookingDetails.map((item, index) => {
    return (
      <React.Fragment key={item.ID}>
        <div
          style={{
            // display: "flex",
            // flexDirection: "row",
            // justifyContent: "space-between",
            alignItems: "left",
            borderRadius: "35px",
            background: "rgba(123, 123, 123, 0.25)",
            padding: "5px 10px",
            margin: "10px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: " space-between",
              gap: "20px",
              marginLeft: "10px",
            }}
          >
            <div>
              <span
                style={{ borderBottom: "1px solid grey" }}
                onClick={() => {
                  navigate(`/salon/${item.SalonId}`);
                }}
              >
                {item.SalonName}
              </span>
            </div>
            <div>
              <div>
                <FavoriteIcon
                  style={{
                    color: "red",
                  }}
                  onClick={() => handleRemoveFromWishlist(item)}
                />
              </div>
            </div>
            {/* <div>{item.Location}</div> */}
          </div>
          {/* <div>
            <div>
              <FavoriteIcon
                style={{
                  //   marginTop: "5px",
                  color: "red",
                  position: "relative",
                  top: "0px",
                  right: "-23px",
                }}
                onClick={() => handleRemoveFromWishlist(item)}
              />
            </div>
          </div> */}
        </div>
      </React.Fragment>
    );
  });

  return bookings;
}

export default WishlistMobile;

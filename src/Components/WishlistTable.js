import React from "react";
import "../Styles/TableRow.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

// The WishlistTable component is responsible for rendering wishlist items.
function WishlistTable(props) {
  const navigate = useNavigate();

  const { BookingDetails, removeFromWishlist } = props;

  const handleRemoveFromWishlist = (item) => {
    removeFromWishlist(item.ID);
  };

  // Generate the list of wishlist items to be displayed
  const bookings = BookingDetails.map((item) => {
    return (
      <React.Fragment key={item.ID}>
        <tr>
          <td style={{ width: "5vw", cursor: "pointer", textAlign: "left" }}>
            <span
              style={{ borderBottom: "1px solid grey" }}
              onClick={() => {
                navigate(`/salon/${item.SalonId}`);
              }}
            >
              <b>{item.SalonName}</b>
            </span>
          </td>
          {/* <td style={{ width: "10vw", textAlign: "left" }}>{item.Location}</td> */}
          {/* Render the favorite icon to allow removing items from the wishlist */}
          <td width="5px" style={{ textAlign: "right" }}>
            <FavoriteIcon
              style={{ marginRight: "2vw", color: "red", cursor: "pointer" }}
              onClick={() => handleRemoveFromWishlist(item)}
            />
          </td>
        </tr>
      </React.Fragment>
    );
  });

  return bookings;
}

export default WishlistTable;

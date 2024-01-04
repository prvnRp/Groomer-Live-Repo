import "../App.css";
import WishlistTable from "./WishlistTable";
import "../Styles/Bookings.css";
import WishlistMobile from "./WishlistMobile";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useBlur } from "../context/blurContext";
import { deleteWishlistApi, getWishlistApi } from "../Apis/Wishlist_service";
import Loader from "../Components2/Loader";
import MetaData from "../context/MetaData";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";

// TODO : empty wishlist component
const EmptyWishlist = () => {
  return (
    <tr>
      <td colSpan={2}>
        <div style={{ color: "red" }}>
          <HourglassDisabledIcon />
          <h1>Empty Wishlist</h1>
        </div>
      </td>
    </tr>
  );
};

// The Wishlist component displays a user's wishlist of salons.
function Wishlist() {
  // ? ------------------------------------------------------------
  //  ?  ----------- All useStates---------------------
  // ? -----------------------------------------------------------
  const { isBlur } = useBlur();
  const [loading, setloading] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // ? ------------------------------------------------------------
  //  ?  ----------- functions---------------------
  // ? -----------------------------------------------------------
  // TODO : fetch the users wishlist
  const fetchWishlist = async () => {
    setloading(true);
    const response = await getWishlistApi();
    if (response.code === 200) {
      let update = response.data.map((item) => ({
        ID: item.wishlist_uuid,
        SalonId: item.wishlist_salon_uuid,
        SalonName: item.salon_name,
        Location: " need to get address 500068",
      }));
      setWishlist(update);
      setloading(false);
    }
  };

  // TODO : Function to remove an item from the wishlist based on its ID
  const removeFromWishlist = async (wishlist_id) => {
    setloading();
    setloading(true);
    const response = await deleteWishlistApi(wishlist_id);
    if (response.code === 202) {
      setWishlist([]);
      fetchWishlist();
    }
  };

  // ? ------------------------------------------------------------
  //  ?  ----------- useEffect ------------------------------------
  // ? -----------------------------------------------------------
  useEffect(() => {
    fetchWishlist();
  }, []);
  return (
    <>
      <MetaData title="Wishlists" />
      <Header />
      {/* Render the main content of the Wishlist */}
      {loading ? (
        <Loader x="loader-half" />
      ) : (
        <div
          style={{ filter: isBlur ? "blur(10px)" : "none" }}
          className="flex-container"
        >
          <div className="container1">
            <div className="flex2 desktop-flex2">
              <div className="salonname text-center">
                <b>Wishlist</b>
              </div>

              <table id="wishlist">
                <thead>
                  <tr>
                    <th>
                      <span style={{ textAlign: "center" }}>Salon Name</span>
                    </th>
                    {/* <th>Location</th> */}
                    <th></th>
                  </tr>
                </thead>
                {/* Display the wishlist items using the WishlistTable component */}
                <tbody>
                  {wishlist.length === 0 ? (
                    <EmptyWishlist />
                  ) : (
                    <WishlistTable
                      BookingDetails={wishlist}
                      removeFromWishlist={removeFromWishlist}
                    />
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex2">
              <div className="MobileView">
                <div className="salonname">
                  <b>Wishlist</b>
                </div>
                {/* Display the mobile version of the wishlist using the WishlistMobile component */}

                {wishlist.length === 0 ? (
                  <EmptyWishlist />
                ) : (
                  <WishlistMobile
                    BookingDetails={wishlist}
                    removeFromWishlist={removeFromWishlist}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Wishlist;

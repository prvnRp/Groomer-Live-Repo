import "../App.css";
import React, { useState, useEffect } from "react";
import TableRow from "./TableRow";
import "../Styles/Bookings.css";
import Header from "./Header";
import BookingMobile from "./BookingMobile";
import { useBlur } from "../context/blurContext";
import Loader from "../Components2/Loader";
import { getAppointmentsApi } from "../Apis/Booking_service";
import moment from "moment";
import MetaData from "../context/MetaData";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import { removeToken } from "../context/StorageToken";
import { useNavigate } from "react-router-dom";

const EmpytBooking = () => {
  return (
    <tr>
      <td colSpan={2}>
        <div style={{ color: "red" }}>
          <HourglassDisabledIcon />
          <h1>Empty Bookings</h1>
        </div>
      </td>
    </tr>
  );
};

function Bookings() {
  const navigate = useNavigate();
  // ? ------------------------------------------------------------
  //  ?  ----------- All useState---------------------
  // ? -----------------------------------------------------------
  // Access blur state from context using custom hook
  const { isBlur } = useBlur();
  const [loader, setloader] = useState(true);
  const [BookingDetails, setBookingDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(0);

  // ? ------------------------------------------------------------
  //  ?  ----------- functions -------------------------------------
  // ? -----------------------------------------------------------

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // ? ------------------------------------------------------------
  //  ?  ----------- useEffect---------------------
  // ? -----------------------------------------------------------
  useEffect(() => {
    // TODO : fetch all the appointments function
    const fetchAppointments = async () => {
      setloader(true);
      const recordsPerPage = 10;
      const response = await getAppointmentsApi(recordsPerPage, currentPage);
      if (response.code === 200) {
        const alter = response.data.appointments.map((item) => {
          function capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
          }
          let slot_details =
            moment(item.appointment_date, "DD/MM/YYYY").format("D MMM") +
            ", " +
            item.appointment_timing;
          const ch = {
            Appt_id: item.appointment_uuid,
            Date: item.appointment_date,
            BookingID: item.appointment_booking_id,
            SalonId: item.appointment_salon_uuid,
            SalonName: item.salon.salon_name,
            Location: item.salon.salon_location.coordinates,
            SlotDetails: slot_details,
            Services: item.appointment_services
              .map((value) => value.service_name)
              .join(","),

            Combo: item.appointment_combos,
            //   .map((value) => value.combo_services_name)
            //   .join(", "),
            // ComboName: item.appointment_combos
            //   .map((value) => value.combo_name)
            //   .join(""),
            Pricing: `₹${item.appointment_subtotal}`,
            Status: capitalizeFirstLetter(item.appointment_status),
            Payment_Mode: item.appointment_payment_method,
            User_Name: item.appointment_user_full_name,
            User_Phone: item.appointment_user_phone,
            User_Email: item.appointment_user_email,
            isReappointment: item.appointment_is_reappointment,
          };
          return ch;
        });

        setBookingDetails(alter);
        let tempPages = Math.floor(
          response.data.totalAppointments / recordsPerPage
        );
        settotalPages(tempPages);
        if (response.data.totalAppointments % recordsPerPage !== 0) {
          settotalPages(tempPages + 1);
        }
        setloader(false);
      } else if (response.code === 401) {
        removeToken();
        navigate("/login");
      } else {
        console.log(response.message);
      }
    };

    fetchAppointments();
  }, [currentPage]);
  return (
    <>
      <MetaData title="Appointments" />
      <Header />
      <div
        style={{ filter: isBlur ? "blur(10px)" : "none" }}
        className="flex-container"
      >
        <div className="container1">
          <div className="flex2">
            <div className="heading">Bookings History</div>
            <div className="grid-container">
              <div className="grid-item-h">Booking ID</div>
              <div className="grid-item-h">Salon Name</div>
              <div className="grid-item-h">Slot details</div>
              {/* <div className="grid-item-h">Location</div> */}
              <div className="grid-item-h">Services</div>
              {/* <div className="grid-item-h">Combos</div> */}
              <div className="grid-item-h">Pricing</div>
              <div className="grid-item-h">Status</div>
              {/* Render individual rows using TableRow component */}

              {!loader && BookingDetails.length === 0 ? (
                <EmpytBooking />
              ) : (
                <TableRow BookingDetails={BookingDetails} />
              )}
            </div>

            {loader && <Loader x="loader-half" />}
            {/* Display mobile view of bookings */}
            <div className="MobileView">
              {!loader &&
                (BookingDetails.length === 0 ? (
                  <EmpytBooking />
                ) : (
                  <BookingMobile BookingDetails={BookingDetails} />
                ))}
            </div>

            {/* pagination ------------------ */}
            {!loader && totalPages !== 1 && (
              <div className="pagination" style={{ marginBottom: "2rem" }}>
                <button
                  className="navbutton"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={
                      currentPage === index + 1
                        ? "pagebutton active"
                        : "pagebutton"
                    }
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="navbutton"
                  onClick={handleNextPage}
                  style={{
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Bookings;

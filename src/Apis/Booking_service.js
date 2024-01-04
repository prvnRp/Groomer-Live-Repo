import axios from "axios";
import Context from "../context/Productuion";
import { getToken, removeToken } from "../context/StorageToken";

/**
 * The function `getAppointmentsApi` makes an API request to retrieve appointments data, with
 * authentication and error handling.
 * @param {Number} limit - The `limit` parameter is used to specify the maximum number of appointments to
 * retrieve per page. It determines the number of appointments that will be displayed on a single page.
 * @param {Number} page - The page parameter is used to specify the page number of the appointments data that
 * you want to retrieve. It is used for pagination purposes, allowing you to retrieve a specific page
 * of appointments at a time.
 * @returns the data received from the API call if the request is successful. If the request returns a
 * status code of 401, it removes the token and redirects the user to the login page. If there is an
 * error, it returns the error response data.
 */
export const getAppointmentsApi = async (limit, page) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${Context}/user/appointments?limit=${limit}&page=${page}`,
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `showTimingsAPI` makes an API call to retrieve show timings for a salon based on the
 * provided salon UUID, duration, and date.
 * @param {String} salonUUID - The salonUUID parameter is a unique identifier for a salon. It is used to specify
 * which salon's show timings to retrieve.
 * @param {Number} duration - The duration parameter represents the duration of the show timings in minutes. It
 * is used to filter the available show timings based on their duration.
 * @param {String} date - The date parameter is the specific date for which you want to retrieve the show
 * timings. It should be in the format of YYYY-MM-DD.
 * @returns the data received from the API call.
 */
export const showTimingsAPI = async (salonUUID, duration, date) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${Context}/user/showtimings/${salonUUID}?duration=${duration}&date=${date}`,
      config
    );

    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `makeAppointAPI` is an asynchronous function that makes an API call to create an
 * appointment with the given salon ID, slot details, duration, and selected services/combos.
 * @param {String} salonId - The ID of the salon where the appointment is being made.
 * @param {Object} slotDetails - The `slotDetails` parameter is an object that contains information about the
 * selected time slot for the appointment. It includes the `slot_uuid` (unique identifier for the time
 * slot), `time` (the time of the slot), and `full_date` (the full date of the slot).
 * @param {Number} duration - The duration parameter represents the duration of the appointment in minutes.
 * @param {Object} selected - The `selected` parameter is an object that contains the selected services and
 * combos for the appointment. It has the following structure:
 * @returns the data received from the API call, or an error response if there was an error.
 */
export const makeAppointAPI = async (
  salonId,
  slotDetails,
  duration,
  selected
) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const details = {
      salon_uuid: salonId,
      slot_uuid: slotDetails.slot_uuid,
      duration,
      date: slotDetails.full_date,
    };
    if (slotDetails.time[0].includes("0")) {
      details.timing = slotDetails.time.replace("0", "");
      console.log(details.timing);
    } else {
      details.timing = slotDetails.time;
    }

    if (selected.services.length > 0) {
      details.services = selected.services;
    }

    if (selected.combos.length > 0) {
      details.combos = selected.combos;
    }

    const { data } = await axios.post(
      `${Context}/user/create_appointment`,
      details,
      config
    );

    return data;
  } catch (error) {
    return error.response.data;
  }
};
/**
 * The function `makeGuetAppointAPI` is an asynchronous function that makes an API call to create a
 * guest appointment with the provided details.
 * @param {String} salonId - The ID of the salon where the appointment is being made.
 * @param {Object} guest - The `guest` parameter is an object that contains the following properties:
 * @param {Object} slotDetails - An object containing details about the time slot for the appointment. It
 * includes properties like slot_uuid (unique identifier for the time slot), time (the time of the
 * slot), and full_date (the full date of the slot).
 * @param {Number} duration - The duration parameter represents the duration of the appointment in minutes.
 * @param {Object} selected - The `selected` parameter is an object that contains the selected services and
 * combos for the appointment. It has two properties:
 * @returns the data received from the API call.
 */

export const makeGuetAppointAPI = async (
  salonId,
  guest,
  slotDetails,
  duration,
  selected
) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const details = {
      is_guest_appointment: true,
      full_name: guest.name,
      mobile: guest.phone,
      email: guest.email,
      salon_uuid: salonId,
      slot_uuid: slotDetails.slot_uuid,
      duration,
      date: slotDetails.full_date,
    };

    if (slotDetails.time[0] === "0") {
      details.timing = slotDetails.time.substring(1);
    } else {
      details.timing = slotDetails.time;
    }

    if (selected.services.length > 0) {
      details.services = selected.services;
    }

    if (selected.combos.length > 0) {
      details.combos = selected.combos;
    }

    const { data } = await axios.post(
      `${Context}/user/create_appointment`,
      details,
      config
    );

    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The `verifyPayment` function is an asynchronous function that verifies the payment status of a
 * transaction using an API endpoint, and handles authentication and error handling.
 * @param {String} transactionID - The `transactionID` parameter is the unique identifier for a payment
 * transaction. It is used to retrieve the payment status for a specific transaction.
 * @returns The function `verifyPayment` returns the `data` object if the request is successful. If the
 * response code is 401, it removes the token and redirects the user to the login page. If there is an
 * error, it returns the error response data.
 */
export const verifyPaymentAPI = async (transactionID) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${Context}/payment/payment-status/${transactionID}`,
      config
    );
    if (data.code === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `CancelBookingAPI` is an asynchronous function that cancels a booking by making a GET
 * request to a specific endpoint and returns the response data.
 * @param {String} app_id - The `app_id` parameter is the ID of the appointment that needs to be cancelled.
 * @returns {Object} the data received from the API call if successful. If the API call returns a code of 401,
 * it removes the token and redirects the user to the login page. If there is an error, it returns the
 * error response data.
 */
export const CancelBookingAPI = async (app_id) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${Context}/user/cancel_appointment/${app_id}`,
      config
    );
    if (data.code === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The `resheduleAppointAPI` function is an asynchronous function that sends a POST request to
 * reschedule an appointment using the provided appointment ID and slot details.
 * @param appId - The `appId` parameter is the unique identifier of the appointment that needs to be
 * rescheduled. It is used to identify the specific appointment in the system.
 * @param slotDetails - The `slotDetails` parameter is an object that contains the details of the
 * appointment slot to be rescheduled. It has the following properties:
 * @returns the data received from the API call if the call is successful. If there is an error, it is
 * returning the error response data.
 */
export const resheduleAppointAPI = async (appId, slotDetails) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const details = {
      appointment_uuid: appId,
      slot_uuid: slotDetails.slot_uuid,
      date: slotDetails.full_date,
    };
    if (slotDetails.time[0].includes("0")) {
      details.timing = slotDetails.time.replace("0", "");
      console.log(details.timing);
    } else {
      details.timing = slotDetails.time;
    }

    const { data } = await axios.post(
      `${Context}/user/reschedule_appointment`,
      details,
      config
    );

    return data;
  } catch (error) {
    return error.response.data;
  }
};

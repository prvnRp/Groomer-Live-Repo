import axios from "axios";
import Context from "../context/Productuion";
import { getToken } from "../context/StorageToken";

/**
 * The `loginUserAPI` function sends a POST request to generate an OTP for user login using the
 * provided email.
 * @param {String} email - The `email` parameter is the email address of the user who wants to login.
 * @returns {Object} the data received from the API call if the call is successful. If there is an error, it
 * will return the error response data.
 */

export const loginUserAPI = async (email) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${Context}/user/login/generateOtp`,
      { email },
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The `verifyLoginOtpApi` function sends a POST request to validate the an OTP for user login using the
 * provided email and sends the token.
 * @param {String} email - The `email` parameter is the email address of the user who wants to login.
 * @param {String} otp - otp is recieved in email the length will be 6
 * @returns {Object} the data received from the API call if the call is successful. If there is an error, it
 * will return the error response data.
 */
export const verifyLoginOtpAPI = async (email, otp) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${Context}/user/login/verification`,
      { email, otp },
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `userDetailsAPI` makes an API call to retrieve user details using a token for
 * authorization.
 * @returns the data received from the API call if the request is successful. If there is an error, it
 * will return the error response data.
 */
export const userDetailsAPI = async () => {
  try {
    const token = getToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${Context}/user/details`, config);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

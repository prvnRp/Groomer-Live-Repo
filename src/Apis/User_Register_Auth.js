import axios from "axios";
import Context from "../context/Productuion";

/**
 * The function `registerUserAPI` is an asynchronous function that sends a POST request to a user
 * registration API endpoint and returns the response data or an error message.
 * @param {Object} details - The `details` parameter is an object that contains the user registration details
 * such as username, email, password, etc.
 * @returns the response data from the API call if the request is successful. If there is an error, it
 * is returning the error response data.
 */
export const registerUserAPI = async (details) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${Context}/user/registration`,
      details,
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `generateOtpPAPI` sends a POST request to a server endpoint to generate an OTP
 * (One-Time Password) for a user registration process, using the provided email as a parameter.
 * @param {String} email - The `email` parameter is the email address of the user for whom the OTP (One-Time
 * Password) needs to be generated.
 * @returns the `data` object if the request is successful. If there is an error, it will return the
 * `error.response.data` object.
 */
export const generateOtpPAPI = async (email) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${Context}/user/registration/generateOtp`,
      { email },
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};
/**
 * The function `verifyOTPAPI` is an asynchronous function that sends a POST request to a verification
 * API endpoint with the provided email and OTP, and returns the response data or the error response
 * data.
 * @param {String} email - The email parameter is the email address of the user who is trying to verify their
 * OTP (One-Time Password). It is used to identify the user and match it with the OTP they received.
 * @param {String} otp - The `otp` parameter stands for "One-Time Password". It is a unique code that is
 * generated and sent to a user's email or phone number for the purpose of verifying their identity
 * during a registration or login process. The user is required to enter the OTP correctly in order to
 * proceed with the verification
 * @returns the response data from the API call if it is successful. If there is an error, it is
 * returning the error response data.
 */

export const verifyOTPAPI = async (email, otp) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${Context}/user/registration/verification`,
      { email, otp },
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

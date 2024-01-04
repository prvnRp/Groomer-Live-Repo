import axios from "axios";
import Context from "../context/Productuion";
import { getToken } from "../context/StorageToken";
/**
 * The function `getAllSalons` is an asynchronous function that retrieves a list of salons based on the
 * specified city, location, and limit.
 * @param {Number} [limit=12] - The `limit` parameter is used to specify the maximum number of salons to
 * retrieve from the API. By default, it is set to 12, but you can pass a different value to retrieve a
 * different number of salons.
 * @returns {Array} the data received from the API call if the call is successful. If there is an error, it
 * will return the error response data.
 */

const getLocation = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(coordinates);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              // reject("User denied the request for Geolocation.");
              resolve("PermissionDenied");
              break;
            case error.POSITION_UNAVAILABLE:
              reject("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              reject("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              reject("An unknown error occurred.");
              break;
            default:
              reject("An error occurred.");
          }
        }
      );
    } else {
      reject("Geolocation is not supported.");
    }
  });
};

export const getAllSalons = async (limit = 12) => {
  try {
    let location;

    try {
      location = await getLocation();
    } catch (locationError) {
      location = null;
    }

    let apiUrl;

    if (
      location &&
      location.latitude !== undefined &&
      location.longitude !== undefined
    ) {
      apiUrl = `${Context}/user/salons?city=Hyderabad&&location=${location.latitude},${location.longitude}&&limit=${limit}`;
    } else {
      apiUrl = `${Context}/user/salons?city=Hyderabad&&limit=${limit}`;
    }

    const { data } = await axios.get(apiUrl);
    return data;
  } catch (error) {
    console.error("Error fetching salon data:", error);
    return error.response.data;
  }
};

export const filterData = async (filterOptions) => {
  let location = await getLocation();
  let apiFilter = {};

  // if (filterOptions.priceFrom !== "") {
  //   if (location) {
  //     apiFilter.location = `${location.latitude},${location.longitude}`;
  //     apiFilter.minServicePrice = filterOptions.priceFrom;
  //   } else {
  //     alert("First give the location access");
  //     apiFilter.minServicePrice = filterOptions.priceFrom;
  //   }
  // }

  if (filterOptions.ratings !== "") {
    if (location) {
      apiFilter.location = `${location.latitude},${location.longitude}`;
      apiFilter.minRating = filterOptions.ratings;
    } else {
      alert("First give the location access");
      apiFilter.minRating = filterOptions.ratings;
    }
  }

  if (filterOptions.distance !== "") {
    if (location) {
      apiFilter.location = `${location.latitude},${location.longitude}`;
      apiFilter.distance = filterOptions.distance;
    } else {
      alert("First give the location access");
    }
  }

  // if (filterOptions.priceTo !== "") {
  //   if (location) {
  //     apiFilter.location = `${location.latitude},${location.longitude}`;
  //     apiFilter.maxServicePrice = filterOptions.priceTo;
  //   } else {
  //     alert("First give the location access");
  //     apiFilter.maxServicePrice = filterOptions.priceTo;
  //   }
  // }

  if (filterOptions.manhood !== "") {
    if (location) {
      apiFilter.location = `${location.latitude},${location.longitude}`;
      apiFilter.sex = filterOptions.manhood;
    } else {
      alert("First give the location access");
      apiFilter.sex = filterOptions.manhood;
    }
  }

  if (filterOptions.services !== "") {
    if (location) {
      apiFilter.location = `${location.latitude},${location.longitude}`;
      apiFilter.service = filterOptions.services.join(",");
    } else {
      alert("First give the location access");
      apiFilter.service = filterOptions.services.join(",");
    }
  }

  const queryString = Object.keys(apiFilter)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(apiFilter[key])}`
    )
    .join("&");

  try {
    const { data } = await axios.get(
      `${Context}/user/salons?city=Hyderabad&limit=12&${queryString}`
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const getRecommandedSalon = async (limit = 12) => {
  try {
    const { data } = await axios.get(
      `${Context}/user/recommended-salon-code?city=Hyderabad`
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `getSingleSalon` makes an asynchronous request to retrieve data for a single salon
 * using a given UUID.
 * @param {String} uuid - The `uuid` parameter is a unique identifier for a salon. It is used to retrieve
 * information about a specific salon from the server.
 * @returns  the data received from the API call if the call is successful. If there is an error, it is
 * returning the error response data.
 */
export const getSignleSalon = async (uuid, userID) => {
  try {
    let check = getToken();
    let op;
    check ? (op = `uuid=${uuid}&userUuid=${userID}`) : (op = `uuid=${uuid}`);

    const { data } = await axios.get(`${Context}/user/salon?${op}`);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `getReviewsApi` is an asynchronous function that makes an API call to retrieve feedback
 * data for a salon based on its UUID.
 * @param {String} uuid - The `uuid` parameter is a unique identifier for a salon. It is used to retrieve the
 * reviews or feedback for a specific salon.
 * @returns the data received from the API call if the call is successful. If there is an error, it is
 * returning the error response data.
 */
export const getReviewsApi = async (uuid) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${Context}/user/feedback/getFeedback?salon_uuid=${uuid}`,
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `createReviewAPI` is an asynchronous function that sends a POST request to create a
 * review with the provided details, including an authorization token, and returns the response data or
 * an error response.
 * @param {Object} details - The `details` parameter is an object that contains the information needed to create
 * a review. It could include properties such as the user's ID, the product ID, the rating, and the
 * review text.
 * @returns the response data from the API call if it is successful. If the response code is 401, it
 * removes the token and redirects the user to the login page. If there is an error, it returns the
 * error response data.
 */
export const createReviewAPI = async (details) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${Context}/user/feedback/create`,
      details,
      config
    );

    return data;
  } catch (error) {
    return error.response.data;
  }
};

import axios from "axios";
import Context from "../context/Productuion";
import { getToken, removeToken } from "../context/StorageToken";

/**
 * The function `getWishlistApi` makes an API request to retrieve the user's wishlist, using a token
 * for authorization, and handles any errors that occur.
 * @returns the data received from the API call. If the API call is successful, it will return the data
 * object. If there is an error, it will return the error response data.
 */
export const getWishlistApi = async () => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log(`${Context}/user/wishlist`);
    const { data } = await axios.get(`${Context}/user/wishlist`, config);
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
 * The `addWishlistApi` function is an asynchronous function that sends a POST request to create a
 * wishlist item for a salon, using the provided salon UUID.
 * @param {String} salon_uuid - The `salon_uuid` parameter is the unique identifier of a salon. It is used to
 * specify which salon to add to the wishlist.
 * @returns the data received from the API call.
 */
export const addWishlistApi = async (salon_uuid) => {
  try {
    console.log(salon_uuid);
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${Context}/user/wishlist/create`,
      { salon_uuid },
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
 * The `deleteWishlistApi` function is an asynchronous function that sends a DELETE request to the
 * server to delete a wishlist, using the provided wishlist UUID.
 * @param {String} wishlist_uuid - The `wishlist_uuid` parameter is the unique identifier of the wishlist that
 * you want to delete.
 * @returns the response data from the API call.
 */
export const deleteWishlistApi = async (wishlist_uuid) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        wishlist_uuid,
      },
    };

    const { data } = await axios.delete(
      `${Context}/user/wishlist/delete`,
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

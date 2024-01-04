import axios from "axios";
import Context from "../context/Productuion";
import { getToken, removeToken } from "../context/StorageToken";
import moment from "moment";

export const HomeServiceAppointAPI = async (
  userDetails,
  selectedCategory,
  selectedServices,
  totalPrice
) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    let time = moment(userDetails.appointmentTime, "HH:mm").format("hh:mm A");

    const details = {
      targetGender: selectedCategory.toLowerCase(),
      selectedServices: selectedServices,
      appointmentDate: userDetails.appointmentDate,
      appointmentTime: time,
      fullName: userDetails.fullName,
      mobileNumber: userDetails.mobileNumber,
      fullAddress: userDetails.fullAddress,
      suggestions: userDetails.suggestions,
      totalPrice: totalPrice,
    };

    const { data } = await axios.post(
      `${Context}/user/homeService`,
      details,
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

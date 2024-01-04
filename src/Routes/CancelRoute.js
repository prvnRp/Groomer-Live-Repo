import { Navigate } from "react-router-dom";
import { getToken } from "../context/StorageToken";
import { getCancelToken } from "../context/CancelStorage";

const CancelRoute = ({ children }) => {
  const salonToken = getToken();
  const isCancel = getCancelToken();
  if (salonToken && isCancel) {
    return children;
  }
  return <Navigate to="/bookings" />;
};

export default CancelRoute;

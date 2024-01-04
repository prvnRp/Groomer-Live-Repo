import { Navigate } from "react-router-dom";
import { getToken } from "../context/StorageToken";
import { getPayment } from "../context/PaymentStorage";

const PaymentRoute = ({ children }) => {
  const salonToken = getToken();
  const isPayment = getPayment();
  if (salonToken && isPayment) {
    return children;
  }
  return <Navigate to="/" />;
};

export default PaymentRoute;

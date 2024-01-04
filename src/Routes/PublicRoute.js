import { Navigate } from "react-router-dom";
// import { Store } from "../App";
// import { useContext } from "react";
import { getToken } from "../context/StorageToken";

const PublicRoute = ({ children }) => {
  // const [isAuth, setisAuth] = useContext(Store);

  const t = getToken();
  if (t) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;

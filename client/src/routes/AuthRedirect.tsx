import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const AuthRedirect = () => {
  return <Navigate to={isAuthenticated() ? "/home" : "/login"} replace />;
};

export default AuthRedirect;

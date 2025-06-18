import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasToken } from "../../utils/token.js";

const AuthRoute = ({ children }) => {
  let location = useLocation();
  return hasToken() ? (
    <>{children}</>
  ) : (
    <Navigate replace to="/login" state={{ from: location }} />
  );
}

export default AuthRoute;

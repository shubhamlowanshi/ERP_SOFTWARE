import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children; // token exists → allow
};

export default ProtectedRoute;

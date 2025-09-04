import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useApp();

  if (!isAuthenticated) return <Navigate to="/connexion" />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === "client") return <Navigate to="/dashboard" />;
    if (user?.role === "producer") return <Navigate to="/producteur" />;
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;

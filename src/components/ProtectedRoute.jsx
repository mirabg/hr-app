import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{ denied: "You must be logged in to access that page." }}
      />
    );
  }

  if (requiredRole && user.userType !== requiredRole) {
    return (
      <Navigate
        to="/"
        replace
        state={{ denied: `Access denied — requires ${requiredRole} role.` }}
      />
    );
  }

  return children;
}

import React from "react";
import ProtectedRoute from "./ProtectedRoute";

export default function RequireAuth({ children, requiredRole }) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>{children}</ProtectedRoute>
  );
}

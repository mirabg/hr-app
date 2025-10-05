import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          HR Portal
        </NavLink>
        <div className="d-flex align-items-center">
          {user ? (
            <>
              {/* show user name first */}
              <span className="text-white fw-semibold me-3">
                {user.firstName || user.email}
                {user.lastName ? ` ${user.lastName}` : ""}
              </span>

              {/* role-specific dashboard link (solid button) */}
              {user.userType === "Employee" && (
                <NavLink
                  className="btn btn-light btn-sm text-primary me-3"
                  to="/employeeDashboard"
                >
                  Employee Dashboard
                </NavLink>
              )}
              {user.userType === "HR" && (
                <NavLink
                  className="btn btn-light btn-sm text-primary me-3"
                  to="/hrDashboard"
                >
                  HR Dashboard
                </NavLink>
              )}

              <button
                className="btn btn-light btn-sm text-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink className="btn btn-light btn-sm text-primary" to="/">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

import React, { useState } from "react";
import { AuthContext } from "./createAuthContext";

export function AuthProvider({ children }) {
  // initialize synchronously from localStorage to avoid a transient null
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("loggedInUser");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Invalid loggedInUser in localStorage", err);
      return null;
    }
  });

  const login = (userObj) => {
    setUser(userObj);
    try {
      localStorage.setItem("loggedInUser", JSON.stringify(userObj));
    } catch (err) {
      console.warn("Could not save to localStorage", err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

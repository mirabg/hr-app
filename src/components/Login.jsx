import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import axios from "axios";

function Login() {
  const [userType, setUserType] = useState("Employee");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:3000/users?email=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(
          password
        )}&userType=${encodeURIComponent(userType)}`
      );
      const users = res.data;
      if (users && users.length > 0) {
        const user = users[0];
        // persist to localStorage
        // persist via context
        login(user);
        // navigate based on role
        if (user.userType === "HR") {
          navigate("/hrDashboard");
        } else if (user.userType === "Employee") {
          navigate("/employeeDashboard");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <form
        className="border rounded p-4 shadow-sm bg-light mx-auto"
        style={{ width: 420, maxWidth: "90%" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-center mb-4">Login</h2>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="d-flex justify-content-center gap-3 mb-3">
          <label className="radio-inline">
            <input
              className="me-1"
              type="radio"
              name="userType"
              value="Employee"
              checked={userType === "Employee"}
              onChange={() => setUserType("Employee")}
            />{" "}
            Employee
          </label>
          <label className="radio-inline">
            <input
              className="me-1"
              type="radio"
              name="userType"
              value="HR"
              checked={userType === "HR"}
              onChange={() => setUserType("HR")}
            />{" "}
            HR
          </label>
        </div>
        {error && <div className="text-center text-danger mb-3">{error}</div>}
        <button className="btn btn-primary d-block mx-auto" type="submit">
          Login
        </button>
        <NavLink className="d-block text-center mt-3" to="/signup">
          Don't have an account? Sign up
        </NavLink>
      </form>
    </div>
  );
}

export default Login;

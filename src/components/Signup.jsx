import React, { useState } from "react";
import axios from "axios";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setSubmitting(false);
      return setError("Email is required.");
    }
    if (!password) {
      setSubmitting(false);
      return setError("Please choose a password.");
    }
    if (password !== confirm) {
      setSubmitting(false);
      return setError("Passwords do not match.");
    }

    setSubmitting(true);
    try {
      // find user by email
      const res = await axios.get(
        `http://localhost:3000/users?email=${encodeURIComponent(email)}`
      );
      const users = res.data || [];
      if (users.length === 0) {
        setError("Employee record not found in system. Please contact HR");
        setSubmitting(false);
        return;
      }

      const user = users[0];
      if (user.isSignedUp) {
        setError(
          "You are already signed up. Please login using the login form"
        );
        setSubmitting(false);
        return;
      }

      // patch user: set password and isSignedUp=true
      const patch = { password, isSignedUp: true };
      const updated = await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        patch
      );
      const updatedUser = updated.data;
      // auto-login via auth context
      login(updatedUser);
      // navigate to employee dashboard after signup
      navigate("/employeeDashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to sign up. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 420, width: "100%" }}
        className="p-4 border rounded bg-light"
      >
        <h4 className="mb-3 text-center">Sign Up</h4>

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Choose a password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm password</label>
          <input
            type="password"
            className="form-control"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {error && <div className="text-danger mb-2 text-center">{error}</div>}
        {success && (
          <div className="text-success mb-2 text-center">{success}</div>
        )}

        <div className="d-flex justify-content-center">
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;

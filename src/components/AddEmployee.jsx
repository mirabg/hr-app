import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useNotification from "../context/useNotification";

const AddEmployee = ({ onSaved, onCancel }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const notify = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    // basic validation
    if (!form.firstName || !form.lastName || !form.email) {
      setError("First name, last name and email are required.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/users", {
        ...form,
        userType: "Employee",
        isSignedUp: false,
        password: null,
      });
      if (res.status === 201 || res.status === 200) {
        setSuccess("Employee added successfully.");
        const created = res.data;
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          address: "",
          city: "",
          state: "",
          zipcode: "",
          department: "",
        });
        // show global notification
        notify.show("Employee added successfully.");
        // if parent passed an onSaved handler (inline mode), call it
        if (typeof onSaved === "function") {
          onSaved(created);
        } else {
          // otherwise navigate back to HR dashboard with refresh flag
          setTimeout(
            () => navigate("/hrDashboard", { state: { refresh: true } }),
            600
          );
        }
        return;
      } else {
        setError("Failed to add employee.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add employee.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Employee</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            type="email"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">State</label>
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Zip Code</label>
          <input
            name="zipcode"
            value={form.zipcode}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Department</label>
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {error && <div className="text-danger">{error}</div>}
        {success && <div className="text-success">{success}</div>}

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? "Adding..." : "Add Employee"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              // if parent provided onCancel (inline mode), call it; otherwise navigate back
              if (typeof onCancel === "function") return onCancel();
              navigate("/hrDashboard");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;

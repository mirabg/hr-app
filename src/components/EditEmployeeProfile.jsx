import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useNotification from "../context/useNotification";

export default function EditEmployeeProfile({
  idProp,
  user: userProp,
  form: formProp,
  setForm: setFormProp,
  saving: savingProp,
  setSaving: setSavingProp,
  setEditing,
  login,
  setMsg,
}) {
  const params = useParams();
  const idFromParams = params?.id;
  const id = idProp ?? idFromParams ?? userProp?.id;
  const navigate = useNavigate();
  const notify = useNotification();

  // local fallbacks for form and saving so component can be used both inline and via route
  const [localForm, setLocalForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    zipcode: "",
    email: "",
    department: "",
  });
  const form = formProp ?? localForm;
  const setForm = setFormProp ?? setLocalForm;

  const [localSaving, setLocalSaving] = useState(false);
  const saving = savingProp ?? localSaving;
  const setSaving = setSavingProp ?? setLocalSaving;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // if called inline with a user prop, populate form from that and skip fetching
    if (userProp) {
      setForm({
        firstName: userProp.firstName || "",
        lastName: userProp.lastName || "",
        address: userProp.address || "",
        zipcode: userProp.zipcode || "",
        email: userProp.email || "",
        department: userProp.department || "",
      });
      return;
    }

    // otherwise fetch by id when id is available
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`);
        const u = res.data;
        setForm({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          address: u.address || "",
          zipcode: u.zipcode || "",
          email: u.email || "",
          department: u.department || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load employee.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, userProp, setForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const patch = { ...form };
      const res = await axios.patch(`http://localhost:3000/users/${id}`, patch);
      const updated = res.data;

      // show global notification
      if (notify && typeof notify.show === "function") notify.show("Saved.");

      // if this was inline editing (employee editing their own details), update auth and UI
      if (setEditing && typeof setEditing === "function") {
        if (typeof login === "function") login(updated);
        if (typeof setMsg === "function") setMsg("Saved.");
        setEditing(false);
      } else {
        // otherwise (HR editing via route) navigate back to HR dashboard and request refresh
        navigate("/hrDashboard", {
          state: { refresh: true, notify: "Saved." },
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save employee.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="mt-3">Loading...</div>;

  return (
    <div className="mt-3">
      <h4>Edit Employee</h4>
      {error && <div className="text-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">First name</label>
            <input
              className="form-control"
              value={form.firstName}
              onChange={(e) =>
                setForm((s) => ({ ...s, firstName: e.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last name</label>
            <input
              className="form-control"
              value={form.lastName}
              onChange={(e) =>
                setForm((s) => ({ ...s, lastName: e.target.value }))
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">Address</label>
            <input
              className="form-control"
              value={form.address}
              onChange={(e) =>
                setForm((s) => ({ ...s, address: e.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Zip Code</label>
            <input
              className="form-control"
              value={form.zipcode}
              onChange={(e) =>
                setForm((s) => ({ ...s, zipcode: e.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Department</label>
            <input
              className="form-control"
              value={form.department}
              onChange={(e) =>
                setForm((s) => ({ ...s, department: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              if (setEditing && typeof setEditing === "function") {
                setEditing(false);
              } else {
                navigate("/hrDashboard");
              }
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

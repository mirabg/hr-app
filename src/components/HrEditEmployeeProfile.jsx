import React, { useEffect, useState } from "react";
import axios from "axios";
import useNotification from "../context/useNotification";

export default function HrEditEmployeeProfile({ id, onSaved, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    zipcode: "",
    email: "",
    department: "",
  });
  const notify = useNotification();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`);
        if (!mounted) return;
        const u = res.data || {};
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
        if (!mounted) return;
        setError("Failed to load employee.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError("");
    try {
      const res = await axios.patch(`http://localhost:3000/users/${id}`, {
        ...form,
      });
      const updated = res.data;
      if (notify && typeof notify.show === "function") notify.show("Saved.");
      if (typeof onSaved === "function") onSaved(updated);
    } catch (err) {
      console.error(err);
      setError("Failed to save employee.");
    } finally {
      setSaving(false);
    }
  };

  if (!id) return null;
  if (loading) return <div className="mt-3">Loading...</div>;

  return (
    <div className="mt-3 card w-100">
      <div className="card-body">
        <h5 className="card-title">Edit Employee</h5>
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
              onClick={() =>
                typeof onCancel === "function" ? onCancel() : null
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import useNotification from "../context/useNotification";

const CreateLeaveRequest = ({ userId, onSuccess, onCancel }) => {
  const [leave, setLeave] = useState({ date: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const notify = useNotification?.() || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        userId,
        date: leave.date,
        reason: leave.reason,
        status: "Pending",
      };
      const res = await axios.post(
        "http://localhost:3000/leaveRequests",
        payload
      );
      if (res.status === 201 || res.status === 200) {
        if (notify && notify.show) notify.show("Leave request submitted.");
        setLeave({ date: "", reason: "" });
        if (onSuccess) onSuccess();
      } else {
        if (notify && notify.show)
          notify.show("Failed to submit leave request.");
      }
    } catch (err) {
      console.error(err);
      if (notify && notify.show) notify.show("Failed to submit leave request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">Apply for Leave</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={leave.date}
              onChange={(e) =>
                setLeave((s) => ({ ...s, date: e.target.value }))
              }
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Reason</label>
            <textarea
              className="form-control"
              value={leave.reason}
              onChange={(e) =>
                setLeave((s) => ({ ...s, reason: e.target.value }))
              }
              required
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-success" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeaveRequest;

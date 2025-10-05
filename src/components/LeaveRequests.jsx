import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function LeaveRequests({ userId: userIdProp, reloadSignal }) {
  const { id } = useParams();
  const userId = userIdProp || id;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [employee, setEmployee] = useState(null);

  const fetchEmployee = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:3000/users/${userId}`);
      setEmployee(res.data || null);
    } catch (err) {
      console.error(err);
      setEmployee(null);
    }
  }, [userId]);

  const fetchRequests = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:3000/leaveRequests?userId=${userId}`
      );
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setRequests(sorted);
    } catch (err) {
      console.error(err);
      setError("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRequests();
    fetchEmployee();
  }, [fetchRequests, fetchEmployee, reloadSignal]);

  const updateStatus = async (requestId, status) => {
    try {
      await axios.patch(`http://localhost:3000/leaveRequests/${requestId}`, {
        status,
      });
      setRequests((r) =>
        r.map((it) => (it.id === requestId ? { ...it, status } : it))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    }
  };

  if (!userId)
    return <div className="container mt-3">No employee selected.</div>;

  return (
    <div className="container mt-3">
      <h4>
        Manage Leave for Employee{" "}
        {employee ? `${employee.firstName} ${employee.lastName}` : `#${userId}`}
      </h4>
      {loading && <div>Loading...</div>}
      {error && <div className="text-danger">{error}</div>}
      {!loading && requests.length === 0 && (
        <div className="text-muted">No leave requests found.</div>
      )}

      <div className="row mt-2">
        {requests.map((lr) => (
          <div className="col-12 mb-2" key={lr.id}>
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-bold">
                    {new Date(lr.date).toLocaleDateString()}
                  </div>
                  <div className="text-muted">{lr.reason}</div>
                </div>
                <div className="text-end">
                  <div className="mb-2">
                    <span
                      className={`badge ${
                        lr.status === "Approved"
                          ? "bg-success"
                          : lr.status === "Denied"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {lr.status || "Pending"}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => updateStatus(lr.id, "Approved")}
                      disabled={lr.status === "Approved"}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => updateStatus(lr.id, "Denied")}
                      disabled={lr.status === "Denied"}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

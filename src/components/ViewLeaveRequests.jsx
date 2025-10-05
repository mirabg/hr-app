import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewLeaveRequests({ user, reloadSignal }) {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [leaveError, setLeaveError] = useState("");

  const fetchLeaveRequests = async () => {
    if (!user) return;
    setLoadingLeaves(true);
    setLeaveError("");
    try {
      const res = await axios.get(
        `http://localhost:3000/leaveRequests?userId=${user.id}`
      );
      setLeaveRequests(res.data || []);
    } catch (err) {
      console.error(err);
      setLeaveError("Failed to load leave requests.");
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    // reload when reloadSignal changes or when user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadSignal, user]);

  return (
    <div className="mt-3">
      <h5>Your Leave Requests</h5>
      {loadingLeaves && <div>Loading...</div>}
      {leaveError && <div className="text-danger">{leaveError}</div>}
      {!loadingLeaves && leaveRequests.length === 0 && (
        <div className="text-muted">No leave requests found.</div>
      )}
      <div className="row mt-2">
        {leaveRequests.map((lr) => (
          <div className="col-12 mb-2" key={lr.id || `${lr.userId}-${lr.date}`}>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="fw-bold">
                      {new Date(lr.date).toLocaleDateString()}
                    </div>
                    <div className="text-muted">{lr.reason}</div>
                  </div>
                  <div>
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

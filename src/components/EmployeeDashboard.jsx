import React, { useState, useEffect } from "react";
import useAuth from "../context/useAuth";
import CreateLeaveRequest from "./CreateLeaveRequest";
import ViewEmployeeProfile from "./ViewEmployeeProfile";
import ViewLeaveRequests from "./ViewLeaveRequests";

export const EmployeeDashboard = () => {
  const { user, login } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    zipcode: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [showLeave, setShowLeave] = useState(false);
  const [showLeaves, setShowLeaves] = useState(false);
  // reloadSignal increments to tell the leave-list component to refetch
  const [reloadSignal, setReloadSignal] = useState(0);

  // sync initial form with user when component mounts or user changes
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        zipcode: user.zipcode || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (showLeaves) {
      // hide the leave form when viewing the list
      setShowLeave(false);
    }
  }, [showLeaves]);

  if (!user) {
    return (
      <div className="container mt-4">Please log in to see your dashboard.</div>
    );
  }

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div style={{ maxWidth: 720, width: "100%" }}>
        <div className="card mb-3">
          <div className="card-body text-center">
            <h4>Welcome {user.firstName}</h4>
            <p className="text-muted">This is your employee dashboard.</p>
            <div className="d-flex align-items-center">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowDetails((s) => !s)}
                >
                  {showDetails ? "Hide My Profile" : "View My Profile"}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditing(true);
                    setShowDetails(true);
                  }}
                >
                  Edit My Profile
                </button>
              </div>

              <div className="d-flex gap-2 ms-auto">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowLeaves((s) => !s);
                    setMsg("");
                  }}
                >
                  {showLeaves ? "Hide Leave Requests" : "View Leave Requests"}
                </button>

                <button
                  className="btn btn-outline-success"
                  onClick={() => {
                    setShowLeave((s) => !s);
                    setShowLeaves(false);
                    setMsg("");
                  }}
                >
                  Apply for Leave
                </button>
              </div>
            </div>
          </div>
        </div>

        {showDetails && (
          <ViewEmployeeProfile
            user={user}
            editing={editing}
            setEditing={setEditing}
            form={form}
            setForm={setForm}
            saving={saving}
            setSaving={setSaving}
            msg={msg}
            setMsg={setMsg}
            login={login}
          />
        )}
        {showLeave && (
          <CreateLeaveRequest
            userId={user.id}
            onSuccess={() => {
              setMsg("Leave request submitted.");
              setShowLeave(false);
              // show the leave list and tell it to reload
              setShowLeaves(true);
              setReloadSignal((s) => s + 1);
            }}
            onCancel={() => setShowLeave(false)}
          />
        )}

        {showLeaves && (
          <ViewLeaveRequests user={user} reloadSignal={reloadSignal} />
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

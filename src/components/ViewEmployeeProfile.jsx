import React from "react";
import EditEmployeeProfile from "./EditEmployeeProfile";

export default function ViewEmployeeProfile({
  user,
  editing,
  setEditing,
  form,
  setForm,
  saving,
  setSaving,
  msg,
  setMsg,
  login,
}) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Your Details</h5>
        {!editing && (
          <div>
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "—"}
            </p>
            <p>
              <strong>Zip Code:</strong> {user.zipcode || "—"}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Department:</strong> {user.department || "—"}
            </p>
          </div>
        )}

        {editing && (
          <EditEmployeeProfile
            user={user}
            form={form}
            setForm={setForm}
            saving={saving}
            setSaving={setSaving}
            msg={msg}
            setMsg={setMsg}
            setEditing={setEditing}
            login={login}
          />
        )}
      </div>
    </div>
  );
}

import React from "react";

export default function EmployeeCard({ emp, onManage, onEdit }) {
  return (
    <div className="card" style={{ minWidth: 170 }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <strong>
              {emp.firstName} {emp.lastName}
            </strong>
            <div className="small">{emp.email}</div>
          </div>
          <div className="text-end">
            <div className="badge bg-secondary">{emp.department || "—"}</div>
          </div>
        </div>

        <div className="mt-2 d-flex justify-content-center gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onManage?.(emp.id)}
          >
            Manage Leave
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onEdit?.(emp.id)}
          >
            Edit Employee Profile
          </button>
        </div>
      </div>
    </div>
  );
}

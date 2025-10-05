import React, { useEffect, useState, useCallback } from "react";
import { Link, Outlet, useLocation, useMatch } from "react-router-dom";
import axios from "axios";
import ManageLeaveReqeusts from "./ManageLeaveReqeusts";
import useNotification from "../context/useNotification";
import EditEmployeeProfile from "./EditEmployeeProfile";
import HrEditEmployeeProfile from "./HrEditEmployeeProfile";
import EmployeeCard from "./EmployeeCard";

const HrDashboard = () => {
  const location = useLocation();
  const notify = useNotification();
  const showCard = !location.pathname.includes("addEmployee");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manageLeaveEmpId, setManageLeaveEmpId] = useState(null);
  const [hrEditingId, setHrEditingId] = useState(null);
  const editMatch = useMatch("/hrDashboard/editEmployee/:id");
  const [showEditEmp, setShowEditEmp] = useState(false);
  const [showManageLeave, setShowManageLeave] = useState(false);

  const handleEditButtonClicked = (name, id) => {
    console.log("handleEditButtonClicked", name, id);
    if (name == null || name === "") {
      setManageLeaveEmpId(null);
      setHrEditingId(null);
      setShowManageLeave(false);
      setShowEditEmp(false);
      return;
    } else if (name === "Manage Leave") {
      setManageLeaveEmpId(id);
      setHrEditingId(null);
      setShowManageLeave(true);
      setShowEditEmp(false);
    } else if (name === "Edit Employee Profile") {
      setHrEditingId(id);
      setManageLeaveEmpId(null);
      setShowEditEmp(true);
      setShowManageLeave(false);
    }
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "http://localhost:3000/users?userType=Employee"
      );
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // show notification if navigation passed one
    if (location.state?.notify) notify.show(location.state.notify);
    // if navigation requested refresh, refetch
    if (location.state?.refresh) {
      fetchEmployees();
      return;
    }
    // initial load
    fetchEmployees();
  }, [location.state, fetchEmployees, notify]);

  return (
    <div className="container">
      {/* Add New Employee - centered container */}
      <div className="d-flex justify-content-center my-3">
        {showCard && (
          <div
            className="card text-center"
            style={{ maxWidth: 370, width: "100%" }}
          >
            <div className="card-body">
              <h5 className="card-title">Add New Employee</h5>
              <small className="d-block text-muted mb-2">
                Use this to add a new employee to the system.
              </small>
              <Link to="/hrDashboard/addEmployee" className="btn btn-primary">
                Add Employee
              </Link>
            </div>
          </div>
        )}
      </div>

      <h4 className="text-center mt-5">Employees</h4>
      <hr className="mx-3" />
      {/* Employees - flex container that wraps cards left-to-right */}
      <div className="d-flex flex-column mx-3">
        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">{error}</div>}
        {!loading && !error && (
          <div className="d-flex flex-row flex-wrap gap-2">
            {employees.length === 0 && (
              <div className="card p-2">No employees yet.</div>
            )}
            {employees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                emp={emp}
                onManage={(id) => handleEditButtonClicked("Manage Leave", id)}
                onEdit={(id) =>
                  handleEditButtonClicked("Edit Employee Profile", id)
                }
              />
            ))}
          </div>
        )}

        {/* Management/Edit area - its own flex container */}
        <hr />
        {(showManageLeave || showEditEmp) && (
          <div className="mt-5 bg-light border rounded p-3">
            {showManageLeave && (
              <div>
                <div>
                  <h4 className="text-center">Manage Leave</h4>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-sm btn-outline-secondary align-self-end"
                    onClick={() => handleEditButtonClicked(null, null)}
                  >
                    Close
                  </button>
                </div>
                <ManageLeaveReqeusts userId={manageLeaveEmpId} />
              </div>
            )}

            <div>
              {showEditEmp ? (
                <HrEditEmployeeProfile
                  id={hrEditingId}
                  onSaved={() => {
                    // refresh list and close editor
                    fetchEmployees();
                    setHrEditingId(null);
                    if (notify && typeof notify.show === "function")
                      notify.show("Employee profile saved.");
                  }}
                  onCancel={() => handleEditButtonClicked(null, null)}
                />
              ) : editMatch ? (
                <EditEmployeeProfile idProp={editMatch.params.id} />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HrDashboard;

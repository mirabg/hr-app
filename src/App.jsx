import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./context/AuthContext";
import { Signup } from "./components/Signup";
import AddEmployee from "./components/AddEmployee";
import HrDashboard from "./components/HrDashboard";
import ManageLeaveReqeusts from "./components/ManageLeaveReqeusts";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import EditEmployeeProfile from "./components/EditEmployeeProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireAuth from "./components/RequireAuth";
import { useEffect } from "react";
import useNotification from "./context/useNotification";

function App() {
  const location = useLocation();
  const notify = useNotification();

  useEffect(() => {
    // don't show denied toast when navigating to the login page
    if (location.pathname === "/") return;
    if (location.state?.denied) {
      notify.show(location.state.denied);
    }
    // run only on location change
  }, [location.state, location.pathname, notify]);

  return (
    <AuthProvider>
      <NavBar />
      {/* Notifications rendered by NotificationProvider */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/hrDashboard"
          element={
            <RequireAuth requiredRole="HR">
              <HrDashboard />
            </RequireAuth>
          }
        >
          <Route path="addEmployee" element={<AddEmployee />} />
          <Route path="manageLeave/:id" element={<ManageLeaveReqeusts />} />
        </Route>
        <Route
          path="/employeeDashboard"
          element={
            <RequireAuth requiredRole="Employee">
              <EmployeeDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

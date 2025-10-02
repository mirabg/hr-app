import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import { Signup } from "./components/Signup";
import AddEmployee from "./components/AddEmployee";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hrDashboard" element={<Signup />}>
          <Route path="addEmployee" element={<AddEmployee />} />
        </Route>
        <Route path="/employeeDashboard" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;

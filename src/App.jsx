import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/Login";
import Dashboard from "./dashboard/Dashboard";
import Absensi from "./absensi/Absensi";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      {/* Toast global*/}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/absensi"
          element={token ? <Absensi /> : <Navigate to="/login" />}
        />

        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
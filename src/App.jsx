import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/Login";
import Dashboard from "./dashboard/Dashboard";
import Absensi from "./absensi/Absensi";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
    <Helmet>
        <title>Absensi</title>
      </Helmet>
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
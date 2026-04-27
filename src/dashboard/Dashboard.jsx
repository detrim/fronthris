import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api"; // KAMU KETINGGALAN INI
import "../assets/Dashboard.css";
import { toast } from 'react-toastify'; 

function Dashboard() {
  const [open, setOpen] = useState(false);

  const scannerRef = useRef(null);
  const isInitialized = useRef(false); // LOCK ANTI DOUBLE

  // FUNCTION SCAN → KIRIM KE LARAVEL
const onScanSuccess = async (decodedText) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    toast.error("User tidak ditemukan, silakan login ulang");
    return;
  }

  try {
    const res = await api.post(
      "/absensi/scan",
      {
        employee_id: user.employee_id,
        qr_code: decodedText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { status, message } = res.data;

    // HANDLE STATUS RESPONSE
    if (status === "success") {
      toast.success(message);
    } 
    else if (status === "already_checked") {
      toast.warning(message);
    } 
    else if (status === "not_time") {
      toast.info(message);
    } 
    else {
      toast.info(message);
    }

  } catch (err) {
    // ini HANYA untuk error sistem (server mati / network)
    toast.error("Server tidak dapat diakses");
  }
};
      const navigate = useNavigate();
      const handleLogout = () => {
        localStorage.clear();
        navigate("/login", { replace: true });
      };

  useEffect(() => {
    //  CEGAH DOUBLE INIT
    if (isInitialized.current) return;
    isInitialized.current = true;

    const timer = setTimeout(() => {
      
      // kalau ada scanner lama, hapus dulu
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 20,
          qrbox: 350,
        },
        false
      );

      scannerRef.current = scanner;

      //  HUBUNGKAN KE FUNCTION
      scanner.render(onScanSuccess);

    }, 300); // stabilisasi DOM

    return () => {
      clearTimeout(timer);

      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }

      isInitialized.current = false;
    };

  }, []);

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h3>Dashboard</h3>

        <button onClick={() => setOpen(true)}>☰</button>
      </header>

      {/* OVERLAY */}
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "show" : ""}`}>
        <button onClick={() => setOpen(false)}>✕</button>

      <ul>
         <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Dashboard
            </NavLink>
          </li>
        <li>
          <NavLink 
            to="/absensi"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Data Absensi
          </NavLink>
        </li>
        {/* LOGOUT */}
        {/* <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li> */}
      </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="content">
        <h2>Scan QR Absensi</h2>
        <div className="scan-card">
          <p className="scan-status">Scanning...</p>
          <div id="qr-reader"></div>
        </div>
      </main>

    </div>
  );
}

export default Dashboard;
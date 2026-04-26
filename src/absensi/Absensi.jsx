import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api";
import "../assets/Dashboard.css";

function Absensi() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchData = async () => {
      try {
        const res = await api.get("/absensi/today", {
          params: {
            employee_id: user.employee_id,
          },
        });

        setData(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h3>Absensi</h3>

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

          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTENT */}
<main className="content">
  <h2>Data Absensi Hari Ini</h2>

  <div className="card single-card">

    <div className="row">
      <span>Jam Masuk Pagi</span>
      <strong>{data?.jam_masuk_pagi || "-"}</strong>
    </div>

    <div className="row">
      <span>Jam Masuk Sore</span>
      <strong>{data?.jam_masuk_sore || "-"}</strong>
    </div>

    <div className="row status">
      <span>Status</span>
      <strong>
        {data?.jam_masuk_pagi && data?.jam_masuk_sore
          ? "Lengkap"
          : "Belum Lengkap"}
      </strong>
    </div>

  </div>
</main>

    </div>
  );
}

export default Absensi;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";
import { toast } from 'react-toastify'; 

function Login() {
  const [employee_id, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!employee_id || !password) {
    toast.warning("NIP dan Password wajib diisi");
    return;
  }

  setLoading(true);

  try {
    const res = await api.post("/login", {
      employee_id,
      password,
    });

    const { status, message, data, Authorization } = res.data;

    if (status === "success") {
      toast.success(message);

      localStorage.setItem("token", Authorization.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/dashboard");
    }

    else if (status === "wrong_password") {
      toast.warning(message);
    }

    else if (status === "not_found") {
      toast.error(message);
    }

    else if (status === "validation_error") {
      toast.info(message);
    }

    else {
      toast.info(message);
    }

  } catch (err) {
    // ini hanya untuk server mati / network
    toast.error("Server tidak dapat diakses");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-page">

      <div className="login-header">
        <div className="logo">📋</div>
        <h1>Absensi</h1>
        <p>Sistem Kehadiran Pegawai</p>
      </div>

      <div className="login-card">
        <form onSubmit={handleLogin}>

          <div className="input-box">
            <label>NIP</label>
            <input
              type="text"
              value={employee_id}
              onChange={(e) => setNip(e.target.value)}
            />
          </div>

          <div className="input-box">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

        </form>
      </div>

      <p className="footer-text">© 2026 Absensi System</p>

    </div>
  );
}

export default Login;
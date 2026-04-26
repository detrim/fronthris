import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// REQUEST: otomatis kirim token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE: auto logout kalau 401 (token expired / tidak valid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // hapus session
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // edirect ke login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
import axios from "axios";

// 🔥 Smart BASE URL logic
export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("🚀 API HIT:", config.baseURL + config.url);
  console.log("🔐 TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

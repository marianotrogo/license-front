
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ||"http://localhost:4443"; // Cambiar si el backend está en otra URL

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

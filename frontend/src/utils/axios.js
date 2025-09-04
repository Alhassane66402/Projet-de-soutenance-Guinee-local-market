import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // ton backend Express/MongoDB
  headers: {
    "Content-Type": "application/json",
  },
});

// Exemple : intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

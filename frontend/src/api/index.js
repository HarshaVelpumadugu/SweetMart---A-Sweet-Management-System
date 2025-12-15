import axios from "axios";

export const api = axios.create({
  baseURL: "https://sweetmart-a-sweet-management-system.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sweetmart_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

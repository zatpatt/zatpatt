// src/services/api.js

import axios from "axios";

// Read API URL from environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials is only needed for cookie-based auth
  withCredentials: false,
});

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized or token expired");

      // OPTIONAL (recommended)
     localStorage.removeItem("accessToken");
     localStorage.removeItem("refreshToken");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;

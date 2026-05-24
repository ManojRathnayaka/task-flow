import axios from 'axios';

/**
 * axiosConfig.js — centralized Axios instance configuration.
 *
 * All API calls go through this instance, which automatically:
 * 1. Prefixes the base URL (/api)
 * 2. Attaches the JWT token from localStorage to every request
 * 3. Redirects to login on 401 Unauthorized responses
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ── Request Interceptor — attach JWT to every outgoing request ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor — handle global errors ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired, invalid, or user wiped from in-memory DB — clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

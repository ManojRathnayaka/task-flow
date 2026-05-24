import axios, { AxiosError } from 'axios';

/**
 * axiosConfig.ts — centralized Axios instance configuration.
 *
 * All API calls go through this instance, which automatically:
 * 1. Prefixes the base URL (/api)
 * 2. Attaches the JWT token from localStorage to every request
 * 3. Redirects to login on 401 Unauthorized responses with a returnUrl
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
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired, invalid, or user wiped from in-memory DB — clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

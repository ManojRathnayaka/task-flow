import api from './axiosConfig';

/**
 * authApi.js — functions for authentication endpoints.
 * Each function corresponds to a single AuthController endpoint.
 */

/**
 * POST /api/auth/register
 * @param {{ username: string, email: string, password: string }} data
 * @returns {Promise<{ token: string, username: string, email: string, userId: number }>}
 */
export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data.data; // Unwrap ApiResponse<AuthResponse>
};

/**
 * POST /api/auth/login
 * @param {{ username: string, password: string }} data
 * @returns {Promise<{ token: string, username: string, email: string, userId: number }>}
 */
export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data.data; // Unwrap ApiResponse<AuthResponse>
};

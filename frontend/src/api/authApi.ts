import api from './axiosConfig';
import { AuthData, ApiResponse } from '../types';

/**
 * authApi.ts — functions for authentication endpoints.
 */

export const register = async (data: Record<string, string>): Promise<AuthData> => {
  const response = await api.post<ApiResponse<AuthData>>('/auth/register', data);
  return response.data.data;
};

export const login = async (data: Record<string, string>): Promise<AuthData> => {
  const response = await api.post<ApiResponse<AuthData>>('/auth/login', data);
  return response.data.data;
};

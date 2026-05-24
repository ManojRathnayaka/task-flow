import api from './axiosConfig';
import { Task, TaskInput, ApiResponse } from '../types';

/**
 * taskApi.ts — CRUD functions for task endpoints.
 */

export const getTasks = async (filters: { status?: string; priority?: string } = {}): Promise<Task[]> => {
  const params: Record<string, string> = {};
  if (filters.status)   params.status   = filters.status;
  if (filters.priority) params.priority = filters.priority;
  const response = await api.get<ApiResponse<Task[]>>('/tasks', { params });
  return response.data.data;
};

export const getTask = async (id: number | string): Promise<Task> => {
  const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (data: TaskInput): Promise<Task> => {
  const response = await api.post<ApiResponse<Task>>('/tasks', data);
  return response.data.data;
};

export const updateTask = async (id: number | string, data: TaskInput): Promise<Task> => {
  const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
  return response.data.data;
};

export const deleteTask = async (id: number | string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

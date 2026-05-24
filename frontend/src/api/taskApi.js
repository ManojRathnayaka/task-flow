import api from './axiosConfig';

/**
 * taskApi.js — CRUD functions for task endpoints.
 * Each function corresponds to a TaskController endpoint.
 */

/** GET /api/tasks — optionally filtered by status or priority */
export const getTasks = async (filters = {}) => {
  const params = {};
  if (filters.status)   params.status   = filters.status;
  if (filters.priority) params.priority = filters.priority;
  const response = await api.get('/tasks', { params });
  return response.data.data;
};

/** GET /api/tasks/:id */
export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data;
};

/** POST /api/tasks */
export const createTask = async (data) => {
  const response = await api.post('/tasks', data);
  return response.data.data;
};

/** PUT /api/tasks/:id */
export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data.data;
};

/** DELETE /api/tasks/:id */
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

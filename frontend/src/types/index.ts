import { TaskStatus, TaskPriority } from '../constants';

export type { TaskStatus, TaskPriority };

export interface AuthData {
  token: string;
  username: string;
  email: string;
  userId: number;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

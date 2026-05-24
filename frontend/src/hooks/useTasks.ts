import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';
import { Task, TaskInput } from '../types';

export function useTasks() {
  const queryClient = useQueryClient();
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Fetch Tasks
  const {
    data: tasks = [],
    isLoading: loading,
    error: queryError,
    refetch: fetchTasks
  } = useQuery<Task[], Error>({
    queryKey: ['tasks', priorityFilter],
    queryFn: () => {
      const filters = priorityFilter !== 'ALL' ? { priority: priorityFilter } : {};
      return getTasks(filters);
    }
  });

  const error = (queryError as unknown as {response?: {data?: {message?: string}}})?.response?.data?.message || (queryError ? 'Could not load tasks. Is the backend running?' : '');

  // Create Task
  const createMutation = useMutation<Task, Error, TaskInput>({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // Update Task
  const updateMutation = useMutation<Task, Error, { taskId: number | string; formData: TaskInput }>({
    mutationFn: ({ taskId, formData }) => updateTask(taskId, formData),
    onMutate: async ({ taskId, formData }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', priorityFilter]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks', priorityFilter], (old) =>
          old ? old.map((t) => (t.id === taskId ? { ...t, ...formData } as Task : t)) : []
        );
      }

      return { previousTasks };
    },
    // @ts-expect-error - react-query v5 context typing issue
    onError: (_err, _variables, context) => {
      if ((context as { previousTasks?: Task[] })?.previousTasks) {
        queryClient.setQueryData(['tasks', priorityFilter], (context as { previousTasks?: Task[] }).previousTasks);
      }
    },
  });

  // Delete Task
  const deleteMutation = useMutation<void, Error, number | string>({
    mutationFn: deleteTask,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', priorityFilter]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks', priorityFilter], (old) =>
          old ? old.filter((t) => t.id !== deletedId) : []
        );
      }

      return { previousTasks };
    },
    // @ts-expect-error - react-query v5 context typing issue
    onError: (_err, _variables, context) => {
      if ((context as { previousTasks?: Task[] })?.previousTasks) {
        queryClient.setQueryData(['tasks', priorityFilter], (context as { previousTasks?: Task[] }).previousTasks);
      }
    },
  });

  const handleCreate = async (formData: TaskInput) => {
    return createMutation.mutateAsync(formData);
  };

  const handleUpdate = async (taskId: number | string, formData: TaskInput) => {
    return updateMutation.mutateAsync({ taskId, formData });
  };

  const handleDelete = async (id: number | string) => {
    return deleteMutation.mutateAsync(id);
  };

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

  const stats = {
    total: tasks.length,
    todo: getTasksByStatus('TODO').length,
    inProgress: getTasksByStatus('IN_PROGRESS').length,
    done: getTasksByStatus('DONE').length,
  };

  const donePercent = stats.total > 0
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  return {
    tasks,
    loading,
    error,
    priorityFilter,
    setPriorityFilter,
    fetchTasks,
    handleCreate,
    handleUpdate,
    handleDelete,
    getTasksByStatus,
    stats,
    donePercent
  };
}

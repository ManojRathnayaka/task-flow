import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filters = priorityFilter !== 'ALL' ? { priority: priorityFilter } : {};
      const data = await getTasks(filters);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (formData) => {
    const created = await createTask(formData);
    setTasks((prev) => [created, ...prev]);
  };

  const handleUpdate = async (taskId, formData) => {
    const updated = await updateTask(taskId, formData);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

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

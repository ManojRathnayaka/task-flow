import { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task, TaskInput } from '../types';
import { STATUSES, PRIORITIES } from '../constants';
import { cn } from '../utils/cn';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(STATUSES as unknown as [string, ...string[]]),
  priority: z.enum(PRIORITIES as unknown as [string, ...string[]]),
  dueDate: z.string().optional().or(z.literal('')),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskInput) => Promise<unknown>;
  onClose: () => void;
}

export default function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const isEdit = !!task;
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
      });
    }
  }, [task, reset]);

  const onFormSubmit = async (data: TaskFormValues) => {
    setApiError('');
    try {
      await onSubmit({
        ...data,
        description: data.description?.trim() || null,
        dueDate: data.dueDate || null,
      } as TaskInput);
      onClose();
    } catch (err: unknown) {
      const msg = (err as {response?: {data?: {message?: string}}}).response?.data?.message || 'Failed to save task. Please try again.';
      setApiError(msg);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={handleBackdropClick} id="task-form-modal">
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl animate-in slide-in-from-bottom-4 duration-300">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEdit ? '✏️ Edit Task' : '✨ New Task'}
          </h2>
          <button id="modal-close-btn" className="p-1.5 rounded-lg text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/50" role="alert">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} id="task-form" noValidate>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="task-title-input">Title *</label>
            <input
              id="task-title-input"
              className={cn(
                "w-full bg-slate-50 dark:bg-neutral-800 border rounded-lg px-3 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.title ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-neutral-700 focus:border-blue-500"
              )}
              type="text"
              placeholder="What needs to be done?"
              autoFocus
              {...register('title')}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="task-description-input">Description</label>
            <textarea
              id="task-description-input"
              className="w-full bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y min-h-[100px]"
              placeholder="Add more details..."
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="task-status-select">Status</label>
              <select
                id="task-status-select"
                className="w-full bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all custom-select"
                {...register('status')}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="task-priority-select">Priority</label>
              <select
                id="task-priority-select"
                className="w-full bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all custom-select"
                {...register('priority')}
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🔴 High</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="task-due-date">Due Date</label>
            <input
              id="task-due-date"
              className="w-full bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
              type="date"
              {...register('dueDate')}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-gray-300 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors shadow-sm"
              onClick={onClose}
              id="cancel-task-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-task-btn"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader size={16} className="animate-spin" />}
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

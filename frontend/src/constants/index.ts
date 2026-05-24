import { ListTodo, Clock, CheckCircle2 } from 'lucide-react';

export const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export type TaskStatus = typeof STATUSES[number];

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type TaskPriority = typeof PRIORITIES[number];

export const COLUMN_META: Record<TaskStatus, { label: string; Icon: React.ElementType; headerClass: string; color: string }> = {
  TODO: {
    label: 'To Do',
    Icon: ListTodo,
    headerClass: 'bg-slate-100 border border-slate-200 text-slate-700 dark:bg-neutral-900 dark:border-neutral-800 dark:text-gray-300',
    color: '#64748b',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    Icon: Clock,
    headerClass: 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400',
    color: '#3b82f6',
  },
  DONE: {
    label: 'Done',
    Icon: CheckCircle2,
    headerClass: 'bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400',
    color: '#22c55e',
  },
};

export const FILTER_OPTIONS = [
  { key: 'ALL',    label: 'All' },
  { key: 'LOW',    label: '🟢 Low' },
  { key: 'MEDIUM', label: '🟡 Medium' },
  { key: 'HIGH',   label: '🔴 High' },
];

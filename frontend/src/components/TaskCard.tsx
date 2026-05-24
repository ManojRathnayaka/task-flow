import { Calendar, Pencil, Trash2, Clock } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

function isOverdue(dueDateStr: string | null) {
  if (!dueDateStr) return false;
  return new Date(dueDateStr) < new Date();
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number | string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusKey = task.status;
  const priorityKey = task.priority;
  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE';

  const statusClass = {
    TODO: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    IN_PROGRESS: 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    DONE: 'bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-400',
  }[statusKey] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';

  const priorityClass = {
    LOW: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  }[priorityKey] || 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';

  const priorityEdgeColor = {
    LOW: 'before:bg-green-500',
    MEDIUM: 'before:bg-yellow-500',
    HIGH: 'before:bg-red-500',
  }[priorityKey] || 'before:bg-yellow-500';

  const cardClass = `group relative bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-neutral-700 hover:shadow-md cursor-pointer overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${priorityEdgeColor}`;

  const isDone = statusKey === 'DONE';

  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    e.dataTransfer.setData('taskId', String(task.id));
  };

  return (
    <article 
      className={cardClass} 
      id={`task-card-${task.id}`} 
      onClick={() => onEdit(task)}
      draggable
      onDragStart={handleDragStart}
    >

      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className={`text-sm font-semibold leading-snug flex-1 ${isDone ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-900 dark:text-gray-100'}`}>
          {task.title}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button
            id={`edit-task-${task.id}`}
            className="p-1.5 rounded-md text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <Pencil size={14} />
          </button>
          <button
            id={`delete-task-${task.id}`}
            className="p-1.5 rounded-md text-slate-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${isDone ? 'text-slate-400 dark:text-gray-500' : 'text-slate-500 dark:text-gray-400'}`}>
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusClass}`}>
            {STATUS_LABELS[statusKey]}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${priorityClass}`}>
            {PRIORITY_LABELS[priorityKey]}
          </span>
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-1 text-[10px] font-medium ${overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-gray-400'}`}>
            {overdue ? <Clock size={12} /> : <Calendar size={12} />}
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>

    </article>
  );
}

import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { Task, TaskStatus } from '../types';

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  Icon: React.ElementType;
  headerClass: string;
  columnTasks: Task[];
  setModalTask: (task: Task | null) => void;
  handleDelete: (id: number | string) => void;
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
}

export default function KanbanColumn({
  status,
  label,
  Icon,
  headerClass,
  columnTasks,
  setModalTask,
  handleDelete,
  onDropTask,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && onDropTask) {
      onDropTask(taskId, status);
    }
  };

  return (
    <div 
      className="flex flex-col gap-4 min-h-[200px]" 
      id={`column-${status.toLowerCase()}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 ${headerClass}`}>
        <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
          <Icon size={16} />
          <span>{label}</span>
        </div>
        <span className="bg-white/60 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{columnTasks.length}</span>
      </div>

      {/* Task Cards */}
      {columnTasks.length === 0 ? (
        <div className="text-center py-10 px-4 text-slate-500 dark:text-gray-400 bg-white dark:bg-neutral-900 border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-xl">
          <div className="text-3xl mb-2 opacity-50">📋</div>
          <p className="font-semibold text-slate-600 dark:text-gray-300 mb-1">No tasks here</p>
          <p className="text-xs">
            {status === 'TODO'
              ? 'Click "Add task" to add one'
              : 'Move tasks here to track progress'}
          </p>
        </div>
      ) : (
        columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(t) => setModalTask(t)}
            onDelete={handleDelete}
          />
        ))
      )}

      {/* Quick-add shortcut for the TODO column */}
      {status === 'TODO' && (
        <button
          id="quick-add-task-btn"
          className="w-full flex items-center justify-start gap-2 px-4 py-3 text-sm font-medium text-slate-500 dark:text-gray-400 bg-transparent border-2 border-dashed border-slate-200 dark:border-neutral-700 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 hover:text-slate-700 dark:hover:text-gray-200 hover:border-slate-300 dark:hover:border-neutral-600 transition-colors"
          onClick={() => setModalTask(null)}
        >
          <Plus size={16} />
          Add task
        </button>
      )}
    </div>
  );
}

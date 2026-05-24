import { Task } from '../types';
import { STATUSES, COLUMN_META, TaskStatus } from '../constants';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  getTasksByStatus: (status: TaskStatus) => Task[];
  setModalTask: (task: Task | null) => void;
  requestDelete: (id: number | string) => void;
  handleDropTask: (taskId: string, newStatus: TaskStatus) => void;
}

export default function KanbanBoard({
  getTasksByStatus,
  setModalTask,
  requestDelete,
  handleDropTask,
}: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start" id="kanban-board">
      {STATUSES.map((status) => {
        const meta = COLUMN_META[status];
        const columnTasks = getTasksByStatus(status);

        return (
          <KanbanColumn
            key={status}
            status={status}
            label={meta.label}
            Icon={meta.Icon}
            headerClass={meta.headerClass}
            columnTasks={columnTasks}
            setModalTask={setModalTask}
            handleDelete={requestDelete}
            onDropTask={handleDropTask}
          />
        );
      })}
    </div>
  );
}

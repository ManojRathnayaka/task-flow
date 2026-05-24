import { useState } from 'react';
import {
  Plus, ListTodo, Clock, CheckCircle2,
  RefreshCw, AlertCircle, BarChart2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import StatCard from '../components/StatCard';
import KanbanColumn from '../components/KanbanColumn';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

const COLUMN_META = {
  TODO: {
    label: 'To Do',
    Icon: ListTodo,
    headerClass: 'bg-slate-100 border border-slate-200 text-slate-700',
    color: '#64748b',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    Icon: Clock,
    headerClass: 'bg-blue-50 border border-blue-200 text-blue-700',
    color: '#3b82f6',
  },
  DONE: {
    label: 'Done',
    Icon: CheckCircle2,
    headerClass: 'bg-green-50 border border-green-200 text-green-700',
    color: '#22c55e',
  },
};

const FILTER_OPTIONS = [
  { key: 'ALL',    label: 'All' },
  { key: 'LOW',    label: '🟢 Low' },
  { key: 'MEDIUM', label: '🟡 Medium' },
  { key: 'HIGH',   label: '🔴 High' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const {
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
  } = useTasks();

  const [modalTask, setModalTask] = useState(undefined); // undefined = closed, null = new, obj = edit

  const handleDropTask = (taskId, newStatus) => {
    const taskToUpdate = tasks.find((t) => String(t.id) === String(taskId));
    if (taskToUpdate && taskToUpdate.status !== newStatus) {
      handleUpdate(taskToUpdate.id, {
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        status: newStatus,
        priority: taskToUpdate.priority,
        dueDate: taskToUpdate.dueDate,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" id="dashboard-page">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-8 max-w-7xl mx-auto w-full">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-slate-500 text-sm mb-1">
              Good {getTimeOfDay()}, <strong className="text-slate-700">{user?.username}</strong> 👋
            </p>
            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          </div>

          <button
            id="new-task-btn"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            onClick={() => setModalTask(null)}
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            Icon={BarChart2}
            value={stats.total}
            label="Total Tasks"
            color="text-slate-600"
            bg="bg-slate-100"
            id="stat-total"
          />
          <StatCard
            Icon={ListTodo}
            value={stats.todo}
            label="To Do"
            color="text-slate-600"
            bg="bg-slate-100"
            id="stat-todo"
          />
          <StatCard
            Icon={Clock}
            value={stats.inProgress}
            label="In Progress"
            color="text-blue-600"
            bg="bg-blue-100"
            id="stat-in-progress"
          />
          <StatCard
            Icon={CheckCircle2}
            value={stats.done}
            label="Done"
            color="text-green-600"
            bg="bg-green-100"
            id="stat-done"
          />
          {/* Progress bar card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center gap-2 shadow-sm col-span-2 lg:col-span-1" id="stat-progress">
            <div className="w-full flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500">Completion</span>
              <span className="text-sm font-bold text-green-600">{donePercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${donePercent}%` }} 
              />
            </div>
          </div>
        </div>

        {/* ── Priority Filter ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6" id="priority-filters">
          {FILTER_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              id={`filter-${key.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                priorityFilter === key 
                  ? 'bg-blue-100 text-blue-700 border-blue-200 font-semibold' 
                  : 'bg-white text-slate-600 border-slate-200 font-medium hover:bg-slate-50'
              }`}
              onClick={() => setPriorityFilter(key)}
            >
              {label}
            </button>
          ))}

          <button
            id="refresh-tasks-btn"
            className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            onClick={fetchTasks}
            title="Refresh"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2" id="dashboard-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 text-sm font-medium">Loading tasks...</p>
          </div>
        ) : (
          /* ── Kanban Board ── */
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
                  color={meta.color}
                  columnTasks={columnTasks}
                  setModalTask={setModalTask}
                  handleDelete={handleDelete}
                  onDropTask={handleDropTask}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* ── Task Modal ── */}
      {modalTask !== undefined && (
        <TaskForm
          task={modalTask}
          onSubmit={modalTask ? (formData) => handleUpdate(modalTask.id, formData) : handleCreate}
          onClose={() => setModalTask(undefined)}
        />
      )}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

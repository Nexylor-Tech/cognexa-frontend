import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, Trash2, Edit2, LayoutList, Kanban as KanbanIcon, X } from 'lucide-react';
import type { Task, Project } from '../types';
import { dataApi } from '../services/api';
import { TaskStorage } from '../lib/storage';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, type DragStartEvent, type DragEndEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskViewProps {
  project: Project;
  tasks: Task[];
  onNewTask: () => void;
  onTaskUpdate: () => void;
}

// Separate component for draggable items
const SortableTaskCard = ({ task, isKanban, onStatusToggle, onDelete, onEdit, onAdvance }: {
  task: Task;
  isKanban: boolean;
  onStatusToggle: (e: React.MouseEvent, task: Task) => void;
  onDelete: (e: React.MouseEvent, taskId: string) => void;
  onEdit: (e: React.MouseEvent, task: Task) => void;
  onAdvance: (task: Task) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    disabled: !isKanban // Only draggable in Kanban
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={isKanban ? () => onAdvance(task) : undefined}
      className={`bg-surface rounded border border-overlay hover:border-muted transition-colors flex items-center justify-between group relative select-none
                ${isKanban ? 'p-4 cursor-grab active:cursor-grabbing hover:bg-overlay/20' : 'p-2'}`}
    >
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={(e) => onStatusToggle(e, task)}
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
          className={`p-1 rounded-full border-2 transition-colors shrink-0 z-10 cursor-pointer
                    ${task.status === 'done' ? 'bg-foam border-foam text-surface' : 'border-muted text-transparent hover:border-foam'}`}
          title={task.status === 'done' ? "Mark as Todo" : "Mark as Done"}
        >
          <CheckCircle size={isKanban ? 16 : 14} />
        </button>

        <div className="grow min-w-0">
          <h3 className={`font-medium truncate ${task.status === 'done' ? 'text-muted line-through' : 'text-text'} ${!isKanban ? 'text-sm' : ''}`}>
            {task.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-subtle mt-0.5">
            <span className={`px-1.5 py-0.5 rounded-full uppercase text-[9px] font-bold 
                                            ${task.priority === 'high' ? 'bg-love/20 text-love' :
                task.priority === 'medium' ? 'bg-gold/20 text-gold' :
                  'bg-foam/20 text-foam'}`
            }>
              {task.priority}
            </span>
            {task.deadline && (
              <span className="flex items-center gap-1">
                <Clock size={10} /> {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-surface pl-2 shadow-sm rounded">
        <button
          onClick={(e) => onEdit(e, task)}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1.5 text-subtle hover:text-iris hover:bg-overlay rounded transition-colors cursor-pointer"
          title="Edit"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={(e) => onDelete(e, task.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1.5 text-subtle hover:text-love hover:bg-overlay rounded transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

const KanbanColumn = ({ status, title, colorClass, count, tasks, onStatusToggle, onDelete, onEdit, onAdvance }: {
  status: 'todo' | 'in_progress' | 'done';
  title: string;
  colorClass: string;
  count: number;
  tasks: Task[];
  onStatusToggle: (e: React.MouseEvent, task: Task) => void;
  onDelete: (e: React.MouseEvent, taskId: string) => void;
  onEdit: (e: React.MouseEvent, task: Task) => void;
  onAdvance: (task: Task) => void;
}) => {
  const { setNodeRef } = useDroppable({
    id: `container-${status}`,
  });

  return (
    <div className="flex flex-col h-full bg-surface/30 rounded-lg p-2 border border-overlay/50">
      <div className="flex items-center gap-2 mb-4 p-2">
        <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        <h3 className="font-bold text-text">{title}</h3>
        <span className="text-xs bg-overlay text-subtle px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex-1 space-y-3 overflow-y-auto p-2 min-h-25">
          {tasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              isKanban={true}
              onStatusToggle={onStatusToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onAdvance={onAdvance}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};


export const TaskView: React.FC<TaskViewProps> = ({ project, tasks, onNewTask, onTaskUpdate }) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [localTasks, setLocalTasks] = useState<Task[]>(() => {
    return tasks;
  });

  // Sync with parent tasks when they update
  React.useEffect(() => {
    setLocalTasks(tasks);
    TaskStorage.saveTasks(project.id, tasks);
  }, [tasks, project.id]);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState<{ title: string; priority: 'low' | 'medium' | 'high'; status: 'todo' | 'in_progress' | 'done'; deadline: string }>({
    title: '',
    priority: 'medium',
    status: 'todo',
    deadline: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Start dragging after 5px movement
      },
    })
  );

  const handleStatusToggle = async (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();

    // Optimistic Update
    const newStatus: 'todo' | 'in_progress' | 'done' = task.status === 'done' ? 'todo' : 'done';
    const updatedTask = { ...task, status: newStatus };

    const newTasks = localTasks.map(t => t.id === task.id ? updatedTask : t);
    setLocalTasks(newTasks);
    TaskStorage.saveTasks(project.id, newTasks);

    try {
      await dataApi.updateTask(project.id, task.id, { status: newStatus });
      onTaskUpdate();
    } catch (error) {
      console.error("Failed to update task status:", error);
      setLocalTasks(localTasks);
      TaskStorage.saveTasks(project.id, localTasks);
    }
  };

  const handleAdvanceStatus = async (task: Task) => {
    const statusCycle: Record<string, 'todo' | 'in_progress' | 'done'> = {
      'todo': 'in_progress',
      'in_progress': 'done',
      'done': 'todo'
    };
    const newStatus = statusCycle[task.status] || 'todo';

    // Optimistic Update
    const updatedTask = { ...task, status: newStatus };
    const newTasks = localTasks.map(t => t.id === task.id ? updatedTask : t);
    setLocalTasks(newTasks);
    TaskStorage.saveTasks(project.id, newTasks);

    try {
      await dataApi.updateTask(project.id, task.id, { status: newStatus });
      onTaskUpdate();
    } catch (error) {
      console.error("Failed to advance task status:", error);
      setLocalTasks(localTasks);
      TaskStorage.saveTasks(project.id, localTasks);
    }
  };

  const handleDelete = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this task?")) {
      const previousTasks = [...localTasks];
      const newTasks = localTasks.filter(t => t.id !== taskId);
      setLocalTasks(newTasks);
      TaskStorage.saveTasks(project.id, newTasks);

      try {
        await dataApi.deleteTask(project.id, taskId);
        onTaskUpdate();
      } catch (error) {
        console.error("Failed to delete task:", error);
        setLocalTasks(previousTasks);
        TaskStorage.saveTasks(project.id, previousTasks);
      }
    }
  };

  const openEditModal = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setEditingTask(task);
    setEditForm({
      title: task.title,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!editForm.title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    const updatedTask = {
      ...editingTask,
      title: editForm.title,
      priority: editForm.priority,
      status: editForm.status,
      deadline: editForm.deadline ? new Date(editForm.deadline) : undefined
    };

    const previousTasks = [...localTasks];
    const newTasks = localTasks.map(t => t.id === editingTask.id ? updatedTask : t);
    setLocalTasks(newTasks);
    TaskStorage.saveTasks(project.id, newTasks);
    setEditingTask(null);

    try {
      await dataApi.updateTask(project.id, editingTask.id, {
        title: editForm.title,
        priority: editForm.priority,
        status: editForm.status,
        deadline: editForm.deadline ? new Date(editForm.deadline) : undefined
      });
      onTaskUpdate();
    } catch (error) {
      console.error("Failed to update task:", error);
      setLocalTasks(previousTasks);
      TaskStorage.saveTasks(project.id, previousTasks);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = localTasks.find(t => t.id === activeId);
    if (!activeTask) return;

    let newStatus: 'todo' | 'in_progress' | 'done' | undefined;

    // Check if over a container
    if (overId.startsWith('container-')) {
      newStatus = overId.replace('container-', '') as 'todo' | 'in_progress' | 'done';
    } else {
      // Dropped on another task
      const overTask = localTasks.find(t => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus && newStatus !== activeTask.status) {
      // Optimistic Update
      const updatedTask = { ...activeTask, status: newStatus };
      const previousTasks = [...localTasks];
      const newTasks = localTasks.map(t => t.id === activeTask.id ? updatedTask : t);

      setLocalTasks(newTasks);
      TaskStorage.saveTasks(project.id, newTasks);

      try {
        await dataApi.updateTask(project.id, activeTask.id, { status: newStatus });
        onTaskUpdate();
      } catch (error) {
        console.error("Failed to move task:", error);
        setLocalTasks(previousTasks);
        TaskStorage.saveTasks(project.id, previousTasks);
      }
    }
  };

  // Use localTasks for rendering
  const todoTasks = localTasks.filter(t => t.status === 'todo');
  const inProgressTasks = localTasks.filter(t => t.status === 'in_progress');
  const doneTasks = localTasks.filter(t => t.status === 'done');

  const activeDragTask = activeDragId ? localTasks.find(t => t.id === activeDragId) : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Project Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text mb-2">Tasks</h2>
          <p className="text-subtle">Manage tasks for {project.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface border border-overlay rounded p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-overlay text-text' : 'text-subtle hover:text-text'}`}
              title="List View"
            >
              <LayoutList size={20} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-overlay text-text' : 'text-subtle hover:text-text'}`}
              title="Kanban View"
            >
              <KanbanIcon size={20} />
            </button>
          </div>
          <button
            onClick={onNewTask}
            className="bg-love text-surface px-4 py-2 rounded flex items-center gap-2 hover:bg-rose transition-colors"
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="space-y-3 max-w-4xl mx-auto">
          {localTasks.length === 0 && (
            <div className="text-center py-10 bg-overlay/30 rounded border border-dashed border-muted text-muted">
              No tasks found. Create one to get moving!
            </div>
          )}
          {localTasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              isKanban={false}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
              onEdit={openEditModal}
              onAdvance={handleAdvanceStatus}
            />
          ))}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
            <KanbanColumn
              status="todo"
              title="To Do"
              colorClass="bg-subtle"
              count={todoTasks.length}
              tasks={todoTasks}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
              onEdit={openEditModal}
              onAdvance={handleAdvanceStatus}
            />
            <KanbanColumn
              status="in_progress"
              title="In Progress"
              colorClass="bg-gold"
              count={inProgressTasks.length}
              tasks={inProgressTasks}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
              onEdit={openEditModal}
              onAdvance={handleAdvanceStatus}
            />
            <KanbanColumn
              status="done"
              title="Done"
              colorClass="bg-foam"
              count={doneTasks.length}
              tasks={doneTasks}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
              onEdit={openEditModal}
              onAdvance={handleAdvanceStatus}
            />
          </div>

          <DragOverlay>
            {activeDragTask ? (
              <div className="bg-surface rounded border border-overlay shadow-xl p-4 flex items-center justify-between opacity-80 rotate-2 w-75">
                <div className="flex items-center gap-3 w-full">
                  <button className={`p-1 rounded-full border-2 ${activeDragTask.status === 'done' ? 'bg-foam border-foam text-surface' : 'border-muted text-transparent'}`}>
                    <CheckCircle size={16} />
                  </button>
                  <div className="grow min-w-0">
                    <h3 className="font-medium truncate text-text">{activeDragTask.title}</h3>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-base/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-overlay p-6 rounded-lg shadow-xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setEditingTask(null)}
              className="absolute right-4 top-4 text-subtle hover:text-text"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-text mb-4">Edit Task</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-subtle mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-overlay border border-muted rounded p-2 text-text focus:border-iris focus:outline-none"
                  placeholder="Task title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-subtle mb-1">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={e => setEditForm({ ...editForm, priority: e.target.value as any })}
                    className="w-full bg-overlay border border-muted rounded p-2 text-text focus:border-iris focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-subtle mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full bg-overlay border border-muted rounded p-2 text-text focus:border-iris focus:outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-subtle mb-1">Deadline</label>
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={e => setEditForm({ ...editForm, deadline: e.target.value })}
                  className="w-full bg-overlay border border-muted rounded p-2 text-text focus:border-iris focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-subtle hover:text-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-love text-surface px-4 py-2 rounded hover:bg-rose transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

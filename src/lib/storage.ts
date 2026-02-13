import type { Task } from '../types';

const STORAGE_KEY_PREFIX = 'cognexa_project_tasks_';

export const TaskStorage = {
  getTasks: (projectId: string): Task[] | null => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${projectId}`);
      if (!stored) return null;
      //Parse dates back to Date objects
      return JSON.parse(stored, (key, value) => {
        if (key === 'deadline' || key === 'createdAt') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
    } catch (e) {
      console.error("Failed to load tasks from storage", e);
      return null;
    }
  },

  saveTasks: (projectId: string, tasks: Task[]) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${projectId}`, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to storage", e);
    }
  },

  updateTask: (projectId: string, updatedTask: Task) => {
    const tasks = TaskStorage.getTasks(projectId) || [];
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      TaskStorage.saveTasks(projectId, tasks);
    }
    return tasks;
  },

  addTask: (projectId: string, newTask: Task) => {
    const tasks = TaskStorage.getTasks(projectId) || [];
    tasks.push(newTask);
    TaskStorage.saveTasks(projectId, tasks);
    return tasks;
  },

  deleteTask: (projectId: string, taskId: string) => {
    const tasks = TaskStorage.getTasks(projectId) || [];
    const newTasks = tasks.filter(t => t.id !== taskId);
    TaskStorage.saveTasks(projectId, newTasks);
    return newTasks;
  }
};

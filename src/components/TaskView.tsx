import React from 'react';
import { Plus, CheckCircle, Clock } from 'lucide-react';
import type { Task, Project } from '../types';

interface TaskViewProps {
  project: Project;
  tasks: Task[];
  onNewTask: () => void;
}

export const TaskView: React.FC<TaskViewProps> = ({ project, tasks, onNewTask }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Project Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text mb-2">Tasks</h2>
          <p className="text-subtle">Manage tasks for {project.name}</p>
        </div>
        <button
          onClick={onNewTask}
          className="bg-love text-surface px-4 py-2 rounded flex items-center gap-2 hover:bg-rose transition-colors"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-center py-10 bg-overlay/30 rounded border border-dashed border-muted text-muted">
            No tasks found. Create one to get moving!
          </div>
        )}
        {tasks.map(task => (
          <div key={task.id} className="bg-surface p-4 rounded border border-overlay hover:border-muted transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <button className={`p-1 rounded-full border-2 ${task.status === 'done' ? 'bg-foam border-foam text-surface' : 'border-muted text-transparent hover:border-foam'}`}>
                <CheckCircle size={16} />
              </button>
              <div>
                <h3 className={`font-medium ${task.status === 'done' ? 'text-muted line-through' : 'text-text'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-subtle mt-1">
                  <span className={`px-2 py-0.5 rounded-full uppercase text-[10px] font-bold 
                                        ${task.priority === 'high' ? 'bg-love/20 text-love' :
                      task.priority === 'medium' ? 'bg-gold/20 text-gold' :
                        'bg-foam/20 text-foam'}`
                  }>
                    {task.priority}
                  </span>
                  {task.deadline && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Actions placeholder */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

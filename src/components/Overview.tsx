import React, { useMemo } from 'react';
import { BarChart, Clock, CheckCircle, AlertCircle, UserPlus, FilePlus } from 'lucide-react';
import type { Project, Task, ProjectMember } from '../types';

interface OverviewProps {
  project: Project;
  tasks: Task[];
  members: ProjectMember[];
}

export const Overview: React.FC<OverviewProps> = ({ tasks, members }) => {
  // Calculate Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    return { total, done, inProgress, todo };
  }, [tasks]);

  // Generate Activity Feed (Mocked from existing data)
  const activities = useMemo(() => {
    const events: { id: string; type: 'task' | 'member'; date: Date; text: string; icon: React.ReactNode }[] = [];

    tasks.forEach(task => {
      events.push({
        id: `task-${task.id}`,
        type: 'task',
        date: new Date(task.createdAt),
        text: `Task created: ${task.title}`,
        icon: <FilePlus size={16} className="text-iris" />
      });
    });

    members.forEach(member => {
      events.push({
        id: `member-${member.id}`,
        type: 'member',
        date: new Date(member.joinedAt),
        text: `${member.user.name} joined the project as ${member.role}`,
        icon: <UserPlus size={16} className="text-pine" />
      });
    });

    return events.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }, [tasks, members]);

  // Simple Graph Data
  const maxVal = stats.total || 1;
  const getPercent = (val: number) => Math.round((val / maxVal) * 100);

  return (
    <div className="max-w-5xl mx-auto p-2">
      <h2 className="text-3xl font-bold text-text mb-6">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-surface p-6 rounded-xl border border-overlay shadow-sm flex items-center gap-4">
          <div className="p-3 bg-foam/20 rounded-lg text-foam">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-subtle">Completed</p>
            <p className="text-2xl font-bold text-text">{stats.done}</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-overlay shadow-sm flex items-center gap-4">
          <div className="p-3 bg-gold/20 rounded-lg text-gold">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-subtle">In Progress</p>
            <p className="text-2xl font-bold text-text">{stats.inProgress}</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-overlay shadow-sm flex items-center gap-4">
          <div className="p-3 bg-love/20 rounded-lg text-love">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-subtle">To Do</p>
            <p className="text-2xl font-bold text-text">{stats.todo}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graph Section */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-overlay shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart size={20} className="text-subtle" />
            <h3 className="text-lg font-semibold text-text">Task Progress</h3>
          </div>
          
          <div className="space-y-6">
             {/* Progress Bars */}
             <div>
               <div className="flex justify-between text-sm mb-2">
                 <span className="text-text">Completed</span>
                 <span className="text-subtle">{stats.done} / {stats.total}</span>
               </div>
               <div className="h-3 bg-overlay rounded-full overflow-hidden">
                 <div className="h-full bg-foam transition-all duration-500" style={{ width: `${getPercent(stats.done)}%` }} />
               </div>
             </div>

             <div>
               <div className="flex justify-between text-sm mb-2">
                 <span className="text-text">In Progress</span>
                 <span className="text-subtle">{stats.inProgress} / {stats.total}</span>
               </div>
               <div className="h-3 bg-overlay rounded-full overflow-hidden">
                 <div className="h-full bg-gold transition-all duration-500" style={{ width: `${getPercent(stats.inProgress)}%` }} />
               </div>
             </div>

             <div>
               <div className="flex justify-between text-sm mb-2">
                 <span className="text-text">To Do</span>
                 <span className="text-subtle">{stats.todo} / {stats.total}</span>
               </div>
               <div className="h-3 bg-overlay rounded-full overflow-hidden">
                 <div className="h-full bg-love transition-all duration-500" style={{ width: `${getPercent(stats.todo)}%` }} />
               </div>
             </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface p-6 rounded-xl border border-overlay shadow-sm">
          <h3 className="text-lg font-semibold text-text mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {activities.length === 0 && <p className="text-sm text-subtle">No recent activity.</p>}
            {activities.map((item, i) => (
              <div key={item.id} className="flex gap-3 relative">
                 {/* Connector Line */}
                 {i !== activities.length - 1 && (
                   <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-overlay" />
                 )}
                 <div className="relative z-10 bg-surface">
                   <div className="p-1.5 rounded-full bg-overlay/50 border border-muted/20">
                     {item.icon}
                   </div>
                 </div>
                 <div>
                   <p className="text-sm text-text font-medium">{item.text}</p>
                   <p className="text-xs text-subtle mt-1">{item.date.toLocaleDateString()} {item.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

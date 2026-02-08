import React from 'react';
import { TaskView } from './TaskView';
import { MemberView } from './MemberView';
import { Overview } from './Overview';
import type { Project, Task, ProjectMember, User } from '../types';

interface ProjectViewProps {
  project: Project;
  tasks: Task[];
  members: ProjectMember[];
  orgMembers: { user: User; role: string; joinedAt: string }[];
  activeTab: 'overview' | 'tasks' | 'files' | 'research';
  onNewTask: () => void;
  onInviteToOrg: () => void;
  onAddToProject: (userId: string) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ 
  project, 
  tasks, 
  members, 
  orgMembers,
  activeTab,
  onNewTask, 
  onInviteToOrg,
  onAddToProject
}) => {
  return (
    <div className="flex h-full flex-col">
       <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {activeTab === 'overview' && (
              <Overview project={project} tasks={tasks} members={members} />
            )}
            {activeTab === 'tasks' && (
              <TaskView 
                project={project} 
                tasks={tasks} 
                onNewTask={onNewTask} 
              />
            )}
            {activeTab === 'files' && (
              <div className="flex flex-col items-center justify-center h-full text-muted border-2 border-dashed border-overlay rounded-xl m-10">
                <p>Files module coming soon.</p>
              </div>
            )}
            {activeTab === 'research' && (
              <div className="flex flex-col items-center justify-center h-full text-muted border-2 border-dashed border-overlay rounded-xl m-10">
                 <p>Research module coming soon.</p>
              </div>
            )}
          </div>

          {/* Right Side Members View */}
          <div className="w-72 border-l border-overlay p-6 bg-surface/30 overflow-y-auto hidden xl:block">
            <MemberView 
              orgMembers={orgMembers}
              projectMembers={members}
              onInviteToOrg={onInviteToOrg} 
              onAddToProject={onAddToProject}
            />
          </div>
       </div>
    </div>
  );
};

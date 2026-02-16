import React from 'react';
import { TaskView } from './TaskView';
import { MemberView } from './MemberView';
import { Overview } from './Overview';
import { FileView } from './FileView';
import { Chatbot } from './Chatbot';
import type { Project, Task, ProjectMember, User, FileItem } from '../types';

interface ProjectViewProps {
  project: Project;
  tasks: Task[];
  members: ProjectMember[];
  files: FileItem[];
  orgMembers: { user: User; role: string; joinedAt: string }[];
  activeTab: 'overview' | 'tasks' | 'files' | 'research';
  onNewTask: () => void;
  onInviteToOrg: () => void;
  onAddToProject: (userId: string) => void;
  onFileUploaded: () => void;
  onTaskUpdate: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  project,
  tasks,
  members,
  files,
  orgMembers,
  activeTab,
  onNewTask,
  onInviteToOrg,
  onAddToProject,
  onFileUploaded,
  onTaskUpdate
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
              onTaskUpdate={onTaskUpdate}
            />
          )}
          {activeTab === 'files' && (
            <FileView
              projectId={project.id}
              files={files}
              onFileUploaded={onFileUploaded}
            />
          )}
          {activeTab === 'research' && (
            <Chatbot projectId={project.id} />
          )}
        </div>

        {/* Right Side Members View */}
        <div className="border-l border-overlay bg-surface/30 hidden xl:block">
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

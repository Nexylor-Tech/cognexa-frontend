import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import { ProjectView } from '../components/ProjectView';
import type { User, Organization, Project, Task, ProjectMember, FileItem } from '../types';
import { authApi, dataApi } from '../services/api';
import { LayoutDashboard, CheckSquare, FileText, Search } from 'lucide-react';

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'files' | 'research'>('overview');

  // Modals state
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showInviteOrgModal, setShowInviteOrgModal] = useState(false);
  const [showAddToProjectModal, setShowAddToProjectModal] = useState(false);

  // Form state
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSlug, setNewOrgSlug] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  // Invite state
  const [orgMembers, setOrgMembers] = useState<any[]>([]); 
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  
  // Add to Project State
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedProjectRole, setSelectedProjectRole] = useState('viewer');

  // Initial Load
  useEffect(() => {
    loadOrganizations();
  }, []);

  // When Org Changes, load projects and org members
  useEffect(() => {
    if (currentOrg) {
      loadProjects(currentOrg.id);
      loadOrgMembers(currentOrg.id);
    } else {
      setProjects([]);
      setCurrentProject(null);
      setTasks([]);
      setMembers([]);
      setFiles([]);
      setOrgMembers([]);
    }
  }, [currentOrg]);

  // When Project Changes, load tasks and members
  useEffect(() => {
    if (currentProject) {
      loadProjectDetails(currentProject.id);
      setActiveTab('overview'); // Reset tab on project switch
    } else {
      setTasks([]);
      setMembers([]);
      setFiles([]);
    }
  }, [currentProject]);

  const loadOrganizations = async () => {
    try {
      const orgs = await authApi.listOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0) {
        setCurrentOrg(orgs[0]);
      }
    } catch (error) {
      console.error("Failed to load organizations", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrgMembers = async (orgId: string) => {
    try {
      const members = await authApi.listOrganizationMembers(orgId);
      setOrgMembers(members || []);
    } catch (error) {
      console.error("Failed to load org members", error);
    }
  };

  const loadProjects = async (orgId: string) => {
    try {
      const projs = await dataApi.getProjectsByOrg(orgId);
      setProjects(projs);
      if (projs.length > 0) {
        const currentProjectExists = currentProject && projs.some(p => p.id === currentProject.id);
        if (!currentProject || !currentProjectExists) {
          setCurrentProject(projs[0]);
        }
      } else {
        setCurrentProject(null);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  const loadProjectDetails = async (projectId: string) => {
    try {
      // Parallel fetch for details and files
      const [projectDetails, projectFiles] = await Promise.all([
        dataApi.getProject(projectId),
        dataApi.getFiles(projectId)
      ]);
      setTasks(projectDetails.tasks || []);
      setMembers(projectDetails.members || []);
      setFiles(projectFiles || []);
    } catch (error) {
      console.error("Failed to load project details", error);
    }
  }

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const org = await authApi.createOrganization(newOrgName, newOrgSlug);
      setOrganizations([...organizations, org]);
      setCurrentOrg(org);
      setShowNewOrgModal(false);
      setNewOrgName('');
      setNewOrgSlug('');
    } catch (error) {
      alert("Failed to create organization");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrg) return;
    try {
      const project = await dataApi.createProject(newProjectName, currentOrg.id);
      setProjects([...projects, project]);
      setCurrentProject(project);
      setShowNewProjectModal(false);
      setNewProjectName('');
    } catch (error) {
      alert("Failed to create project");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    try {
      const task = await dataApi.createTask(currentProject.id, newTaskTitle, newTaskDeadline, newTaskPriority);
      setTasks([...tasks, task]);
      setShowNewTaskModal(false);
      setNewTaskTitle('');
      setNewTaskDeadline('');
    } catch (error) {
      alert("Failed to create task");
    }
  }

  const handleInviteToOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrg) return;
    try {
      await authApi.inviteToOrganization(inviteEmail, inviteRole, currentOrg.id);
      alert("Invitation sent!");
      setShowInviteOrgModal(false);
      setInviteEmail('');
    } catch (error) {
      alert("Failed to invite member to organization");
    }
  };

  const handleAddToProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !selectedUserId) return;
    try {
      await dataApi.inviteMember(currentProject.id, selectedUserId, selectedProjectRole);
      // Reload details to show new member
      loadProjectDetails(currentProject.id);
      setShowAddToProjectModal(false);
      setSelectedUserId('');
    } catch (error) {
      alert("Failed to add member to project");
    }
  }

  const onSelectProject = async (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      setCurrentProject(proj);
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-base text-text">Loading Dashboard...</div>;

  return (
    <div className="flex h-screen bg-base text-text font-sans">
      <Sidebar
        organizations={organizations}
        currentOrg={currentOrg}
        projects={projects}
        onSwitchOrg={(id) => {
          const org = organizations.find(o => o.id === id);
          if (org) setCurrentOrg(org);
        }}
        onCreateOrg={() => setShowNewOrgModal(true)}
        onCreateProject={() => setShowNewProjectModal(true)}
        onSelectProject={onSelectProject}
        currentProjectId={currentProject?.id}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 border-b border-overlay flex items-center justify-between px-6 bg-surface/50 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-rose mr-4">
              {currentProject ? currentProject.name : 'Dashboard'}
            </h1>
            
            {/* Top Navigation for Projects */}
            {currentProject && (
              <nav className="flex items-center gap-1 h-16">
                 <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-3 h-full border-b-2 transition-colors text-sm font-medium
                        ${activeTab === 'overview' ? 'border-iris text-iris' : 'border-transparent text-subtle hover:text-text hover:bg-overlay/30'}`}
                 >
                   <LayoutDashboard size={16} /> Overview
                 </button>
                 <button 
                    onClick={() => setActiveTab('tasks')}
                    className={`flex items-center gap-2 px-3 h-full border-b-2 transition-colors text-sm font-medium
                        ${activeTab === 'tasks' ? 'border-iris text-iris' : 'border-transparent text-subtle hover:text-text hover:bg-overlay/30'}`}
                 >
                   <CheckSquare size={16} /> Tasks
                 </button>
                 <button 
                    onClick={() => setActiveTab('files')}
                    className={`flex items-center gap-2 px-3 h-full border-b-2 transition-colors text-sm font-medium
                        ${activeTab === 'files' ? 'border-iris text-iris' : 'border-transparent text-subtle hover:text-text hover:bg-overlay/30'}`}
                 >
                   <FileText size={16} /> Files
                 </button>
                 <button 
                    onClick={() => setActiveTab('research')}
                    className={`flex items-center gap-2 px-3 h-full border-b-2 transition-colors text-sm font-medium
                        ${activeTab === 'research' ? 'border-iris text-iris' : 'border-transparent text-subtle hover:text-text hover:bg-overlay/30'}`}
                 >
                   <Search size={16} /> Research
                 </button>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-subtle hidden md:block">Welcome, {user.name}</span>
            <ThemeToggle />
            <button onClick={onSignOut} className="text-sm text-love hover:underline">Sign Out</button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {!currentOrg ? (
            <div className="flex flex-col items-center justify-center h-full text-muted">
              <p className="mb-4">You don't have any organizations yet.</p>
              <button onClick={() => setShowNewOrgModal(true)} className="bg-pine text-surface px-4 py-2 rounded shadow hover:bg-foam transition-colors">
                Create Organization
              </button>
            </div>
          ) : !currentProject ? (
            <div className="flex flex-col items-center justify-center h-full text-muted">
              <p className="mb-4">Select or create a project to get started.</p>
              <button onClick={() => setShowNewProjectModal(true)} className="bg-iris text-surface px-4 py-2 rounded shadow hover:bg-gold transition-colors">
                Create Project
              </button>
            </div>
          ) : (
            <ProjectView
              project={currentProject}
              tasks={tasks}
              members={members}
              files={files}
              orgMembers={orgMembers}
              activeTab={activeTab}
              onNewTask={() => setShowNewTaskModal(true)}
              onInviteToOrg={() => setShowInviteOrgModal(true)}
              onAddToProject={(userId) => {
                setSelectedUserId(userId);
                setShowAddToProjectModal(true);
              }}
              onFileUploaded={() => loadProjectDetails(currentProject.id)}
            />
          )}
        </div>

        {/* Modals */}
        {showNewOrgModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm">
            <div className="bg-surface p-6 rounded-lg shadow-xl border border-overlay w-full max-w-md">
              <h3 className="text-xl font-bold text-text mb-4">Create Organization</h3>
              <form onSubmit={handleCreateOrg}>
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={newOrgName}
                  onChange={e => setNewOrgName(e.target.value)}
                  className="w-full bg-overlay border border-muted/30 rounded p-2 text-text mb-4 focus:outline-none focus:border-iris"
                  required
                />
                <input
                  type="text"
                  placeholder="e.g., my-company"
                  value={newOrgSlug}
                  onChange={e => setNewOrgSlug(e.target.value)}
                  className="w-full bg-overlay border border-muted/30 rounded p-2 text-text mb-4 focus:outline-none focus:border-iris"
                  title="URL Identifier"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowNewOrgModal(false)} className="px-4 py-2 text-subtle hover:text-text">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-pine text-surface rounded hover:bg-foam">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showNewProjectModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm">
            <div className="bg-surface p-6 rounded-lg shadow-xl border border-overlay w-full max-w-md">
              <h3 className="text-xl font-bold text-text mb-4">Create Project</h3>
              <form onSubmit={handleCreateProject}>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  className="w-full bg-overlay border border-muted/30 rounded p-2 text-text mb-4 focus:outline-none focus:border-iris"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowNewProjectModal(false)} className="px-4 py-2 text-subtle hover:text-text">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-iris text-surface rounded hover:bg-gold">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showNewTaskModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm">
            <div className="bg-surface p-6 rounded-lg shadow-xl border border-overlay w-full max-w-md">
              <h3 className="text-xl font-bold text-text mb-4">New Task</h3>
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    className="w-full bg-overlay border border-muted/30 rounded p-2 text-text focus:outline-none focus:border-iris"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-subtle mb-1">Deadline</label>
                      <input
                        type="date"
                        value={newTaskDeadline}
                        onChange={e => setNewTaskDeadline(e.target.value)}
                        className="w-full bg-overlay border border-muted/30 rounded p-2 text-text focus:outline-none focus:border-iris"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-subtle mb-1">Priority</label>
                      <select
                        value={newTaskPriority}
                        onChange={e => setNewTaskPriority(e.target.value)}
                        className="w-full bg-overlay border border-muted/30 rounded p-2 text-text focus:outline-none focus:border-iris"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" onClick={() => setShowNewTaskModal(false)} className="px-4 py-2 text-subtle hover:text-text">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-love text-surface rounded hover:bg-rose">Add Task</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showInviteOrgModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm">
            <div className="bg-surface p-6 rounded-lg shadow-xl border border-overlay w-full max-w-md">
              <h3 className="text-xl font-bold text-text mb-4">Invite to Organization</h3>
              <form onSubmit={handleInviteToOrg}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-subtle mb-1">Email Address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className="w-full bg-overlay border border-muted/30 rounded p-2 text-text focus:outline-none focus:border-iris"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-subtle mb-1">Role</label>
                    <select
                      value={inviteRole}
                      onChange={e => setInviteRole(e.target.value)}
                      className="w-full bg-overlay border border-muted/30 rounded p-2 text-text focus:outline-none focus:border-iris"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" onClick={() => setShowInviteOrgModal(false)} className="px-4 py-2 text-subtle hover:text-text">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-pine text-surface rounded hover:bg-foam">Send Invitation</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddToProjectModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm">
            <div className="bg-surface p-6 rounded-lg shadow-xl border border-overlay w-full max-w-md">
              <h3 className="text-xl font-bold text-text mb-4">Add Member to Project</h3>
              <form onSubmit={handleAddToProject}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-subtle mb-1">Role</label>
                    <select
                      value={selectedProjectRole}
                      onChange={e => setSelectedProjectRole(e.target.value)}
                      className="w-full bg-overlay border border-muted/30 rounded p-2 text-text focus:outline-none focus:border-iris"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <p className="text-xs text-subtle">
                    This will add the selected user to the current project.
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" onClick={() => setShowAddToProjectModal(false)} className="px-4 py-2 text-subtle hover:text-text">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-iris text-surface rounded hover:bg-gold">Add to Project</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

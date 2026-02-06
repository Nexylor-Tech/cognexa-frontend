import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import type { User, Organization, Project, Task } from '../types';
import { authApi, dataApi } from '../services/api';
import { Plus, CheckCircle, Clock } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Form state
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSlug, setNewOrgSlug] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  // Initial Load
  useEffect(() => {
    loadOrganizations();
  }, []);

  // When Org Changes, load projects
  useEffect(() => {
    if (currentOrg) {
      loadProjects(currentOrg.id);
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [currentOrg]);

  // When Project Changes, load tasks
  useEffect(() => {
    if (currentProject) {
      loadTasks(currentProject.id);
    } else {
      setTasks([]);
    }
  }, [currentProject]);

  const loadOrganizations = async () => {
    try {
      const orgs = await authApi.listOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0) {
        // Default to first org if none selected, or implement last visited logic
        setCurrentOrg(orgs[0]);
      }
    } catch (error) {
      console.error("Failed to load organizations", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async (orgId: string) => {
    try {
      const projs = await dataApi.getProjectsByOrg(orgId);
      setProjects(projs);
      if (projs.length > 0) {
        // Auto select first project if none selected
        if (!currentProject) onSelectProject(projs[0].id);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  const loadTasks = async (projectId: string) => {
    try {
      const projectDetails = await dataApi.getProject(projectId);
      // Backend returns project with tasks included in relation
      setTasks(projectDetails.tasks || []);
    } catch (error) {
      console.error("Failed to load tasks", error);
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
          <h1 className="text-xl font-bold text-rose">
            {currentProject ? currentProject.name : 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-subtle hidden md:block">Welcome, {user.name}</span>
            <ThemeToggle />
            <button onClick={onSignOut} className="text-sm text-love hover:underline">Sign Out</button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
            <div className="max-w-4xl mx-auto">
              {/* Project Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-text mb-2">Tasks</h2>
                  <p className="text-subtle">Manage tasks for {currentProject.name}</p>
                </div>
                <button
                  onClick={() => setShowNewTaskModal(true)}
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

      </main>
    </div>
  );
};


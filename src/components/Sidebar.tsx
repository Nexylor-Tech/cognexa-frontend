import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  FileText,
  Search,
  Settings,
  User,
  Plus,
  Briefcase
} from 'lucide-react';
import type { Organization, Project } from '../types';

interface SidebarProps {
  organizations: Organization[];
  currentOrg: Organization | null;
  projects: Project[];
  onSwitchOrg: (orgId: string) => void;
  onCreateOrg: () => void;
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
  currentProjectId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  organizations,
  currentOrg,
  projects,
  onSwitchOrg,
  onCreateOrg,
  onCreateProject,
  onSelectProject,
  currentProjectId
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Tasks', icon: Briefcase, id: 'tasks' },
    { label: 'Files', icon: FileText, id: 'files' },
    { label: 'Research', icon: Search, id: 'research' },
    { label: 'Settings', icon: Settings, id: 'settings' },
    { label: 'Profile', icon: User, id: 'profile' },
  ];

  return (
    <aside
      className={`
        bg-surface border-r border-overlay h-screen flex flex-col transition-all duration-300 relative
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-surface border border-overlay rounded-full p-1 text-subtle hover:text-text z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header / Org Switcher */}
      <div className="p-4 border-b border-overlay">
        <div className="flex items-center justify-between mb-2">
          {!collapsed && <span className="text-xs font-bold text-muted uppercase tracking-wider">Organization</span>}
        </div>

        {collapsed ? (
          <div className="flex justify-center cursor-pointer" onClick={() => setCollapsed(false)}>
            <div className="w-8 h-8 rounded bg-pine flex items-center justify-center text-base font-bold text-surface">
              {currentOrg?.name.substring(0, 1) || "O"}
            </div>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="w-full flex items-center justify-between bg-base p-2 rounded hover:bg-overlay transition-colors border border-transparent hover:border-muted/20"
            >
              <span className="font-semibold truncate text-text">
                {currentOrg?.name || "Select Org"}
              </span>
              <ChevronDown size={16} className="text-subtle" />
            </button>

            {isOrgDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-overlay border border-muted/20 rounded shadow-lg z-20 py-1">
                {organizations.map(org => (
                  <button
                    key={org.id}
                    onClick={() => {
                      onSwitchOrg(org.id);
                      setIsOrgDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-subtle hover:text-text hover:bg-surface/50 transition-colors"
                  >
                    {org.name}
                  </button>
                ))}
                <div className="border-t border-muted/20 my-1"></div>
                <button
                  onClick={() => {
                    onCreateOrg();
                    setIsOrgDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-love hover:bg-surface/50 flex items-center gap-2"
                >
                  <Plus size={14} /> Create New
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Middle Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded text-subtle hover:text-text hover:bg-overlay transition-colors">
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>

        {!collapsed && <div className="px-4 mt-6 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Projects</span>
            <button onClick={onCreateProject} className="text-pine hover:text-foam">
              <Plus size={16} />
            </button>
          </div>
        </div>}

        {/* Projects List */}
        <div className="px-2 space-y-1">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded transition-colors
                    ${currentProjectId === project.id ? 'bg-overlay text-text' : 'text-subtle hover:text-text hover:bg-overlay/50'}
                 `}
              title={project.name}
            >
              <Folder size={20} className={currentProjectId === project.id ? 'text-iris' : ''} />
              {!collapsed && <span className="truncate text-sm">{project.name}</span>}
            </button>
          ))}
          {projects.length === 0 && !collapsed && (
            <div className="px-3 py-4 text-center text-sm text-muted italic">
              No projects yet.
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Profile/Settings stub if needed, or included in nav above */}
      <div className="p-4 border-t border-overlay">
        {!collapsed ? (
          <div className="text-xs text-muted text-center">Cognexa v1.0</div>
        ) : (
          <div className="flex justify-center text-muted">...</div>
        )}
      </div>
    </aside>
  );
};


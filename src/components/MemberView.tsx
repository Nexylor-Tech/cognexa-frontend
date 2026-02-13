import React, { useState } from 'react';
import { Plus, User as UserIcon, UserPlus, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectMember, User } from '../types';

interface MemberViewProps {
  orgMembers: { user: User; role: string; joinedAt: string }[];
  projectMembers: ProjectMember[];
  onInviteToOrg: () => void;
  onAddToProject: (userId: string) => void;
}

export const MemberView: React.FC<MemberViewProps> = ({
  orgMembers,
  projectMembers,
  onInviteToOrg,
  onAddToProject
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="h-full w-12 flex flex-col items-center py-4 bg-surface/30 transition-all duration-300">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-overlay rounded-full text-subtle hover:text-text transition-colors"
          title="Expand Members"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="mt-4 flex-1 w-full flex flex-col items-center gap-4">
          {/* Show tiny avatars or vertical text? Tiny avatars seems cool */}
          <div className="w-px h-8 bg-overlay"></div>
          {orgMembers.slice(0, 5).map(m => (
            <div key={m.user.id} className="w-8 h-8 rounded-full bg-iris/20 flex items-center justify-center text-iris overflow-hidden shrink-0" title={m.user.name}>
              {m.user.image ? (
                <img src={m.user.image} alt={m.user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={14} />
              )}
            </div>
          ))}
          {orgMembers.length > 5 && <span className="text-xs text-subtle">...</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-72 flex flex-col p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-overlay rounded text-subtle hover:text-text transition-colors"
            title="Collapse"
          >
            <ChevronRight size={18} />
          </button>
          <h3 className="text-lg font-bold text-text">Members</h3>
        </div>
        <button
          onClick={onInviteToOrg}
          className="p-1.5 rounded bg-overlay hover:bg-muted/20 text-text transition-colors flex items-center gap-1 text-xs"
          title="Invite to Organization"
        >
          <Plus size={14} /> Invite
        </button>
      </div>

      <div className="text-xs text-subtle mb-4 uppercase font-semibold tracking-wider">
        Organization Members
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {orgMembers.length === 0 && (
          <p className="text-sm text-subtle italic">No members found.</p>
        )}
        {orgMembers.map((member) => {
          const projectMember = projectMembers.find(pm => pm.userId === member.user.id);
          const isAssigned = !!projectMember;

          return (
            <div
              key={member.user.id}
              className="group flex items-center gap-3 p-2 rounded hover:bg-overlay/50 transition-colors cursor-pointer"
              onClick={() => {
                if (!isAssigned) {
                  onAddToProject(member.user.id);
                }
              }}
            >
              <div className="w-8 h-8 rounded-full bg-iris/20 flex items-center justify-center text-iris overflow-hidden shrink-0 relative">
                {member.user.image ? (
                  <img src={member.user.image} alt={member.user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={14} />
                )}
                {isAssigned && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-pine rounded-full border-2 border-surface" title="In Project" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-text truncate">{member.user.name}</p>
                  {isAssigned && (
                    <span title={projectMember?.role}>
                      <Shield size={10} className="text-subtle" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-subtle truncate">{member.user.email}</p>
              </div>

              {!isAssigned && (
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 text-pine hover:bg-pine/10 rounded transition-all"
                  title="Add to Project"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToProject(member.user.id);
                  }}
                >
                  <UserPlus size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

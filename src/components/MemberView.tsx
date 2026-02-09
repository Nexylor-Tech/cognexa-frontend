import React from 'react';
import { Plus, User as UserIcon, UserPlus, Shield } from 'lucide-react';
import type { ProjectMember, User } from '../types';

// We need a combined type for the list
// showing ALL Org members, with info on if they are in the project
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
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-text">Members</h3>
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

      <div className="flex-1 overflow-y-auto space-y-3">
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
                // If assigned, maybe show details? For now, action is adding unassigned.
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
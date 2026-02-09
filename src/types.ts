export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
}

export interface Session {
  id: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug?: string;
  logo?: string | null;
  metadata?: any;
  createdAt: Date;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
  members?: ProjectMember[];
}

export interface Task {
  id: string;
  projectId: string;
  assigneeId?: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  deadline?: Date;
  createdAt: Date;
}

export interface FileItem {
  id: string;
  projectId: string;
  name: string;
  size: number;
  mimeType: string;
  storagePath: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  createdAt: string;
  uploader: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}


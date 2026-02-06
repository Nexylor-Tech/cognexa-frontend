export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
}

export interface Session {
  id: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  metadata?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  assigneeId?: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  deadline?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}


import type { Organization, Project, Task, ProjectMember, User } from '../types';
import { authClient } from '../lib/auth-client';
import { env } from '../lib/'

const API_URL = `${env.API_URL}/api`;
// Helper to handle fetch with credentials for non-better-auth endpoints (Data API)
async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API Error: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) errorMessage = errorJson.message;
    } catch (e) {
      // use text
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {} as T;
}

export const authApi = {
  signUp: async (name: string, email: string, password: string) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    });
    if (error) throw new Error(error.message || "Sign up failed");
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) throw new Error(error.message || "Sign in failed");
    return data;
  },

  signOut: async () => {
    await authClient.signOut();
  },

  getSession: async () => {
    const { data } = await authClient.getSession();
    // data structure from client is { session: Session, user: User } or null
    // matching our existing App consumption
    return data;
  },

  listOrganizations: async () => {
    const { data, error } = await authClient.organization.list();
    if (error) throw new Error(error.message || "Failed to list organizations");
    return data as Organization[];
  },

  listOrganizationMembers: async (organizationId: string) => {
    return fetchClient<{ user: User, role: string, joinedAt: string }[]>(`${API_URL}/organization/${organizationId}/members`);
  },

  createOrganization: async (name: string, slug?: string) => {

    return fetchClient<Organization>(`${API_URL}/organization`, {
      method: 'POST',
      body: JSON.stringify({ name, slug }),
    });
  },

  inviteToOrganization: async (email: string, role: string, organizationId: string) => {
    return fetchClient(`${API_URL}/organization/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, role, organizationId })
    });
  },

  setActiveOrganization: async (organizationId: string) => {
    const { data, error } = await authClient.organization.setActive({
      organizationId
    });
    if (error) throw new Error(error.message || "Failed to set active organization");
    return data;
  }
};

export const dataApi = {
  createProject: async (name: string, orgId: string) => {
    return fetchClient<Project>(`${API_URL}/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, orgId }),
    });
  },

  getProject: async (projectId: string) => {
    return fetchClient<Project & { tasks: Task[]; members: ProjectMember[] }>(`${API_URL}/projects/${projectId}`);
  },

  getProjectsByOrg: async (orgId: string) => {
    // Keeping the manual fetch for custom controller endpoint
    try {
      return await fetchClient<Project[]>(`${API_URL}/projects/org/${orgId}`);
    } catch (e) {
      console.warn("List projects endpoint missing in backend provided. Returning empty list.");
      return [];
    }
  },

  inviteMember: async (projectId: string, userId: string, role: string) => {
    return fetchClient(`${API_URL}/projects/${projectId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ userId, role })
    });
  },

  createTask: async (projectId: string, title: string, deadline: string, priority: string) => {
    return fetchClient<Task>(`${API_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, priority, deadline })
    });
  },

  getFiles: async (projectId: string) => {
    return fetchClient<any[]>(`${API_URL}/projects/${projectId}/files`);
  },

  getSignedUrl: async (projectId: string, fileName: string, mimeType: string) => {
    return fetchClient<{ signedUrl: string, path: string }>(`${API_URL}/projects/${projectId}/files/signedurl`, {
      method: 'POST',
      body: JSON.stringify({ fileName, mimeType })
    });
  },

  confirmUpload: async (projectId: string, fileName: string, storagePath: string, mimeType: string, size: number) => {
    return fetchClient(`${API_URL}/projects/${projectId}/files/confirm`, {
      method: 'POST',
      body: JSON.stringify({ fileName, storagePath, mimeType, size })
    });
  }
};

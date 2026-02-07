import type { User, Session, Organization, Project, Task } from '../types';
import { authClient } from '../lib/auth-client';
import { env } from '../lib/'

const API_URL = `${env.API_URL}/api`
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
  return text ? JSON.parse(text) : {};
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

  createOrganization: async (name: string, slug?: string) => {

    return fetchClient<Organization>(`${API_URL}/oraganisation`, {
      method: 'POST',
      body: JSON.stringify({ name, slug }),
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
    return fetchClient<Project & { tasks: Task[] }>(`${API_URL}/projects/${projectId}`);
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

  createTask: async (projectId: string, title: string, deadline: string, priority: string) => {
    return fetchClient<Task>(`${API_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, deadline, priority })
    });
  }
};

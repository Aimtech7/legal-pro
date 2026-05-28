// User Management Service for LegalPro v1.0.1 - Advocate (Superuser) Functions
import axios from 'axios';
import { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth header interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
);

export interface CreateAdminData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  permissions: {
    canOpenFiles: boolean;
    canUploadFiles: boolean;
    canAdmitClients: boolean;
    canManageCases: boolean;
    canScheduleAppointments: boolean;
    canAccessReports: boolean;
  };
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface UserListResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
  users: User[];
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  user: User;
  temporaryPassword: string;
}

export const userManagementService = {
  // Create advocate user (for invitation system)
  async createAdvocate(advocateData: any): Promise<CreateUserResponse> {
    const response = await api.post('/user-management/create-advocate', advocateData);
    return response.data;
  },

  // Create admin user (Advocate only)
  async createAdmin(adminData: CreateAdminData): Promise<CreateUserResponse> {
    const response = await api.post('/user-management/create-admin', adminData);
    return response.data;
  },

  // Create client user (Advocate/Admin with permission)
  async createClient(clientData: CreateClientData): Promise<CreateUserResponse> {
    const response = await api.post('/user-management/create-client', clientData);
    return response.data;
  },

  // Get all users (Advocate only)
  async getAllUsers(params?: {
    role?: 'admin' | 'client';
    page?: number;
    limit?: number;
  }): Promise<UserListResponse> {
    const response = await api.get('/user-management/users', { params });
    return response.data;
  },

  // Update admin permissions (Advocate only)
  async updateAdminPermissions(adminId: string, permissions: CreateAdminData['permissions']): Promise<{
    success: boolean;
    message: string;
    user: User;
  }> {
    const response = await api.put(`/user-management/admin/${adminId}/permissions`, { permissions });
    return response.data;
  },

  // Deactivate user (Advocate only)
  async deactivateUser(userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.put(`/user-management/user/${userId}/deactivate`);
    return response.data;
  },

  // Activate user (Advocate only)
  async activateUser(userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.put(`/user-management/user/${userId}/activate`);
    return response.data;
  },

  // Reset user password (Advocate only)
  async resetUserPassword(userId: string): Promise<{
    success: boolean;
    message: string;
    temporaryPassword: string;
  }> {
    const response = await api.put(`/user-management/user/${userId}/reset-password`);
    return response.data;
  },

  // Delete user (Advocate only)
  async deleteUser(userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.delete(`/user-management/user/${userId}`);
    return response.data;
  }
};

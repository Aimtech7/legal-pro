// Enhanced API service layer for LegalPro v1.0.1 - With Loading & Error Handling
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Case, Appointment, Payment, ChatMessage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth and loading
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for timeout tracking
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const endTime = new Date();
    const duration = endTime.getTime() - response.config.metadata?.startTime?.getTime();

    // Log slow requests (>5 seconds)
    if (duration > 5000) {
      console.warn(`Slow API request: ${response.config.url} took ${duration}ms`);
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      throw new ApiError('Request timeout. Please check your connection and try again.', 'TIMEOUT', error.response?.status);
    }

    if (!error.response) {
      throw new ApiError('Network error. Please check your internet connection.', 'NETWORK_ERROR');
    }

    const status = error.response.status;
    const message = error.response.data?.message || error.message;

    switch (status) {
      case 401:
        // Handle unauthorized - redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new ApiError('Your session has expired. Please log in again.', 'UNAUTHORIZED', status);

      case 403:
        throw new ApiError('You do not have permission to perform this action.', 'FORBIDDEN', status);

      case 404:
        throw new ApiError('The requested resource was not found.', 'NOT_FOUND', status);

      case 422:
        throw new ApiError(message || 'Invalid data provided.', 'VALIDATION_ERROR', status, error.response.data?.errors);

      case 429:
        throw new ApiError('Too many requests. Please wait a moment and try again.', 'RATE_LIMIT', status);

      case 500:
        throw new ApiError('Server error. Please try again later.', 'SERVER_ERROR', status);

      default:
        throw new ApiError(message || 'An unexpected error occurred.', 'UNKNOWN_ERROR', status);
    }
  }
);

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public validationErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Retry mechanism with exponential backoff
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (error instanceof ApiError) {
        if (['UNAUTHORIZED', 'FORBIDDEN', 'VALIDATION_ERROR'].includes(error.code)) {
          throw error;
        }
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// Enhanced API service with loading states and error handling
export const apiService = {
  // Cases
  async getCases(params?: any) {
    return retryRequest(async () => {
      const response = await api.get('/cases', { params });
      return response.data;
    });
  },

  async getCase(id: string) {
    return retryRequest(async () => {
      const response = await api.get(`/cases/${id}`);
      return response.data;
    });
  },

  async createCase(caseData: Partial<Case>) {
    const response = await api.post('/cases', caseData);
    return response.data;
  },

  async updateCase(id: string, caseData: Partial<Case>) {
    const response = await api.put(`/cases/${id}`, caseData);
    return response.data;
  },

  async deleteCase(id: string) {
    const response = await api.delete(`/cases/${id}`);
    return response.data;
  },

  // Appointments
  async getAppointments(params?: any) {
    return retryRequest(async () => {
      const response = await api.get('/appointments', { params });
      return response.data;
    });
  },

  async getAppointment(id: string) {
    return retryRequest(async () => {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    });
  },

  async createAppointment(appointmentData: Partial<Appointment>) {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  async updateAppointment(id: string, appointmentData: Partial<Appointment>) {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  async cancelAppointment(id: string) {
    const response = await api.patch(`/appointments/${id}/cancel`);
    return response.data;
  },

  // Payments
  async getPayments(params?: any) {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  async createPayment(paymentData: Partial<Payment>) {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  async initiateMpesaPayment(appointmentId: string, phoneNumber: string) {
    const response = await api.post('/payments/mpesa/initiate', {
      appointmentId,
      phoneNumber
    });
    return response.data;
  },

  // File uploads
  async uploadFile(file: File, caseId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (caseId) formData.append('caseId', caseId);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Chat
  async getChatMessages(recipientId: string) {
    const response = await api.get(`/chat/messages/${recipientId}`);
    return response.data;
  },

  async sendMessage(messageData: Partial<ChatMessage>) {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  },

  // Dashboard stats
  async getDashboardStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};
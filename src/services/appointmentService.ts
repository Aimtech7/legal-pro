// Appointment service for LegalPro v1.0.1
import { apiService } from './apiService';

export interface Appointment {
  _id: string;
  title: string;
  description?: string;
  clientId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  advocateId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    specialization?: string[];
  };
  startDateTime: string;
  endDateTime: string;
  timezone: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  type: 'consultation' | 'follow_up' | 'court_preparation' | 'document_review' | 'mediation' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: {
    type: 'office' | 'virtual' | 'court' | 'client_location' | 'other';
    address?: string;
    room?: string;
    meetingLink?: string;
    instructions?: string;
  };
  caseId?: {
    _id: string;
    title: string;
    caseNumber: string;
  };
  isRecurring: boolean;
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    occurrences?: number;
  };
  parentAppointmentId?: string;
  reminders: Array<{
    type: 'email' | 'sms' | 'whatsapp';
    sentAt: string;
    status: 'sent' | 'delivered' | 'failed';
  }>;
  reminderSettings: {
    enabled: boolean;
    intervals: number[];
    methods: string[];
  };
  notes: Array<{
    _id: string;
    content: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    isPrivate: boolean;
    type: 'general' | 'preparation' | 'outcome' | 'follow_up';
    createdAt: string;
    updatedAt: string;
  }>;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  bookedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  bookedAt: string;
  cancelledBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  cancelledAt?: string;
  cancellationReason?: string;
  completedAt?: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  billable: boolean;
  hourlyRate?: number;
  totalCost?: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  duration: number;
  formattedDate: string;
  formattedTime: string;
}

export interface CreateAppointmentData {
  title: string;
  description?: string;
  clientId: string;
  advocateId: string;
  startDateTime: string;
  endDateTime: string;
  type?: string;
  priority?: string;
  location?: {
    type: string;
    address?: string;
    room?: string;
    meetingLink?: string;
    instructions?: string;
  };
  caseId?: string;
  isRecurring?: boolean;
  recurrence?: {
    pattern: string;
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    occurrences?: number;
  };
  reminderSettings?: {
    enabled: boolean;
    intervals: number[];
    methods: string[];
  };
}

export interface UpdateAppointmentData {
  title?: string;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
  type?: string;
  priority?: string;
  location?: {
    type?: string;
    address?: string;
    room?: string;
    meetingLink?: string;
    instructions?: string;
  };
  status?: string;
  outcome?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface AppointmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  advocateId?: string;
  clientId?: string;
  caseId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  formattedTime: string;
}

export interface AvailabilityResponse {
  date: string;
  advocateId: string;
  duration: number;
  availableSlots: AvailableSlot[];
}

export interface AppointmentStatistics {
  period: {
    startDate: string;
    endDate: string;
  };
  totals: {
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    upcoming: number;
  };
  breakdown: {
    byType: Array<{ _id: string; count: number }>;
    byStatus: Array<{ _id: string; count: number }>;
  };
  completionRate: string;
  cancellationRate: string;
}

class AppointmentService {
  // Get all appointments with filtering and pagination
  async getAppointments(filters: AppointmentFilters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiService.getAppointments(filters);
    return response.data;
  }

  // Get single appointment
  async getAppointment(id: string) {
    const response = await apiService.getAppointment(id);
    return response.data;
  }

  // Create new appointment
  async createAppointment(data: CreateAppointmentData) {
    const response = await apiService.createAppointment(data);
    return response.data;
  }

  // Update appointment
  async updateAppointment(id: string, data: UpdateAppointmentData) {
    const response = await apiService.updateAppointment(id, data);
    return response.data;
  }

  // Cancel appointment
  async cancelAppointment(id: string, reason?: string) {
    const response = await apiService.cancelAppointment(id);
    return response.data;
  }

  // Delete appointment
  async deleteAppointment(id: string) {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }

  // Get available time slots for an advocate
  async getAvailability(advocateId: string, date: string, duration: number = 60): Promise<AvailabilityResponse> {
    const response = await api.get(`/appointments/availability/${advocateId}?date=${date}&duration=${duration}`);
    return response.data.data;
  }

  // Get appointment statistics
  async getStatistics(startDate?: string, endDate?: string): Promise<AppointmentStatistics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get(`/appointments/statistics?${params.toString()}`);
    return response.data.data;
  }

  // Get upcoming appointments for current user
  async getUpcomingAppointments(limit: number = 5) {
    const today = new Date().toISOString().split('T')[0];
    const response = await api.get(`/appointments?startDate=${today}&status=scheduled&limit=${limit}`);
    return response.data;
  }

  // Get today's appointments
  async getTodaysAppointments() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
    
    const response = await api.get(`/appointments?startDate=${startOfDay}&endDate=${endOfDay}`);
    return response.data;
  }

  // Reschedule appointment
  async rescheduleAppointment(id: string, newStartDateTime: string, newEndDateTime: string) {
    return this.updateAppointment(id, {
      startDateTime: newStartDateTime,
      endDateTime: newEndDateTime
    });
  }

  // Mark appointment as completed
  async completeAppointment(id: string, outcome?: string, followUpRequired: boolean = false, followUpDate?: string) {
    return this.updateAppointment(id, {
      status: 'completed',
      outcome,
      followUpRequired,
      followUpDate
    });
  }

  // Add note to appointment
  async addNote(id: string, content: string, isPrivate: boolean = false, type: string = 'general') {
    const response = await api.post(`/appointments/${id}/notes`, {
      content,
      isPrivate,
      type
    });
    return response.data;
  }

  // Get appointments for calendar view
  async getCalendarAppointments(startDate: string, endDate: string) {
    const response = await api.get(`/appointments?startDate=${startDate}&endDate=${endDate}&limit=1000`);
    return response.data.data.map((appointment: Appointment) => ({
      id: appointment._id,
      title: appointment.title,
      start: appointment.startDateTime,
      end: appointment.endDateTime,
      backgroundColor: this.getStatusColor(appointment.status),
      borderColor: this.getStatusColor(appointment.status),
      extendedProps: {
        appointment,
        client: appointment.clientId,
        advocate: appointment.advocateId,
        status: appointment.status,
        type: appointment.type
      }
    }));
  }

  // Helper method to get status colors for calendar
  private getStatusColor(status: string): string {
    const colors = {
      scheduled: '#3B82F6', // Blue
      confirmed: '#10B981', // Green
      in_progress: '#F59E0B', // Amber
      completed: '#6B7280', // Gray
      cancelled: '#EF4444', // Red
      no_show: '#8B5CF6' // Purple
    };
    return colors[status as keyof typeof colors] || '#6B7280';
  }

  // Validate appointment data
  validateAppointmentData(data: CreateAppointmentData | UpdateAppointmentData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if ('title' in data && (!data.title || data.title.trim().length === 0)) {
      errors.push('Title is required');
    }

    if ('startDateTime' in data && 'endDateTime' in data && data.startDateTime && data.endDateTime) {
      const start = new Date(data.startDateTime);
      const end = new Date(data.endDateTime);
      const now = new Date();

      if (start >= end) {
        errors.push('End time must be after start time');
      }

      if (start <= now) {
        errors.push('Appointment cannot be scheduled in the past');
      }

      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
      if (duration > 4) {
        errors.push('Appointment duration cannot exceed 4 hours');
      }

      if (duration < 0.25) {
        errors.push('Appointment duration must be at least 15 minutes');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const appointmentService = new AppointmentService();

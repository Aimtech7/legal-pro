// TypeScript type definitions for LegalPro v1.0.1
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'advocate' | 'admin' | 'client'; // advocate is the highest level (super admin)
  phone?: string;
  avatar?: string;
  // Advocate-specific fields (for super admin advocates)
  licenseNumber?: string;
  specialization?: string[];
  experience?: number;
  education?: string;
  barAdmission?: string;
  isVerified?: boolean;
  isActive?: boolean;
  // Admin permissions (for admin role only)
  permissions?: {
    canOpenFiles: boolean;
    canUploadFiles: boolean;
    canAdmitClients: boolean;
    canManageCases: boolean;
    canScheduleAppointments: boolean;
    canAccessReports: boolean;
  };
  // User management fields
  createdBy?: string;
  isTemporaryPassword?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  _id: string;
  id: string;
  caseNumber: string;
  clientId: string | User;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string | User;
  courtDate?: string;
  documents: CaseDocument[];
  notes: CaseNote[];
  timeline: TimelineEvent[];
  clientName?: string;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseDocument {
  _id: string;
  id: string;
  caseId: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  url: string;
  publicId: string;
  uploadedBy: string | User;
  description?: string;
  tags?: string[];
  downloadCount?: number;
  lastAccessed?: string;
  metadata?: any;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document extends CaseDocument {}

export interface CaseNote {
  _id: string;
  id: string;
  caseId: string;
  content: string;
  author: string | User;
  isPrivate: boolean;
  createdAt: string;
}

export interface TimelineEvent {
  _id: string;
  event: string;
  description: string;
  user: string | User;
  metadata?: any;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow_up' | 'court_appearance';
  location?: string;
  meetingLink?: string;
  fee?: number;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  clientId: string;
  appointmentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'mpesa' | 'card' | 'bank_transfer';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PracticeArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'client' | 'advocate';
  // Advocate-specific fields (for super admin registration)
  licenseNumber?: string;
  specialization?: string[];
  experience?: number;
  education?: string;
  barAdmission?: string;
}
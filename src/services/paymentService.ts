// Enhanced Payment service for LegalPro v1.0.1 with comprehensive M-Pesa integration
import axios from 'axios';

const API_URL = (import.meta.env as any).VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const paymentApi = axios.create({
  baseURL: `${API_URL}/payments`,
  timeout: 60000, // 60 seconds for payment operations
  withCredentials: true,
});

// Add auth token to requests
paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Payment API error:', error.response?.data || error.message);
    throw error;
  }
);

// Types for payment data
export interface PaymentInitiationData {
  phoneNumber: string;
  amount: number;
  appointmentId?: string;
  caseId?: string;
  paymentType?: 'consultation_fee' | 'case_fee' | 'document_fee' | 'court_fee' | 'other';
  description?: string;
  accountReference?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    checkoutRequestID: string;
    merchantRequestID: string;
    customerMessage: string;
    amount: string;
    phoneNumber: string;
  };
}

export interface PaymentStatus {
  success: boolean;
  payment: {
    id: string;
    amount: string;
    status: string;
    method: string;
    type: string;
    createdAt: string;
    mpesaReceipt?: string;
  };
  mpesaDetails?: {
    checkoutRequestID: string;
    stkPushStatus: string;
    resultCode?: number;
    resultDesc?: string;
    mpesaReceiptNumber?: string;
  };
}

export interface PaymentListResponse {
  success: boolean;
  payments: Array<{
    id: string;
    amount: string;
    status: string;
    method: string;
    type: string;
    createdAt: string;
    mpesaReceipt?: string;
  }>;
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
}

// Initiate STK Push payment
export const initiateSTKPush = async (paymentData: PaymentInitiationData): Promise<PaymentResponse> => {
  const response = await paymentApi.post('/stk-push', paymentData);
  return response.data;
};

// Legacy support
export const initiatePayment = async (paymentData: { phoneNumber: string; amount: number; appointmentId?: string }) => {
  return initiateSTKPush({
    ...paymentData,
    paymentType: 'consultation_fee'
  });
};

// Query payment status
export const queryPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  const response = await paymentApi.get(`/${paymentId}/status`);
  return response.data;
};

// Get user payments with filtering and pagination
export const getPayments = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  paymentType?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
} = {}): Promise<PaymentListResponse> => {
  const response = await paymentApi.get('/', { params });
  return response.data;
};

// Initiate refund (admin only)
export const initiateRefund = async (paymentId: string, refundData: {
  amount?: number;
  reason: string;
}) => {
  const response = await paymentApi.post(`/${paymentId}/refund`, refundData);
  return response.data;
};

// Get transaction analytics (admin only)
export const getTransactionAnalytics = async (params: {
  startDate?: string;
  endDate?: string;
} = {}) => {
  const response = await paymentApi.get('/analytics', { params });
  return response.data;
};

// Utility functions
export const formatAmount = (amount: number, currency: string = 'KES'): string => {
  return `${currency} ${amount.toLocaleString()}`;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Handle different formats
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`;
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    return `+254${cleaned}`;
  }

  return phoneNumber;
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600';
    case 'processing':
    case 'pending':
      return 'text-yellow-600';
    case 'failed':
    case 'cancelled':
      return 'text-red-600';
    case 'refunded':
    case 'partially_refunded':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

export const getPaymentStatusBadge = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'refunded':
    case 'partially_refunded':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

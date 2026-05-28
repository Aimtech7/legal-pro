// Payment Status Component - LegalPro v1.0.1
import React, { useState, useEffect } from 'react';
import { queryPaymentStatus, getPaymentStatusColor, getPaymentStatusBadge } from '../../services/paymentService';
import Button from '../ui/Button';

interface PaymentStatusProps {
  paymentId: string;
  onStatusChange?: (status: string) => void;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  paymentId,
  onStatusChange,
  autoRefresh = false,
  refreshInterval = 5000
}) => {
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchPaymentStatus();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh && ['pending', 'processing'].includes(payment?.status)) {
      interval = setInterval(fetchPaymentStatus, refreshInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [paymentId, autoRefresh, refreshInterval, payment?.status]);

  const fetchPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await queryPaymentStatus(paymentId);
      
      if (response.success) {
        const newStatus = response.payment.status;
        const oldStatus = payment?.status;
        
        setPayment(response.payment);
        setLastUpdated(new Date());
        
        // Notify parent component of status change
        if (onStatusChange && newStatus !== oldStatus) {
          onStatusChange(newStatus);
        }
      } else {
        setError('Failed to fetch payment status');
      }
    } catch (err: any) {
      console.error('Error fetching payment status:', err);
      setError(err.response?.data?.message || 'Failed to fetch payment status');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'processing':
      case 'pending':
        return (
          <svg className="w-5 h-5 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'failed':
      case 'cancelled':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'refunded':
      case 'partially_refunded':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Payment is pending. Please complete the payment on your phone.';
      case 'processing':
        return 'Payment is being processed. Please wait...';
      case 'completed':
        return 'Payment completed successfully!';
      case 'failed':
        return 'Payment failed. Please try again or contact support.';
      case 'cancelled':
        return 'Payment was cancelled.';
      case 'refunded':
        return 'Payment has been refunded.';
      case 'partially_refunded':
        return 'Payment has been partially refunded.';
      default:
        return 'Unknown payment status.';
    }
  };

  if (loading && !payment) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-600 font-medium">Error</span>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchPaymentStatus} size="sm">
          Retry
        </Button>
      </div>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(payment.status)}
          <span className={`font-medium ${getPaymentStatusColor(payment.status)}`}>
            Payment {payment.status.replace('_', ' ')}
          </span>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(payment.status)}`}>
          {payment.status.replace('_', ' ')}
        </span>
      </div>

      {/* Status Message */}
      <p className="text-gray-600 mb-4">
        {getStatusMessage(payment.status)}
      </p>

      {/* Payment Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Amount</label>
          <p className="text-sm text-gray-900">{payment.amount}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Method</label>
          <p className="text-sm text-gray-900 capitalize">{payment.method}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Type</label>
          <p className="text-sm text-gray-900">{payment.type.replace('_', ' ')}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Date</label>
          <p className="text-sm text-gray-900">{formatDate(payment.createdAt)}</p>
        </div>
      </div>

      {/* M-Pesa Receipt */}
      {payment.mpesaReceipt && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">M-Pesa Receipt</label>
          <p className="text-sm text-gray-900 font-mono">{payment.mpesaReceipt}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchPaymentStatus}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </Button>
          
          {autoRefresh && ['pending', 'processing'].includes(payment.status) && (
            <span className="text-xs text-gray-500">
              Auto-refreshing every {refreshInterval / 1000}s
            </span>
          )}
        </div>

        <span className="text-xs text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default PaymentStatus;

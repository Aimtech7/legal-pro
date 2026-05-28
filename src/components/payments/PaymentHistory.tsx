// Payment History Component - LegalPro v1.0.1
import React, { useState, useEffect } from 'react';
import { getPayments, getPaymentStatusBadge } from '../../services/paymentService';
import PaymentStatus from './PaymentStatus';
import Button from '../ui/Button';

interface PaymentHistoryProps {
  clientId?: string;
  limit?: number;
  showFilters?: boolean;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  clientId,
  limit = 10,
  showFilters = true
}) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit,
    status: '',
    method: 'mpesa' // Default to M-Pesa
  });
  const [pagination, setPagination] = useState<any>({});

  useEffect(() => {
    fetchPayments();
  }, [filters, clientId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      if (clientId) {
        params.clientId = clientId;
      }
      
      const response = await getPayments(params);
      setPayments(response.payments);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleStatusChange = (paymentId: string, newStatus: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: newStatus }
        : payment
    ));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Payment History ({pagination.total || 0})
        </h3>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.method}
                onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value, page: 1 }))}
              >
                <option value="">All Methods</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Payment List */}
      <div className="divide-y divide-gray-200">
        {payments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.status || filters.method
                ? 'Try adjusting your filters'
                : 'No payments have been made yet'}
            </p>
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {getPaymentTypeLabel(payment.type)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {payment.amount} • {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(payment.status)}`}>
                        {payment.status.replace('_', ' ')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPayment(
                          selectedPayment === payment.id ? null : payment.id
                        )}
                      >
                        {selectedPayment === payment.id ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="capitalize">{payment.method}</span>
                    <span>ID: {payment.id.slice(-8)}</span>
                    {payment.mpesaReceipt && (
                      <span>Receipt: {payment.mpesaReceipt}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedPayment === payment.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <PaymentStatus
                    paymentId={payment.id}
                    onStatusChange={(newStatus) => handleStatusChange(payment.id, newStatus)}
                    autoRefresh={['pending', 'processing'].includes(payment.status)}
                    refreshInterval={5000}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.current} of {pagination.pages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;

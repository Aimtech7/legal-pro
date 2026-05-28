// Payments Page - LegalPro v1.0.1
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PaymentDashboard, PaymentModal, PaymentHistory } from '../components/payments';
import Button from '../components/ui/Button';

const Payments: React.FC = () => {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'analytics'>('overview');

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    // Refresh the payment data
    window.location.reload();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'history', label: 'Payment History', icon: '📋' },
    ...(user?.role === 'admin' ? [{ id: 'analytics', label: 'Analytics', icon: '📈' }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.role === 'admin' ? 'Payment Management' : 'My Payments'}
              </h1>
              <p className="mt-2 text-gray-600">
                {user?.role === 'admin' 
                  ? 'Manage and monitor all payment transactions'
                  : 'View your payment history and make new payments'
                }
              </p>
            </div>
            
            {user?.role !== 'admin' && (
              <Button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Make Payment</span>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {user?.role === 'admin' ? (
                <PaymentDashboard />
              ) : (
                <>
                  {/* Quick Stats for Users */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Completed Payments</p>
                          <p className="text-2xl font-semibold text-gray-900">-</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                          <p className="text-2xl font-semibold text-gray-900">-</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Total Spent</p>
                          <p className="text-2xl font-semibold text-gray-900">KES -</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Payments */}
                  <PaymentHistory limit={5} showFilters={false} />
                </>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <PaymentHistory />
          )}

          {activeTab === 'analytics' && user?.role === 'admin' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Payment Analytics</h3>
              <p className="text-gray-600">
                Detailed analytics and reporting features will be available here.
              </p>
              {/* This would contain detailed analytics charts and reports */}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {user?.role !== 'admin' && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Need to make a payment?</h3>
            <p className="text-blue-700 mb-4">
              Pay for consultations, case fees, or other legal services securely with M-Pesa.
            </p>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowPaymentModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Make Payment
              </Button>
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => setActiveTab('history')}
              >
                View History
              </Button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Help</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">M-Pesa Payments</h4>
              <ul className="space-y-1">
                <li>• Ensure your phone has sufficient balance</li>
                <li>• Enter your M-Pesa PIN when prompted</li>
                <li>• Keep your phone nearby during payment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Payment Issues</h4>
              <ul className="space-y-1">
                <li>• Check your network connection</li>
                <li>• Verify your phone number is correct</li>
                <li>• Contact support if payment fails</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Payments;

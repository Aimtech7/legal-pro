import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import {
  initiateSTKPush,
  queryPaymentStatus,
  formatPhoneNumber,
  PaymentInitiationData
} from '../../services/paymentService';
import { toast } from 'react-toastify';

interface PaymentFormData {
  phoneNumber: string;
  amount: number;
  paymentType: 'consultation_fee' | 'case_fee' | 'document_fee' | 'court_fee' | 'other';
  description?: string;
}

interface PaymentModalProps {
  appointmentId?: string;
  caseId?: string;
  defaultAmount?: number;
  defaultPaymentType?: 'consultation_fee' | 'case_fee' | 'document_fee' | 'court_fee' | 'other';
  onClose: () => void;
  onPaymentSuccess: (paymentId: string) => void;
}

type PaymentStep = 'form' | 'processing' | 'waiting' | 'success' | 'failed';

const PaymentModal: React.FC<PaymentModalProps> = ({
  appointmentId,
  caseId,
  defaultAmount,
  defaultPaymentType = 'consultation_fee',
  onClose,
  onPaymentSuccess
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PaymentFormData>({
    defaultValues: {
      amount: defaultAmount || 0,
      paymentType: defaultPaymentType
    }
  });

  const [currentStep, setCurrentStep] = useState<PaymentStep>('form');
  const [paymentId, setPaymentId] = useState<string>('');
  const [checkoutRequestID, setCheckoutRequestID] = useState<string>('');
  const [customerMessage, setCustomerMessage] = useState<string>('');
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [timeoutCountdown, setTimeoutCountdown] = useState<number>(120); // 2 minutes

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Countdown timer for payment timeout
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (currentStep === 'waiting' && timeoutCountdown > 0) {
      countdownInterval = setInterval(() => {
        setTimeoutCountdown(prev => {
          if (prev <= 1) {
            setCurrentStep('failed');
            toast.error('Payment timeout. Please try again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [currentStep, timeoutCountdown]);

  const startStatusChecking = (paymentId: string) => {
    const interval = setInterval(async () => {
      try {
        const statusResponse = await queryPaymentStatus(paymentId);

        if (statusResponse.payment.status === 'completed') {
          setCurrentStep('success');
          clearInterval(interval);
          toast.success('Payment completed successfully!');
          setTimeout(() => {
            onPaymentSuccess(paymentId);
            onClose();
          }, 2000);
        } else if (statusResponse.payment.status === 'failed') {
          setCurrentStep('failed');
          clearInterval(interval);
          toast.error('Payment failed. Please try again.');
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 3000); // Check every 3 seconds

    setStatusCheckInterval(interval);
  };

  const onSubmit = async (data: PaymentFormData) => {
    setCurrentStep('processing');

    try {
      const paymentData: PaymentInitiationData = {
        phoneNumber: data.phoneNumber,
        amount: data.amount,
        paymentType: data.paymentType,
        description: data.description || `${data.paymentType.replace('_', ' ')} payment`,
        appointmentId,
        caseId
      };

      const response = await initiateSTKPush(paymentData);

      if (response.success) {
        setPaymentId(response.data.paymentId);
        setCheckoutRequestID(response.data.checkoutRequestID);
        setCustomerMessage(response.data.customerMessage);
        setCurrentStep('waiting');
        setTimeoutCountdown(120); // Reset countdown

        toast.success('STK Push sent! Please check your phone and enter your M-Pesa PIN.');

        // Start checking payment status
        startStatusChecking(response.data.paymentId);
      } else {
        throw new Error(response.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      setCurrentStep('failed');
      toast.error(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
    }
  };

  const handleRetry = () => {
    setCurrentStep('form');
    setPaymentId('');
    setCheckoutRequestID('');
    setCustomerMessage('');
    setTimeoutCountdown(120);

    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'form':
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="0708374149 or 254708374149"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^(\+?254|0)?[17]\d{8}$/,
                  message: 'Please enter a valid Kenyan phone number'
                }
              })}
            />

            <Input
              label="Amount (KES)"
              type="number"
              min={1}
              error={errors.amount?.message}
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be at least 1 KES' },
                valueAsNumber: true
              })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('paymentType', { required: 'Payment type is required' })}
              >
                <option value="consultation_fee">Consultation Fee</option>
                <option value="case_fee">Case Fee</option>
                <option value="document_fee">Document Fee</option>
                <option value="court_fee">Court Fee</option>
                <option value="other">Other</option>
              </select>
              {errors.paymentType && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentType.message}</p>
              )}
            </div>

            <Input
              label="Description (Optional)"
              type="text"
              placeholder="Payment description"
              {...register('description')}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Initiate Payment
              </Button>
            </div>
          </form>
        );

      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we initiate your payment...</p>
          </div>
        );

      case 'waiting':
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Check Your Phone</h3>
              <p className="text-gray-600 mb-4">{customerMessage}</p>
              <p className="text-sm text-gray-500">
                Enter your M-Pesa PIN to complete the payment
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">
                  Time remaining: {formatTime(timeoutCountdown)}
                </span>
              </div>
              <p className="text-xs text-yellow-700 text-center">
                Payment will timeout automatically if not completed
              </p>
            </div>

            <div className="flex justify-center space-x-2">
              <Button variant="ghost" onClick={handleRetry}>
                Cancel
              </Button>
              <Button onClick={() => startStatusChecking(paymentId)} disabled>
                Waiting for Payment...
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
            <p className="text-sm text-gray-500">You will be redirected shortly...</p>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-6">
              The payment could not be completed. This might be due to:
            </p>
            <ul className="text-sm text-gray-500 text-left mb-6 space-y-1">
              <li>• Payment was cancelled</li>
              <li>• Insufficient funds</li>
              <li>• Network timeout</li>
              <li>• Invalid PIN entered</li>
            </ul>
            <div className="flex justify-center space-x-2">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {currentStep === 'form' ? 'Make a Payment' :
             currentStep === 'processing' ? 'Processing...' :
             currentStep === 'waiting' ? 'Complete Payment' :
             currentStep === 'success' ? 'Payment Complete' :
             'Payment Failed'}
          </h2>
          {currentStep === 'form' && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className={currentStep === 'form' ? 'text-blue-600 font-medium' : ''}>
              Payment Details
            </span>
            <span className={['processing', 'waiting'].includes(currentStep) ? 'text-blue-600 font-medium' : ''}>
              Processing
            </span>
            <span className={currentStep === 'success' ? 'text-green-600 font-medium' : ''}>
              Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                currentStep === 'form' ? 'w-1/3 bg-blue-600' :
                ['processing', 'waiting'].includes(currentStep) ? 'w-2/3 bg-blue-600' :
                currentStep === 'success' ? 'w-full bg-green-600' :
                'w-2/3 bg-red-600'
              }`}
            />
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
};

export default PaymentModal;

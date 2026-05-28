// Error Handling Components for LegalPro v1.0.1 - WCAG 2.1 AA Compliant
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  AlertCircle, 
  RefreshCw, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  ExternalLink,
  Home,
  ArrowLeft
} from 'lucide-react';
import { LoadingButton } from './LoadingStates';

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log error to monitoring service
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          showDetails={this.props.showDetails}
        />
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// ERROR FALLBACK COMPONENT
// ============================================================================

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  onRetry?: () => void;
  showDetails?: boolean;
  title?: string;
  message?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  onRetry,
  showDetails = false,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again or contact support if the problem persists.'
}) => {
  const [showErrorDetails, setShowErrorDetails] = React.useState(false);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6" role="alert">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="space-y-3">
          {onRetry && (
            <LoadingButton
              onClick={onRetry}
              variant="primary"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </LoadingButton>
          )}

          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 text-navy-600 border border-navy-600 rounded-md hover:bg-navy-50 transition-colors"
          >
            <Home className="w-4 h-4 mr-2 inline" />
            Go to Homepage
          </button>

          {showDetails && error && (
            <button
              onClick={() => setShowErrorDetails(!showErrorDetails)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showErrorDetails ? 'Hide' : 'Show'} Error Details
            </button>
          )}
        </div>

        {showErrorDetails && error && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Error Details:</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
              {error.message}
              {errorInfo?.componentStack && `\n\nComponent Stack:${errorInfo.componentStack}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps extends Toast {
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  action,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(id), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onDismiss]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className={clsx(
            'max-w-sm w-full border rounded-lg shadow-lg p-4',
            colors[type]
          )}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start">
            <Icon className={clsx('w-5 h-5 mt-0.5 mr-3 flex-shrink-0', iconColors[type])} aria-hidden="true" />
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium">{title}</h4>
              {message && (
                <p className="mt-1 text-sm opacity-90">{message}</p>
              )}
              
              {action && (
                <button
                  onClick={action.onClick}
                  className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
                >
                  {action.label}
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onDismiss(id), 300);
              }}
              className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// INLINE ERROR COMPONENT
// ============================================================================

interface InlineErrorProps {
  error?: string | null;
  className?: string;
  icon?: boolean;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  error,
  className,
  icon = true
}) => {
  if (!error) return null;

  return (
    <div 
      className={clsx('flex items-center text-sm text-red-600 mt-1', className)}
      role="alert"
      aria-live="polite"
    >
      {icon && <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />}
      <span>{error}</span>
    </div>
  );
};

// ============================================================================
// RETRY COMPONENT
// ============================================================================

interface RetryProps {
  onRetry: () => void;
  loading?: boolean;
  error?: string;
  attempts?: number;
  maxAttempts?: number;
  className?: string;
}

export const RetryComponent: React.FC<RetryProps> = ({
  onRetry,
  loading = false,
  error,
  attempts = 0,
  maxAttempts = 3,
  className
}) => {
  const canRetry = attempts < maxAttempts;

  return (
    <div className={clsx('text-center p-6', className)}>
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Connection Error
      </h3>
      
      <p className="text-gray-600 mb-4">
        {error || 'Unable to load data. Please check your connection and try again.'}
      </p>

      {attempts > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          Attempt {attempts} of {maxAttempts}
        </p>
      )}

      <div className="space-y-2">
        <LoadingButton
          onClick={onRetry}
          loading={loading}
          disabled={!canRetry}
          variant="primary"
          loadingText="Retrying..."
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {canRetry ? 'Try Again' : 'Max Attempts Reached'}
        </LoadingButton>

        {!canRetry && (
          <p className="text-sm text-gray-500">
            Please refresh the page or contact support if the problem persists.
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// ERROR HOOKS
// ============================================================================

export const useErrorHandler = () => {
  const [error, setError] = React.useState<string | null>(null);

  const handleError = React.useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

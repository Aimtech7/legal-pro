// Comprehensive Toast Components for LegalPro v1.0.1 - WCAG AA Compliant
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Loader2, 
  X,
  RotateCcw,
  Eye,
  ExternalLink,
  Clock
} from 'lucide-react';
import { clsx } from 'clsx';

// Toast action interface
export interface ToastAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

// Toast component props
export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title?: string;
  message: string;
  actions?: ToastAction[];
  progress?: number;
  dismissible?: boolean;
  persistent?: boolean;
  visible?: boolean;
  onDismiss?: (id: string) => void;
  duration?: number;
  className?: string;
}

// Toast container props
export interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  maxVisible?: number;
  className?: string;
}

// Toast icons mapping
const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2
};

// Toast color schemes
const TOAST_STYLES = {
  success: {
    container: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30',
    icon: 'text-white',
    progress: 'bg-white bg-opacity-30',
    progressBar: 'bg-white'
  },
  error: {
    container: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30',
    icon: 'text-white',
    progress: 'bg-white bg-opacity-30',
    progressBar: 'bg-white'
  },
  warning: {
    container: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30',
    icon: 'text-white',
    progress: 'bg-white bg-opacity-30',
    progressBar: 'bg-white'
  },
  info: {
    container: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30',
    icon: 'text-white',
    progress: 'bg-white bg-opacity-30',
    progressBar: 'bg-white'
  },
  loading: {
    container: 'bg-gradient-to-r from-navy-800 to-navy-900 text-white shadow-lg shadow-navy-800/30',
    icon: 'text-white animate-spin',
    progress: 'bg-white bg-opacity-30',
    progressBar: 'bg-white'
  }
};

// Individual Toast Component
export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  actions = [],
  progress,
  dismissible = true,
  persistent = false,
  visible = true,
  onDismiss,
  duration = 4000,
  className
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  const Icon = TOAST_ICONS[type];
  const styles = TOAST_STYLES[type];

  // Auto-dismiss timer
  useEffect(() => {
    if (persistent || !visible || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          onDismiss?.(id);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [id, persistent, visible, isPaused, onDismiss]);

  const handleDismiss = () => {
    onDismiss?.(id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleDismiss();
    }
  };

  const progressPercentage = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={clsx(
        'max-w-md w-full rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transform transition-all duration-200',
        styles.container,
        className
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${type}: ${message}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon 
              className={clsx('h-5 w-5', styles.icon)}
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <p className="text-sm font-semibold mb-1" id={`toast-title-${id}`}>
                {title}
              </p>
            )}
            <p 
              className="text-sm opacity-90" 
              id={`toast-message-${id}`}
              aria-describedby={title ? `toast-title-${id}` : undefined}
            >
              {message}
            </p>
            
            {/* Progress bar for loading toasts or auto-dismiss timer */}
            {(type === 'loading' && typeof progress === 'number') || (!persistent && duration > 0) && (
              <div className={clsx('mt-2 w-full rounded-full h-1', styles.progress)}>
                <div
                  className={clsx('h-1 rounded-full transition-all duration-100', styles.progressBar)}
                  style={{ 
                    width: type === 'loading' && typeof progress === 'number' 
                      ? `${Math.min(100, Math.max(0, progress))}%`
                      : `${100 - progressPercentage}%`
                  }}
                  role="progressbar"
                  aria-valuenow={type === 'loading' ? progress : 100 - progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={type === 'loading' ? 'Loading progress' : 'Time remaining'}
                />
              </div>
            )}

            {/* Action buttons */}
            {actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {actions.map((action, index) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        if (!persistent) handleDismiss();
                      }}
                      disabled={action.disabled}
                      className={clsx(
                        'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md',
                        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        {
                          'bg-red-600 hover:bg-red-700 text-white': action.variant === 'danger',
                          'bg-white bg-opacity-20 hover:bg-opacity-30 text-white': action.variant === 'secondary',
                          'bg-white bg-opacity-10 hover:bg-opacity-20 text-white': !action.variant || action.variant === 'primary'
                        }
                      )}
                      aria-label={action.label}
                    >
                      {ActionIcon && <ActionIcon className="w-3 h-3 mr-1" />}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Time remaining indicator for non-persistent toasts */}
            {!persistent && duration > 0 && (
              <div className="mt-2 flex items-center text-xs opacity-70">
                <Clock className="w-3 h-3 mr-1" />
                <span>{Math.ceil(timeLeft / 1000)}s</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dismiss button */}
      {dismissible && (
        <div className="flex border-l border-white border-opacity-20">
          <button
            onClick={handleDismiss}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Toast Container Component
export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  maxVisible = 5,
  className
}) => {
  const visibleToasts = toasts.slice(0, maxVisible);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div
      className={clsx(
        'fixed z-50 pointer-events-none',
        positionClasses[position],
        className
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      <div className="flex flex-col space-y-2 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {visibleToasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Convenience components for specific toast types
export const SuccessToast: React.FC<Omit<ToastProps, 'type'>> = (props) => (
  <Toast {...props} type="success" />
);

export const ErrorToast: React.FC<Omit<ToastProps, 'type'>> = (props) => (
  <Toast {...props} type="error" />
);

export const WarningToast: React.FC<Omit<ToastProps, 'type'>> = (props) => (
  <Toast {...props} type="warning" />
);

export const InfoToast: React.FC<Omit<ToastProps, 'type'>> = (props) => (
  <Toast {...props} type="info" />
);

export const LoadingToast: React.FC<Omit<ToastProps, 'type'>> = (props) => (
  <Toast {...props} type="loading" />
);

export default Toast;

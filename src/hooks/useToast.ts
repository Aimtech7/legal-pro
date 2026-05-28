// Enhanced Toast Hook for LegalPro v1.0.1 - Comprehensive Toast Management
import { useState, useCallback, useRef, useEffect } from 'react';
import { ToastAction } from '../components/ui/Toast';

// Toast configuration interface
export interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title?: string;
  message: string;
  actions?: ToastAction[];
  progress?: number;
  dismissible?: boolean;
  persistent?: boolean;
  duration?: number;
  ariaLabel?: string;
}

// Toast state interface
export interface ToastState extends ToastConfig {
  id: string;
  visible: boolean;
  createdAt: number;
}

// Toast hook return type
export interface UseToastReturn {
  toasts: ToastState[];
  showToast: (config: ToastConfig) => string;
  updateToast: (id: string, updates: Partial<ToastConfig>) => void;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
  success: (message: string, options?: Partial<ToastConfig>) => string;
  error: (message: string, options?: Partial<ToastConfig>) => string;
  warning: (message: string, options?: Partial<ToastConfig>) => string;
  info: (message: string, options?: Partial<ToastConfig>) => string;
  loading: (message: string, options?: Partial<ToastConfig>) => string;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: Partial<ToastConfig>
  ) => Promise<T>;
}

// Default toast durations
const DEFAULT_DURATIONS = {
  success: 4000,
  error: 10000,
  warning: 7000,
  info: 5000,
  loading: Infinity
};

// Generate unique toast ID
const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Enhanced toast hook with comprehensive functionality
 */
export const useToast = (maxToasts: number = 5): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  /**
   * Show a new toast
   */
  const showToast = useCallback((config: ToastConfig): string => {
    const id = generateToastId();
    const duration = config.duration ?? DEFAULT_DURATIONS[config.type];

    const newToast: ToastState = {
      ...config,
      id,
      visible: true,
      createdAt: Date.now(),
      duration
    };

    setToasts(prev => {
      // Remove oldest toasts if we exceed maxToasts
      const updatedToasts = prev.length >= maxToasts 
        ? prev.slice(-(maxToasts - 1))
        : prev;
      
      return [...updatedToasts, newToast];
    });

    // Set auto-dismiss timer for non-persistent toasts
    if (!config.persistent && duration !== Infinity) {
      const timeout = setTimeout(() => {
        dismissToast(id);
      }, duration);
      
      timeoutRefs.current.set(id, timeout);
    }

    return id;
  }, [maxToasts]);

  /**
   * Update an existing toast
   */
  const updateToast = useCallback((id: string, updates: Partial<ToastConfig>): void => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id 
          ? { ...toast, ...updates }
          : toast
      )
    );

    // Update timer if duration changed
    if (updates.duration !== undefined) {
      const existingTimeout = timeoutRefs.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      if (updates.duration !== Infinity && !updates.persistent) {
        const timeout = setTimeout(() => {
          dismissToast(id);
        }, updates.duration);
        
        timeoutRefs.current.set(id, timeout);
      }
    }
  }, []);

  /**
   * Dismiss a specific toast
   */
  const dismissToast = useCallback((id: string): void => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }
  }, []);

  /**
   * Dismiss all toasts
   */
  const dismissAll = useCallback((): void => {
    setToasts([]);
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
  }, []);

  /**
   * Success toast convenience method
   */
  const success = useCallback((message: string, options: Partial<ToastConfig> = {}): string => {
    return showToast({
      type: 'success',
      message,
      ariaLabel: `Success: ${message}`,
      ...options
    });
  }, [showToast]);

  /**
   * Error toast convenience method
   */
  const error = useCallback((message: string, options: Partial<ToastConfig> = {}): string => {
    return showToast({
      type: 'error',
      message,
      persistent: true,
      ariaLabel: `Error: ${message}`,
      ...options
    });
  }, [showToast]);

  /**
   * Warning toast convenience method
   */
  const warning = useCallback((message: string, options: Partial<ToastConfig> = {}): string => {
    return showToast({
      type: 'warning',
      message,
      ariaLabel: `Warning: ${message}`,
      ...options
    });
  }, [showToast]);

  /**
   * Info toast convenience method
   */
  const info = useCallback((message: string, options: Partial<ToastConfig> = {}): string => {
    return showToast({
      type: 'info',
      message,
      ariaLabel: `Information: ${message}`,
      ...options
    });
  }, [showToast]);

  /**
   * Loading toast convenience method
   */
  const loading = useCallback((message: string, options: Partial<ToastConfig> = {}): string => {
    return showToast({
      type: 'loading',
      message,
      persistent: true,
      dismissible: false,
      ariaLabel: `Loading: ${message}`,
      ...options
    });
  }, [showToast]);

  /**
   * Promise-based toast for async operations
   */
  const promise = useCallback(async <T>(
    promiseToResolve: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options: Partial<ToastConfig> = {}
  ): Promise<T> => {
    const loadingToastId = loading(messages.loading, options);

    try {
      const result = await promiseToResolve;
      dismissToast(loadingToastId);
      
      const successMessage = typeof messages.success === 'function' 
        ? messages.success(result) 
        : messages.success;
      
      success(successMessage, options);
      return result;
    } catch (err) {
      dismissToast(loadingToastId);
      
      const errorMessage = typeof messages.error === 'function' 
        ? messages.error(err) 
        : messages.error;
      
      error(errorMessage, {
        ...options,
        actions: [
          {
            label: 'Retry',
            action: () => promise(promiseToResolve, messages, options),
            icon: ({ className }) => (
              <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )
          },
          ...(options.actions || [])
        ]
      });
      throw err;
    }
  }, [loading, dismissToast, success, error]);

  return {
    toasts,
    showToast,
    updateToast,
    dismissToast,
    dismissAll,
    success,
    error,
    warning,
    info,
    loading,
    promise
  };
};

// Global toast context for app-wide toast management
import { createContext, useContext, ReactNode } from 'react';

const ToastContext = createContext<UseToastReturn | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode; maxToasts?: number }> = ({ 
  children, 
  maxToasts = 5 
}) => {
  const toastMethods = useToast(maxToasts);

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
    </ToastContext.Provider>
  );
};

export const useGlobalToast = (): UseToastReturn => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useGlobalToast must be used within a ToastProvider');
  }
  return context;
};

export default useToast;

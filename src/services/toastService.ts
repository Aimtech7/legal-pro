// Toast Service for LegalPro v1.0.1
import toast, { ToastOptions } from 'react-hot-toast';

export interface ToastAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface EnhancedToastOptions extends ToastOptions {
  title?: string;
  actions?: ToastAction[];
  progress?: number;
  dismissible?: boolean;
  persistent?: boolean;
}

class ToastService {
  success(message: string, options: EnhancedToastOptions = {}): string {
    return toast.success(message, {
      duration: 4000,
      ...options
    });
  }

  error(message: string, options: EnhancedToastOptions = {}): string {
    return toast.error(message, {
      duration: 10000,
      ...options
    });
  }

  warning(message: string, options: EnhancedToastOptions = {}): string {
    return toast(message, {
      icon: '⚠️',
      duration: 7000,
      ...options
    });
  }

  info(message: string, options: EnhancedToastOptions = {}): string {
    return toast(message, {
      icon: 'ℹ️',
      duration: 5000,
      ...options
    });
  }

  loading(message: string, options: EnhancedToastOptions = {}): string {
    return toast.loading(message, {
      ...options
    });
  }

  dismiss(toastId: string): void {
    toast.dismiss(toastId);
  }

  dismissAll(): void {
    toast.dismiss();
  }

  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ): Promise<T> {
    return toast.promise(promise, messages);
  }
}

export const toastService = new ToastService();

export const showToast = {
  success: (message: string, options?: EnhancedToastOptions) => toastService.success(message, options),
  error: (message: string, options?: EnhancedToastOptions) => toastService.error(message, options),
  warning: (message: string, options?: EnhancedToastOptions) => toastService.warning(message, options),
  info: (message: string, options?: EnhancedToastOptions) => toastService.info(message, options),
  loading: (message: string, options?: EnhancedToastOptions) => toastService.loading(message, options),
  promise: <T>(promise: Promise<T>, messages: any) => toastService.promise(promise, messages),
  dismiss: (toastId: string) => toastService.dismiss(toastId),
  dismissAll: () => toastService.dismissAll()
};

export default toastService;
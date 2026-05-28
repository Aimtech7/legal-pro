// Loading State Components for LegalPro v1.0.1 - WCAG 2.1 AA Compliant
import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  label = 'Loading...'
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colors = {
    primary: 'text-navy-600',
    secondary: 'text-gold-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <div className="inline-flex items-center" role="status" aria-label={label}>
      <Loader2 
        className={clsx(
          'animate-spin',
          sizes[size],
          colors[color],
          className
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

// ============================================================================
// LOADING OVERLAY COMPONENT
// ============================================================================

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  backdrop?: boolean;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  size = 'md',
  backdrop = true,
  className
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx(
        'absolute inset-0 flex items-center justify-center z-50',
        backdrop && 'bg-white/80 backdrop-blur-sm',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center space-y-3 p-6 bg-white rounded-lg shadow-lg border">
        <Spinner size={size} />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </motion.div>
  );
};

// ============================================================================
// PROGRESS BAR COMPONENT
// ============================================================================

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  color = 'primary',
  showPercentage = true,
  label,
  className
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colors = {
    primary: 'bg-navy-600',
    secondary: 'bg-gold-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  return (
    <div className={clsx('w-full', className)} role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && <span className="text-sm text-gray-500">{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className={clsx('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// SKELETON LOADER COMPONENTS
// ============================================================================

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

const SkeletonBase: React.FC<SkeletonProps> = ({ className, animate = true }) => (
  <div
    className={clsx(
      'bg-gray-200 rounded',
      animate && 'animate-pulse',
      className
    )}
    aria-hidden="true"
  />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className 
}) => (
  <div className={clsx('space-y-2', className)} aria-label="Loading content">
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBase
        key={index}
        className={clsx(
          'h-4',
          index === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('p-6 border border-gray-200 rounded-lg', className)} aria-label="Loading card">
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonBase className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonBase className="h-4 w-1/2" />
        <SkeletonBase className="h-3 w-1/3" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => (
  <div className={clsx('space-y-3', className)} aria-label="Loading table">
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonBase key={`header-${index}`} className="h-6" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonBase key={`cell-${rowIndex}-${colIndex}`} className="h-4" />
        ))}
      </div>
    ))}
  </div>
);

// ============================================================================
// LOADING BUTTON COMPONENT
// ============================================================================

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-navy-800 text-white hover:bg-navy-700 focus:ring-navy-500",
    secondary: "bg-gold-500 text-white hover:bg-gold-600 focus:ring-gold-400",
    outline: "border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white focus:ring-navy-500",
    ghost: "text-navy-800 hover:bg-navy-100 focus:ring-navy-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[32px]",
    md: "px-4 py-2 text-base min-h-[40px]",
    lg: "px-6 py-3 text-lg min-h-[48px]"
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner 
          size={size === 'lg' ? 'md' : 'sm'} 
          color={variant === 'outline' || variant === 'ghost' ? 'primary' : 'white'}
          className="mr-2"
          label={loadingText || 'Processing...'}
        />
      )}
      <span className={loading ? 'opacity-75' : ''}>
        {loading && loadingText ? loadingText : children}
      </span>
    </button>
  );
};

// ============================================================================
// LOADING STATES HOOK
// ============================================================================

export const useLoadingState = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);
  const [error, setError] = React.useState<string | null>(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setErrorState = (errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
  };

  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    reset
  };
};

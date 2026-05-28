// Input component for LegalPro v1.0.1 - WCAG 2.1 AA Compliant
import React, { useId } from 'react';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  success?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  variant = 'default',
  inputSize = 'md',
  success = false,
  loading = false,
  fullWidth = true,
  className,
  required,
  id: providedId,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const describedBy = [
    error ? errorId : null,
    helperText ? helperId : null
  ].filter(Boolean).join(' ') || undefined;

  const baseClasses = "input-accessible transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses = {
    default: "bg-white border border-gray-300 focus-visible:border-primary-500",
    filled: "bg-gray-50 border border-gray-200 focus-visible:bg-white focus-visible:border-primary-500",
    outlined: "bg-transparent border-2 border-gray-300 focus-visible:border-primary-500"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[44px]",
    md: "px-3 py-2.5 text-base min-h-[44px]",
    lg: "px-4 py-3 text-lg min-h-[48px]"
  };

  const stateClasses = error
    ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
    : success
    ? "border-green-500 focus-visible:ring-green-500 focus-visible:border-green-500"
    : "";

  const widthClasses = fullWidth ? "w-full" : "";
  const iconClasses = (icon || error || success || loading) ? "pl-10" : "";

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[inputSize],
    stateClasses,
    widthClasses,
    iconClasses,
    "rounded-md",
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        {(icon || error || success || loading) && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500" aria-hidden="true" />
            ) : error ? (
              <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
            ) : success ? (
              <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
            ) : (
              icon
            )}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={classes}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        />
      </div>
      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600 flex items-center"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id={helperId}
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
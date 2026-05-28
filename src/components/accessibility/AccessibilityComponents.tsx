// Accessibility components for LegalPro v1.0.1 - WCAG 2.1 AA Compliant
import React, { useEffect, useRef } from 'react';
import { useLiveRegion, useSkipLinks } from '../../hooks/useAccessibility';

/**
 * Skip Links Component for Keyboard Navigation
 */
export const SkipLinks: React.FC = () => {
  const { skipToMain, skipToNavigation } = useSkipLinks();

  return (
    <div className="sr-only focus-within:not-sr-only">
      <button
        className="skip-link"
        onClick={skipToMain}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            skipToMain();
          }
        }}
      >
        Skip to main content
      </button>
      <button
        className="skip-link ml-2"
        onClick={skipToNavigation}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            skipToNavigation();
          }
        }}
      >
        Skip to navigation
      </button>
    </div>
  );
};

/**
 * Live Region Component for Screen Reader Announcements
 */
interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  priority = 'polite',
  className = 'sr-only'
}) => {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className={className}
    >
      {message}
    </div>
  );
};

/**
 * Screen Reader Only Text Component
 */
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  as: Component = 'span'
}) => {
  return <Component className="sr-only">{children}</Component>;
};

/**
 * Focus Trap Component for Modals
 */
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  onEscape?: () => void;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  isActive,
  onEscape,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.();
      }
    };

    container.addEventListener('keydown', handleTabKey);
    container.addEventListener('keydown', handleEscapeKey);
    
    // Focus first element when trap becomes active
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      container.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive, onEscape]);

  return (
    <div
      ref={containerRef}
      className={`focus-trap ${className}`}
      role="dialog"
      aria-modal={isActive}
    >
      {children}
    </div>
  );
};

/**
 * Accessible Heading Component with Proper Hierarchy
 */
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className = '',
  id
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Component
      id={id}
      className={className}
      tabIndex={-1} // Allow programmatic focus for skip links
    >
      {children}
    </Component>
  );
};

/**
 * Accessible Link Component with External Link Indicators
 */
interface AccessibleLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AccessibleLink: React.FC<AccessibleLinkProps> = ({
  href,
  children,
  external = false,
  className = '',
  onClick
}) => {
  const isExternal = external || href.startsWith('http');

  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(isExternal && {
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-describedby': 'external-link-description'
      })}
    >
      {children}
      {isExternal && (
        <>
          <ScreenReaderOnly>(opens in new tab)</ScreenReaderOnly>
          <span aria-hidden="true" className="ml-1">↗</span>
        </>
      )}
    </a>
  );
};

/**
 * Accessible Button with Loading State
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={`btn-accessible ${props.className || ''}`}
    >
      {loading ? (
        <>
          <span aria-hidden="true" className="animate-spin mr-2">⟳</span>
          <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
          <span aria-hidden="true">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * Error Boundary with Accessible Error Display
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AccessibleErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Accessibility Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-700">
              We're sorry, but there was an error loading this content. Please try refreshing the page.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Accessible Form Field with Proper Labeling
 */
interface FormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  children,
  error,
  helperText,
  required = false,
  className = ''
}) => {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy = [
    error ? errorId : null,
    helperText ? helperId : null
  ].filter(Boolean).join(' ');

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required
      })}
      
      {helperText && (
        <p id={helperId} className="text-sm text-gray-600">
          {helperText}
        </p>
      )}
      
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

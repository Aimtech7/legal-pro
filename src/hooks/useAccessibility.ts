// Accessibility hooks for LegalPro v1.0.1 - WCAG 2.1 AA Compliant
import { useEffect, useRef, useState } from 'react';

/**
 * Hook for managing focus trap in modals and dialogs
 */
export const useFocusTrap = (isActive: boolean = false) => {
  const containerRef = useRef<HTMLElement>(null);

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
        // Allow parent component to handle escape
        container.dispatchEvent(new CustomEvent('escape-key'));
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
  }, [isActive]);

  return containerRef;
};

/**
 * Hook for managing live regions for screen reader announcements
 */
export const useLiveRegion = () => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');

  const announce = (text: string, level: 'polite' | 'assertive' = 'polite') => {
    setMessage(''); // Clear first to ensure re-announcement
    setTimeout(() => {
      setMessage(text);
      setPriority(level);
    }, 100);
  };

  const clear = () => setMessage('');

  return { message, priority, announce, clear };
};

/**
 * Hook for managing keyboard navigation
 */
export const useKeyboardNavigation = (
  items: HTMLElement[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
  } = {}
) => {
  const { loop = true, orientation = 'vertical' } = options;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        setCurrentIndex(prev => {
          const next = prev + 1;
          if (next >= items.length) {
            return loop ? 0 : prev;
          }
          return next;
        });
        break;

      case prevKey:
        e.preventDefault();
        setCurrentIndex(prev => {
          const next = prev - 1;
          if (next < 0) {
            return loop ? items.length - 1 : prev;
          }
          return next;
        });
        break;

      case 'Home':
        e.preventDefault();
        setCurrentIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setCurrentIndex(items.length - 1);
        break;
    }
  };

  useEffect(() => {
    items[currentIndex]?.focus();
  }, [currentIndex, items]);

  return { currentIndex, handleKeyDown };
};

/**
 * Hook for managing skip links
 */
export const useSkipLinks = () => {
  const skipToMain = () => {
    const mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
    if (mainElement) {
      (mainElement as HTMLElement).focus();
      (mainElement as HTMLElement).scrollIntoView();
    }
  };

  const skipToNavigation = () => {
    const navElement = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    if (navElement) {
      (navElement as HTMLElement).focus();
      (navElement as HTMLElement).scrollIntoView();
    }
  };

  return { skipToMain, skipToNavigation };
};

/**
 * Hook for managing ARIA attributes dynamically
 */
export const useAriaAttributes = (initialAttributes: Record<string, string> = {}) => {
  const [attributes, setAttributes] = useState(initialAttributes);

  const updateAttribute = (key: string, value: string) => {
    setAttributes(prev => ({ ...prev, [key]: value }));
  };

  const removeAttribute = (key: string) => {
    setAttributes(prev => {
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  };

  const toggleAttribute = (key: string, trueValue: string, falseValue: string) => {
    setAttributes(prev => ({
      ...prev,
      [key]: prev[key] === trueValue ? falseValue : trueValue
    }));
  };

  return { attributes, updateAttribute, removeAttribute, toggleAttribute };
};

/**
 * Hook for managing reduced motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook for managing color scheme preferences
 */
export const useColorScheme = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);

  useEffect(() => {
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setPrefersHighContrast(highContrastQuery.matches);
    setPrefersDarkMode(darkModeQuery.matches);

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setPrefersDarkMode(e.matches);
    };

    highContrastQuery.addEventListener('change', handleHighContrastChange);
    darkModeQuery.addEventListener('change', handleDarkModeChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
      darkModeQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  return { prefersHighContrast, prefersDarkMode };
};

/**
 * Hook for managing form accessibility
 */
export const useFormAccessibility = () => {
  const generateId = (prefix: string = 'field') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getAriaDescribedBy = (fieldId: string, hasError: boolean, hasHelper: boolean) => {
    const ids = [];
    if (hasError) ids.push(`${fieldId}-error`);
    if (hasHelper) ids.push(`${fieldId}-helper`);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  return { generateId, getAriaDescribedBy };
};

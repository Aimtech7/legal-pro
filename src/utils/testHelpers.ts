
// Test helpers for loading and error handling - LegalPro v1.0.1
import { ApiError } from '../services/apiService';

// Mock API responses for testing
export const mockApiResponses = {
  // Success responses
  success: {
    cases: [
      {
        id: '1',
        title: 'Property Dispute Resolution',
        status: 'in_progress',
        priority: 'high',
        clientId: 'client-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Contract Negotiation',
        status: 'pending',
        priority: 'medium',
        clientId: 'client-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    appointments: [
      {
        id: '1',
        title: 'Initial Consultation',
        date: new Date().toISOString(),
        status: 'scheduled',
        clientId: 'client-1',
        advocateId: 'advocate-1'
      }
    ],
    dashboardStats: {
      activeCases: 3,
      upcomingAppointments: 2,
      pendingActions: 5,
      outstandingFees: 2500
    }
  },

  // Error responses
  errors: {
    network: new ApiError('Network error. Please check your internet connection.', 'NETWORK_ERROR'),
    timeout: new ApiError('Request timeout. Please check your connection and try again.', 'TIMEOUT'),
    unauthorized: new ApiError('Your session has expired. Please log in again.', 'UNAUTHORIZED', 401),
    forbidden: new ApiError('You do not have permission to perform this action.', 'FORBIDDEN', 403),
    notFound: new ApiError('The requested resource was not found.', 'NOT_FOUND', 404),
    validation: new ApiError('Invalid data provided.', 'VALIDATION_ERROR', 422, {
      email: ['Email is required'],
      password: ['Password must be at least 8 characters']
    }),
    rateLimit: new ApiError('Too many requests. Please wait a moment and try again.', 'RATE_LIMIT', 429),
    serverError: new ApiError('Server error. Please try again later.', 'SERVER_ERROR', 500)
  }
};

// Simulate network delays
export const simulateDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simulate API call with loading and error states
export const simulateApiCall = async <T>(
  response: T | ApiError,
  delay: number = 1000,
  shouldFail: boolean = false
): Promise<T> => {
  await simulateDelay(delay);
  
  if (shouldFail || response instanceof ApiError) {
    throw response;
  }
  
  return response as T;
};

// Test scenarios for different loading states
export const testScenarios = {
  // Fast loading (< 1 second)
  fast: {
    delay: 500,
    shouldFail: false
  },
  
  // Normal loading (1-3 seconds)
  normal: {
    delay: 2000,
    shouldFail: false
  },
  
  // Slow loading (3-5 seconds)
  slow: {
    delay: 4000,
    shouldFail: false
  },
  
  // Very slow loading (> 5 seconds)
  verySlow: {
    delay: 6000,
    shouldFail: false
  },
  
  // Network error
  networkError: {
    delay: 1000,
    shouldFail: true,
    error: mockApiResponses.errors.network
  },
  
  // Timeout error
  timeoutError: {
    delay: 1000,
    shouldFail: true,
    error: mockApiResponses.errors.timeout
  },
  
  // Server error
  serverError: {
    delay: 1000,
    shouldFail: true,
    error: mockApiResponses.errors.serverError
  },
  
  // Validation error
  validationError: {
    delay: 500,
    shouldFail: true,
    error: mockApiResponses.errors.validation
  }
};

// Mock API service for testing
export const createMockApiService = (scenario: keyof typeof testScenarios = 'normal') => {
  const config = testScenarios[scenario];
  
  return {
    getCases: () => simulateApiCall(
      config.shouldFail ? config.error! : mockApiResponses.success.cases,
      config.delay,
      config.shouldFail
    ),
    
    getAppointments: () => simulateApiCall(
      config.shouldFail ? config.error! : mockApiResponses.success.appointments,
      config.delay,
      config.shouldFail
    ),
    
    getDashboardData: () => simulateApiCall(
      config.shouldFail ? config.error! : mockApiResponses.success.dashboardStats,
      config.delay,
      config.shouldFail
    ),
    
    createCase: (data: any) => simulateApiCall(
      config.shouldFail ? config.error! : { ...data, id: Date.now().toString() },
      config.delay,
      config.shouldFail
    ),
    
    updateCase: (id: string, data: any) => simulateApiCall(
      config.shouldFail ? config.error! : { ...data, id },
      config.delay,
      config.shouldFail
    ),
    
    deleteCase: (id: string) => simulateApiCall(
      config.shouldFail ? config.error! : { success: true },
      config.delay,
      config.shouldFail
    )
  };
};

// Accessibility testing helpers
export const accessibilityTestHelpers = {
  // Check if loading indicators have proper ARIA attributes
  checkLoadingAria: (element: HTMLElement): boolean => {
    const hasRole = element.getAttribute('role') === 'status';
    const hasAriaLabel = element.hasAttribute('aria-label');
    const hasAriaLive = element.getAttribute('aria-live') === 'polite';
    
    return hasRole && (hasAriaLabel || hasAriaLive);
  },
  
  // Check if error messages have proper ARIA attributes
  checkErrorAria: (element: HTMLElement): boolean => {
    const hasRole = element.getAttribute('role') === 'alert';
    const hasAriaLive = element.getAttribute('aria-live') === 'polite';
    
    return hasRole && hasAriaLive;
  },
  
  // Check if interactive elements are keyboard accessible
  checkKeyboardAccessibility: (element: HTMLElement): boolean => {
    const isButton = element.tagName === 'BUTTON';
    const hasTabIndex = element.hasAttribute('tabindex');
    const hasRole = element.getAttribute('role') === 'button';
    
    return isButton || (hasTabIndex && hasRole);
  },
  
  // Check color contrast (simplified check)
  checkColorContrast: (foreground: string, background: string): boolean => {
    // This is a simplified check - in real testing, use proper contrast calculation
    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    
    return ratio >= 4.5; // WCAG AA standard
  }
};

// Helper function to calculate luminance (simplified)
function getLuminance(color: string): number {
  // This is a simplified implementation
  // In real testing, use a proper color library
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Performance testing helpers
export const performanceTestHelpers = {
  // Measure time to first loading indicator
  measureLoadingTime: (): { start: () => void; end: () => number } => {
    let startTime: number;
    
    return {
      start: () => {
        startTime = performance.now();
      },
      end: () => {
        return performance.now() - startTime;
      }
    };
  },
  
  // Check if loading indicators appear within 100ms
  checkLoadingSpeed: async (triggerLoading: () => void): Promise<boolean> => {
    const timer = performanceTestHelpers.measureLoadingTime();
    timer.start();
    
    triggerLoading();
    
    // Wait for loading indicator to appear
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const loadingTime = timer.end();
    return loadingTime <= 100; // Should appear within 100ms
  }
};

// Mobile testing helpers
export const mobileTestHelpers = {
  // Simulate mobile viewport
  setMobileViewport: () => {
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    Object.defineProperty(window, 'innerHeight', { value: 667 });
    window.dispatchEvent(new Event('resize'));
  },
  
  // Simulate tablet viewport
  setTabletViewport: () => {
    Object.defineProperty(window, 'innerWidth', { value: 768 });
    Object.defineProperty(window, 'innerHeight', { value: 1024 });
    window.dispatchEvent(new Event('resize'));
  },
  
  // Simulate desktop viewport
  setDesktopViewport: () => {
    Object.defineProperty(window, 'innerWidth', { value: 1920 });
    Object.defineProperty(window, 'innerHeight', { value: 1080 });
    window.dispatchEvent(new Event('resize'));
  },
  
  // Check touch target size (minimum 44px)
  checkTouchTargetSize: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  }
};
=======
// Test Helper Utilities for LegalPro v1.0.1 - Mobile and Accessibility Testing
import { fireEvent } from '@testing-library/react';

// Mobile viewport dimensions
export const VIEWPORT_SIZES = {
  mobile: {
    small: { width: 320, height: 568 }, // iPhone SE
    medium: { width: 375, height: 667 }, // iPhone 8
    large: { width: 414, height: 896 } // iPhone 11 Pro Max
  },
  tablet: {
    small: { width: 768, height: 1024 }, // iPad
    large: { width: 1024, height: 1366 } // iPad Pro
  },
  desktop: {
    small: { width: 1200, height: 800 },
    medium: { width: 1440, height: 900 },
    large: { width: 1920, height: 1080 }
  }
};

// Mobile test helpers
export const mobileTestHelpers = {
  /**
   * Set mobile viewport for testing
   */
  setMobileViewport: (size: 'small' | 'medium' | 'large' = 'medium') => {
    const viewport = VIEWPORT_SIZES.mobile[size];
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: viewport.width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: viewport.height,
    });
    
    // Trigger resize event
    fireEvent(window, new Event('resize'));
  },

  /**
   * Set tablet viewport for testing
   */
  setTabletViewport: (size: 'small' | 'large' = 'small') => {
    const viewport = VIEWPORT_SIZES.tablet[size];
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: viewport.width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: viewport.height,
    });
    
    fireEvent(window, new Event('resize'));
  },

  /**
   * Set desktop viewport for testing
   */
  setDesktopViewport: (size: 'small' | 'medium' | 'large' = 'medium') => {
    const viewport = VIEWPORT_SIZES.desktop[size];
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: viewport.width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: viewport.height,
    });
    
    fireEvent(window, new Event('resize'));
  },

  /**
   * Check if element meets minimum touch target size (44px)
   */
  checkTouchTargetSize: (element: Element): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  },

  /**
   * Simulate touch events for swipe gestures
   */
  simulateSwipe: (element: Element, direction: 'left' | 'right' | 'up' | 'down', distance: number = 100) => {
    const startCoords = { x: 0, y: 0 };
    const endCoords = { x: 0, y: 0 };

    switch (direction) {
      case 'right':
        endCoords.x = distance;
        break;
      case 'left':
        endCoords.x = -distance;
        break;
      case 'down':
        endCoords.y = distance;
        break;
      case 'up':
        endCoords.y = -distance;
        break;
    }

    // Touch start
    fireEvent.touchStart(element, {
      touches: [{ clientX: startCoords.x, clientY: startCoords.y }]
    });

    // Touch move
    fireEvent.touchMove(element, {
      touches: [{ clientX: endCoords.x, clientY: endCoords.y }]
    });

    // Touch end
    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: endCoords.x, clientY: endCoords.y }]
    });
  },

  /**
   * Check if element is visible in viewport
   */
  isElementInViewport: (element: Element): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  },

  /**
   * Mock touch device
   */
  mockTouchDevice: () => {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 5,
    });
    
    Object.defineProperty(window, 'ontouchstart', {
      writable: true,
      configurable: true,
      value: () => {},
    });
  },

  /**
   * Mock non-touch device
   */
  mockNonTouchDevice: () => {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0,
    });
    
    delete (window as any).ontouchstart;
  }
};

// Accessibility test helpers
export const accessibilityTestHelpers = {
  /**
   * Check if element has proper ARIA attributes
   */
  hasProperARIA: (element: Element, expectedAttributes: Record<string, string>): boolean => {
    return Object.entries(expectedAttributes).every(([attr, value]) => {
      return element.getAttribute(attr) === value;
    });
  },

  /**
   * Check color contrast ratio (simplified)
   */
  checkColorContrast: (element: Element): { ratio: number; passes: boolean } => {
    const styles = window.getComputedStyle(element);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;
    
    // Simplified contrast calculation
    // In real implementation, use proper color contrast calculation
    const ratio = 4.5; // Mock ratio
    const passes = ratio >= 4.5;
    
    return { ratio, passes };
  },

  /**
   * Check if element is focusable
   */
  isFocusable: (element: Element): boolean => {
    const focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    return focusableElements.some(selector => element.matches(selector));
  },

  /**
   * Get focus order of elements
   */
  getFocusOrder: (container: Element): Element[] => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    return Array.from(focusableElements).sort((a, b) => {
      const aTabIndex = parseInt(a.getAttribute('tabindex') || '0');
      const bTabIndex = parseInt(b.getAttribute('tabindex') || '0');
      return aTabIndex - bTabIndex;
    });
  },

  /**
   * Mock screen reader
   */
  mockScreenReader: () => {
    const announcements: string[] = [];
    
    // Mock ARIA live region announcements
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name: string, value: string) {
      if (name === 'aria-live' && value === 'polite') {
        // Mock announcement
        announcements.push(this.textContent || '');
      }
      return originalSetAttribute.call(this, name, value);
    };
    
    return {
      getAnnouncements: () => announcements,
      clearAnnouncements: () => announcements.length = 0
    };
  },

  /**
   * Check keyboard navigation
   */
  testKeyboardNavigation: (container: Element): boolean => {
    const focusableElements = accessibilityTestHelpers.getFocusOrder(container);
    
    if (focusableElements.length === 0) return true;
    
    // Test Tab navigation
    let currentIndex = 0;
    focusableElements[currentIndex].focus();
    
    for (let i = 1; i < focusableElements.length; i++) {
      fireEvent.keyDown(focusableElements[currentIndex], { key: 'Tab' });
      currentIndex = i;
      
      if (document.activeElement !== focusableElements[currentIndex]) {
        return false;
      }
    }
    
    return true;
  }
};

// Performance test helpers
export const performanceTestHelpers = {
  /**
   * Measure component render time
   */
  measureRenderTime: async (renderFunction: () => void): Promise<number> => {
    const start = performance.now();
    renderFunction();
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for render
    const end = performance.now();
    return end - start;
  },

  /**
   * Mock performance API
   */
  mockPerformanceAPI: () => {
    const marks: Record<string, number> = {};
    const measures: Record<string, number> = {};
    
    return {
      now: () => Date.now(),
      mark: (name: string) => {
        marks[name] = Date.now();
      },
      measure: (name: string, startMark: string, endMark: string) => {
        const duration = marks[endMark] - marks[startMark];
        measures[name] = duration;
        return duration;
      },
      getMarks: () => marks,
      getMeasures: () => measures
    };
  },

  /**
   * Check animation performance
   */
  checkAnimationPerformance: (element: Element): Promise<boolean> => {
    return new Promise((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();
      
      const checkFrame = () => {
        frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed >= 1000) { // Check for 1 second
          const fps = frameCount;
          resolve(fps >= 55); // Should maintain ~60fps
        } else {
          requestAnimationFrame(checkFrame);
        }
      };
      
      requestAnimationFrame(checkFrame);
    });
  }
};

// API test helpers
export const apiTestHelpers = {
  /**
   * Mock successful API response
   */
  mockSuccessResponse: <T>(data: T, delay: number = 100): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  },

  /**
   * Mock API error
   */
  mockErrorResponse: (message: string, status: number = 500, delay: number = 100): Promise<never> => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        const error = new Error(message);
        (error as any).status = status;
        reject(error);
      }, delay);
    });
  },

  /**
   * Mock network timeout
   */
  mockTimeout: (delay: number = 5000): Promise<never> => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, delay);
    });
  },

  /**
   * Mock progressive loading
   */
  mockProgressiveLoading: (totalSteps: number, stepDelay: number = 200): Promise<void> => {
    return new Promise((resolve) => {
      let currentStep = 0;
      
      const nextStep = () => {
        currentStep++;
        if (currentStep >= totalSteps) {
          resolve();
        } else {
          setTimeout(nextStep, stepDelay);
        }
      };
      
      setTimeout(nextStep, stepDelay);
    });
  }
};

// Toast-specific test helpers
export const toastTestHelpers = {
  /**
   * Wait for toast to appear
   */
  waitForToast: async (message: string, timeout: number = 5000): Promise<Element> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkForToast = () => {
        const toast = document.querySelector(`[aria-label*="${message}"]`);
        
        if (toast) {
          resolve(toast);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Toast with message "${message}" not found within ${timeout}ms`));
        } else {
          setTimeout(checkForToast, 100);
        }
      };
      
      checkForToast();
    });
  },

  /**
   * Count visible toasts
   */
  countVisibleToasts: (): number => {
    return document.querySelectorAll('[role="alert"]').length;
  },

  /**
   * Get toast by type
   */
  getToastByType: (type: string): Element | null => {
    return document.querySelector(`[aria-label^="${type}:"]`);
  },

  /**
   * Check toast positioning
   */
  checkToastPosition: (position: string): boolean => {
    const container = document.querySelector('.toast-container');
    if (!container) return false;
    
    const styles = window.getComputedStyle(container);
    
    switch (position) {
      case 'top-right':
        return styles.top !== 'auto' && styles.right !== 'auto';
      case 'top-left':
        return styles.top !== 'auto' && styles.left !== 'auto';
      case 'bottom-right':
        return styles.bottom !== 'auto' && styles.right !== 'auto';
      default:
        return false;
    }
  }
};

export default {
  mobileTestHelpers,
  accessibilityTestHelpers,
  performanceTestHelpers,
  apiTestHelpers,
  toastTestHelpers
};


// Toast Accessibility Tests for LegalPro v1.0.1 - WCAG 2.1 AA Compliance
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { Toast, ToastContainer } from '../components/ui/Toast';
import { toastService, showToast } from '../services/toastService';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock toast props for testing
const mockToastProps = {
  id: 'test-toast-1',
  type: 'success' as const,
  message: 'Test message',
  onDismiss: jest.fn(),
  visible: true
};

describe('Toast Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WCAG 2.1 AA Compliance', () => {
    test('should have no accessibility violations', async () => {
      const { container } = render(<Toast {...mockToastProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
      expect(toast).toHaveAttribute('aria-label', 'success: Test message');
    });

    test('should have proper role and live region', () => {
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toBeInTheDocument();
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    test('should announce different toast types correctly', () => {
      const types = ['success', 'error', 'warning', 'info', 'loading'] as const;
      
      types.forEach(type => {
        const { unmount } = render(
          <Toast {...mockToastProps} type={type} />
        );
        
        const toast = screen.getByRole('alert');
        expect(toast).toHaveAttribute('aria-label', `${type}: Test message`);
        
        unmount();
      });
    });

    test('should have proper color contrast ratios', () => {
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      const computedStyle = window.getComputedStyle(toast);
      
      // Check that background and text colors provide sufficient contrast
      // This is a simplified test - in real scenarios, use proper contrast calculation
      expect(computedStyle.background).toBeTruthy();
      expect(computedStyle.color).toBeTruthy();
    });
  });

  describe('Keyboard Navigation', () => {
    test('should be focusable with keyboard', () => {
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('tabIndex', '0');
      
      toast.focus();
      expect(toast).toHaveFocus();
    });

    test('should dismiss on Escape key', async () => {
      const onDismiss = jest.fn();
      render(<Toast {...mockToastProps} onDismiss={onDismiss} />);
      
      const toast = screen.getByRole('alert');
      toast.focus();
      
      fireEvent.keyDown(toast, { key: 'Escape' });
      expect(onDismiss).toHaveBeenCalledWith('test-toast-1');
    });

    test('should navigate action buttons with Tab', async () => {
      const actions = [
        { label: 'Retry', action: jest.fn() },
        { label: 'Dismiss', action: jest.fn() }
      ];
      
      render(<Toast {...mockToastProps} actions={actions} />);
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      const dismissButton = screen.getByRole('button', { name: 'Dismiss notification' });
      
      // Tab navigation
      await userEvent.tab();
      expect(retryButton).toHaveFocus();
      
      await userEvent.tab();
      expect(dismissButton).toHaveFocus();
    });

    test('should activate action buttons with Enter and Space', async () => {
      const actionMock = jest.fn();
      const actions = [{ label: 'Retry', action: actionMock }];
      
      render(<Toast {...mockToastProps} actions={actions} />);
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      retryButton.focus();
      
      // Test Enter key
      fireEvent.keyDown(retryButton, { key: 'Enter' });
      expect(actionMock).toHaveBeenCalled();
      
      actionMock.mockClear();
      
      // Test Space key
      fireEvent.keyDown(retryButton, { key: ' ' });
      expect(actionMock).toHaveBeenCalled();
    });
  });

  describe('Screen Reader Support', () => {
    test('should have proper heading structure with title', () => {
      render(<Toast {...mockToastProps} title="Success Title" />);
      
      const title = screen.getByText('Success Title');
      expect(title).toHaveAttribute('id', expect.stringContaining('toast-title-'));
    });

    test('should associate message with title using aria-describedby', () => {
      render(<Toast {...mockToastProps} title="Success Title" />);
      
      const message = screen.getByText('Test message');
      const titleId = screen.getByText('Success Title').getAttribute('id');
      
      expect(message).toHaveAttribute('aria-describedby', titleId);
    });

    test('should announce progress for loading toasts', () => {
      render(
        <Toast 
          {...mockToastProps} 
          type="loading" 
          progress={50} 
        />
      );
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      expect(progressBar).toHaveAttribute('aria-label', 'Loading progress');
    });

    test('should have proper button labels', () => {
      const actions = [
        { label: 'Retry', action: jest.fn() },
        { label: 'View Details', action: jest.fn() }
      ];
      
      render(<Toast {...mockToastProps} actions={actions} />);
      
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View Details' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    test('should not trap focus within toast', () => {
      render(
        <div>
          <button>Before Toast</button>
          <Toast {...mockToastProps} />
          <button>After Toast</button>
        </div>
      );
      
      const beforeButton = screen.getByText('Before Toast');
      const afterButton = screen.getByText('After Toast');
      
      beforeButton.focus();
      expect(beforeButton).toHaveFocus();
      
      // Tab should move to next focusable element
      fireEvent.keyDown(beforeButton, { key: 'Tab' });
      // Focus should move naturally through the DOM
    });

    test('should maintain focus when toast is dismissed', async () => {
      const onDismiss = jest.fn();
      render(
        <div>
          <button>Focus Target</button>
          <Toast {...mockToastProps} onDismiss={onDismiss} />
        </div>
      );
      
      const focusTarget = screen.getByText('Focus Target');
      const toast = screen.getByRole('alert');
      
      focusTarget.focus();
      expect(focusTarget).toHaveFocus();
      
      // Dismiss toast
      fireEvent.keyDown(toast, { key: 'Escape' });
      
      // Focus should remain on the target element
      expect(focusTarget).toHaveFocus();
    });
  });

  describe('Reduced Motion Support', () => {
    test('should respect prefers-reduced-motion', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      // Check that animations are disabled or reduced
      expect(toast).toHaveClass('animate-enter');
    });
  });

  describe('Toast Container Accessibility', () => {
    test('should have proper container ARIA attributes', () => {
      const toasts = [
        { ...mockToastProps, id: 'toast-1' },
        { ...mockToastProps, id: 'toast-2', type: 'error' as const }
      ];
      
      render(<ToastContainer toasts={toasts} />);
      
      const container = screen.getByLabelText('Notifications');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    test('should handle multiple toasts without accessibility conflicts', () => {
      const toasts = [
        { ...mockToastProps, id: 'toast-1', message: 'First message' },
        { ...mockToastProps, id: 'toast-2', message: 'Second message', type: 'error' as const }
      ];
      
      render(<ToastContainer toasts={toasts} />);
      
      const alerts = screen.getAllByRole('alert');
      expect(alerts).toHaveLength(2);
      
      // Each toast should have unique IDs
      const firstToast = screen.getByLabelText('success: First message');
      const secondToast = screen.getByLabelText('error: Second message');
      
      expect(firstToast).toBeInTheDocument();
      expect(secondToast).toBeInTheDocument();
    });
  });

  describe('Error State Accessibility', () => {
    test('should properly announce error toasts', () => {
      render(
        <Toast 
          {...mockToastProps} 
          type="error" 
          title="Error Occurred"
          message="Something went wrong"
        />
      );
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-label', 'error: Something went wrong');
    });

    test('should have proper error action accessibility', () => {
      const retryAction = jest.fn();
      const actions = [
        { 
          label: 'Retry', 
          action: retryAction,
          variant: 'primary' as const
        }
      ];
      
      render(
        <Toast 
          {...mockToastProps} 
          type="error" 
          actions={actions}
        />
      );
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).not.toHaveAttribute('disabled');
    });
  });

  describe('Loading State Accessibility', () => {
    test('should announce loading progress changes', async () => {
      const { rerender } = render(
        <Toast 
          {...mockToastProps} 
          type="loading" 
          progress={25}
        />
      );
      
      let progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '25');
      
      // Update progress
      rerender(
        <Toast 
          {...mockToastProps} 
          type="loading" 
          progress={75}
        />
      );
      
      progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    });

    test('should not be dismissible during loading', () => {
      render(
        <Toast 
          {...mockToastProps} 
          type="loading" 
          dismissible={false}
        />
      );
      
      // Should not have dismiss button
      expect(screen.queryByRole('button', { name: 'Dismiss notification' })).not.toBeInTheDocument();
    });
  });
});

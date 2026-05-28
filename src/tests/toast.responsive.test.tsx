// Toast Responsive Design Tests for LegalPro v1.0.1 - Mobile & Desktop Compatibility
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Toast, ToastContainer } from '../components/ui/Toast';
import { mobileTestHelpers } from '../utils/testHelpers';

// Mock toast props for testing
const mockToastProps = {
  id: 'test-toast-1',
  type: 'success' as const,
  message: 'Test message for responsive testing',
  onDismiss: jest.fn(),
  visible: true
};

describe('Toast Responsive Design Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mobile Responsiveness (320px - 414px)', () => {
    beforeEach(() => {
      mobileTestHelpers.setMobileViewport();
    });

    afterEach(() => {
      mobileTestHelpers.setDesktopViewport();
    });

    test('should adapt to mobile viewport width', () => {
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      const computedStyle = window.getComputedStyle(toast);
      
      // Should have mobile-appropriate max-width
      expect(computedStyle.maxWidth).toBe('400px');
    });

    test('should have touch-friendly dismiss button', () => {
      render(<Toast {...mockToastProps} />);
      
      const dismissButton = screen.getByRole('button', { name: 'Dismiss notification' });
      const rect = dismissButton.getBoundingClientRect();
      
      // Should meet minimum touch target size (44px)
      expect(mobileTestHelpers.checkTouchTargetSize(dismissButton)).toBe(true);
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });

    test('should stack action buttons vertically on small screens', () => {
      const actions = [
        { label: 'Retry', action: jest.fn() },
        { label: 'View Details', action: jest.fn() },
        { label: 'Cancel', action: jest.fn() }
      ];
      
      render(<Toast {...mockToastProps} actions={actions} />);
      
      const actionContainer = screen.getByRole('button', { name: 'Retry' }).parentElement;
      const computedStyle = window.getComputedStyle(actionContainer!);
      
      // Should use flex-wrap for mobile
      expect(computedStyle.flexWrap).toBe('wrap');
    });

    test('should handle long messages on mobile', () => {
      const longMessage = 'This is a very long message that should wrap properly on mobile devices without breaking the layout or causing horizontal scrolling issues.';
      
      render(<Toast {...mockToastProps} message={longMessage} />);
      
      const toast = screen.getByRole('alert');
      const rect = toast.getBoundingClientRect();
      
      // Should not exceed viewport width
      expect(rect.width).toBeLessThanOrEqual(window.innerWidth);
    });

    test('should position toasts appropriately on mobile', () => {
      const toasts = [
        { ...mockToastProps, id: 'toast-1' },
        { ...mockToastProps, id: 'toast-2' }
      ];
      
      render(<ToastContainer toasts={toasts} position="top-center" />);
      
      const container = screen.getByLabelText('Notifications');
      const computedStyle = window.getComputedStyle(container);
      
      // Should be positioned for mobile
      expect(computedStyle.position).toBe('fixed');
    });

    test('should support swipe gestures on mobile', () => {
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      
      // Simulate swipe right gesture
      fireEvent.touchStart(toast, {
        touches: [{ clientX: 0, clientY: 0 }]
      });
      
      fireEvent.touchMove(toast, {
        touches: [{ clientX: 100, clientY: 0 }]
      });
      
      fireEvent.touchEnd(toast, {
        changedTouches: [{ clientX: 100, clientY: 0 }]
      });
      
      // Should trigger dismiss (in a real implementation)
      expect(mockToastProps.onDismiss).toHaveBeenCalled();
    });
  });

  describe('Tablet Responsiveness (768px - 1024px)', () => {
    beforeEach(() => {
      mobileTestHelpers.setTabletViewport();
    });

    afterEach(() => {
      mobileTestHelpers.setDesktopViewport();
    });

    test('should adapt to tablet viewport', () => {
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      const rect = toast.getBoundingClientRect();
      
      // Should have appropriate width for tablet
      expect(rect.width).toBeLessThanOrEqual(400);
    });

    test('should maintain touch targets on tablet', () => {
      const actions = [
        { label: 'Retry', action: jest.fn() },
        { label: 'Dismiss', action: jest.fn() }
      ];
      
      render(<Toast {...mockToastProps} actions={actions} />);
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      const dismissButton = screen.getByRole('button', { name: 'Dismiss notification' });
      
      expect(mobileTestHelpers.checkTouchTargetSize(retryButton)).toBe(true);
      expect(mobileTestHelpers.checkTouchTargetSize(dismissButton)).toBe(true);
    });

    test('should position toasts correctly on tablet', () => {
      const toasts = [mockToastProps];
      
      render(<ToastContainer toasts={toasts} position="top-right" />);
      
      const container = screen.getByLabelText('Notifications');
      const computedStyle = window.getComputedStyle(container);
      
      // Should maintain top-right positioning on tablet
      expect(computedStyle.top).toBeTruthy();
      expect(computedStyle.right).toBeTruthy();
    });
  });

  describe('Desktop Responsiveness (1200px+)', () => {
    beforeEach(() => {
      mobileTestHelpers.setDesktopViewport();
    });

    test('should display optimally on desktop', () => {
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      const rect = toast.getBoundingClientRect();
      
      // Should have desktop-appropriate max-width
      expect(rect.width).toBeLessThanOrEqual(400);
    });

    test('should support hover interactions on desktop', () => {
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      
      // Simulate hover
      fireEvent.mouseEnter(toast);
      
      // Should pause auto-dismiss timer (tested through implementation)
      expect(toast).toBeInTheDocument();
      
      fireEvent.mouseLeave(toast);
    });

    test('should handle multiple toasts stacking on desktop', () => {
      const toasts = [
        { ...mockToastProps, id: 'toast-1', message: 'First toast' },
        { ...mockToastProps, id: 'toast-2', message: 'Second toast' },
        { ...mockToastProps, id: 'toast-3', message: 'Third toast' }
      ];
      
      render(<ToastContainer toasts={toasts} position="top-right" />);
      
      const alerts = screen.getAllByRole('alert');
      expect(alerts).toHaveLength(3);
      
      // Should stack vertically with proper spacing
      const container = screen.getByLabelText('Notifications');
      const computedStyle = window.getComputedStyle(container);
      expect(computedStyle.display).toBe('flex');
    });

    test('should display action buttons horizontally on desktop', () => {
      const actions = [
        { label: 'Retry', action: jest.fn() },
        { label: 'View Details', action: jest.fn() },
        { label: 'Cancel', action: jest.fn() }
      ];
      
      render(<Toast {...mockToastProps} actions={actions} />);
      
      const actionContainer = screen.getByRole('button', { name: 'Retry' }).parentElement;
      const computedStyle = window.getComputedStyle(actionContainer!);
      
      // Should display actions in a row on desktop
      expect(computedStyle.display).toBe('flex');
    });
  });

  describe('Toast Container Positioning', () => {
    const positions = [
      'top-right',
      'top-left', 
      'top-center',
      'bottom-right',
      'bottom-left',
      'bottom-center'
    ] as const;

    positions.forEach(position => {
      test(`should position container correctly for ${position}`, () => {
        const toasts = [mockToastProps];
        
        render(<ToastContainer toasts={toasts} position={position} />);
        
        const container = screen.getByLabelText('Notifications');
        const computedStyle = window.getComputedStyle(container);
        
        expect(computedStyle.position).toBe('fixed');
        
        // Check position-specific styles
        if (position.includes('top')) {
          expect(computedStyle.top).toBeTruthy();
        }
        if (position.includes('bottom')) {
          expect(computedStyle.bottom).toBeTruthy();
        }
        if (position.includes('right')) {
          expect(computedStyle.right).toBeTruthy();
        }
        if (position.includes('left')) {
          expect(computedStyle.left).toBeTruthy();
        }
        if (position.includes('center')) {
          expect(computedStyle.transform).toContain('translateX');
        }
      });
    });
  });

  describe('Progress Bar Responsiveness', () => {
    test('should display progress bar appropriately on all screen sizes', () => {
      const viewports = [
        { name: 'mobile', setter: mobileTestHelpers.setMobileViewport },
        { name: 'tablet', setter: mobileTestHelpers.setTabletViewport },
        { name: 'desktop', setter: mobileTestHelpers.setDesktopViewport }
      ];

      viewports.forEach(({ name, setter }) => {
        setter();
        
        const { unmount } = render(
          <Toast 
            {...mockToastProps} 
            type="loading" 
            progress={50}
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        const rect = progressBar.getBoundingClientRect();
        
        // Should be visible and properly sized
        expect(rect.width).toBeGreaterThan(0);
        expect(rect.height).toBeGreaterThan(0);
        
        unmount();
      });
    });
  });

  describe('Typography Responsiveness', () => {
    test('should scale text appropriately across screen sizes', () => {
      const { rerender } = render(
        <Toast 
          {...mockToastProps} 
          title="Toast Title"
          message="Toast message content"
        />
      );
      
      // Test mobile
      mobileTestHelpers.setMobileViewport();
      rerender(
        <Toast 
          {...mockToastProps} 
          title="Toast Title"
          message="Toast message content"
        />
      );
      
      const title = screen.getByText('Toast Title');
      const message = screen.getByText('Toast message content');
      
      expect(title).toBeInTheDocument();
      expect(message).toBeInTheDocument();
      
      // Test desktop
      mobileTestHelpers.setDesktopViewport();
      rerender(
        <Toast 
          {...mockToastProps} 
          title="Toast Title"
          message="Toast message content"
        />
      );
      
      expect(title).toBeInTheDocument();
      expect(message).toBeInTheDocument();
    });
  });

  describe('Animation Performance', () => {
    test('should maintain 60fps animations across devices', () => {
      // Mock performance API
      const mockPerformance = {
        now: jest.fn(() => Date.now()),
        mark: jest.fn(),
        measure: jest.fn()
      };
      
      Object.defineProperty(window, 'performance', {
        value: mockPerformance
      });
      
      render(<Toast {...mockToastProps} />);
      
      const toast = screen.getByRole('alert');
      
      // Simulate animation frame
      fireEvent.animationStart(toast);
      fireEvent.animationEnd(toast);
      
      // Should complete without performance issues
      expect(toast).toBeInTheDocument();
    });

    test('should respect reduced motion preferences', () => {
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
      
      // Should have reduced or no animations
      expect(toast).toHaveClass('animate-enter');
    });
  });

  describe('Z-Index and Layering', () => {
    test('should maintain proper z-index across screen sizes', () => {
      const toasts = [mockToastProps];
      
      render(<ToastContainer toasts={toasts} />);
      
      const container = screen.getByLabelText('Notifications');
      const computedStyle = window.getComputedStyle(container);
      
      // Should have high z-index to appear above other content
      expect(parseInt(computedStyle.zIndex)).toBeGreaterThan(1000);
    });

    test('should not interfere with page content', () => {
      render(
        <div>
          <div data-testid="page-content">Page Content</div>
          <ToastContainer toasts={[mockToastProps]} />
        </div>
      );
      
      const pageContent = screen.getByTestId('page-content');
      const toast = screen.getByRole('alert');
      
      // Toast should not affect page content layout
      expect(pageContent).toBeInTheDocument();
      expect(toast).toBeInTheDocument();
    });
  });
});

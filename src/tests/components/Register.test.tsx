// Frontend tests for Registration Component - LegalPro v1.0.1
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Register from '../../pages/auth/Register';
import { server } from '../mocks/server';
import { rest } from 'msw';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    // Reset any runtime request handlers
    server.resetHandlers();
  });

  describe('Initial Render', () => {
    it('should render registration form', () => {
      renderWithProviders(<Register />);
      
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Advocate Registration')).toBeInTheDocument();
      expect(screen.getByText('Super Key Required')).toBeInTheDocument();
    });

    it('should show super key input field', () => {
      renderWithProviders(<Register />);
      
      expect(screen.getByLabelText(/super key/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter advocate super key/i)).toBeInTheDocument();
    });

    it('should not show registration form initially', () => {
      renderWithProviders(<Register />);
      
      expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/last name/i)).not.toBeInTheDocument();
    });
  });

  describe('Super Key Verification', () => {
    it('should verify valid super key', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Register />);
      
      const superKeyInput = screen.getByLabelText(/super key/i);
      await user.type(superKeyInput, 'ADVOCATE-SUPER-2024-DEV-KEY');
      
      await waitFor(() => {
        expect(screen.getByText(/super key verified/i)).toBeInTheDocument();
      });
    });

    it('should reject invalid super key', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Register />);
      
      const superKeyInput = screen.getByLabelText(/super key/i);
      await user.type(superKeyInput, 'INVALID-KEY');
      
      await waitFor(() => {
        expect(screen.queryByText(/super key verified/i)).not.toBeInTheDocument();
      });
    });

    it('should show registration form after super key verification', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Register />);
      
      const superKeyInput = screen.getByLabelText(/super key/i);
      await user.type(superKeyInput, 'ADVOCATE-SUPER-2024-DEV-KEY');
      
      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderWithProviders(<Register />);
      
      // Verify super key first
      const superKeyInput = screen.getByLabelText(/super key/i);
      await user.type(superKeyInput, 'ADVOCATE-SUPER-2024-DEV-KEY');
      
      await waitFor(() => {
        expect(screen.getByText(/super key verified/i)).toBeInTheDocument();
      });
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();
      
      const submitButton = screen.getByRole('button', { name: /register as advocate/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      
      const submitButton = screen.getByRole('button', { name: /register as advocate/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should validate password strength', async () => {
      const user = userEvent.setup();
      
      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'weak');
      
      await waitFor(() => {
        expect(screen.getByText(/password must include/i)).toBeInTheDocument();
        expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should validate password confirmation', async () => {
      const user = userEvent.setup();
      
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      
      await user.type(passwordInput, 'StrongPassword123!');
      await user.type(confirmPasswordInput, 'DifferentPassword123!');
      
      const submitButton = screen.getByRole('button', { name: /register as advocate/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should validate advocate-specific fields', async () => {
      const user = userEvent.setup();
      
      // Fill basic fields
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'StrongPassword123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongPassword123!');
      
      const submitButton = screen.getByRole('button', { name: /register as advocate/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/license number must be at least 3 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/please select a specialization/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Strength Indicator', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderWithProviders(<Register />);
      
      // Verify super key first
      const superKeyInput = screen.getByLabelText(/super key/i);
      await user.type(superKeyInput, 'ADVOCATE-SUPER-2024-DEV-KEY');
      
      await waitFor(() => {
        expect(screen.getByText(/super key verified/i)).toBeInTheDocument();
      });
    });

    it('should show password strength indicator', async () => {
      const user = userEvent.setup();
      
      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'weak');
      
      await waitFor(() => {
        expect(screen.getByText(/password strength/i)).toBeInTheDocument();
        expect(screen.getByText(/weak/i)).toBeInTheDocument();
      });
    });

    it('should update strength as password improves', async () => {
      const user = userEvent.setup();
      
      const passwordInput = screen.getByLabelText(/^password$/i);
      
      // Weak password
      await user.type(passwordInput, 'weak');
      await waitFor(() => {
        expect(screen.getByText(/weak/i)).toBeInTheDocument();
      });
      
      // Clear and type strong password
      await user.clear(passwordInput);
      await user.type(passwordInput, 'StrongPassword123!');
      
      await waitFor(() => {
        expect(screen.getByText(/strong/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderWithProviders(<Register />);
      
      // Verify super key first
      const superKeyInput = screen.getByLabelText(/super key/i);
      await user.type(superKeyInput, 'ADVOCATE-SUPER-2024-DEV-KEY');
      
      await waitFor(() => {
        expect(screen.getByText(/super key verified/i)).toBeInTheDocument();
      });
    });

    it('should submit valid form successfully', async () => {
      const user = userEvent.setup();
      
      // Fill all required fields
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Advocate');
      await user.type(screen.getByLabelText(/email/i), 'john.advocate@test.com');
      await user.type(screen.getByLabelText(/phone/i), '+254712345678');
      await user.type(screen.getByLabelText(/^password$/i), 'StrongPassword123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongPassword123!');
      await user.type(screen.getByLabelText(/license number/i), 'ADV-2024-001');
      await user.selectOptions(screen.getByLabelText(/specialization/i), 'Corporate Law');
      await user.type(screen.getByLabelText(/experience/i), '5 years of corporate law experience');
      await user.type(screen.getByLabelText(/education/i), 'LLB University of Nairobi');
      await user.type(screen.getByLabelText(/bar admission/i), 'Kenya Law Society 2019');
      await user.click(screen.getByLabelText(/terms and conditions/i));
      
      const submitButton = screen.getByRole('button', { name: /register as advocate/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/creating account/i)).toBeInTheDocument();
      });
    });

    it('should handle server validation errors', async () => {
      const user = userEvent.setup();
      
      // Mock server error response
      server.use(
        rest.post('/api/auth/register', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              success: false,
              message: 'Validation failed',
              errors: [
                { field: 'email', message: 'Email already exists' }
              ]
            })
          );
        })
      );
      
      // Fill form and submit
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Advocate');
      await user.type(screen.getByLabelText(/email/i), 'existing@test.com');
      await user.type(screen.getByLabelText(/phone/i), '+254712345678');
      await user.type(screen.getByLabelText(/^password$/i), 'StrongPassword123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongPassword123!');
      await user.type(screen.getByLabelText(/license number/i), 'ADV-2024-001');
      await user.selectOptions(screen.getByLabelText(/specialization/i), 'Corporate Law');
      await user.type(screen.getByLabelText(/experience/i), '5 years of corporate law experience');
      await user.type(screen.getByLabelText(/education/i), 'LLB University of Nairobi');
      await user.type(screen.getByLabelText(/bar admission/i), 'Kenya Law Society 2019');
      await user.click(screen.getByLabelText(/terms and conditions/i));
      
      const submitButton = screen.getByRole('button', { name: /register as advocate/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      
      // Fill minimum required fields
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Advocate');
      await user.type(screen.getByLabelText(/email/i), 'john@test.com');
      await user.type(screen.getByLabelText(/^password$/i), 'StrongPassword123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongPassword123!');
      await user.type(screen.getByLabelText(/license number/i), 'ADV-2024-001');
      await user.selectOptions(screen.getByLabelText(/specialization/i), 'Corporate Law');
      await user.type(screen.getByLabelText(/experience/i), '5 years experience');
      await user.type(screen.getByLabelText(/education/i), 'LLB University');
      await user.type(screen.getByLabelText(/bar admission/i), 'Bar 2019');
      await user.click(screen.getByLabelText(/terms and conditions/i));
      
      const submitButton = screen.getByRole('button', { name: /register as advocate/i });
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderWithProviders(<Register />);
      
      expect(screen.getByLabelText(/super key/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register as advocate/i })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Register />);
      
      const superKeyInput = screen.getByLabelText(/super key/i);
      
      // Tab to super key input
      await user.tab();
      expect(superKeyInput).toHaveFocus();
      
      // Type super key
      await user.type(superKeyInput, 'ADVOCATE-SUPER-2024-DEV-KEY');
      
      await waitFor(() => {
        expect(screen.getByText(/super key verified/i)).toBeInTheDocument();
      });
    });

    it('should announce form errors to screen readers', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Register />);
      
      // Verify super key first
      const superKeyInput = screen.getByLabelText(/super key/i);
      await user.type(superKeyInput, 'ADVOCATE-SUPER-2024-DEV-KEY');
      
      await waitFor(() => {
        expect(screen.getByText(/super key verified/i)).toBeInTheDocument();
      });
      
      // Submit empty form
      const submitButton = screen.getByRole('button', { name: /register as advocate/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });
  });
});

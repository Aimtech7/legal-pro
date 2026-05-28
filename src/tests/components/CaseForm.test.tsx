// CaseForm component tests for LegalPro v1.0.1
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import CaseForm from '../../components/cases/CaseForm';
import { userManagementService } from '../../services/userManagementService';

// Mock the services
vi.mock('../../services/userManagementService', () => ({
  userManagementService: {
    getUsers: vi.fn()
  }
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

const mockClients = [
  {
    _id: 'client1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  },
  {
    _id: 'client2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com'
  }
];

const mockAdmins = [
  {
    _id: 'admin1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    _id: 'advocate1',
    firstName: 'Advocate',
    lastName: 'User',
    email: 'advocate@example.com',
    role: 'advocate'
  }
];

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  case: null,
  isEditing: false
};

describe('CaseForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API responses
    (userManagementService.getUsers as any).mockImplementation((params: any) => {
      if (params.role === 'client') {
        return Promise.resolve({ data: mockClients });
      }
      if (params.role === 'admin,advocate') {
        return Promise.resolve({ data: mockAdmins });
      }
      return Promise.resolve({ data: [] });
    });
  });

  test('renders form when open', async () => {
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/case title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/client/i)).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<CaseForm {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Create New Case')).not.toBeInTheDocument();
  });

  test('loads users on mount', async () => {
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(userManagementService.getUsers).toHaveBeenCalledWith({ role: 'client' });
      expect(userManagementService.getUsers).toHaveBeenCalledWith({ role: 'admin,advocate' });
    });
  });

  test('displays validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /create case/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/case title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/case description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
      expect(screen.getByText(/client is required/i)).toBeInTheDocument();
    });
  });

  test('validates title length', async () => {
    const user = userEvent.setup();
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    const titleInput = screen.getByLabelText(/case title/i);
    const longTitle = 'a'.repeat(201); // Exceeds 200 character limit
    
    await user.type(titleInput, longTitle);
    await user.tab(); // Trigger validation
    
    await waitFor(() => {
      expect(screen.getByText(/title cannot exceed 200 characters/i)).toBeInTheDocument();
    });
  });

  test('validates description length', async () => {
    const user = userEvent.setup();
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    const descriptionInput = screen.getByLabelText(/description/i);
    const longDescription = 'a'.repeat(5001); // Exceeds 5000 character limit
    
    await user.type(descriptionInput, longDescription);
    await user.tab(); // Trigger validation
    
    await waitFor(() => {
      expect(screen.getByText(/description cannot exceed 5000 characters/i)).toBeInTheDocument();
    });
  });

  test('validates court date is not in the past', async () => {
    const user = userEvent.setup();
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    const courtDateInput = screen.getByLabelText(/court date/i);
    const pastDate = '2020-01-01';
    
    await user.type(courtDateInput, pastDate);
    await user.tab(); // Trigger validation
    
    await waitFor(() => {
      expect(screen.getByText(/court date cannot be in the past/i)).toBeInTheDocument();
    });
  });

  test('populates client and admin dropdowns', async () => {
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    // Wait for dropdowns to be populated
    await waitFor(() => {
      const clientSelect = screen.getByLabelText(/client/i);
      expect(clientSelect).toBeInTheDocument();
      
      // Check if clients are loaded
      expect(screen.getByText('John Doe (john@example.com)')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith (jane@example.com)')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      const assignedToSelect = screen.getByLabelText(/assigned to/i);
      expect(assignedToSelect).toBeInTheDocument();
      
      // Check if admins/advocates are loaded
      expect(screen.getByText('Admin User (admin)')).toBeInTheDocument();
      expect(screen.getByText('Advocate User (advocate)')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(<CaseForm {...defaultProps} onSubmit={mockOnSubmit} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    // Fill out the form
    await user.type(screen.getByLabelText(/case title/i), 'Test Case Title');
    await user.type(screen.getByLabelText(/description/i), 'Test case description');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Family Law');
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
    
    // Wait for clients to load and select one
    await waitFor(() => {
      expect(screen.getByText('John Doe (john@example.com)')).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/client/i), 'client1');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create case/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Case Title',
        description: 'Test case description',
        category: 'Family Law',
        priority: 'high',
        clientId: 'client1',
        assignedTo: '',
        courtDate: ''
      });
    });
  });

  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    render(<CaseForm {...defaultProps} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    render(<CaseForm {...defaultProps} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button', { name: '' }); // X button has no text
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('shows edit mode when editing existing case', async () => {
    const existingCase = {
      _id: 'case1',
      title: 'Existing Case',
      description: 'Existing description',
      category: 'Corporate Law',
      priority: 'medium',
      clientId: 'client1',
      assignedTo: 'admin1',
      courtDate: '2024-12-25',
      status: 'pending',
      caseNumber: 'CASE-2024-001',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    };
    
    render(
      <CaseForm 
        {...defaultProps} 
        case={existingCase} 
        isEditing={true} 
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Edit Case')).toBeInTheDocument();
    });
    
    // Check if form is populated with existing data
    expect(screen.getByDisplayValue('Existing Case')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Corporate Law')).toBeInTheDocument();
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-25')).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /update case/i })).toBeInTheDocument();
  });

  test('disables submit button when form is invalid', async () => {
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    const submitButton = screen.getByRole('button', { name: /create case/i });
    expect(submitButton).toBeDisabled();
  });

  test('enables submit button when form is valid', async () => {
    const user = userEvent.setup();
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    // Fill required fields
    await user.type(screen.getByLabelText(/case title/i), 'Test Case');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Family Law');
    
    // Wait for clients to load and select one
    await waitFor(() => {
      expect(screen.getByText('John Doe (john@example.com)')).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/client/i), 'client1');
    
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /create case/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('shows loading state during submission', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<CaseForm {...defaultProps} onSubmit={mockOnSubmit} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/case title/i), 'Test Case');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Family Law');
    
    await waitFor(() => {
      expect(screen.getByText('John Doe (john@example.com)')).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/client/i), 'client1');
    
    const submitButton = screen.getByRole('button', { name: /create case/i });
    await user.click(submitButton);
    
    // Check loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /create case/i })).toBeInTheDocument();
  });

  test('handles API error when loading users', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    (userManagementService.getUsers as any).mockRejectedValue(new Error('API Error'));
    
    render(<CaseForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Case')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Failed to load users:', expect.any(Error));
    });
    
    consoleError.mockRestore();
  });
});

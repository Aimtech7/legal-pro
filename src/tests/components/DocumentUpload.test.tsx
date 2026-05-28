// DocumentUpload component tests for LegalPro v1.0.1
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import DocumentUpload from '../../components/cases/DocumentUpload';
import { caseService } from '../../services/caseService';

// Mock the services
vi.mock('../../services/caseService', () => ({
  caseService: {
    uploadDocument: vi.fn()
  }
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

const defaultProps = {
  caseId: 'test-case-id',
  onUploadComplete: vi.fn(),
  onUploadError: vi.fn()
};

// Helper function to create a mock file
const createMockFile = (name: string, size: number, type: string) => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('DocumentUpload Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful upload
    (caseService.uploadDocument as any).mockResolvedValue({
      data: {
        id: 'doc1',
        name: 'test.pdf',
        originalName: 'test.pdf',
        type: 'application/pdf',
        size: 1024,
        url: 'https://example.com/test.pdf'
      }
    });
  });

  test('renders upload area', () => {
    render(<DocumentUpload {...defaultProps} />);
    
    expect(screen.getByText(/drop files here or click to browse/i)).toBeInTheDocument();
    expect(screen.getByText(/supports pdf, doc, docx/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum 10 files allowed/i)).toBeInTheDocument();
  });

  test('opens file dialog when upload area is clicked', async () => {
    const user = userEvent.setup();
    render(<DocumentUpload {...defaultProps} />);
    
    const uploadArea = screen.getByText(/drop files here or click to browse/i).closest('div');
    expect(uploadArea).toBeInTheDocument();
    
    // Mock file input click
    const fileInput = uploadArea?.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click').mockImplementation(() => {});
    
    await user.click(uploadArea!);
    
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  test('accepts valid file types', async () => {
    const user = userEvent.setup();
    render(<DocumentUpload {...defaultProps} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const validFile = createMockFile('test.pdf', 1024, 'application/pdf');
    
    await user.upload(fileInput, validFile);
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByText('Files to upload (1)')).toBeInTheDocument();
    });
  });

  test('rejects invalid file types', async () => {
    const user = userEvent.setup();
    const mockToastError = vi.fn();
    
    // Mock toast.error
    const toast = await import('react-hot-toast');
    vi.mocked(toast.default.error).mockImplementation(mockToastError);
    
    render(<DocumentUpload {...defaultProps} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const invalidFile = createMockFile('test.exe', 1024, 'application/x-executable');
    
    await user.upload(fileInput, invalidFile);
    
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        expect.stringContaining('File type application/x-executable is not supported')
      );
    });
  });

  test('rejects files that are too large', async () => {
    const user = userEvent.setup();
    const mockToastError = vi.fn();
    
    const toast = await import('react-hot-toast');
    vi.mocked(toast.default.error).mockImplementation(mockToastError);
    
    render(<DocumentUpload {...defaultProps} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const largeFile = createMockFile('large.pdf', 11 * 1024 * 1024, 'application/pdf'); // 11MB
    
    await user.upload(fileInput, largeFile);
    
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        expect.stringContaining('File size exceeds 10.00 MB limit')
      );
    });
  });

  test('limits number of files', async () => {
    const user = userEvent.setup();
    const mockToastError = vi.fn();
    
    const toast = await import('react-hot-toast');
    vi.mocked(toast.default.error).mockImplementation(mockToastError);
    
    render(<DocumentUpload {...defaultProps} maxFiles={2} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const files = [
      createMockFile('file1.pdf', 1024, 'application/pdf'),
      createMockFile('file2.pdf', 1024, 'application/pdf'),
      createMockFile('file3.pdf', 1024, 'application/pdf') // This should be rejected
    ];
    
    await user.upload(fileInput, files);
    
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Maximum 2 files allowed');
      expect(screen.getByText('Files to upload (2)')).toBeInTheDocument();
    });
  });

  test('handles drag and drop', async () => {
    render(<DocumentUpload {...defaultProps} />);
    
    const uploadArea = screen.getByText(/drop files here or click to browse/i).closest('div');
    const validFile = createMockFile('dropped.pdf', 1024, 'application/pdf');
    
    // Simulate drag over
    fireEvent.dragOver(uploadArea!, {
      dataTransfer: {
        files: [validFile]
      }
    });
    
    // Check if drag over state is applied (you might need to check for specific classes)
    expect(uploadArea).toBeInTheDocument();
    
    // Simulate drop
    fireEvent.drop(uploadArea!, {
      dataTransfer: {
        files: [validFile]
      }
    });
    
    await waitFor(() => {
      expect(screen.getByText('dropped.pdf')).toBeInTheDocument();
    });
  });

  test('removes file from upload list', async () => {
    const user = userEvent.setup();
    render(<DocumentUpload {...defaultProps} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const validFile = createMockFile('test.pdf', 1024, 'application/pdf');
    
    await user.upload(fileInput, validFile);
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
    
    // Find and click remove button
    const removeButton = screen.getByRole('button', { name: '' }); // X button
    await user.click(removeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
      expect(screen.queryByText('Files to upload')).not.toBeInTheDocument();
    });
  });

  test('uploads single file successfully', async () => {
    const user = userEvent.setup();
    const mockOnUploadComplete = vi.fn();
    const mockToastSuccess = vi.fn();
    
    const toast = await import('react-hot-toast');
    vi.mocked(toast.default.success).mockImplementation(mockToastSuccess);
    
    render(<DocumentUpload {...defaultProps} onUploadComplete={mockOnUploadComplete} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const validFile = createMockFile('test.pdf', 1024, 'application/pdf');
    
    await user.upload(fileInput, validFile);
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
    
    // Click upload button
    const uploadButton = screen.getByRole('button', { name: /upload all/i });
    await user.click(uploadButton);
    
    await waitFor(() => {
      expect(caseService.uploadDocument).toHaveBeenCalledWith(
        'test-case-id',
        validFile,
        {
          name: 'test.pdf',
          description: '',
          tags: ''
        }
      );
      expect(mockOnUploadComplete).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith('1 file(s) uploaded successfully');
    });
  });

  test('handles upload error', async () => {
    const user = userEvent.setup();
    const mockOnUploadError = vi.fn();
    
    // Mock upload failure
    (caseService.uploadDocument as any).mockRejectedValue(new Error('Upload failed'));
    
    render(<DocumentUpload {...defaultProps} onUploadError={mockOnUploadError} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const validFile = createMockFile('test.pdf', 1024, 'application/pdf');
    
    await user.upload(fileInput, validFile);
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
    
    const uploadButton = screen.getByRole('button', { name: /upload all/i });
    await user.click(uploadButton);
    
    await waitFor(() => {
      expect(mockOnUploadError).toHaveBeenCalledWith('Upload failed');
    });
  });

  test('shows upload progress', async () => {
    const user = userEvent.setup();
    
    // Mock upload with delay to see progress
    (caseService.uploadDocument as any).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        data: { id: 'doc1', name: 'test.pdf' }
      }), 1000))
    );
    
    render(<DocumentUpload {...defaultProps} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const validFile = createMockFile('test.pdf', 1024, 'application/pdf');
    
    await user.upload(fileInput, validFile);
    
    const uploadButton = screen.getByRole('button', { name: /upload all/i });
    await user.click(uploadButton);
    
    // Check for loading state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /upload all/i })).toBeDisabled();
    });
  });

  test('clears all files', async () => {
    const user = userEvent.setup();
    render(<DocumentUpload {...defaultProps} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const files = [
      createMockFile('file1.pdf', 1024, 'application/pdf'),
      createMockFile('file2.pdf', 1024, 'application/pdf')
    ];
    
    await user.upload(fileInput, files);
    
    await waitFor(() => {
      expect(screen.getByText('Files to upload (2)')).toBeInTheDocument();
    });
    
    const clearButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Files to upload')).not.toBeInTheDocument();
    });
  });

  test('generates preview for image files', async () => {
    const user = userEvent.setup();
    render(<DocumentUpload {...defaultProps} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const imageFile = createMockFile('image.jpg', 1024, 'image/jpeg');
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null as any,
      result: 'data:image/jpeg;base64,test'
    };
    
    vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as any);
    
    await user.upload(fileInput, imageFile);
    
    // Simulate FileReader onload
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,test' } } as any);
    }
    
    await waitFor(() => {
      expect(screen.getByText('image.jpg')).toBeInTheDocument();
    });
  });

  test('formats file size correctly', async () => {
    const user = userEvent.setup();
    render(<DocumentUpload {...defaultProps} />);
    
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    const largeFile = createMockFile('large.pdf', 1536000, 'application/pdf'); // 1.5MB
    
    await user.upload(fileInput, largeFile);
    
    await waitFor(() => {
      expect(screen.getByText('1.46 MB')).toBeInTheDocument();
    });
  });
});

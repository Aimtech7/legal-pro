// Case service unit tests for LegalPro v1.0.1
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { caseService } from '../../services/caseService';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('CaseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-jwt-token');
  });

  describe('getCases', () => {
    test('should fetch cases successfully', async () => {
      const response = await caseService.getCases();
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.pagination).toBeDefined();
    });

    test('should fetch cases with filters', async () => {
      const filters = {
        status: 'in_progress',
        priority: 'high',
        category: 'Property Law',
        search: 'property',
        page: 1,
        limit: 10
      };

      const response = await caseService.getCases(filters);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });

    test('should handle pagination correctly', async () => {
      const response = await caseService.getCases({ page: 1, limit: 5 });
      
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(5);
      expect(response.pagination.pages).toBeGreaterThanOrEqual(1);
    });

    test('should handle empty results', async () => {
      const response = await caseService.getCases({ search: 'nonexistent' });
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });
  });

  describe('getCase', () => {
    test('should fetch single case successfully', async () => {
      const response = await caseService.getCase('case-1');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data._id).toBe('case-1');
      expect(response.data.documentStats).toBeDefined();
    });

    test('should handle case not found', async () => {
      await expect(caseService.getCase('nonexistent-case')).rejects.toThrow();
    });

    test('should handle invalid case ID', async () => {
      await expect(caseService.getCase('')).rejects.toThrow();
    });
  });

  describe('createCase', () => {
    test('should create case successfully', async () => {
      const caseData = {
        title: 'New Test Case',
        description: 'Test case description',
        category: 'Family Law',
        priority: 'medium' as const,
        clientId: 'client-1'
      };

      const response = await caseService.createCase(caseData);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.title).toBe(caseData.title);
      expect(response.data.caseNumber).toMatch(/^CASE-\d{4}-\d{4}$/);
    });

    test('should create case with optional fields', async () => {
      const caseData = {
        title: 'New Test Case',
        description: 'Test case description',
        category: 'Family Law',
        priority: 'high' as const,
        clientId: 'client-1',
        assignedTo: 'advocate-1',
        courtDate: '2024-12-25'
      };

      const response = await caseService.createCase(caseData);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });

    test('should handle validation errors', async () => {
      const invalidCaseData = {
        title: '',
        description: '',
        category: '',
        priority: 'medium' as const,
        clientId: ''
      };

      await expect(caseService.createCase(invalidCaseData)).rejects.toThrow();
    });
  });

  describe('updateCase', () => {
    test('should update case successfully', async () => {
      const updateData = {
        title: 'Updated Case Title',
        priority: 'urgent' as const
      };

      const response = await caseService.updateCase('case-1', updateData);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });

    test('should handle partial updates', async () => {
      const updateData = {
        priority: 'low' as const
      };

      const response = await caseService.updateCase('case-1', updateData);
      
      expect(response.success).toBe(true);
    });

    test('should handle case not found for update', async () => {
      const updateData = { title: 'Updated Title' };
      
      await expect(caseService.updateCase('nonexistent-case', updateData)).rejects.toThrow();
    });
  });

  describe('deleteCase', () => {
    test('should delete case successfully', async () => {
      const response = await caseService.deleteCase('case-1');
      
      expect(response.success).toBe(true);
    });

    test('should delete case with reason', async () => {
      const response = await caseService.deleteCase('case-1', 'Case resolved');
      
      expect(response.success).toBe(true);
    });

    test('should handle case not found for deletion', async () => {
      await expect(caseService.deleteCase('nonexistent-case')).rejects.toThrow();
    });
  });

  describe('restoreCase', () => {
    test('should restore case successfully', async () => {
      const response = await caseService.restoreCase('case-1');
      
      expect(response.success).toBe(true);
    });

    test('should restore case with reason', async () => {
      const response = await caseService.restoreCase('case-1', 'Case needs to be reopened');
      
      expect(response.success).toBe(true);
    });
  });

  describe('assignCase', () => {
    test('should assign case successfully', async () => {
      const response = await caseService.assignCase('case-1', 'advocate-1');
      
      expect(response.success).toBe(true);
    });

    test('should handle invalid assignment', async () => {
      await expect(caseService.assignCase('case-1', '')).rejects.toThrow();
    });
  });

  describe('getCaseStats', () => {
    test('should fetch case statistics successfully', async () => {
      const stats = await caseService.getCaseStats();
      
      expect(stats.overview).toBeDefined();
      expect(stats.overview.totalCases).toBeGreaterThanOrEqual(0);
      expect(stats.overview.pendingCases).toBeGreaterThanOrEqual(0);
      expect(stats.overview.inProgressCases).toBeGreaterThanOrEqual(0);
      expect(stats.overview.completedCases).toBeGreaterThanOrEqual(0);
      expect(stats.categoryBreakdown).toBeDefined();
      expect(Array.isArray(stats.categoryBreakdown)).toBe(true);
    });
  });

  describe('searchCases', () => {
    test('should search cases successfully', async () => {
      const filters = {
        q: 'property',
        status: 'in_progress',
        priority: 'high'
      };

      const response = await caseService.searchCases(filters);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should handle empty search results', async () => {
      const response = await caseService.searchCases({ q: 'nonexistent' });
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });

    test('should search with multiple criteria', async () => {
      const filters = {
        q: 'test',
        title: 'property',
        client: 'john',
        status: 'pending',
        category: 'Property Law',
        priority: 'high',
        hasDocuments: true,
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      };

      const response = await caseService.searchCases(filters);
      
      expect(response.success).toBe(true);
    });
  });

  describe('updateCaseStatus', () => {
    test('should update case status successfully', async () => {
      const response = await caseService.updateCaseStatus('case-1', 'completed');
      
      expect(response.success).toBe(true);
    });

    test('should update status with reason', async () => {
      const response = await caseService.updateCaseStatus('case-1', 'in_progress', 'Starting work');
      
      expect(response.success).toBe(true);
    });

    test('should handle invalid status', async () => {
      await expect(caseService.updateCaseStatus('case-1', 'invalid_status')).rejects.toThrow();
    });
  });

  describe('addCaseNote', () => {
    test('should add case note successfully', async () => {
      const response = await caseService.addCaseNote('case-1', 'Test note content');
      
      expect(response.success).toBe(true);
    });

    test('should add private note', async () => {
      const response = await caseService.addCaseNote('case-1', 'Private note', true);
      
      expect(response.success).toBe(true);
    });

    test('should handle empty note content', async () => {
      await expect(caseService.addCaseNote('case-1', '')).rejects.toThrow();
    });
  });

  describe('getCaseTimeline', () => {
    test('should fetch case timeline successfully', async () => {
      const response = await caseService.getCaseTimeline('case-1');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should handle case not found for timeline', async () => {
      await expect(caseService.getCaseTimeline('nonexistent-case')).rejects.toThrow();
    });
  });

  describe('getCaseDocuments', () => {
    test('should fetch case documents successfully', async () => {
      const response = await caseService.getCaseDocuments('case-1');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should handle case not found for documents', async () => {
      await expect(caseService.getCaseDocuments('nonexistent-case')).rejects.toThrow();
    });
  });

  describe('uploadDocument', () => {
    test('should upload document successfully', async () => {
      const file = global.testUtils.createMockFile('test.pdf', 1024, 'application/pdf');
      const metadata = {
        name: 'Test Document',
        description: 'Test description',
        tags: 'test,document'
      };

      const response = await caseService.uploadDocument('case-1', file, metadata);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });

    test('should upload document without metadata', async () => {
      const file = global.testUtils.createMockFile('test.pdf');

      const response = await caseService.uploadDocument('case-1', file);
      
      expect(response.success).toBe(true);
    });

    test('should handle upload errors', async () => {
      const file = global.testUtils.createMockFile('invalid.exe', 1024, 'application/x-executable');

      await expect(caseService.uploadDocument('case-1', file)).rejects.toThrow();
    });
  });

  describe('deleteDocument', () => {
    test('should delete document successfully', async () => {
      const response = await caseService.deleteDocument('case-1', 'doc-1');
      
      expect(response.success).toBe(true);
    });

    test('should handle document not found', async () => {
      await expect(caseService.deleteDocument('case-1', 'nonexistent-doc')).rejects.toThrow();
    });
  });

  describe('downloadDocument', () => {
    test('should get download link successfully', async () => {
      // Mock window.open
      const mockOpen = vi.fn();
      Object.defineProperty(window, 'open', { value: mockOpen });

      const response = await caseService.downloadDocument('case-1', 'doc-1');
      
      expect(response.success).toBe(true);
      expect(response.data.downloadUrl).toBeDefined();
      expect(mockOpen).toHaveBeenCalledWith(response.data.downloadUrl, '_blank');
    });

    test('should handle download errors', async () => {
      await expect(caseService.downloadDocument('case-1', 'nonexistent-doc')).rejects.toThrow();
    });
  });

  describe('Error handling', () => {
    test('should handle network errors', async () => {
      // Mock fetch to reject
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(caseService.getCases()).rejects.toThrow();

      // Restore fetch
      global.fetch = originalFetch;
    });

    test('should handle authentication errors', async () => {
      // Mock localStorage to return null token
      mockLocalStorage.getItem.mockReturnValue(null);

      await expect(caseService.getCases()).rejects.toThrow();
    });

    test('should handle server errors', async () => {
      // This would be handled by MSW returning error responses
      await expect(caseService.getCase('error-case')).rejects.toThrow();
    });
  });
});

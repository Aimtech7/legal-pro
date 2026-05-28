// Case management service for LegalPro v1.0.1
import { apiService } from './apiService';
import { Case, Document } from '../types';

export interface CaseFilters {
  status?: string;
  category?: string;
  priority?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters extends CaseFilters {
  q?: string;
  title?: string;
  client?: string;
  courtDateStart?: string;
  courtDateEnd?: string;
  hasDocuments?: boolean;
}

export interface CaseFormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clientId: string;
  assignedTo?: string;
  courtDate?: string;
}

export interface CaseStats {
  overview: {
    totalCases: number;
    pendingCases: number;
    inProgressCases: number;
    completedCases: number;
    closedCases: number;
    urgentCases: number;
    highPriorityCases: number;
  };
  categoryBreakdown: Array<{
    _id: string;
    count: number;
  }>;
}

export interface DocumentUploadData {
  name?: string;
  description?: string;
  tags?: string;
}

class CaseService {
  // Get all cases with filters
  async getCases(filters: CaseFilters = {}) {
    try {
      const response = await apiService.getCases(filters);
      return response;
    } catch (error) {
      console.error('Get cases error:', error);
      throw error;
    }
  }

  // Get single case by ID
  async getCase(id: string) {
    try {
      const response = await apiService.getCase(id);
      return response;
    } catch (error) {
      console.error('Get case error:', error);
      throw error;
    }
  }

  // Create new case
  async createCase(caseData: CaseFormData) {
    try {
      const response = await apiService.createCase(caseData);
      return response;
    } catch (error) {
      console.error('Create case error:', error);
      throw error;
    }
  }

  // Update case
  async updateCase(id: string, caseData: Partial<CaseFormData>) {
    try {
      const response = await apiService.updateCase(id, caseData);
      return response;
    } catch (error) {
      console.error('Update case error:', error);
      throw error;
    }
  }

  // Delete case (soft delete)
  async deleteCase(id: string, reason?: string) {
    try {
      const response = await apiService.deleteCase(id);
      return response;
    } catch (error) {
      console.error('Delete case error:', error);
      throw error;
    }
  }

  // Restore archived case
  async restoreCase(id: string, reason?: string) {
    try {
      const response = await fetch(`/api/cases/${id}/restore`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason })
      });
      
      if (!response.ok) {
        throw new Error('Failed to restore case');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Restore case error:', error);
      throw error;
    }
  }

  // Assign case to user
  async assignCase(id: string, assignedTo: string) {
    try {
      const response = await fetch(`/api/cases/${id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ assignedTo })
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign case');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Assign case error:', error);
      throw error;
    }
  }

  // Get case statistics
  async getCaseStats(): Promise<CaseStats> {
    try {
      const response = await fetch('/api/cases/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get case statistics');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get case stats error:', error);
      throw error;
    }
  }

  // Advanced case search
  async searchCases(filters: SearchFilters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/cases/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to search cases');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Search cases error:', error);
      throw error;
    }
  }

  // Update case status
  async updateCaseStatus(id: string, status: string, reason?: string) {
    try {
      const response = await fetch(`/api/cases/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status, reason })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update case status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update case status error:', error);
      throw error;
    }
  }

  // Add case note
  async addCaseNote(id: string, content: string, isPrivate: boolean = false) {
    try {
      const response = await fetch(`/api/cases/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content, isPrivate })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add case note');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Add case note error:', error);
      throw error;
    }
  }

  // Get case timeline
  async getCaseTimeline(id: string) {
    try {
      const response = await fetch(`/api/cases/${id}/timeline`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get case timeline');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get case timeline error:', error);
      throw error;
    }
  }

  // Get case documents
  async getCaseDocuments(id: string) {
    try {
      const response = await fetch(`/api/cases/${id}/documents`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get case documents');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get case documents error:', error);
      throw error;
    }
  }

  // Upload document to case
  async uploadDocument(id: string, file: File, metadata: DocumentUploadData = {}) {
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      if (metadata.name) formData.append('name', metadata.name);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.tags) formData.append('tags', metadata.tags);
      
      const response = await fetch(`/api/cases/${id}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload document');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload document error:', error);
      throw error;
    }
  }

  // Delete document from case
  async deleteDocument(caseId: string, documentId: string) {
    try {
      const response = await fetch(`/api/cases/${caseId}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }

  // Download document
  async downloadDocument(caseId: string, documentId: string) {
    try {
      const response = await fetch(`/api/cases/${caseId}/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get download link');
      }
      
      const data = await response.json();
      
      // Open download URL in new tab
      window.open(data.data.downloadUrl, '_blank');
      
      return data;
    } catch (error) {
      console.error('Download document error:', error);
      throw error;
    }
  }
}

export const caseService = new CaseService();

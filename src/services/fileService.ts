// File service for LegalPro v1.0.1 with Cloudinary integration
import axios, { AxiosProgressEvent } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// File upload interfaces
export interface FileUploadOptions {
  caseId?: string;
  type?: 'documents' | 'images' | 'media' | 'evidence' | 'contracts' | 'correspondence' | 'court-filings';
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UploadedFile {
  id: string;
  cloudinaryId: string;
  originalName: string;
  url: string;
  secureUrl: string;
  size: number;
  format: string;
  resourceType: string;
  folder: string;
  width?: number;
  height?: number;
  uploadedAt: string;
  metadata: {
    etag: string;
    version: number;
    signature: string;
    tags: string[];
    context: any;
  };
  description?: string;
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  caseId?: string;
  type: string;
  isPublic: boolean;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  file?: UploadedFile;
  files?: UploadedFile[];
  failed?: Array<{
    filename: string;
    error: string;
  }>;
  summary?: {
    totalUploaded: number;
    totalFailed: number;
  };
}

export interface FileSearchOptions {
  folder?: string;
  tags?: string[];
  type?: string;
  caseId?: string;
  userId?: string;
  maxResults?: number;
  nextCursor?: string;
}

export interface FileSearchResponse {
  success: boolean;
  resources: UploadedFile[];
  totalCount: number;
  nextCursor?: string;
}

export interface SignedUrlOptions {
  expiresIn?: number; // seconds
  transformation?: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  };
}

export interface SignedUrlResponse {
  success: boolean;
  url: string;
  expiresAt: string;
}

export interface TransformationOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low';
  format?: 'jpg' | 'png' | 'webp' | 'gif' | 'svg' | 'pdf';
}

export interface UsageStats {
  success: boolean;
  stats: {
    storage: {
      used: number;
      limit: number;
      percentage: number;
    };
    bandwidth: {
      used: number;
      limit: number;
      percentage: number;
    };
    requests: {
      used: number;
      limit: number;
      percentage: number;
    };
    transformations: {
      used: number;
      limit: number;
      percentage: number;
    };
  };
}

class FileService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private getMultipartHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    };
  }

  /**
   * Upload single file
   */
  async uploadSingleFile(
    file: File, 
    options: FileUploadOptions = {},
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add options to form data
      if (options.caseId) formData.append('caseId', options.caseId);
      if (options.type) formData.append('type', options.type);
      if (options.description) formData.append('description', options.description);
      if (options.tags) formData.append('tags', options.tags.join(','));
      if (options.isPublic !== undefined) formData.append('isPublic', options.isPublic.toString());

      const response = await axios.post(
        `${API_BASE_URL}/files/upload`,
        formData,
        {
          headers: this.getMultipartHeaders(),
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total && onProgress) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(progress);
            }
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('File upload error:', error);
      throw new Error(error.response?.data?.message || 'File upload failed');
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[], 
    options: FileUploadOptions = {},
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      
      // Append all files
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Add options to form data
      if (options.caseId) formData.append('caseId', options.caseId);
      if (options.type) formData.append('type', options.type);
      if (options.description) formData.append('description', options.description);
      if (options.tags) formData.append('tags', options.tags.join(','));
      if (options.isPublic !== undefined) formData.append('isPublic', options.isPublic.toString());

      const response = await axios.post(
        `${API_BASE_URL}/files/upload-multiple`,
        formData,
        {
          headers: this.getMultipartHeaders(),
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total && onProgress) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(progress);
            }
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Multiple file upload error:', error);
      throw new Error(error.response?.data?.message || 'Multiple file upload failed');
    }
  }

  /**
   * Get file details
   */
  async getFileDetails(fileId: string): Promise<UploadedFile> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/files/${fileId}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data.file;
    } catch (error: any) {
      console.error('Get file details error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get file details');
    }
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/files/${fileId}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Delete file error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete file');
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(fileIds: string[]): Promise<{
    success: boolean;
    message: string;
    deleted: string[];
    notFound: string[];
    partial: string[];
  }> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/files/bulk-delete`,
        {
          headers: this.getAuthHeaders(),
          data: { fileIds }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Bulk delete error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete files');
    }
  }

  /**
   * Generate signed URL for secure access
   */
  async generateSignedUrl(fileId: string, options: SignedUrlOptions = {}): Promise<SignedUrlResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/files/${fileId}/signed-url`,
        options,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Generate signed URL error:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate signed URL');
    }
  }

  /**
   * Search files
   */
  async searchFiles(options: FileSearchOptions = {}): Promise<FileSearchResponse> {
    try {
      const params = new URLSearchParams();
      
      if (options.folder) params.append('folder', options.folder);
      if (options.tags) params.append('tags', options.tags.join(','));
      if (options.type) params.append('type', options.type);
      if (options.caseId) params.append('caseId', options.caseId);
      if (options.userId) params.append('userId', options.userId);
      if (options.maxResults) params.append('maxResults', options.maxResults.toString());
      if (options.nextCursor) params.append('nextCursor', options.nextCursor);

      const response = await axios.get(
        `${API_BASE_URL}/files/search?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Search files error:', error);
      throw new Error(error.response?.data?.message || 'File search failed');
    }
  }

  /**
   * Transform image
   */
  async transformImage(fileId: string, transformations: TransformationOptions): Promise<{
    success: boolean;
    originalId: string;
    transformedUrl: string;
    transformations: TransformationOptions;
  }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/files/${fileId}/transform`,
        transformations,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Transform image error:', error);
      throw new Error(error.response?.data?.message || 'Image transformation failed');
    }
  }

  /**
   * Get storage usage statistics (Admin/Advocate only)
   */
  async getUsageStats(): Promise<UsageStats> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/files/usage-stats`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Get usage stats error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get usage statistics');
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file type category
   */
  getFileTypeCategory(filename: string): 'image' | 'document' | 'video' | 'audio' | 'other' {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image';
    }
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'].includes(extension || '')) {
      return 'document';
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) {
      return 'video';
    }
    if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension || '')) {
      return 'audio';
    }
    
    return 'other';
  }

  /**
   * Generate thumbnail URL for images
   */
  generateThumbnailUrl(secureUrl: string, width: number = 200, height: number = 200): string {
    // Insert transformation parameters into Cloudinary URL
    return secureUrl.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`);
  }
}

// Export singleton instance
export const fileService = new FileService();
export default fileService;

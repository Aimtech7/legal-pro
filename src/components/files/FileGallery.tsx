// File Gallery Component for LegalPro v1.0.1 with Cloudinary integration
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Filter, Download, Trash2, Eye, MoreVertical, 
  File, Image, Video, Music, FileText, Grid, List,
  Calendar, User, Tag, FolderOpen, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileService, UploadedFile, FileSearchOptions } from '../../services/fileService';

interface FileGalleryProps {
  caseId?: string;
  userId?: string;
  type?: string;
  showUpload?: boolean;
  onFileSelect?: (file: UploadedFile) => void;
  onFileDelete?: (fileId: string) => void;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date' | 'size' | 'type';
type SortOrder = 'asc' | 'desc';

const FileGallery: React.FC<FileGalleryProps> = ({
  caseId,
  userId,
  type,
  showUpload = true,
  onFileSelect,
  onFileDelete,
  className = ''
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    dateRange: '',
    sizeRange: '',
    tags: ''
  });

  // File type icons mapping
  const getFileIcon = (file: UploadedFile) => {
    const category = fileService.getFileTypeCategory(file.originalName);
    
    switch (category) {
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />;
      case 'audio':
        return <Music className="h-6 w-6 text-green-500" />;
      case 'document':
        return <FileText className="h-6 w-6 text-red-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  // Load files
  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchOptions: FileSearchOptions = {
        maxResults: 50
      };

      if (caseId) searchOptions.caseId = caseId;
      if (userId) searchOptions.userId = userId;
      if (type) searchOptions.type = type;

      const response = await fileService.searchFiles(searchOptions);
      setFiles(response.resources);
    } catch (err) {
      console.error('Failed to load files:', err);
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [caseId, userId, type]);

  // Filter and sort files
  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply additional filters
    if (filters.type) {
      filtered = filtered.filter(file => file.type === filters.type);
    }

    if (filters.tags) {
      const searchTags = filters.tags.toLowerCase().split(',').map(tag => tag.trim());
      filtered = filtered.filter(file =>
        file.metadata.tags?.some(tag =>
          searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
        )
      );
    }

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.originalName.localeCompare(b.originalName);
          break;
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.format.localeCompare(b.format);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [files, searchTerm, filters, sortBy, sortOrder]);

  // Handle file selection
  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  // Handle file download
  const handleDownload = async (file: UploadedFile) => {
    try {
      const signedUrl = await fileService.generateSignedUrl(file.id, { expiresIn: 300 });
      window.open(signedUrl.url, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download file');
    }
  };

  // Handle file deletion
  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await fileService.deleteFile(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      onFileDelete?.(fileId);
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete file');
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)) return;

    try {
      const fileIds = Array.from(selectedFiles);
      await fileService.deleteMultipleFiles(fileIds);
      setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
      setSelectedFiles(new Set());
      fileIds.forEach(id => onFileDelete?.(id));
    } catch (err) {
      console.error('Bulk delete failed:', err);
      setError('Failed to delete files');
    }
  };

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading files...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading files</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={loadFiles}
              className="mt-2 text-sm text-red-600 hover:text-red-500"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Files</h3>
          <p className="text-sm text-gray-500">
            {filteredAndSortedFiles.length} file{filteredAndSortedFiles.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          {/* Bulk actions */}
          {selectedFiles.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete ({selectedFiles.size})</span>
            </button>
          )}

          {/* View mode toggle */}
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border border-gray-300 rounded-md ${showFilters ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All types</option>
                  <option value="documents">Documents</option>
                  <option value="images">Images</option>
                  <option value="media">Media</option>
                  <option value="evidence">Evidence</option>
                  <option value="contracts">Contracts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-') as [SortBy, SortOrder];
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="size-desc">Largest first</option>
                  <option value="size-asc">Smallest first</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="Enter tags (comma separated)"
                  value={filters.tags}
                  onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ type: '', dateRange: '', sizeRange: '', tags: '' })}
                  className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File Grid/List */}
      {filteredAndSortedFiles.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.values(filters).some(f => f)
              ? 'Try adjusting your search or filters'
              : 'Upload some files to get started'
            }
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'space-y-2'
        }>
          {filteredAndSortedFiles.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              viewMode={viewMode}
              isSelected={selectedFiles.has(file.id)}
              onSelect={() => toggleFileSelection(file.id)}
              onView={() => onFileSelect?.(file)}
              onDownload={() => handleDownload(file)}
              onDelete={() => handleDelete(file.id)}
              getFileIcon={getFileIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// File Item Component
interface FileItemProps {
  file: UploadedFile;
  viewMode: ViewMode;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
  getFileIcon: (file: UploadedFile) => React.ReactNode;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  viewMode,
  isSelected,
  onSelect,
  onView,
  onDownload,
  onDelete,
  getFileIcon
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isImage = fileService.getFileTypeCategory(file.originalName) === 'image';

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          relative group bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
        `}
        onClick={onView}
      >
        {/* Selection checkbox */}
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        {/* Actions menu */}
        <div className="absolute top-2 right-2 z-10">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* File preview/icon */}
        <div className="flex justify-center mb-3">
          {isImage ? (
            <img
              src={fileService.generateThumbnailUrl(file.secureUrl, 150, 150)}
              alt={file.originalName}
              className="h-20 w-20 object-cover rounded"
            />
          ) : (
            <div className="h-20 w-20 flex items-center justify-center">
              {getFileIcon(file)}
            </div>
          )}
        </div>

        {/* File info */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 truncate" title={file.originalName}>
            {file.originalName}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {fileService.formatFileSize(file.size)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(file.uploadedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Tags */}
        {file.metadata.tags && file.metadata.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {file.metadata.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {file.metadata.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{file.metadata.tags.length - 2} more</span>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        flex items-center space-x-4 p-4 bg-white border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
      `}
      onClick={onView}
    >
      {/* Selection checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />

      {/* File icon/preview */}
      <div className="flex-shrink-0">
        {isImage ? (
          <img
            src={fileService.generateThumbnailUrl(file.secureUrl, 40, 40)}
            alt={file.originalName}
            className="h-10 w-10 object-cover rounded"
          />
        ) : (
          getFileIcon(file)
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.originalName}
        </p>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span>{fileService.formatFileSize(file.size)}</span>
          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
          <span className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {file.uploadedBy.name}
          </span>
        </div>
      </div>

      {/* Tags */}
      {file.metadata.tags && file.metadata.tags.length > 0 && (
        <div className="flex-shrink-0 flex space-x-1">
          {file.metadata.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="p-1 text-gray-400 hover:text-gray-600"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(file.secureUrl, '_blank');
          }}
          className="p-1 text-gray-400 hover:text-gray-600"
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-gray-400 hover:text-red-600"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default FileGallery;

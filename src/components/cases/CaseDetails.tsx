// Case details view component for LegalPro v1.0.1
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  User, 
  FileText, 
  Clock, 
  MessageSquare, 
  Upload,
  Download,
  Trash2,
  Edit,
  Flag,
  AlertCircle,
  CheckCircle,
  Eye,
  Plus
} from 'lucide-react';
import Button from '../ui/Button';
import { Case, Document } from '../../types';
import { caseService } from '../../services/caseService';
import { useAuth } from '../../contexts/AuthContext';
import DocumentUpload from './DocumentUpload';
import toast from 'react-hot-toast';

interface CaseDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onCaseUpdate?: (updatedCase: Case) => void;
}

const STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'text-green-600', icon: CheckCircle },
  { value: 'medium', label: 'Medium', color: 'text-blue-600', icon: Clock },
  { value: 'high', label: 'High', color: 'text-orange-600', icon: Flag },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600', icon: AlertCircle }
];

const CaseDetails: React.FC<CaseDetailsProps> = ({
  isOpen,
  onClose,
  caseId,
  onCaseUpdate
}) => {
  const { user } = useAuth();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline' | 'notes'>('overview');
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  // Load case data
  useEffect(() => {
    if (isOpen && caseId) {
      loadCaseData();
    }
  }, [isOpen, caseId]);

  const loadCaseData = async () => {
    try {
      setLoading(true);
      const [caseResponse, documentsResponse, timelineResponse] = await Promise.all([
        caseService.getCase(caseId),
        caseService.getCaseDocuments(caseId),
        caseService.getCaseTimeline(caseId)
      ]);

      setCaseData(caseResponse.data);
      setDocuments(documentsResponse.data);
      setTimeline(timelineResponse.data);
    } catch (error) {
      console.error('Failed to load case data:', error);
      toast.error('Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (!caseData) return;

    try {
      await caseService.updateCaseStatus(caseId, newStatus);
      setCaseData({ ...caseData, status: newStatus });
      toast.success('Case status updated successfully');
      onCaseUpdate?.(caseData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update case status');
    }
  };

  // Handle document upload
  const handleDocumentUpload = (document: Document) => {
    setDocuments(prev => [document, ...prev]);
    toast.success('Document uploaded successfully');
  };

  // Handle document delete
  const handleDocumentDelete = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await caseService.deleteDocument(caseId, documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete document');
    }
  };

  // Handle document download
  const handleDocumentDownload = async (documentId: string) => {
    try {
      await caseService.downloadDocument(caseId, documentId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to download document');
    }
  };

  // Handle add note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setAddingNote(true);
      await caseService.addCaseNote(caseId, newNote.trim(), isPrivateNote);
      setNewNote('');
      setIsPrivateNote(false);
      await loadCaseData(); // Reload to get updated notes
      toast.success('Note added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusInfo = (status: string) => {
    return STATUSES.find(s => s.value === status) || STATUSES[0];
  };

  const getPriorityInfo = (priority: string) => {
    return PRIORITIES.find(p => p.value === priority) || PRIORITIES[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <FileText className="w-6 h-6 text-navy-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {loading ? 'Loading...' : caseData?.title}
              </h2>
              <p className="text-sm text-gray-500">
                {loading ? '' : caseData?.caseNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
          </div>
        ) : caseData ? (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
                  { id: 'timeline', label: 'Timeline', icon: Clock },
                  { id: 'notes', label: `Notes (${caseData.notes?.length || 0})`, icon: MessageSquare }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-navy-500 text-navy-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Case Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(caseData.status).color}`}>
                            {getStatusInfo(caseData.status).label}
                          </span>
                          {(user?.role === 'advocate' || user?.role === 'admin') && (
                            <select
                              value={caseData.status}
                              onChange={(e) => handleStatusChange(e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              {STATUSES.map(status => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <div className="flex items-center space-x-2">
                          {React.createElement(getPriorityInfo(caseData.priority).icon, {
                            className: `w-4 h-4 ${getPriorityInfo(caseData.priority).color}`
                          })}
                          <span className={`font-medium ${getPriorityInfo(caseData.priority).color}`}>
                            {getPriorityInfo(caseData.priority).label}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <p className="text-gray-900">{caseData.category}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {caseData.clientId?.firstName} {caseData.clientId?.lastName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {caseData.assignedTo?.firstName} {caseData.assignedTo?.lastName}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Court Date</label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {caseData.courtDate ? formatDate(caseData.courtDate) : 'Not scheduled'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                        <p className="text-gray-900">{formatDate(caseData.createdAt)}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                        <p className="text-gray-900">{formatDate(caseData.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{caseData.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  {/* Upload Section */}
                  {(user?.role === 'advocate' || user?.role === 'admin' || user?.role === 'client') && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
                        <Button
                          onClick={() => setShowDocumentUpload(!showDocumentUpload)}
                          size="sm"
                          className="flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Documents
                        </Button>
                      </div>
                      
                      {showDocumentUpload && (
                        <DocumentUpload
                          caseId={caseId}
                          onUploadComplete={handleDocumentUpload}
                          onUploadError={(error) => toast.error(error)}
                        />
                      )}
                    </div>
                  )}

                  {/* Documents List */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Case Documents</h3>
                    {documents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No documents uploaded yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map((document) => (
                          <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleDocumentDownload(document.id)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                {(user?.role === 'advocate' || 
                                  (user?.role === 'admin' && user?.permissions?.canDeleteFiles) ||
                                  (user?.role === 'client' && document.uploadedBy === user?.id)) && (
                                  <button
                                    onClick={() => handleDocumentDelete(document.id)}
                                    className="text-gray-400 hover:text-red-600"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                              {document.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">
                              {formatFileSize(document.size)} • {formatDate(document.createdAt)}
                            </p>
                            <p className="text-xs text-gray-400">
                              Uploaded by {document.uploadedBy?.firstName} {document.uploadedBy?.lastName}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Case Timeline</h3>
                  {timeline.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No timeline events yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-navy-600 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{event.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(event.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-6">
                  {/* Add Note */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add Note</h3>
                    <div className="space-y-3">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note about this case..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none"
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isPrivateNote}
                            onChange={(e) => setIsPrivateNote(e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">Private note (only visible to staff)</span>
                        </label>
                        <Button
                          onClick={handleAddNote}
                          disabled={!newNote.trim() || addingNote}
                          size="sm"
                          className="flex items-center"
                        >
                          {addingNote ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Plus className="w-4 h-4 mr-2" />
                          )}
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Notes List */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Case Notes</h3>
                    {!caseData.notes || caseData.notes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No notes added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {caseData.notes.map((note, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  {note.author?.firstName} {note.author?.lastName}
                                </span>
                                {note.isPrivate && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                    Private
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(note.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Failed to load case details</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CaseDetails;

// Cases management page for LegalPro v1.0.1
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
  MessageSquare,
  Tag,
  Flag,
  SortAsc,
  SortDesc,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { caseService, CaseFilters } from '../services/caseService';
import { Case } from '../types';
import toast from 'react-hot-toast';

interface CaseFormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clientId: string;
  assignedTo?: string;
  courtDate?: string;
}

const CATEGORIES = [
  'Family Law',
  'Corporate Law',
  'Criminal Defense',
  'Property Law',
  'Employment Law',
  'Constitutional Law',
  'Tax Law',
  'Immigration Law',
  'Intellectual Property',
  'Environmental Law'
];

const STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

const getStatusColor = (status: string): string => {
  const statusInfo = STATUSES.find(s => s.value === status);
  return statusInfo?.color || 'bg-gray-100 text-gray-800';
};

const getPriorityColor = (priority: string): string => {
  const priorityInfo = PRIORITIES.find(p => p.value === priority);
  return priorityInfo?.color || 'bg-gray-100 text-gray-800';
};

const Cases: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<CaseFilters>({
    search: '',
    status: '',
    category: '',
    priority: '',
    assignedTo: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CaseFormData>();

  const loadCases = useCallback(async (newFilters?: Partial<CaseFilters>) => {
    try {
      setLoading(true);
      const currentFilters = { ...filters, ...newFilters };
      const response = await caseService.getCases(currentFilters);
      setCases(response.data);
      if (newFilters) {
        setFilters(currentFilters);
      }
    } catch (error) {
      console.error('Failed to load cases:', error);
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshCases = async () => {
    setRefreshing(true);
    await loadCases();
    setRefreshing(false);
    toast.success('Cases refreshed');
  };

  const handleFilterChange = (key: keyof CaseFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    loadCases(newFilters);
  };

  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  const handleSort = (sortBy: string) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    loadCases({ sortBy, sortOrder: newSortOrder });
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleCreateCase = async (data: CaseFormData) => {
    try {
      await caseService.createCase(data);
      toast.success('Case created successfully');
      setShowCreateForm(false);
      reset();
      await loadCases();
    } catch (error: any) {
      console.error('Failed to create case:', error);
      toast.error(error.message || 'Failed to create case');
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <Flag className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      category: '',
      priority: '',
      assignedTo: '',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const
    };
    loadCases(clearedFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              {user?.role === 'client' ? 'My Cases' : 'Case Management'}
            </h1>
            <p className="text-gray-600">
              {user?.role === 'client' 
                ? 'Track the progress of your legal cases and view important updates'
                : 'Manage all legal cases, track progress, and collaborate with clients'
              }
            </p>
          </div>
          {user?.role !== 'client' && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Case
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cases..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshCases}
                disabled={refreshing}
                className="flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </Card>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {cases.map((case_item: Case, index: number) => (
            <motion.div
              key={case_item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="p-6 h-full cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCase(case_item)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-mono text-gray-500">{case_item.caseNumber}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_item.status)}`}>
                        {case_item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-primary-800 mb-2">{case_item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{case_item.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {cases.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-600">No cases have been created yet</p>
          </div>
        )}

        {/* Create Case Modal */}
        {showCreateForm && user?.role !== 'client' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-800">Create New Case</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(handleCreateCase)} className="space-y-6">
                <Input
                  label="Case Title"
                  error={errors.title?.message}
                  {...register('title', { required: 'Title is required' })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe the case details..."
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Case
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;
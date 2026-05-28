// Case creation and editing form component for LegalPro v1.0.1
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { X, Save, Calendar, User, AlertCircle, FileText } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Case } from '../../types';
import { userManagementService } from '../../services/userManagementService';
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

interface CaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CaseFormData) => Promise<void>;
  case?: Case | null;
  isEditing?: boolean;
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

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-blue-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
];

const CaseForm: React.FC<CaseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  case: caseData,
  isEditing = false
}) => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<CaseFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      clientId: '',
      assignedTo: '',
      courtDate: ''
    }
  });

  // Load users (clients and admins) for dropdowns
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const [clientsResponse, adminsResponse] = await Promise.all([
          userManagementService.getUsers({ role: 'client' }),
          userManagementService.getUsers({ role: 'admin,advocate' })
        ]);
        
        setClients(clientsResponse.data || []);
        setAdmins(adminsResponse.data || []);
      } catch (error) {
        console.error('Failed to load users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (isEditing && caseData) {
      setValue('title', caseData.title);
      setValue('description', caseData.description);
      setValue('category', caseData.category);
      setValue('priority', caseData.priority);
      setValue('clientId', caseData.clientId);
      setValue('assignedTo', caseData.assignedTo || '');
      setValue('courtDate', caseData.courtDate ? new Date(caseData.courtDate).toISOString().split('T')[0] : '');
    } else {
      reset();
    }
  }, [isEditing, caseData, setValue, reset]);

  const handleFormSubmit = async (data: CaseFormData) => {
    try {
      setLoading(true);
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-navy-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Case' : 'Create New Case'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Title *
            </label>
            <Input
              {...register('title', {
                required: 'Case title is required',
                maxLength: { value: 200, message: 'Title cannot exceed 200 characters' }
              })}
              placeholder="Enter case title"
              error={errors.title?.message}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', {
                required: 'Case description is required',
                maxLength: { value: 5000, message: 'Description cannot exceed 5000 characters' }
              })}
              rows={4}
              placeholder="Describe the case details..."
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              >
                {PRIORITIES.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Client and Assigned To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              {loadingUsers ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  Loading clients...
                </div>
              ) : (
                <select
                  {...register('clientId', { required: 'Client is required' })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent ${
                    errors.clientId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select client</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.firstName} {client.lastName} ({client.email})
                    </option>
                  ))}
                </select>
              )}
              {errors.clientId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.clientId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>
              {loadingUsers ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  Loading staff...
                </div>
              ) : (
                <select
                  {...register('assignedTo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                >
                  <option value="">Auto-assign</option>
                  {admins.map(admin => (
                    <option key={admin._id} value={admin._id}>
                      {admin.firstName} {admin.lastName} ({admin.role})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Court Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Court Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                {...register('courtDate', {
                  validate: (value) => {
                    if (value && new Date(value) < new Date()) {
                      return 'Court date cannot be in the past';
                    }
                    return true;
                  }
                })}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent ${
                  errors.courtDate ? 'border-red-300' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.courtDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.courtDate.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !isValid}
              className="flex items-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditing ? 'Update Case' : 'Create Case'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CaseForm;

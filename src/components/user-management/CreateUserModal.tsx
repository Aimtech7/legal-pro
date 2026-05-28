// Create User Modal for LegalPro v1.0.1 - Advocate (Superuser) Interface
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Shield, Save, AlertCircle } from 'lucide-react';
import { userManagementService, CreateAdminData, CreateClientData } from '../../services/userManagementService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface CreateUserModalProps {
  userType: 'admin' | 'client';
  onClose: () => void;
  onSuccess: (password: string) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ userType, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [permissions, setPermissions] = useState({
    canOpenFiles: false,
    canUploadFiles: false,
    canAdmitClients: false,
    canManageCases: false,
    canScheduleAppointments: false,
    canAccessReports: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [permission]: !prev[permission] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (userType === 'admin') {
        const adminData: CreateAdminData = {
          ...formData,
          permissions
        };
        const response = await userManagementService.createAdmin(adminData);
        toast.success('Admin created successfully');
        onSuccess(response.temporaryPassword);
      } else {
        const clientData: CreateClientData = formData;
        const response = await userManagementService.createClient(clientData);
        toast.success('Client created successfully');
        onSuccess(response.temporaryPassword);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to create ${userType}`);
    } finally {
      setLoading(false);
    }
  };

  const permissionLabels = {
    canOpenFiles: 'Open Files',
    canUploadFiles: 'Upload Files',
    canAdmitClients: 'Admit Clients',
    canManageCases: 'Manage Cases',
    canScheduleAppointments: 'Schedule Appointments',
    canAccessReports: 'Access Reports'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {userType === 'admin' ? (
                <Shield className="h-6 w-6 text-purple-600" />
              ) : (
                <User className="h-6 w-6 text-blue-600" />
              )}
              <h2 className="text-xl font-bold text-gray-900">
                Create New {userType === 'admin' ? 'Admin' : 'Client'}
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            {/* Admin Permissions */}
            {userType === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Office Duties & Permissions
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={permissions[key as keyof typeof permissions]}
                          onChange={() => handlePermissionChange(key as keyof typeof permissions)}
                          className="h-4 w-4 text-navy-600 focus:ring-navy-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Permission Guidelines:</p>
                        <ul className="mt-1 space-y-1 text-xs">
                          <li>• <strong>Open Files:</strong> View and access case files</li>
                          <li>• <strong>Upload Files:</strong> Add documents to cases</li>
                          <li>• <strong>Admit Clients:</strong> Create new client accounts</li>
                          <li>• <strong>Manage Cases:</strong> Create and modify cases</li>
                          <li>• <strong>Schedule Appointments:</strong> Book client meetings</li>
                          <li>• <strong>Access Reports:</strong> View analytics and reports</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Password Information:</p>
                  <p className="mt-1">
                    A secure temporary password will be automatically generated for this user. 
                    You will receive the password after creation to share with the user. 
                    They will be required to change it on first login.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{loading ? 'Creating...' : `Create ${userType === 'admin' ? 'Admin' : 'Client'}`}</span>
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateUserModal;

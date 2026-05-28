// Admin Permissions Modal for LegalPro v1.0.1 - Advocate (Superuser) Interface
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Save, AlertCircle, User } from 'lucide-react';
import { userManagementService } from '../../services/userManagementService';
import { User as UserType } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface AdminPermissionsModalProps {
  user: UserType;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminPermissionsModal: React.FC<AdminPermissionsModalProps> = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState({
    canOpenFiles: user.permissions?.canOpenFiles || false,
    canUploadFiles: user.permissions?.canUploadFiles || false,
    canAdmitClients: user.permissions?.canAdmitClients || false,
    canManageCases: user.permissions?.canManageCases || false,
    canScheduleAppointments: user.permissions?.canScheduleAppointments || false,
    canAccessReports: user.permissions?.canAccessReports || false
  });

  const handlePermissionChange = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [permission]: !prev[permission] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await userManagementService.updateAdminPermissions(user.id, permissions);
      toast.success('Admin permissions updated successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  const permissionLabels = {
    canOpenFiles: {
      label: 'Open Files',
      description: 'View and access case files and documents'
    },
    canUploadFiles: {
      label: 'Upload Files',
      description: 'Add documents and files to cases'
    },
    canAdmitClients: {
      label: 'Admit Clients',
      description: 'Create new client accounts and onboard clients'
    },
    canManageCases: {
      label: 'Manage Cases',
      description: 'Create, modify, and manage legal cases'
    },
    canScheduleAppointments: {
      label: 'Schedule Appointments',
      description: 'Book and manage client appointments'
    },
    canAccessReports: {
      label: 'Access Reports',
      description: 'View analytics, reports, and system insights'
    }
  };

  const enabledPermissions = Object.entries(permissions).filter(([_, enabled]) => enabled).length;

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
              <Shield className="h-6 w-6 text-purple-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Admin Permissions
                </h2>
                <p className="text-sm text-gray-600">
                  Manage office duties for {user.firstName} {user.lastName}
                </p>
              </div>
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

          {/* Admin Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-purple-600 font-medium">Administrator</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Permissions Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Permissions Summary
                </span>
              </div>
              <p className="text-sm text-blue-700">
                {enabledPermissions} of {Object.keys(permissions).length} permissions enabled
              </p>
            </div>

            {/* Permissions List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Office Duties & Permissions
              </label>
              <div className="space-y-4">
                {Object.entries(permissionLabels).map(([key, { label, description }]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions[key as keyof typeof permissions]}
                        onChange={() => handlePermissionChange(key as keyof typeof permissions)}
                        className="h-4 w-4 text-navy-600 focus:ring-navy-500 border-gray-300 rounded mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                          {permissions[key as keyof typeof permissions] && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Enabled
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning for No Permissions */}
            {enabledPermissions === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">No Permissions Enabled</p>
                    <p className="mt-1">
                      This admin will have very limited access to the system. 
                      Consider enabling at least one permission for them to be useful.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium">Security Notice</p>
                  <p className="mt-1">
                    Changes to admin permissions take effect immediately. 
                    The admin will be notified of any permission changes.
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
                <span>{loading ? 'Updating...' : 'Update Permissions'}</span>
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPermissionsModal;

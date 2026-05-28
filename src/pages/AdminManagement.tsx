// Admin Management page for LegalPro v1.0.1 - Enhanced with Advocate (Superuser) Features
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Shield,
  Plus,
  Search,
  User,
  Mail,
  Phone,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Settings,
  Users,
  Key,
  Crown,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import UserManagementDashboard from '../components/user-management/UserManagementDashboard';
import { showToast } from '../services/toastService';

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  casesAssigned: number;
  clientsManaged: number;
}

const AdminManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced'>('overview');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AdminFormData>();

  // Check if user is advocate (superuser)
  if (user?.role !== 'advocate') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only advocates (superusers) can access admin management.</p>
        </Card>
      </div>
    );
  }

  // Mock admins data - replace with API call
  const mockAdmins: Admin[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Kamau',
      email: 'john.kamau@legalpro.co.ke',
      phone: '+254 700 123 456',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-15',
      lastLogin: '2024-03-10',
      casesAssigned: 15,
      clientsManaged: 25
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Wanjiku',
      email: 'sarah.wanjiku@legalpro.co.ke',
      phone: '+254 700 123 457',
      role: 'admin',
      isActive: true,
      createdAt: '2024-02-01',
      lastLogin: '2024-03-09',
      casesAssigned: 12,
      clientsManaged: 18
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Otieno',
      email: 'michael.otieno@legalpro.co.ke',
      phone: '+254 700 123 458',
      role: 'admin',
      isActive: false,
      createdAt: '2024-01-20',
      lastLogin: '2024-02-28',
      casesAssigned: 8,
      clientsManaged: 12
    }
  ];

  useEffect(() => {
    // Check if user is advocate (super admin)
    if (user?.role !== 'advocate') {
      showToast.error('Access denied. Only advocates can manage admins.');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setAdmins(mockAdmins);
      setLoading(false);
    }, 1000);
  }, [user]);

  const onSubmit = async (data: AdminFormData) => {
    const loadingToastId = showToast.loading('Creating admin account...', {
      title: 'Creating Admin'
    });

    try {
      // API call to create admin
      console.log('Creating admin:', data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newAdmin: Admin = {
        id: Date.now().toString(),
        ...data,
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        casesAssigned: 0,
        clientsManaged: 0
      };

      setAdmins([...admins, newAdmin]);

      showToast.dismiss(loadingToastId);
      showToast.success(`Admin account created for ${data.firstName} ${data.lastName}. Login credentials have been sent via email.`, {
        title: 'Admin Created Successfully',
        actions: [
          {
            label: 'Send Welcome Email',
            action: () => {
              showToast.info('Welcome email sent successfully.', {
                title: 'Email Sent'
              });
            },
            icon: Mail
          },
          {
            label: 'Set Permissions',
            action: () => console.log('Set permissions'),
            icon: Key
          }
        ]
      });

      reset();
      setShowCreateForm(false);
    } catch (error: any) {
      showToast.dismiss(loadingToastId);
      showToast.error(error.message || 'Failed to create admin account. Please check the information and try again.', {
        title: 'Admin Creation Failed',
        actions: [
          {
            label: 'Retry',
            action: () => onSubmit(data),
            icon: RotateCcw
          }
        ]
      });
    }
  };

  const toggleAdminStatus = async (adminId: string) => {
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return;

    const action = admin.isActive ? 'deactivating' : 'activating';
    const loadingToastId = showToast.loading(`${action} admin account...`, {
      title: 'Updating Status'
    });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAdmins(admins.map(a =>
        a.id === adminId
          ? { ...a, isActive: !a.isActive }
          : a
      ));

      showToast.dismiss(loadingToastId);
      showToast.success(`Admin account ${admin.isActive ? 'deactivated' : 'activated'} successfully.`, {
        title: 'Status Updated',
        actions: [
          {
            label: admin.isActive ? 'Reactivate' : 'Deactivate',
            action: () => toggleAdminStatus(adminId),
            icon: admin.isActive ? UserCheck : UserX,
            variant: admin.isActive ? 'primary' : 'danger'
          }
        ]
      });
    } catch (error: any) {
      showToast.dismiss(loadingToastId);
      showToast.error(error.message || 'Failed to update admin status. Please try again.', {
        title: 'Status Update Failed',
        actions: [
          {
            label: 'Retry',
            action: () => toggleAdminStatus(adminId),
            icon: RotateCcw
          }
        ]
      });
    }
  };

  const deleteAdmin = async (adminId: string) => {
    if (window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        setAdmins(admins.filter(admin => admin.id !== adminId));
        showToast.success('Admin deleted successfully!');
      } catch (error) {
        showToast.error('Failed to delete admin');
      }
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && admin.isActive) ||
      (statusFilter === 'inactive' && !admin.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Redirect if not advocate
  if (user?.role !== 'advocate') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only advocates (super admins) can access this page.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-800 mb-2">
              <Crown className="inline-block w-8 h-8 mr-2 text-gold-600" />
              Admin Management (Superuser)
            </h1>
            <p className="text-gray-600">
              Comprehensive user management system for advocates (superusers)
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-navy-500 text-navy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Admin Overview
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'advanced'
                  ? 'border-navy-500 text-navy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Crown className="w-4 h-4 inline-block mr-2" />
              Advanced User Management
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Original Admin Management Content */}
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Admin</span>
              </Button>
            </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Admins</p>
                <p className="text-2xl font-bold text-navy-800">{admins.length}</p>
              </div>
              <Shield className="w-8 h-8 text-navy-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Admins</p>
                <p className="text-2xl font-bold text-green-600">
                  {admins.filter(admin => admin.isActive).length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inactive Admins</p>
                <p className="text-2xl font-bold text-red-600">
                  {admins.filter(admin => !admin.isActive).length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cases</p>
                <p className="text-2xl font-bold text-blue-600">
                  {admins.reduce((sum, admin) => sum + admin.casesAssigned, 0)}
                </p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Admins Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin, index) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-navy-800" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.firstName} {admin.lastName}
                          </div>
                          <div className="text-sm text-gray-500">Admin</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admin.email}</div>
                      <div className="text-sm text-gray-500">{admin.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{admin.casesAssigned} cases</div>
                      <div className="text-gray-500">{admin.clientsManaged} clients</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedAdmin(admin)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleAdminStatus(admin.id)}
                          className={`${
                            admin.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {admin.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No admins have been created yet'
              }
            </p>
          </div>
        )}

        {/* Create Admin Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-navy-800">Add New Admin</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    icon={<User className="w-5 h-5 text-gray-400" />}
                    error={errors.firstName?.message}
                    {...register('firstName', { required: 'First name is required' })}
                  />

                  <Input
                    label="Last Name"
                    icon={<User className="w-5 h-5 text-gray-400" />}
                    error={errors.lastName?.message}
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  icon={<Mail className="w-5 h-5 text-gray-400" />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  icon={<Phone className="w-5 h-5 text-gray-400" />}
                  error={errors.phone?.message}
                  {...register('phone', { required: 'Phone number is required' })}
                />

                <Input
                  label="Temporary Password"
                  type="password"
                  helperText="Admin will be required to change this password on first login"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                />

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Admin
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Admin Details Modal */}
        {selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-navy-800">Admin Details</h2>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-navy-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-800">
                      {selectedAdmin.firstName} {selectedAdmin.lastName}
                    </h3>
                    <p className="text-gray-600">System Administrator</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedAdmin.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedAdmin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{selectedAdmin.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{selectedAdmin.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">Cases Assigned: </span>
                        <span className="font-medium">{selectedAdmin.casesAssigned}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Clients Managed: </span>
                        <span className="font-medium">{selectedAdmin.clientsManaged}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600">Created: </span>
                      <span className="font-medium">{new Date(selectedAdmin.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Login: </span>
                      <span className="font-medium">
                        {selectedAdmin.lastLogin ? new Date(selectedAdmin.lastLogin).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => toggleAdminStatus(selectedAdmin.id)}
                  >
                    {selectedAdmin.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedAdmin(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
          </div>
        )}

        {/* Advanced User Management Tab */}
        {activeTab === 'advanced' && (
          <div>
            <UserManagementDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
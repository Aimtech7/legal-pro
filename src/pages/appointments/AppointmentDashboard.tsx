// Appointment Dashboard for LegalPro v1.0.1
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Filter, 
  Search, 
  User, 
  MapPin, 
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { appointmentService, Appointment, AppointmentFilters } from '../../services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentBookingForm from '../../components/appointments/AppointmentBookingForm';
import toast from 'react-hot-toast';

const AppointmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const [filters, setFilters] = useState<AppointmentFilters>({
    page: 1,
    limit: 20,
    status: '',
    type: '',
    search: ''
  });

  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    loadAppointments();
    loadStats();
  }, [filters]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointments(filters);
      setAppointments(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const statistics = await appointmentService.getStatistics(
        startOfMonth.toISOString(),
        endOfMonth.toISOString()
      );

      setStats({
        total: statistics.totals.total,
        upcoming: statistics.totals.upcoming,
        completed: statistics.totals.completed,
        cancelled: statistics.totals.cancelled
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleCancelAppointment = async (appointmentId: string, reason?: string) => {
    try {
      await appointmentService.cancelAppointment(appointmentId, reason);
      toast.success('Appointment cancelled successfully');
      loadAppointments();
      loadStats();
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.completeAppointment(appointmentId);
      toast.success('Appointment marked as completed');
      loadAppointments();
      loadStats();
    } catch (error: any) {
      console.error('Error completing appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to complete appointment');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      consultation: User,
      follow_up: Clock,
      court_preparation: FileText,
      document_review: FileText,
      mediation: User,
      other: Calendar
    };
    const IconComponent = icons[type as keyof typeof icons] || Calendar;
    return <IconComponent className="w-4 h-4" />;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const canManageAppointment = (appointment: Appointment) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'advocate' && appointment.advocateId._id === user.id) return true;
    if (user?.role === 'client' && appointment.clientId._id === user.id) return true;
    return false;
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Upcoming</p>
            <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderFilters = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: showFilters ? 1 : 0, height: showFilters ? 'auto' : 0 }}
      className="bg-white rounded-lg shadow p-6 mb-6 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="follow_up">Follow-up</option>
            <option value="court_preparation">Court Preparation</option>
            <option value="document_review">Document Review</option>
            <option value="mediation">Mediation</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search appointments..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAppointmentCard = (appointment: Appointment) => {
    const { date, time } = formatDateTime(appointment.startDateTime);
    const canManage = canManageAppointment(appointment);

    return (
      <motion.div
        key={appointment._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="mr-3">
                {getTypeIcon(appointment.type)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {appointment.title}
              </h3>
              <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {appointment.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{date} at {time}</span>
              </div>

              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>
                  {user?.role === 'client'
                    ? `with ${appointment.advocateId.firstName} ${appointment.advocateId.lastName}`
                    : `${appointment.clientId.firstName} ${appointment.clientId.lastName}`
                  }
                </span>
              </div>

              {appointment.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="capitalize">
                    {appointment.location.type.replace('_', ' ')}
                    {appointment.location.address && ` - ${appointment.location.address}`}
                  </span>
                </div>
              )}

              {appointment.caseId && (
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>
                    Case: {appointment.caseId.caseNumber} - {appointment.caseId.title}
                  </span>
                </div>
              )}
            </div>

            {appointment.description && (
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {appointment.description}
              </p>
            )}
          </div>

          {canManage && (
            <div className="relative ml-4">
              <button
                onClick={() => setSelectedAppointment(
                  selectedAppointment?._id === appointment._id ? null : appointment
                )}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {selectedAppointment?._id === appointment._id && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border z-10">
                  <div className="py-1">
                    {appointment.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleCompleteAppointment(appointment._id)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Completed
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel Appointment
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        // Handle edit appointment
                        setSelectedAppointment(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-700">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} appointments
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm border rounded-lg ${
                  page === pagination.page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <AppointmentBookingForm
            onSuccess={(appointment) => {
              setShowBookingForm(false);
              loadAppointments();
              loadStats();
            }}
            onCancel={() => setShowBookingForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">
              Manage your appointments and schedule new meetings
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg flex items-center transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            <button
              onClick={() => setShowBookingForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Filters */}
        {renderFilters()}

        {/* Appointments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading appointments...</span>
            </div>
          ) : appointments.length > 0 ? (
            <>
              {appointments.map(renderAppointmentCard)}
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600 mb-6">
                {filters.search || filters.status || filters.type
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by booking your first appointment'
                }
              </p>
              <button
                onClick={() => setShowBookingForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Book New Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default AppointmentDashboard;

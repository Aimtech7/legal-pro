// Enhanced Dashboard page component for LegalPro v1.0.1 - With Loading & Error Handling
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  User,
  TrendingUp,
  Bell,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/apiService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { LoadingOverlay, SkeletonCard, SkeletonText } from '../components/ui/LoadingStates';
import { ErrorBoundary, RetryComponent } from '../components/ui/ErrorHandling';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // API calls with loading and error handling
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    retry: retryDashboard
  } = useApi(
    () => apiService.getDashboardData?.() || Promise.resolve(getMockDashboardData()),
    []
  );

  const {
    data: recentActivity,
    loading: activityLoading,
    error: activityError,
    retry: retryActivity
  } = useApi(
    () => apiService.getRecentActivity?.() || Promise.resolve(getMockRecentActivity()),
    []
  );

  // Mock data fallback
  const getMockDashboardData = () => ({
    stats: [
      { icon: FileText, label: 'Active Cases', value: '3', color: 'text-blue-600' },
      { icon: Calendar, label: 'Upcoming Appointments', value: '2', color: 'text-green-600' },
      { icon: Clock, label: 'Pending Actions', value: '5', color: 'text-yellow-600' },
      { icon: DollarSign, label: 'Outstanding Fees', value: '$2,500', color: 'text-red-600' }
    ]
  });

  const getMockRecentActivity = () => ({
    cases: [
      {
        id: '1',
        title: 'Property Dispute Resolution',
        status: 'in_progress',
        lastUpdate: '2 days ago',
        nextAction: 'Document review scheduled',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Contract Negotiation',
        status: 'pending',
        lastUpdate: '1 week ago',
        nextAction: 'Awaiting client response',
        priority: 'medium'
      }
    ]
  });

  // Refresh all dashboard data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([retryDashboard(), retryActivity()]);
      toast.success('Dashboard refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  // Show loading state for initial load
  if (dashboardLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <SkeletonText lines={2} className="max-w-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} className="h-32" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkeletonCard className="h-96" />
            <SkeletonCard className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (dashboardError && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RetryComponent
            onRetry={retryDashboard}
            error={dashboardError}
            className="py-16"
          />
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || [];
  const recentCases = recentActivity?.cases || [];

  const upcomingAppointments = [
    {
      id: '1',
      title: 'Initial Consultation',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'consultation',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Case Review Meeting',
      date: 'March 15',
      time: '2:00 PM',
      type: 'follow_up',
      status: 'scheduled'
    }
  ];

  const recentMessages = [
    {
      id: '1',
      sender: 'John Kamau',
      message: 'Your case documents have been reviewed. Please schedule a follow-up meeting.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      sender: 'Sarah Wanjiku',
      message: 'The contract amendments are ready for your review.',
      time: '1 day ago',
      unread: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-navy-800 mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your legal matters and upcoming appointments.
            </p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-navy-800">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Cases */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-navy-800">Recent Cases</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentCases.map((case_item) => (
                  <div key={case_item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-navy-800">{case_item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_item.status)}`}>
                        {case_item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{case_item.nextAction}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Updated {case_item.lastUpdate}</span>
                      <span className={`font-medium ${getPriorityColor(case_item.priority)}`}>
                        {case_item.priority} priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-navy-800">Upcoming Appointments</h2>
                <Button variant="ghost" size="sm">
                  Schedule New
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-navy-800" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-navy-800">{appointment.title}</h3>
                      <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {appointment.status === 'confirmed' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-navy-800">Recent Messages</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-navy-800" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-navy-800">{message.sender}</h3>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{message.message}</p>
                  </div>
                  {message.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-navy-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Calendar className="w-6 h-6" />
                <span>Book Appointment</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <MessageSquare className="w-6 h-6" />
                <span>Send Message</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <FileText className="w-6 h-6" />
                <span>Upload Document</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <DollarSign className="w-6 h-6" />
                <span>Make Payment</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
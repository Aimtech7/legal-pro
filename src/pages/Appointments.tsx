// Appointments scheduling page for LegalPro v1.0.1
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { showToast } from '../services/toastService';
import { RotateCcw, Calendar as CalendarIcon, CreditCard, Bell } from 'lucide-react';

interface AppointmentFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow_up' | 'court_appearance';
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AppointmentFormData>();

  // Mock appointments data
  const appointments = [
    {
      id: '1',
      title: 'Initial Consultation',
      description: 'Property dispute consultation',
      date: '2024-03-15',
      time: '10:00',
      duration: 60,
      status: 'confirmed',
      type: 'consultation',
      client: user ? `${user.firstName} ${user.lastName}` : 'John Doe',
      fee: 5000,
      paymentStatus: 'paid'
    },
    {
      id: '2',
      title: 'Case Review Meeting',
      description: 'Review contract amendments',
      date: '2024-03-20',
      time: '14:00',
      duration: 45,
      status: 'scheduled',
      type: 'follow_up',
      client: user ? `${user.firstName} ${user.lastName}` : 'Jane Smith',
      fee: 3000,
      paymentStatus: 'pending'
    },
    {
      id: '3',
      title: 'Court Appearance',
      description: 'Family court hearing',
      date: '2024-03-25',
      time: '09:00',
      duration: 120,
      status: 'scheduled',
      type: 'court_appearance',
      client: user ? `${user.firstName} ${user.lastName}` : 'Mike Johnson',
      fee: 8000,
      paymentStatus: 'paid'
    }
  ];

  const availableSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const onSubmit = async (data: AppointmentFormData) => {
    const loadingToastId = showToast.loading('Booking your appointment...', {
      title: 'Booking Appointment'
    });

    try {
      // Here you would make an API call to book the appointment
      console.log('Booking appointment:', data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      showToast.dismiss(loadingToastId);
      showToast.success('Appointment booked successfully! You will receive a confirmation email shortly.', {
        title: 'Appointment Confirmed',
        actions: [
          {
            label: 'View Calendar',
            action: () => console.log('View calendar'),
            icon: CalendarIcon
          },
          {
            label: 'Make Payment',
            action: () => console.log('Make payment'),
            icon: CreditCard
          },
          {
            label: 'Set Reminder',
            action: () => {
              showToast.info('Reminder set for 1 hour before your appointment.', {
                title: 'Reminder Set'
              });
            },
            icon: Bell
          }
        ]
      });

      reset();
      setShowBookingForm(false);
    } catch (error: any) {
      showToast.dismiss(loadingToastId);
      showToast.error(error.message || 'Failed to book appointment. Please try again or contact support.', {
        title: 'Booking Failed',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <User className="w-4 h-4" />;
      case 'follow_up': return <MessageSquare className="w-4 h-4" />;
      case 'court_appearance': return <Calendar className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = selectedFilter === 'all' || appointment.status === selectedFilter;
    const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-800 mb-2">
              {user ? 'My Appointments' : 'Book an Appointment'}
            </h1>
            <p className="text-gray-600">
              {user ? 'Manage your scheduled appointments and book new ones' : 'Schedule a consultation with our legal experts'}
            </p>
          </div>
          <Button
            onClick={() => setShowBookingForm(true)}
            className="mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book New Appointment
          </Button>
        </div>

        {user && (
          <>
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'scheduled', 'confirmed', 'completed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-navy-800 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                          {getTypeIcon(appointment.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy-800">{appointment.title}</h3>
                          <p className="text-sm text-gray-600">{appointment.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{appointment.time} ({appointment.duration} minutes)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>{appointment.client}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm">
                        <span className="text-gray-600">Fee: </span>
                        <span className="font-medium">KSh {appointment.fee.toLocaleString()}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          appointment.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {appointment.paymentStatus}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-navy-800">Book an Appointment</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Appointment Title"
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required' })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      {...register('type', { required: 'Type is required' })}
                    >
                      <option value="">Select type</option>
                      <option value="consultation">Initial Consultation</option>
                      <option value="follow_up">Follow-up Meeting</option>
                      <option value="court_appearance">Court Appearance</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    placeholder="Briefly describe the purpose of your appointment..."
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Preferred Date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    error={errors.date?.message}
                    {...register('date', { required: 'Date is required' })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      {...register('time', { required: 'Time is required' })}
                    >
                      <option value="">Select time</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                {!user && (
                  <>
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-navy-800 mb-4">Contact Information</h3>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Input
                          label="Email"
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
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowBookingForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Book Appointment
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Public Booking Section */}
        {!user && (
          <div className="mt-12">
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-navy-800 mb-4">
                  Why Choose Our Legal Services?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our experienced legal team is committed to providing personalized, professional service to help you navigate your legal challenges with confidence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-navy-800" />
                  </div>
                  <h3 className="font-semibold text-navy-800 mb-2">Expert Legal Advice</h3>
                  <p className="text-gray-600 text-sm">
                    Get professional guidance from experienced advocates with proven track records.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-navy-800" />
                  </div>
                  <h3 className="font-semibold text-navy-800 mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600 text-sm">
                    Book appointments at your convenience with our flexible scheduling system.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-navy-800" />
                  </div>
                  <h3 className="font-semibold text-navy-800 mb-2">Ongoing Support</h3>
                  <p className="text-gray-600 text-sm">
                    Receive continuous support and updates throughout your legal journey.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
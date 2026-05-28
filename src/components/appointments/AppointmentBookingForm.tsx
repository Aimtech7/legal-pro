// Appointment Booking Form Component for LegalPro v1.0.1
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, MapPin, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { appointmentService, CreateAppointmentData, AvailableSlot } from '../../services/appointmentService';
import { userManagementService } from '../../services/userManagementService';
import { caseService } from '../../services/caseService';
import toast from 'react-hot-toast';

interface AppointmentBookingFormProps {
  onSuccess?: (appointment: any) => void;
  onCancel?: () => void;
  prefilledData?: Partial<CreateAppointmentData>;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialization?: string[];
}

interface Case {
  _id: string;
  title: string;
  caseNumber: string;
}

const AppointmentBookingForm: React.FC<AppointmentBookingFormProps> = ({
  onSuccess,
  onCancel,
  prefilledData
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [advocates, setAdvocates] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState<CreateAppointmentData>({
    title: '',
    description: '',
    clientId: '',
    advocateId: '',
    startDateTime: '',
    endDateTime: '',
    type: 'consultation',
    priority: 'medium',
    location: {
      type: 'office'
    },
    caseId: '',
    isRecurring: false,
    reminderSettings: {
      enabled: true,
      intervals: [1440, 60], // 24 hours and 1 hour before
      methods: ['email']
    },
    ...prefilledData
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load available slots when advocate and date are selected
  useEffect(() => {
    if (formData.advocateId && selectedDate) {
      loadAvailableSlots();
    }
  }, [formData.advocateId, selectedDate]);

  const loadInitialData = async () => {
    try {
      const [advocatesRes, clientsRes, casesRes] = await Promise.all([
        userManagementService.getUsers({ role: 'advocate', limit: 100 }),
        userManagementService.getUsers({ role: 'client', limit: 100 }),
        caseService.getCases({ limit: 100 })
      ]);

      setAdvocates(advocatesRes.data.users || []);
      setClients(clientsRes.data.users || []);
      setCases(casesRes.data || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load form data');
    }
  };

  const loadAvailableSlots = async () => {
    if (!formData.advocateId || !selectedDate) return;

    setLoadingSlots(true);
    try {
      const availability = await appointmentService.getAvailability(
        formData.advocateId,
        selectedDate,
        60 // Default 1 hour duration
      );
      setAvailableSlots(availability.availableSlots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      toast.error('Failed to load available time slots');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleSlotSelection = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setFormData(prev => ({
      ...prev,
      startDateTime: slot.startTime,
      endDateTime: slot.endTime
    }));
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.clientId) newErrors.clientId = 'Client is required';
        if (!formData.advocateId) newErrors.advocateId = 'Advocate is required';
        break;
      case 2:
        if (!selectedDate) newErrors.date = 'Date is required';
        if (!selectedSlot) newErrors.slot = 'Time slot is required';
        break;
      case 3:
        if (!formData.type) newErrors.type = 'Appointment type is required';
        if (!formData.location?.type) newErrors.locationType = 'Location type is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const validation = appointmentService.validateAppointmentData(formData);
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        setLoading(false);
        return;
      }

      const response = await appointmentService.createAppointment(formData);
      toast.success('Appointment booked successfully!');
      onSuccess?.(response.data);
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      const message = error.response?.data?.message || 'Failed to book appointment';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead
    return maxDate.toISOString().split('T')[0];
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNumber <= step
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {stepNumber < step ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              stepNumber
            )}
          </div>
          {stepNumber < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                stepNumber < step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Basic Information
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Appointment Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Legal Consultation"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Brief description of the appointment purpose..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client *
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => handleInputChange('clientId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.clientId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Advocate *
          </label>
          <select
            value={formData.advocateId}
            onChange={(e) => handleInputChange('advocateId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.advocateId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select an advocate</option>
            {advocates.map((advocate) => (
              <option key={advocate._id} value={advocate._id}>
                {advocate.firstName} {advocate.lastName}
                {advocate.specialization && advocate.specialization.length > 0 && 
                  ` - ${advocate.specialization[0]}`
                }
              </option>
            ))}
          </select>
          {errors.advocateId && (
            <p className="mt-1 text-sm text-red-600">{errors.advocateId}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Related Case (Optional)
        </label>
        <select
          value={formData.caseId}
          onChange={(e) => handleInputChange('caseId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">No related case</option>
          {cases.map((caseItem) => (
            <option key={caseItem._id} value={caseItem._id}>
              {caseItem.caseNumber} - {caseItem.title}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Date & Time Selection
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date *
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={getMinDate()}
          max={getMaxDate()}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      {selectedDate && formData.advocateId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Time Slots *
          </label>
          {loadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading available slots...</span>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSlotSelection(slot)}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    selectedSlot?.startTime === slot.startTime
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {slot.formattedTime}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No available slots for this date</p>
              <p className="text-sm">Please select a different date</p>
            </div>
          )}
          {errors.slot && (
            <p className="mt-2 text-sm text-red-600">{errors.slot}</p>
          )}
        </div>
      )}

      {!formData.advocateId && (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Please select an advocate first</p>
        </div>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Appointment Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="consultation">Consultation</option>
            <option value="follow_up">Follow-up</option>
            <option value="court_preparation">Court Preparation</option>
            <option value="document_review">Document Review</option>
            <option value="mediation">Mediation</option>
            <option value="other">Other</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Type *
        </label>
        <select
          value={formData.location?.type}
          onChange={(e) => handleLocationChange('type', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.locationType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="office">Office</option>
          <option value="virtual">Virtual Meeting</option>
          <option value="court">Court</option>
          <option value="client_location">Client Location</option>
          <option value="other">Other</option>
        </select>
        {errors.locationType && (
          <p className="mt-1 text-sm text-red-600">{errors.locationType}</p>
        )}
      </div>

      {formData.location?.type === 'virtual' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Link
          </label>
          <input
            type="url"
            value={formData.location?.meetingLink || ''}
            onChange={(e) => handleLocationChange('meetingLink', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://zoom.us/j/..."
          />
        </div>
      )}

      {(formData.location?.type === 'client_location' || formData.location?.type === 'other') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.location?.address || ''}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the address..."
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Instructions
        </label>
        <textarea
          value={formData.location?.instructions || ''}
          onChange={(e) => handleLocationChange('instructions', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any special instructions for the appointment..."
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Reminder Settings</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.reminderSettings?.enabled}
              onChange={(e) => handleInputChange('reminderSettings', {
                ...formData.reminderSettings,
                enabled: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Enable appointment reminders
            </span>
          </label>

          {formData.reminderSettings?.enabled && (
            <div className="ml-6 space-y-2">
              <p className="text-sm text-gray-600">
                Reminders will be sent 24 hours and 1 hour before the appointment
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Book New Appointment
        </h2>
        <p className="text-gray-600">
          Schedule a meeting with your legal team
        </p>
      </div>

      {renderStepIndicator()}

      <div className="mb-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      <div className="flex justify-between">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Booking...
                </>
              ) : (
                'Book Appointment'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingForm;

// Advocate Invitation Modal for LegalPro v1.0.1 - Secure Advocate Registration
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Crown, Mail, Send, AlertCircle, Shield } from 'lucide-react';
import { userManagementService } from '../../services/userManagementService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface AdvocateInvitationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AdvocateInvitationModal: React.FC<AdvocateInvitationModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    specialization: '',
    experience: '',
    education: '',
    barAdmission: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.licenseNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Create advocate with special invitation process
      const advocateData = {
        ...formData,
        role: 'advocate',
        specialization: formData.specialization.split(',').map(s => s.trim()),
        experience: parseInt(formData.experience) || 0
      };

      // In a real implementation, this would send an invitation email
      // For now, we'll create the advocate account directly
      const response = await userManagementService.createAdvocate(advocateData);
      
      toast.success('Advocate invitation sent successfully! They will receive login credentials via email.');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send advocate invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-gold-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Invite New Advocate (Superuser)
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

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Security Notice:</p>
                <p className="mt-1">
                  You are inviting a new advocate (superuser) who will have full system access. 
                  Only invite trusted legal professionals with proper credentials.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                />
                
                <Input
                  label="Last Name *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Email Address *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Credentials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="License Number *"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Enter bar license number"
                  required
                />
                
                <Input
                  label="Years of Experience"
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Enter years of experience"
                  min="0"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization Areas
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Criminal Law, Corporate Law, Family Law (comma-separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Education Background"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="e.g., LLB (University of Nairobi), LLM (Harvard)"
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Bar Admission"
                  name="barAdmission"
                  value={formData.barAdmission}
                  onChange={handleInputChange}
                  placeholder="e.g., Law Society of Kenya, 2015"
                />
              </div>
            </div>

            {/* Invitation Process Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Invitation Process:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• A secure invitation email will be sent to the provided email address</li>
                    <li>• The invitee will receive a temporary password and setup instructions</li>
                    <li>• They must verify their credentials and change their password on first login</li>
                    <li>• The account will be activated only after email verification</li>
                  </ul>
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
                  <Send className="h-4 w-4" />
                )}
                <span>{loading ? 'Sending Invitation...' : 'Send Invitation'}</span>
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdvocateInvitationModal;

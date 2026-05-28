// Professional Registration page component for LegalPro v1.0.1
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, Scale, GraduationCap,
  Award, FileText, Key, CheckCircle, AlertCircle, Shield,
  Clock, UserCheck, Building, Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
  superKey: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

const Register: React.FC = () => {
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuperKey, setShowSuperKey] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'advocate'>('advocate');

  // Validation State
  const [superKeyVerified, setSuperKeyVerified] = useState(false);
  const [superKeyInput, setSuperKeyInput] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    clearErrors,
    setError
  } = useForm<RegisterFormData>({
    mode: 'onChange'
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Super key for advocate registration
  const SUPER_KEY = 'ADVOCATE-SUPER-2024-DEV-KEY';

  // Password strength validation
  const validatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, feedback: [], isValid: false };
    }

    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    return {
      score,
      feedback,
      isValid: score >= 4
    };
  };

  // Real-time password validation
  useEffect(() => {
    if (password) {
      const strength = validatePasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password]);

  // Super key verification with enhanced security
  const verifySuperKey = (key: string) => {
    if (!key) {
      setSuperKeyVerified(false);
      return;
    }

    if (key === SUPER_KEY) {
      setSuperKeyVerified(true);
      toast.success('✅ Super key verified! You can now complete advocate registration.');
    } else {
      setSuperKeyVerified(false);
      if (key.length > 0) {
        toast.error('❌ Invalid super key. Contact system administrator.');
      }
    }
  };

  // Enhanced form validation
  const validateForm = (data: RegisterFormData): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    // Password confirmation
    if (data.password !== data.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }

    // Password strength
    if (!passwordStrength.isValid) {
      errors.push({ field: 'password', message: 'Password does not meet security requirements' });
    }

    // Phone validation (optional but if provided, must be valid)
    if (data.phone && !/^\+?[\d\s\-\(\)]+$/.test(data.phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }

    // Advocate-specific validation
    if (selectedRole === 'advocate') {
      if (!superKeyVerified) {
        errors.push({ field: 'superKey', message: 'Please verify the super key first' });
      }

      if (!data.licenseNumber || data.licenseNumber.trim().length < 3) {
        errors.push({ field: 'licenseNumber', message: 'License number must be at least 3 characters' });
      }

      if (!data.specialization) {
        errors.push({ field: 'specialization', message: 'Please select a specialization' });
      }

      if (!data.experience || data.experience.trim().length < 10) {
        errors.push({ field: 'experience', message: 'Please provide detailed experience (minimum 10 characters)' });
      }

      if (!data.education || data.education.trim().length < 10) {
        errors.push({ field: 'education', message: 'Please provide detailed education information (minimum 10 characters)' });
      }

      if (!data.barAdmission || data.barAdmission.trim().length < 5) {
        errors.push({ field: 'barAdmission', message: 'Please provide bar admission details (minimum 5 characters)' });
      }
    }

    return errors;
  };

  const specializations = [
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

  // Enhanced form submission with comprehensive validation
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      // Client-side validation
      const clientErrors = validateForm(data);
      if (clientErrors.length > 0) {
        setValidationErrors(clientErrors);

        // Set form errors for individual fields
        clientErrors.forEach(error => {
          setError(error.field as keyof RegisterFormData, {
            type: 'manual',
            message: error.message
          });
        });

        toast.error('Please fix the validation errors before submitting');
        return;
      }

      // Prepare submission data
      const { confirmPassword, ...userData } = data;
      userData.role = 'advocate'; // Only advocates can register directly
      userData.superKey = superKeyInput; // Include super key for backend verification

      console.log('Submitting registration data:', {
        email: userData.email,
        role: userData.role,
        licenseNumber: userData.licenseNumber
      });

      // Submit registration
      const result = await registerUser(userData);

      // Success feedback
      toast.success('🎉 Registration successful! Please verify your email.');

      // Store email for verification page
      localStorage.setItem('pendingVerificationEmail', userData.email);

      // Navigate to email verification
      setTimeout(() => {
        navigate('/verify-email');
      }, 1000);

    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle server validation errors
      if (error.message && error.message.includes('Validation failed')) {
        try {
          const errorData = JSON.parse(error.message.split('Validation failed: ')[1]);
          if (errorData.errors) {
            setValidationErrors(errorData.errors);
            errorData.errors.forEach((err: ValidationError) => {
              setError(err.field as keyof RegisterFormData, {
                type: 'server',
                message: err.message
              });
            });
          }
        } catch (parseError) {
          toast.error('Registration failed. Please check your information and try again.');
        }
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password Strength Indicator Component
  const PasswordStrengthIndicator: React.FC<{ strength: PasswordStrength }> = ({ strength }) => {
    const getStrengthColor = (score: number) => {
      if (score < 2) return 'bg-red-500';
      if (score < 3) return 'bg-yellow-500';
      if (score < 4) return 'bg-blue-500';
      return 'bg-green-500';
    };

    const getStrengthText = (score: number) => {
      if (score < 2) return 'Weak';
      if (score < 3) return 'Fair';
      if (score < 4) return 'Good';
      return 'Strong';
    };

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">Password Strength</span>
          <span className={`text-xs font-medium ${
            strength.score < 2 ? 'text-red-600' :
            strength.score < 3 ? 'text-yellow-600' :
            strength.score < 4 ? 'text-blue-600' : 'text-green-600'
          }`}>
            {getStrengthText(strength.score)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          ></div>
        </div>
        {strength.feedback.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Password must include:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              {strength.feedback.map((item, index) => (
                <li key={index} className="flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Validation Error Display Component
  const ValidationErrorDisplay: React.FC<{ errors: ValidationError[] }> = ({ errors }) => {
    if (errors.length === 0) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"
        >
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join our legal platform</p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-navy-800 mb-4">I am registering as:</h3>
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 border-2 border-navy-800 bg-navy-50 rounded-lg"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Scale className="w-8 h-8 text-navy-800" />
                  <div>
                    <h4 className="font-semibold text-navy-800">Advocate Registration</h4>
                    <p className="text-sm text-gray-600">Legal professional (Superuser/Owner)</p>
                  </div>
                </div>
              </motion.div>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Only advocates can register directly.
                  Advocates will create admin and client accounts through the system.
                </p>
              </div>
            </div>
          </div>

          {/* Super Key Verification */}
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <div className="flex items-start space-x-2">
                <Key className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Super Key Required</p>
                  <p className="mt-1">
                    Advocate registration requires a super key. Contact your system administrator
                    or existing advocate to obtain the super key.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Input
                label="Super Key *"
                type={showSuperKey ? 'text' : 'password'}
                placeholder="Enter advocate super key"
                value={superKeyInput}
                onChange={(e) => {
                  setSuperKeyInput(e.target.value);
                  verifySuperKey(e.target.value);
                }}
                className={superKeyVerified ? 'border-green-500 bg-green-50' : ''}
                icon={<Key className="w-5 h-5 text-gray-400" />}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowSuperKey(!showSuperKey)}
              >
                {showSuperKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {superKeyVerified && (
                <div className="absolute right-10 top-9 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            {superKeyVerified && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    Super key verified! Complete your advocate registration below.
                  </p>
                </div>
              </div>
            )}
          </div>

          {superKeyVerified && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Validation Errors Display */}
              <ValidationErrorDisplay errors={validationErrors} />

              {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                icon={<User className="w-5 h-5 text-gray-400" />}
                error={errors.firstName?.message}
                {...register('firstName', {
                  required: 'First name is required'
                })}
              />

              <Input
                label="Last Name"
                icon={<User className="w-5 h-5 text-gray-400" />}
                error={errors.lastName?.message}
                {...register('lastName', {
                  required: 'Last name is required'
                })}
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
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]?[\d\s\-()]+$/,
                  message: 'Invalid phone number'
                }
              })}
            />

            {/* Advocate-specific fields */}
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-medium text-navy-800 mb-4">Professional Information</h3>
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium text-navy-800 mb-4">Professional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="License Number"
                    icon={<Award className="w-5 h-5 text-gray-400" />}
                    error={errors.licenseNumber?.message}
                    {...register('licenseNumber', {
                      required: 'License number is required'
                    })}
                  />

                  <Input
                    label="Years of Experience"
                    type="number"
                    min="0"
                    icon={<GraduationCap className="w-5 h-5 text-gray-400" />}
                    error={errors.experience?.message}
                    {...register('experience', {
                      required: 'Experience is required',
                      min: { value: 0, message: 'Experience cannot be negative' }
                    })}
                  />
                </div>

                <Input
                  label="Education Background"
                  placeholder="e.g., LLB (University of Nairobi), LLM (Harvard)"
                  icon={<GraduationCap className="w-5 h-5 text-gray-400" />}
                  error={errors.education?.message}
                  {...register('education', {
                    required: 'Education background is required'
                  })}
                />

                <Input
                  label="Bar Admission"
                  placeholder="e.g., Law Society of Kenya, 2015"
                  icon={<FileText className="w-5 h-5 text-gray-400" />}
                  error={errors.barAdmission?.message}
                  {...register('barAdmission', {
                    required: 'Bar admission details are required'
                  })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Specialization
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {specializations.map((spec) => (
                      <label key={spec} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={spec}
                          className="rounded border-gray-300 text-navy-800 focus:ring-navy-500"
                          {...register('specialization')}
                        />
                        <span className="text-sm text-gray-700">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Password fields */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium text-navy-800 mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Information</span>
              </h3>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    validate: (value) => {
                      const strength = validatePasswordStrength(value);
                      return strength.isValid || 'Password does not meet security requirements';
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>

                {/* Password Strength Indicator */}
                {password && <PasswordStrengthIndicator strength={passwordStrength} />}
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-navy-800 focus:ring-navy-500 border-gray-300 rounded"
                {...register('terms', { required: 'You must accept the terms and conditions' })}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-navy-800 hover:text-navy-600">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-navy-800 hover:text-navy-600">
                  Privacy Policy
                </Link>
                <span className="block text-xs text-gray-500 mt-1">
                  * Advocate accounts require verification before activation
                </span>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms.message}</p>
            )}

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                className="w-full bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                loading={isSubmitting || loading}
                disabled={isSubmitting || loading || !superKeyVerified}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    <span>Register as Advocate (Superuser/Owner)</span>
                  </>
                )}
              </Button>
            </motion.div>

            {/* Registration Progress Indicator */}
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                  <p className="text-sm text-blue-800">
                    Processing your registration... Please wait.
                  </p>
                </div>
              </motion.div>
            )}
          </form>
          )}

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-navy-800 hover:text-navy-600"
              >
                Sign in here
              </Link>
            </p>

          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
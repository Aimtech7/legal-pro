// Secure Advocate Registration with Super Key for LegalPro v1.0.1
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Key, 
  Shield, 
  Eye, 
  EyeOff, 
  Award, 
  GraduationCap, 
  FileText,
  AlertCircle,
  Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

interface AdvocateRegisterFormData {
  superKey: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  licenseNumber: string;
  specialization: string;
  experience: number;
  education: string;
  barAdmission: string;
}

const AdvocateRegister: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuperKey, setShowSuperKey] = useState(false);
  const [superKeyVerified, setSuperKeyVerified] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AdvocateRegisterFormData>();

  const password = watch('password');

  // Super key verification (in production, this should be more secure)
  const SUPER_KEY = 'ADVOCATE_MASTER_2024_LEGALPRO'; // This should be environment variable

  const verifySuperKey = (key: string) => {
    if (key === SUPER_KEY) {
      setSuperKeyVerified(true);
      toast.success('Super key verified! You can now register as an advocate.');
    } else {
      toast.error('Invalid super key. Contact system administrator.');
    }
  };

  const onSubmit = async (data: AdvocateRegisterFormData) => {
    if (!superKeyVerified) {
      toast.error('Please verify the super key first');
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const registerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'advocate' as const,
        licenseNumber: data.licenseNumber,
        specialization: data.specialization.split(',').map(s => s.trim()),
        experience: data.experience,
        education: data.education,
        barAdmission: data.barAdmission
      };

      await registerUser(registerData);
      toast.success('Advocate account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gold-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Crown className="mx-auto h-16 w-16 text-gold-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-navy-800">
            Advocate Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure registration for legal professionals (superusers)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-8">
            {/* Super Key Verification */}
            {!superKeyVerified && (
              <div className="mb-8">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
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
                    label="Super Key"
                    type={showSuperKey ? 'text' : 'password'}
                    placeholder="Enter advocate super key"
                    icon={<Key className="w-5 h-5 text-gray-400" />}
                    onChange={(e) => {
                      if (e.target.value === SUPER_KEY) {
                        verifySuperKey(e.target.value);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowSuperKey(!showSuperKey)}
                  >
                    {showSuperKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Registration Form */}
            {superKeyVerified && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Super key verified! Complete your advocate registration below.
                    </p>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      error={errors.firstName?.message}
                      {...register('firstName', { required: 'First name is required' })}
                    />

                    <Input
                      label="Last Name"
                      error={errors.lastName?.message}
                      {...register('lastName', { required: 'Last name is required' })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                      label="Email Address"
                      type="email"
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
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        error={errors.password?.message}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          }
                        })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Credentials</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="License Number"
                      icon={<Award className="w-5 h-5 text-gray-400" />}
                      error={errors.licenseNumber?.message}
                      {...register('licenseNumber', { required: 'License number is required' })}
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
                    {...register('education', { required: 'Education background is required' })}
                  />

                  <Input
                    label="Bar Admission"
                    placeholder="e.g., Law Society of Kenya, 2015"
                    icon={<FileText className="w-5 h-5 text-gray-400" />}
                    error={errors.barAdmission?.message}
                    {...register('barAdmission', { required: 'Bar admission details are required' })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization Areas
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Criminal Law, Corporate Law, Family Law (comma-separated)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      {...register('specialization', { required: 'At least one specialization is required' })}
                    />
                    {errors.specialization && (
                      <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Register as Advocate (Superuser)
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-navy-600 hover:text-navy-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvocateRegister;

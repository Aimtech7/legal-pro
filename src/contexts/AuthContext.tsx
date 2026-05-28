// Enhanced Authentication context for LegalPro v1.0.1 - With Enhanced Toast Integration
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { authService } from '../services/authService';
import { showToast } from '../services/toastService';
import { RotateCcw, LogIn, UserPlus, LogOut } from 'lucide-react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);

      showToast.success('Welcome back! Login successful.', {
        title: 'Login Successful',
        actions: [
          {
            label: 'Go to Dashboard',
            action: () => window.location.href = '/dashboard',
            icon: LogIn
          }
        ]
      });
    } catch (error: any) {
      showToast.error(error.message || 'Login failed. Please check your credentials and try again.', {
        title: 'Login Failed',
        actions: [
          {
            label: 'Retry',
            action: () => login(email, password),
            icon: RotateCcw
          }
        ]
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);

      showToast.success('Account created successfully! Welcome to LegalPro.', {
        title: 'Registration Successful',
        actions: [
          {
            label: 'Complete Profile',
            action: () => window.location.href = '/profile',
            icon: UserPlus
          }
        ]
      });
    } catch (error: any) {
      showToast.error(error.message || 'Registration failed. Please check your information and try again.', {
        title: 'Registration Failed',
        actions: [
          {
            label: 'Retry',
            action: () => register(userData),
            icon: RotateCcw
          }
        ]
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);

    showToast.info('You have been logged out successfully. Thank you for using LegalPro.', {
      title: 'Logged Out',
      actions: [
        {
          label: 'Login Again',
          action: () => window.location.href = '/login',
          icon: LogIn
        }
      ]
    });
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
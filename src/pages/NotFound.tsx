// 404 Not Found page for LegalPro v1.0.1
import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  const popularPages = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: null },
    { name: 'Practice Areas', path: '/practice-areas', icon: null },
    { name: 'Contact', path: '/contact', icon: Phone },
    { name: 'Book Appointment', path: '/appointments', icon: null },
    { name: 'Resources', path: '/resources', icon: Search }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-9xl font-bold text-navy-200 mb-4"
            >
              404
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-24 h-1 bg-navy-600 mx-auto mb-8"
            />
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <p className="text-gray-500">
              The page may have been moved, deleted, or you may have entered an incorrect URL.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </motion.div>

          {/* Popular Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-xl font-semibold text-navy-800 mb-6">
              Popular Pages
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {popularPages.map((page, index) => (
                <motion.div
                  key={page.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  <Link
                    to={page.path}
                    className="block p-4 rounded-lg border border-gray-200 hover:border-navy-300 hover:bg-navy-50 transition-colors group"
                  >
                    <div className="flex flex-col items-center text-center">
                      {page.icon && (
                        <page.icon className="w-6 h-6 text-navy-600 mb-2 group-hover:text-navy-700" />
                      )}
                      <span className="text-sm font-medium text-gray-700 group-hover:text-navy-700">
                        {page.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <h3 className="text-lg font-semibold text-navy-800 mb-4">
              Still Need Help?
            </h3>
            <p className="text-gray-600 mb-6">
              If you believe this is an error or need assistance finding what you're looking for, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
              <a href="tel:+254700123456">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 text-sm text-gray-500"
          >
            <p>
              You can also try searching for what you need using our{' '}
              <Link to="/resources" className="text-navy-600 hover:underline">
                resources page
              </Link>{' '}
              or{' '}
              <Link to="/contact" className="text-navy-600 hover:underline">
                contact us directly
              </Link>.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;

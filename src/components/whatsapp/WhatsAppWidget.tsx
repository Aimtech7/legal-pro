// WhatsApp Chat Widget for LegalPro v1.0.1
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  showOnPages?: string[];
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = '254726745739', // Your WhatsApp number
  message = 'Hello! I need legal assistance.',
  position = 'bottom-right',
  showOnPages = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [customMessage, setCustomMessage] = useState(message);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Check if widget should be visible on current page
  useEffect(() => {
    if (showOnPages.length > 0) {
      const currentPath = window.location.pathname;
      setIsVisible(showOnPages.some(page => currentPath.includes(page)));
    }
  }, [showOnPages]);

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters and ensure it starts with country code
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    }
    if (!cleaned.startsWith('254')) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const openWhatsApp = () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const getBusinessHours = () => {
    const hour = currentTime.getHours();
    const day = currentTime.getDay();
    
    // Monday to Friday: 8 AM to 6 PM, Saturday: 9 AM to 2 PM
    if (day >= 1 && day <= 5) {
      return hour >= 8 && hour < 18 ? 'online' : 'offline';
    } else if (day === 6) {
      return hour >= 9 && hour < 14 ? 'online' : 'offline';
    }
    return 'offline'; // Sunday
  };

  const getStatusMessage = () => {
    const status = getBusinessHours();
    if (status === 'online') {
      return 'Typically replies within minutes';
    }
    return 'We\'ll reply when we\'re back online';
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 bg-white rounded-lg shadow-2xl border border-gray-200 w-80"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      getBusinessHours() === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">LegalPro Support</h3>
                    <p className="text-xs text-green-100">{getStatusMessage()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-green-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="mb-4">
                <div className="bg-gray-100 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">
                    👋 Hi there! How can we help you today?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />

                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>
                    {getBusinessHours() === 'online' 
                      ? 'We\'re online now!' 
                      : 'We\'ll respond during business hours'
                    }
                  </span>
                </div>

                <button
                  onClick={openWhatsApp}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

                <div className="text-center">
                  <a
                    href={`tel:+${formatPhoneNumber(phoneNumber)}`}
                    className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Or call us directly</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 rounded-b-lg">
              <p className="text-xs text-gray-500 text-center">
                Powered by WhatsApp • End-to-end encrypted
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            1
          </div>
        )}

        {/* Pulse Animation */}
        {!isOpen && (
          <div className="absolute inset-0 bg-green-600 rounded-full animate-ping opacity-20"></div>
        )}
      </motion.button>
    </div>
  );
};

export default WhatsAppWidget;

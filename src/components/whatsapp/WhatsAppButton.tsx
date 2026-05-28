// WhatsApp Button Component for LegalPro v1.0.1
import React from 'react';
import { MessageCircle, Phone, ExternalLink } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  openInNewTab?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '254726745739', // Your WhatsApp number
  message = 'Hello! I need legal assistance.',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  showIcon = true,
  openInNewTab = true
}) => {
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
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    if (openInNewTab) {
      window.open(whatsappUrl, '_blank');
    } else {
      window.location.href = whatsappUrl;
    }
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg',
    secondary: 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500',
    icon: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 rounded-full p-3 shadow-lg hover:shadow-xl'
  };

  const sizeClasses = {
    sm: variant === 'icon' ? 'w-10 h-10' : 'px-3 py-2 text-sm rounded-md',
    md: variant === 'icon' ? 'w-12 h-12' : 'px-4 py-2 text-base rounded-lg',
    lg: variant === 'icon' ? 'w-14 h-14' : 'px-6 py-3 text-lg rounded-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const defaultContent = variant === 'icon' ? null : (
    <>
      {showIcon && <MessageCircle className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />}
      {children || 'Chat on WhatsApp'}
    </>
  );

  const iconContent = variant === 'icon' && (
    <MessageCircle className={iconSizes[size]} />
  );

  return (
    <button
      onClick={openWhatsApp}
      className={buttonClasses}
      title={variant === 'icon' ? 'Chat on WhatsApp' : undefined}
    >
      {variant === 'icon' ? iconContent : defaultContent}
    </button>
  );
};

// Predefined WhatsApp button variants for common use cases
export const WhatsAppChatButton: React.FC<Omit<WhatsAppButtonProps, 'variant'>> = (props) => (
  <WhatsAppButton variant="primary" {...props}>
    Chat with Us
  </WhatsAppButton>
);

export const WhatsAppContactButton: React.FC<Omit<WhatsAppButtonProps, 'variant' | 'message'>> = (props) => (
  <WhatsAppButton 
    variant="outline" 
    message="Hi! I'd like to get in touch regarding legal services."
    {...props}
  >
    Contact via WhatsApp
  </WhatsAppButton>
);

export const WhatsAppSupportButton: React.FC<Omit<WhatsAppButtonProps, 'variant' | 'message'>> = (props) => (
  <WhatsAppButton 
    variant="secondary" 
    message="Hello! I need support with my case/appointment."
    {...props}
  >
    Get Support
  </WhatsAppButton>
);

export const WhatsAppFloatingButton: React.FC<Omit<WhatsAppButtonProps, 'variant'>> = (props) => (
  <WhatsAppButton variant="icon" size="lg" {...props} />
);

// Quick consultation button
export const WhatsAppConsultationButton: React.FC<Omit<WhatsAppButtonProps, 'variant' | 'message'>> = (props) => (
  <WhatsAppButton 
    variant="primary" 
    message="Hi! I'd like to schedule a consultation. Can you help me with the process?"
    {...props}
  >
    <Phone className="w-4 h-4 mr-2" />
    Quick Consultation
  </WhatsAppButton>
);

// Emergency contact button
export const WhatsAppEmergencyButton: React.FC<Omit<WhatsAppButtonProps, 'variant' | 'message'>> = (props) => (
  <WhatsAppButton 
    variant="primary" 
    message="URGENT: I need immediate legal assistance. Please respond as soon as possible."
    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
    {...props}
  >
    <ExternalLink className="w-4 h-4 mr-2" />
    Emergency Contact
  </WhatsAppButton>
);

export default WhatsAppButton;

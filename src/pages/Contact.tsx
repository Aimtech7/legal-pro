// Contact page for LegalPro v1.0.1
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import GoogleMapWrapper from '../components/maps/GoogleMapWrapper';
import { WhatsAppChatButton, WhatsAppContactButton, WhatsAppConsultationButton } from '../components/whatsapp/WhatsAppButton';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    urgency: 'normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      urgency: 'normal'
    });

    setIsSubmitting(false);
    alert('Thank you for your message! We will get back to you within 24 hours.');
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+254 726 745 739', '+254 700 123 457'],
      action: 'tel:+254726745739'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      details: ['+254 726 745 739', 'Chat with us instantly', 'Available 24/7'],
      action: 'whatsapp',
      isWhatsApp: true
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@legalpro.co.ke', 'support@legalpro.co.ke'],
      action: 'mailto:info@legalpro.co.ke'
    },
    {
      icon: MapPin,
      title: 'Main Office',
      details: ['LegalPro Chambers, 5th Floor', 'Utalii House, Uhuru Highway', 'Nairobi, Kenya'],
      action: '#'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 2:00 PM', 'Sunday: Closed'],
      action: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get in touch with our legal experts. We're here to help you with your legal needs
              and answer any questions you may have.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-navy-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-navy-800 mb-3">
                    {info.title}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    {info.details.map((detail, idx) => (
                      <p key={idx}>{detail}</p>
                    ))}
                  </div>
                  {info.action !== '#' && (
                    <div className="mt-4">
                      {info.isWhatsApp ? (
                        <WhatsAppChatButton
                          size="sm"
                          message="Hi! I found your contact information and would like to chat about legal services."
                        >
                          Chat Now
                        </WhatsAppChatButton>
                      ) : (
                        <a
                          href={info.action}
                          className="text-navy-600 hover:text-navy-800 text-sm font-medium"
                        >
                          {info.title === 'Phone' ? 'Call Now' : 'Send Email'}
                        </a>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-navy-600" />
                  <h2 className="text-2xl font-bold text-navy-800">
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level
                      </label>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-500"
                      placeholder="Please describe your legal matter or question..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="p-8 h-full">
                <h2 className="text-2xl font-bold text-navy-800 mb-6">
                  Find Our Office
                </h2>

                {/* Interactive Google Map */}
                <div className="mb-6">
                  <GoogleMapWrapper
                    center={{ lat: -1.2921, lng: 36.8219 }}
                    zoom={15}
                    markers={[
                      {
                        id: 'main-office',
                        position: { lat: -1.2921, lng: 36.8219 },
                        title: 'LegalPro Main Office',
                        address: 'LegalPro Chambers, 5th Floor, Utalii House, Uhuru Highway, Nairobi, Kenya',
                        phone: '+254 700 123 456',
                        hours: 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Closed',
                        services: ['General Legal Consultation', 'Corporate Law', 'Family Law', 'Property Law']
                      }
                    ]}
                    height="300px"
                    className="rounded-lg overflow-hidden"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Main Office Address</h3>
                    <p className="text-gray-600">
                      LegalPro Chambers, 5th Floor<br />
                      Utalii House, Uhuru Highway<br />
                      Nairobi, Kenya
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://maps.google.com', '_blank')}
                    >
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('tel:+254726745739')}
                    >
                      Call Office
                    </Button>
                    <div className="sm:col-span-2">
                      <WhatsAppContactButton
                        size="sm"
                        className="w-full"
                        message="Hi! I found your contact information and would like to get in touch regarding legal services."
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-red-800 mb-4">
              Emergency Legal Assistance
            </h2>
            <p className="text-lg text-red-700 mb-8">
              If you have an urgent legal matter that requires immediate attention,
              please call our emergency hotline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => window.open('tel:+254700123456')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency Hotline: +254 700 123 456
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={() => window.location.href = '/appointments'}
              >
                Book Urgent Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
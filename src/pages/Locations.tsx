// Locations page for LegalPro v1.0.1 - Enhanced with Google Maps Integration
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation, Car, Bus, Map } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import OfficeLocationsMap, { Office } from '../components/maps/OfficeLocationsMap';

const Locations: React.FC = () => {
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const offices: Office[] = [
    {
      id: 1,
      name: 'Main Office - Nairobi CBD',
      address: 'LegalPro Chambers, 5th Floor, Utalii House',
      street: 'Uhuru Highway, Nairobi CBD',
      city: 'Nairobi',
      postalCode: 'P.O. Box 12345-00100',
      phone: '+254 700 123 456',
      email: 'info@legalpro.co.ke',
      hours: {
        weekdays: 'Monday - Friday: 8:00 AM - 6:00 PM',
        saturday: 'Saturday: 9:00 AM - 2:00 PM',
        sunday: 'Sunday: Closed'
      },
      coordinates: { lat: -1.2921, lng: 36.8219 },
      parking: 'Available on-site and nearby parking buildings',
      publicTransport: 'Accessible via matatu routes 46, 100, 111, and city shuttle',
      landmarks: 'Near Kenyatta International Conference Centre and University of Nairobi',
      services: ['General Legal Consultation', 'Corporate Law', 'Family Law', 'Property Law']
    },
    {
      id: 2,
      name: 'Thika Branch Office',
      address: 'Thika Business Centre, 2nd Floor',
      street: 'Commercial Street, Thika Town',
      city: 'Thika',
      postalCode: 'P.O. Box 567-01000',
      phone: '+254 700 123 457',
      email: 'thika@legalpro.co.ke',
      hours: {
        weekdays: 'Monday - Friday: 8:30 AM - 5:30 PM',
        saturday: 'Saturday: 9:00 AM - 1:00 PM',
        sunday: 'Sunday: Closed'
      },
      coordinates: { lat: -1.0332, lng: 37.0692 },
      parking: 'Free parking available',
      publicTransport: 'Thika Road matatus and buses',
      landmarks: 'Near Thika Law Courts and Thika Municipal Market',
      services: ['Family Law', 'Employment Law', 'Criminal Defense', 'Property Disputes']
    },
    {
      id: 3,
      name: 'Machakos Branch Office',
      address: 'Machakos Law Courts Complex',
      street: 'Ground Floor, Court Road',
      city: 'Machakos',
      postalCode: 'P.O. Box 890-90100',
      phone: '+254 700 123 458',
      email: 'machakos@legalpro.co.ke',
      hours: {
        weekdays: 'Monday - Friday: 8:30 AM - 5:30 PM',
        saturday: 'Saturday: By appointment only',
        sunday: 'Sunday: Closed'
      },
      coordinates: { lat: -1.5177, lng: 37.2634 },
      parking: 'Limited parking, street parking available',
      publicTransport: 'Machakos matatus from Nairobi and surrounding areas',
      landmarks: 'Inside Machakos Law Courts Complex',
      services: ['Criminal Defense', 'Civil Litigation', 'Land Law', 'Succession']
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
              Our Office Locations
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Visit us at any of our conveniently located offices across Kenya. 
              We're here to provide you with accessible legal services wherever you are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* View Mode Toggle */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-navy-800 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Map className="w-4 h-4 inline-block mr-2" />
                Map View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-navy-800 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <MapPin className="w-4 h-4 inline-block mr-2" />
                List View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      {viewMode === 'map' && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-navy-800 mb-4">
                  Find Our Offices
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Click on any office marker to view details, get directions, or contact the office directly.
                </p>
              </div>

              <OfficeLocationsMap
                offices={offices}
                selectedOfficeId={selectedOffice?.id}
                onOfficeSelect={setSelectedOffice}
                height="600px"
                showOfficeList={true}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Traditional List View */}
      {viewMode === 'list' && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {offices.map((office, index) => (
              <motion.div
                key={office.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Office Information */}
                    <div className="p-8">
                      <div className="flex items-start space-x-3 mb-6">
                        <MapPin className="w-8 h-8 text-navy-600 mt-1 flex-shrink-0" />
                        <div>
                          <h2 className="text-2xl font-bold text-navy-800 mb-2">
                            {office.name}
                          </h2>
                          <div className="text-gray-600 space-y-1">
                            <p>{office.address}</p>
                            <p>{office.street}</p>
                            <p>{office.city}</p>
                            <p className="text-sm">{office.postalCode}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-navy-600" />
                          <a href={`tel:${office.phone}`} className="text-navy-600 hover:underline">
                            {office.phone}
                          </a>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-navy-600" />
                          <a href={`mailto:${office.email}`} className="text-navy-600 hover:underline">
                            {office.email}
                          </a>
                        </div>
                      </div>

                      {/* Office Hours */}
                      <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <Clock className="w-5 h-5 text-navy-600" />
                          <h3 className="font-semibold text-gray-800">Office Hours</h3>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 ml-7">
                          <p>{office.hours.weekdays}</p>
                          <p>{office.hours.saturday}</p>
                          <p>{office.hours.sunday}</p>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Services Available</h3>
                        <div className="flex flex-wrap gap-2">
                          {office.services.map((service, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-navy-100 text-navy-700 rounded-full text-sm"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          className="flex-1"
                          onClick={() => window.location.href = '/appointments'}
                        >
                          Book Appointment
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(`tel:${office.phone}`)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    </div>

                    {/* Map and Directions */}
                    <div className="bg-gray-100 p-8">
                      {/* Map Placeholder */}
                      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
                        <MapPin className="w-12 h-12 text-navy-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-navy-800 mb-2">
                          Interactive Map
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Google Maps integration coming soon
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(
                            `https://www.google.com/maps/search/?api=1&query=${office.coordinates.lat},${office.coordinates.lng}`,
                            '_blank'
                          )}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </div>

                      {/* Transportation Info */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Car className="w-5 h-5 text-gray-600" />
                            <h4 className="font-medium text-gray-800">Parking</h4>
                          </div>
                          <p className="text-sm text-gray-600 ml-7">{office.parking}</p>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Bus className="w-5 h-5 text-gray-600" />
                            <h4 className="font-medium text-gray-800">Public Transport</h4>
                          </div>
                          <p className="text-sm text-gray-600 ml-7">{office.publicTransport}</p>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <h4 className="font-medium text-gray-800">Landmarks</h4>
                          </div>
                          <p className="text-sm text-gray-600 ml-7">{office.landmarks}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 bg-navy-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Can't Visit Our Offices?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              We also offer virtual consultations and can arrange home visits for 
              clients who cannot travel to our offices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-navy-800 hover:bg-gray-100"
                onClick={() => window.location.href = '/contact'}
              >
                Schedule Virtual Meeting
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-navy-800"
                onClick={() => window.open('tel:+254700123456')}
              >
                Call Main Office
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Locations;

// Areas We Serve page for LegalPro v1.0.1
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import GoogleMapWrapper from '../components/maps/GoogleMapWrapper';

const AreasWeServe: React.FC = () => {
  const counties = [
    {
      name: 'Nairobi County',
      areas: ['CBD', 'Westlands', 'Karen', 'Kilimani', 'Lavington', 'Parklands'],
      office: 'Main Office',
      phone: '+254 700 123 456',
      email: 'nairobi@legalpro.co.ke'
    },
    {
      name: 'Kiambu County',
      areas: ['Thika', 'Ruiru', 'Kikuyu', 'Limuru', 'Gatundu', 'Juja'],
      office: 'Thika Branch',
      phone: '+254 700 123 457',
      email: 'kiambu@legalpro.co.ke'
    },
    {
      name: 'Machakos County',
      areas: ['Machakos Town', 'Athi River', 'Mavoko', 'Kangundo', 'Matungulu'],
      office: 'Machakos Branch',
      phone: '+254 700 123 458',
      email: 'machakos@legalpro.co.ke'
    },
    {
      name: 'Kajiado County',
      areas: ['Kajiado Town', 'Ngong', 'Kitengela', 'Namanga', 'Loitokitok'],
      office: 'Kajiado Office',
      phone: '+254 700 123 459',
      email: 'kajiado@legalpro.co.ke'
    }
  ];

  const offices = [
    {
      name: 'Main Office - Nairobi CBD',
      address: 'LegalPro Chambers, 5th Floor, Utalii House, Uhuru Highway',
      city: 'Nairobi',
      phone: '+254 700 123 456',
      email: 'info@legalpro.co.ke',
      hours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM'
    },
    {
      name: 'Thika Branch',
      address: 'Thika Business Centre, 2nd Floor, Commercial Street',
      city: 'Thika',
      phone: '+254 700 123 457',
      email: 'thika@legalpro.co.ke',
      hours: 'Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 1:00 PM'
    },
    {
      name: 'Machakos Branch',
      address: 'Machakos Law Courts Complex, Ground Floor',
      city: 'Machakos',
      phone: '+254 700 123 458',
      email: 'machakos@legalpro.co.ke',
      hours: 'Mon-Fri: 8:30 AM - 5:30 PM'
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
              Areas We Serve
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Providing comprehensive legal services across Kenya's major counties and regions. 
              Our experienced team is ready to assist you wherever you are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Counties Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-navy-800 mb-4">
              Counties & Regions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide legal services across multiple counties in Kenya, ensuring 
              accessible legal representation for all our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {counties.map((county, index) => (
              <motion.div
                key={county.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-8 h-8 text-navy-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-navy-800 mb-3">
                        {county.name}
                      </h3>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Areas Covered:</h4>
                        <div className="flex flex-wrap gap-2">
                          {county.areas.map((area) => (
                            <span
                              key={area}
                              className="px-3 py-1 bg-navy-100 text-navy-700 rounded-full text-sm"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{county.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{county.email}</span>
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

      {/* Office Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-navy-800 mb-4">
              Our Office Locations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit us at any of our conveniently located offices for in-person consultations 
              and legal assistance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={office.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <h3 className="text-lg font-semibold text-navy-800 mb-4">
                    {office.name}
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <div>
                        <p>{office.address}</p>
                        <p>{office.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{office.email}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{office.hours}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-navy-800 mb-4">
              Find Us on the Map
            </h2>
            <p className="text-gray-600">
              Interactive map integration coming soon. Contact us for directions to any of our offices.
            </p>
          </motion.div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <GoogleMapWrapper
              center={{ lat: -1.2921, lng: 36.8219 }}
              zoom={8}
              markers={[
                {
                  id: 'nairobi-office',
                  position: { lat: -1.2921, lng: 36.8219 },
                  title: 'LegalPro Main Office - Nairobi CBD',
                  address: 'LegalPro Chambers, 5th Floor, Utalii House, Uhuru Highway, Nairobi CBD',
                  phone: '+254 700 123 456',
                  services: ['General Legal Consultation', 'Corporate Law', 'Family Law', 'Property Law']
                },
                {
                  id: 'thika-office',
                  position: { lat: -1.0332, lng: 37.0692 },
                  title: 'LegalPro Thika Branch Office',
                  address: 'Thika Business Centre, 2nd Floor, Commercial Street, Thika Town',
                  phone: '+254 700 123 457',
                  services: ['Family Law', 'Employment Law', 'Criminal Defense', 'Property Disputes']
                },
                {
                  id: 'machakos-office',
                  position: { lat: -1.5177, lng: 37.2634 },
                  title: 'LegalPro Machakos Branch Office',
                  address: 'Machakos Law Courts Complex, Ground Floor, Court Road, Machakos',
                  phone: '+254 700 123 458',
                  services: ['Criminal Defense', 'Civil Litigation', 'Land Law', 'Succession']
                }
              ]}
              height="400px"
            />

            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-navy-800 mb-2">
                Interactive Office Locations
              </h3>
              <p className="text-gray-600 mb-4">
                Click on any marker to view office details and get directions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/locations"
                  className="bg-navy-800 text-white px-6 py-3 rounded-lg hover:bg-navy-700 transition-colors"
                >
                  View All Locations
                </a>
                <a
                  href="/contact"
                  className="border border-navy-800 text-navy-800 px-6 py-3 rounded-lg hover:bg-navy-50 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AreasWeServe;

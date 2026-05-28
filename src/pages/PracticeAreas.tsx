// Practice Areas page for LegalPro v1.0.1
import React from 'react';
import { motion } from 'framer-motion';
import {
  Scale,
  Building,
  Users,
  Heart,
  Shield,
  Briefcase,
  Home,
  Car,
  FileText,
  Gavel,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PracticeAreas: React.FC = () => {
  const practiceAreas = [
    {
      icon: Scale,
      title: 'Criminal Law',
      description: 'Expert defense for criminal charges, from minor offenses to serious felonies.',
      services: ['Criminal Defense', 'DUI/DWI Cases', 'Drug Offenses', 'White Collar Crimes'],
      color: 'bg-red-500'
    },
    {
      icon: Building,
      title: 'Corporate Law',
      description: 'Comprehensive legal services for businesses of all sizes.',
      services: ['Business Formation', 'Contract Drafting', 'Mergers & Acquisitions', 'Compliance'],
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Family Law',
      description: 'Compassionate representation for family-related legal matters.',
      services: ['Divorce Proceedings', 'Child Custody', 'Adoption', 'Domestic Relations'],
      color: 'bg-pink-500'
    },
    {
      icon: Heart,
      title: 'Personal Injury',
      description: 'Fighting for fair compensation for accident and injury victims.',
      services: ['Car Accidents', 'Medical Malpractice', 'Workplace Injuries', 'Product Liability'],
      color: 'bg-green-500'
    },
    {
      icon: Shield,
      title: 'Immigration Law',
      description: 'Helping individuals and families navigate immigration processes.',
      services: ['Visa Applications', 'Citizenship', 'Deportation Defense', 'Family Reunification'],
      color: 'bg-purple-500'
    },
    {
      icon: Briefcase,
      title: 'Employment Law',
      description: 'Protecting workers\' rights and resolving workplace disputes.',
      services: ['Wrongful Termination', 'Discrimination', 'Wage Disputes', 'Employment Contracts'],
      color: 'bg-orange-500'
    },
    {
      icon: Home,
      title: 'Real Estate Law',
      description: 'Legal guidance for property transactions and real estate matters.',
      services: ['Property Transactions', 'Landlord-Tenant', 'Zoning Issues', 'Property Disputes'],
      color: 'bg-teal-500'
    },
    {
      icon: Car,
      title: 'Traffic Law',
      description: 'Representation for traffic violations and driving-related offenses.',
      services: ['Traffic Tickets', 'License Suspension', 'DUI Defense', 'Accident Claims'],
      color: 'bg-yellow-500'
    },
    {
      icon: FileText,
      title: 'Contract Law',
      description: 'Expert contract drafting, review, and dispute resolution.',
      services: ['Contract Drafting', 'Contract Review', 'Breach of Contract', 'Negotiations'],
      color: 'bg-indigo-500'
    }
  ];

  const whyChooseUs = [
    {
      icon: CheckCircle,
      title: 'Experienced Attorneys',
      description: 'Our team has decades of combined experience across all practice areas.'
    },
    {
      icon: CheckCircle,
      title: 'Proven Track Record',
      description: 'Successful outcomes in thousands of cases with satisfied clients.'
    },
    {
      icon: CheckCircle,
      title: 'Personalized Service',
      description: 'Every case receives individual attention and customized legal strategies.'
    },
    {
      icon: CheckCircle,
      title: 'Transparent Pricing',
      description: 'Clear, upfront pricing with no hidden fees or surprise charges.'
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
              Our Practice Areas
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive legal services across multiple practice areas.
              Our experienced attorneys are ready to handle your legal needs with expertise and dedication.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Practice Areas Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${area.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <area.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-800">
                      {area.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {area.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-navy-700 text-sm">Key Services:</h4>
                    <ul className="space-y-1">
                      {area.services.map((service, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-navy-400 rounded-full mr-2" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-navy-600 group-hover:text-white transition-colors"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Get Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">
              Why Choose LegalPro?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine legal expertise with personalized service to deliver the best outcomes for our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-navy-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-navy-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Legal Assistance?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Don't wait. Get the legal help you need today. Our experienced attorneys are ready to fight for your rights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-navy-800 hover:bg-gray-100"
                onClick={() => window.location.href = '/contact'}
              >
                <Gavel className="w-5 h-5 mr-2" />
                Get Free Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-navy-800"
                onClick={() => window.location.href = '/appointments'}
              >
                Schedule Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>Legal Disclaimer:</strong> The information provided on this website is for general informational purposes only
              and does not constitute legal advice.
            </p>
            <p>
              Every case is unique, and you should consult with a qualified attorney to discuss your specific legal situation.
              Past results do not guarantee future outcomes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PracticeAreas;
// About page component for LegalPro v1.0.1
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Award, 
  Users, 
  Heart, 
  Shield, 
  Target,
  CheckCircle,
  Star
} from 'lucide-react';
import Card from '../components/ui/Card';

const About: React.FC = () => {
  const values = [
    {
      icon: Scale,
      title: 'Integrity',
      description: 'We uphold the highest ethical standards in all our legal practices and client relationships.'
    },
    {
      icon: Shield,
      title: 'Excellence',
      description: 'We strive for excellence in every case, providing thorough and competent legal representation.'
    },
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We understand that legal issues can be stressful and approach each case with empathy and care.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work closely with our clients, keeping them informed and involved throughout the legal process.'
    }
  ];

  const achievements = [
    'Certified by the Law Society of Kenya',
    'Member of the International Bar Association',
    'Recognized as Top Legal Firm 2023',
    'Pro Bono Service Award Winner',
    '15+ Years of Combined Experience',
    'Successfully handled 500+ cases'
  ];

  const team = [
    {
      name: 'John Kamau',
      role: 'Senior Partner',
      specialization: 'Corporate & Commercial Law',
      experience: '15 years',
      education: 'LLB (University of Nairobi), LLM (Harvard)',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Sarah Wanjiku',
      role: 'Partner',
      specialization: 'Family & Civil Law',
      experience: '12 years',
      education: 'LLB (University of Nairobi), LLM (Oxford)',
      image: 'https://images.pexels.com/photos/3760854/pexels-photo-3760854.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Michael Otieno',
      role: 'Associate',
      specialization: 'Criminal Defense & Litigation',
      experience: '8 years',
      education: 'LLB (Kenyatta University), Diploma in Advocacy',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gold-400">LegalPro</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We are a full-service law firm committed to providing exceptional legal services 
              with integrity, professionalism, and dedication to our clients' success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8 h-full">
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 text-gold-500 mr-3" />
                  <h2 className="text-2xl font-bold text-navy-800">Our Mission</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To provide accessible, high-quality legal services that protect our clients' rights 
                  and interests while maintaining the highest standards of professional ethics and integrity. 
                  We are committed to being trusted advisors who guide our clients through complex legal 
                  challenges with expertise and compassion.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 h-full">
                <div className="flex items-center mb-6">
                  <Star className="w-8 h-8 text-gold-500 mr-3" />
                  <h2 className="text-2xl font-bold text-navy-800">Our Vision</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading law firm in Kenya, recognized for our excellence in legal practice, 
                  innovation in service delivery, and commitment to justice. We envision a future where 
                  legal services are accessible to all, and where we continue to set the standard for 
                  professional legal representation.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide everything we do and shape how we serve our clients and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-navy-800" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced legal professionals are dedicated to providing exceptional service and achieving the best outcomes for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-navy-800 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gold-600 font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      {member.specialization}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        <span>{member.experience} experience</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" />
                        <span>{member.education}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Recognition of our commitment to excellence and professional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="w-6 h-6 text-gold-400 flex-shrink-0" />
                <span className="text-gray-300">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let us put our experience and dedication to work for you. Contact us today to discuss your legal needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-navy-800 text-white px-8 py-3 rounded-md font-medium hover:bg-navy-700 transition-colors"
              >
                Contact Us Today
              </motion.a>
              <motion.a
                href="/appointments"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-navy-800 text-navy-800 px-8 py-3 rounded-md font-medium hover:bg-navy-800 hover:text-white transition-colors"
              >
                Schedule Consultation
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
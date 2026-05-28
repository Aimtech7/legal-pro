// Footer component for LegalPro v1.0.1
import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, MapPin, Phone, Mail, Facebook, Twitter, Linkedin as LinkedIn, Instagram, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-gold-400" />
              <span className="text-xl font-bold">LegalPro</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Providing exceptional legal services with integrity, professionalism, 
              and dedication to our clients' success.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                <LinkedIn className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-gold-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/practice-areas" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Practice Areas
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Practice Areas</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/practice-areas/family-law" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Family Law
                </Link>
              </li>
              <li>
                <Link to="/practice-areas/corporate-law" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Corporate Law
                </Link>
              </li>
              <li>
                <Link to="/practice-areas/criminal-defense" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Criminal Defense
                </Link>
              </li>
              <li>
                <Link to="/practice-areas/property-law" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Property Law
                </Link>
              </li>
              <li>
                <Link to="/practice-areas/employment-law" className="text-gray-300 hover:text-gold-400 transition-colors">
                  Employment Law
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold-400 mt-0.5" />
                <div>
                  <p className="text-gray-300 text-sm">
                    123 Legal Street, Suite 100<br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold-400" />
                <p className="text-gray-300 text-sm">+254 700 123 456</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold-400" />
                <p className="text-gray-300 text-sm">info@legalpro.co.ke</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gold-400 mt-0.5" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Mon - Fri: 8:00 AM - 6:00 PM<br />
                    Sat: 9:00 AM - 2:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} LegalPro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
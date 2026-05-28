// Resources page for LegalPro v1.0.1
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, FileText, HelpCircle, Search, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'articles', name: 'Legal Articles' },
    { id: 'guides', name: 'How-to Guides' },
    { id: 'forms', name: 'Legal Forms' },
    { id: 'faqs', name: 'FAQs' }
  ];

  const resources = [
    {
      id: 1,
      title: 'Understanding Your Rights in Employment Law',
      category: 'articles',
      type: 'Article',
      description: 'A comprehensive guide to employee rights and protections under Kenyan law.',
      readTime: '8 min read',
      downloadUrl: '#',
      isDownloadable: false
    },
    {
      id: 2,
      title: 'How to Prepare for Your First Legal Consultation',
      category: 'guides',
      type: 'Guide',
      description: 'Essential steps and documents to prepare before meeting with your lawyer.',
      readTime: '5 min read',
      downloadUrl: '#',
      isDownloadable: false
    },
    {
      id: 3,
      title: 'Property Purchase Agreement Template',
      category: 'forms',
      type: 'Form',
      description: 'Standard template for property purchase agreements in Kenya.',
      readTime: 'Download',
      downloadUrl: '/forms/property-purchase-agreement.pdf',
      isDownloadable: true
    },
    {
      id: 4,
      title: 'Family Law: Divorce Proceedings in Kenya',
      category: 'articles',
      type: 'Article',
      description: 'Complete overview of divorce procedures, requirements, and timelines.',
      readTime: '12 min read',
      downloadUrl: '#',
      isDownloadable: false
    },
    {
      id: 5,
      title: 'Business Registration Checklist',
      category: 'guides',
      type: 'Guide',
      description: 'Step-by-step guide to registering your business in Kenya.',
      readTime: '6 min read',
      downloadUrl: '#',
      isDownloadable: false
    },
    {
      id: 6,
      title: 'Power of Attorney Form',
      category: 'forms',
      type: 'Form',
      description: 'Legal form for granting power of attorney to another person.',
      readTime: 'Download',
      downloadUrl: '/forms/power-of-attorney.pdf',
      isDownloadable: true
    }
  ];

  const faqs = [
    {
      question: 'How much do legal consultations cost?',
      answer: 'Initial consultations are typically charged at KES 5,000 for 30 minutes. However, we offer free 15-minute preliminary consultations to assess your case.'
    },
    {
      question: 'How long does a typical case take?',
      answer: 'Case duration varies significantly depending on complexity. Simple matters may take 2-4 weeks, while complex litigation can take 6 months to 2 years.'
    },
    {
      question: 'Do you offer payment plans?',
      answer: 'Yes, we offer flexible payment arrangements for qualifying cases. We also accept M-Pesa payments for your convenience.'
    },
    {
      question: 'Can I get legal advice over the phone?',
      answer: 'We offer phone consultations for existing clients. New clients are encouraged to schedule an in-person or video consultation for comprehensive advice.'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              Legal Resources
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access our comprehensive library of legal articles, guides, forms, and FAQs 
              to better understand your legal rights and options.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5 text-gray-400" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {resource.type === 'Article' && <BookOpen className="w-5 h-5 text-navy-600" />}
                      {resource.type === 'Guide' && <FileText className="w-5 h-5 text-green-600" />}
                      {resource.type === 'Form' && <Download className="w-5 h-5 text-blue-600" />}
                      <span className="text-sm font-medium text-gray-600">{resource.type}</span>
                    </div>
                    <span className="text-xs text-gray-500">{resource.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-navy-800 mb-3">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 flex-1">
                    {resource.description}
                  </p>
                  
                  <div className="mt-auto">
                    {resource.isDownloadable ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(resource.downloadUrl, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {/* Navigate to full article */}}
                      >
                        Read More
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-navy-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions about our legal services.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <HelpCircle className="w-6 h-6 text-navy-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-navy-800 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Need Personalized Legal Advice?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              While our resources provide general information, every legal situation is unique. 
              Schedule a consultation for advice tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-navy-800 hover:bg-gray-100"
                onClick={() => window.location.href = '/appointments'}
              >
                Book Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-navy-800"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Resources;

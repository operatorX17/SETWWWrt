import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We\'ll get back to you soon!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-6xl lg:text-8xl font-bold uppercase tracking-wider mb-8">Contact</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Have questions about our products, need sizing advice, or want to collaborate? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 px-4 py-3 focus:outline-none focus:border-white transition-colors"
                >
                  <option value="">Select a topic</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="sizing-help">Sizing Help</option>
                  <option value="order-support">Order Support</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="press">Press Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 px-4 py-3 focus:outline-none focus:border-white transition-colors resize-vertical"
                  placeholder="Tell us how we can help..."
                />
              </div>
              
              <button
                type="submit"
                className="bg-white text-black px-8 py-4 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <Send size={20} />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Get in touch</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Mail size={24} className="mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-gray-300">hello@axm.com</p>
                    <p className="text-gray-400 text-sm">We typically respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone size={24} className="mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                    <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MapPin size={24} className="mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Studio</h3>
                    <div className="text-gray-300 space-y-1">
                      <p>123 Design District</p>
                      <p>New York, NY 10013</p>
                      <p>United States</p>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">By appointment only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Frequently Asked</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">What's your return policy?</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We offer free returns within 30 days of purchase. Items must be unworn with tags attached.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">How do I find my size?</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Check our detailed size guide on each product page. If you're between sizes, we recommend sizing up.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Do you ship internationally?</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Yes, we ship worldwide. International shipping rates and delivery times vary by location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
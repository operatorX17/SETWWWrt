import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingNavigation from '../components/FloatingNavigation';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <FloatingNavigation />
      
      {/* FIXED: Proper top padding to prevent header overlap */}
      <div className="pt-32 max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
            CONTACT US
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-red-400">Get in Touch</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none resize-none"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-red-400">Store Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-red-400" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-400">support@ogstore.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="text-red-400" size={20} />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-400">+91 99999 99999</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="text-red-400" size={20} />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-400">Hyderabad, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-900/20 to-black p-6 rounded-lg border border-red-500/20">
                <h3 className="text-xl font-bold mb-3">Customer Support</h3>
                <p className="text-gray-300 mb-4">
                  Our team is here to help with any questions about orders, 
                  products, or general inquiries.
                </p>
                <p className="text-sm text-gray-400">
                  Response time: 24-48 hours
                </p>
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
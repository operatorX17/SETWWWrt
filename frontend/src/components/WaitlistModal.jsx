import React, { useState } from 'react';
import { X } from 'lucide-react';

const WaitlistModal = ({ isOpen, onClose, productName = '' }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now, we'll just simulate API call
      // In production, you'd POST to /api/waitlist or Google Form
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      
      // Track waitlist signup
      if (window.gtag) {
        window.gtag('event', 'waitlist_signup', {
          event_category: 'engagement',
          event_label: productName
        });
      }
      
      // Reset form after 3 seconds and close
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ email: '', phone: '', name: '' });
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Waitlist signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-2 border-[var(--color-red)] max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black uppercase tracking-wider mb-2">
                Join Waitlist
              </h2>
              {productName && (
                <p className="text-[var(--color-gold)] font-medium">
                  Get notified when "{productName}" is back
                </p>
              )}
              <p className="text-gray-400 text-sm mt-2">
                We'll ping you before vault. No spam, just drops.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-red)] focus:shadow-[0_0_10px_rgba(193,18,31,0.3)] transition-all"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-red)] focus:shadow-[0_0_10px_rgba(193,18,31,0.3)] transition-all"
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-red)] focus:shadow-[0_0_10px_rgba(193,18,31,0.3)] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--color-red)] text-white py-3 font-black uppercase tracking-wider hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding to Waitlist...' : 'Join the Arsenal'}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              By joining, you agree to receive updates about OG drops
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Added to Arsenal!</h3>
            <p className="text-gray-400">
              We'll notify you before vault. Keep your weapons ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
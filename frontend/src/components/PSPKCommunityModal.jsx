import React, { useState } from 'react';
import { X, Star, Users, Zap, Crown, Heart } from 'lucide-react';

const PSPKCommunityModal = ({ isOpen, onClose, onConsent }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fanLevel: 'casual',
    interests: [],
    consent: false
  });

  const fanLevels = [
    { id: 'casual', label: 'Casual Fan', icon: Heart, description: 'I enjoy PSPK movies' },
    { id: 'dedicated', label: 'Dedicated Fan', icon: Star, description: 'I follow every release' },
    { id: 'superfan', label: 'Super Fan', icon: Crown, description: 'PSPK is my inspiration' },
    { id: 'tribal', label: 'Tribal Member', icon: Zap, description: 'PSPK is life, PSPK is everything' }
  ];

  const interests = [
    'Early access to drops',
    'Behind-the-scenes content',
    'Exclusive meetups & events',
    'Limited edition collectibles',
    'PSPK birthday specials',
    'Fan community discussions',
    'First-day-first-show perks',
    'Birthday & anniversary surprises'
  ];

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.consent) {
      // Track community signup
      if (window.gtag) {
        window.gtag('event', 'pspk_community_join', {
          event_category: 'community',
          fan_level: formData.fanLevel,
          interests_count: formData.interests.length
        });
      }
      
      onConsent(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[var(--color-red)] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-2 h-2 bg-[var(--color-gold)] rounded-full"></div>
            <h2 className="text-3xl font-black uppercase tracking-wider text-[var(--color-red)]">
              JOIN PSPK TRIBE
            </h2>
            <div className="w-2 h-2 bg-[var(--color-gold)] rounded-full"></div>
          </div>
          <p className="text-gray-300 mb-2">
            Become part of the exclusive PSPK fan community
          </p>
          <p className="text-[var(--color-gold)] text-sm font-medium">
            Unlock special access, early drops, and community features
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-red)] transition-all"
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-red)] transition-all"
            />
          </div>

          <input
            type="tel"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[var(--color-red)] transition-all"
          />

          {/* Fan Level */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[var(--color-gold)]">
              What's your PSPK fan level?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fanLevels.map((level) => {
                const IconComponent = level.icon;
                return (
                  <label
                    key={level.id}
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                      formData.fanLevel === level.id
                        ? 'border-[var(--color-red)] bg-[var(--color-red)]/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="fanLevel"
                      value={level.id}
                      checked={formData.fanLevel === level.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, fanLevel: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <IconComponent 
                        size={20} 
                        className={formData.fanLevel === level.id ? 'text-[var(--color-red)]' : 'text-gray-400'} 
                      />
                      <div>
                        <div className="font-bold text-white">{level.label}</div>
                        <div className="text-sm text-gray-400">{level.description}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[var(--color-gold)]">
              What interests you most? (Select all that apply)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {interests.map((interest) => (
                <label
                  key={interest}
                  className="cursor-pointer flex items-center gap-3 p-3 border border-gray-700 rounded hover:border-gray-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="w-4 h-4 text-[var(--color-red)] bg-transparent border-gray-600 rounded focus:ring-[var(--color-red)] focus:ring-2"
                  />
                  <span className="text-sm text-white">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Consent */}
          <div className="border-2 border-[var(--color-gold)] p-4 rounded">
            <label className="cursor-pointer flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                className="w-5 h-5 text-[var(--color-red)] bg-transparent border-gray-600 rounded focus:ring-[var(--color-red)] focus:ring-2 mt-1"
              />
              <div className="text-sm">
                <p className="text-white font-medium mb-2">
                  Yes, I want to join the PSPK community and receive:
                </p>
                <ul className="text-gray-300 space-y-1 text-xs">
                  <li>• Exclusive early access to limited drops</li>
                  <li>• Personalized recommendations based on my fan level</li>
                  <li>• Special birthday and anniversary surprises</li>
                  <li>• Community updates and behind-the-scenes content</li>
                  <li>• First-day-first-show perks and meetup invites</li>
                </ul>
                <p className="text-[var(--color-gold)] text-xs mt-3">
                  You can unsubscribe anytime. We respect your privacy and will never spam.
                </p>
              </div>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!formData.consent}
            className="w-full bg-gradient-to-r from-[var(--color-red)] to-red-700 text-white py-4 font-black text-lg uppercase tracking-wider hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Users size={20} />
            JOIN THE TRIBE
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          By joining, you become part of an exclusive community of PSPK fans worldwide.
        </p>
      </div>
    </div>
  );
};

export default PSPKCommunityModal;
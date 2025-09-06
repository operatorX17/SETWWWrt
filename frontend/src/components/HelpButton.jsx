import React, { useState } from 'react';
import { Phone, MessageCircle, X, HelpCircle } from 'lucide-react';
import { openCustomerSupport } from '../lib/wa';

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const helpOptions = [
    {
      id: 'call',
      icon: Phone,
      title: 'Call Support',
      description: 'Speak to our team',
      action: () => window.open(`tel:${process.env.REACT_APP_SUPPORT_PHONE || '+919876543210'}`, '_self'),
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      title: 'WhatsApp Chat',
      description: 'Quick chat support',
      action: () => openCustomerSupport('Need Help with Order'),
      color: 'from-green-600 to-green-700'
    }
  ];

  const handleHelpAction = (action) => {
    action();
    setIsOpen(false);
    
    // Track help usage
    if (window.gtag) {
      window.gtag('event', 'help_requested', {
        event_category: 'support'
      });
    }
  };

  return (
    <>
      {/* Help Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[var(--color-red)] hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="Need Help?"
        >
          <HelpCircle size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-[var(--color-red)] max-w-sm w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black uppercase tracking-wider mb-2">
                Need Help?
              </h2>
              <p className="text-gray-400 text-sm">
                We're here to help with your OG Armory experience
              </p>
            </div>

            {/* Help Options */}
            <div className="space-y-3">
              {helpOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleHelpAction(option.action)}
                    className={`w-full p-4 bg-gradient-to-r ${option.color} hover:opacity-90 transition-all text-left rounded-sm group`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{option.title}</h3>
                        <p className="text-sm text-gray-100 opacity-90">{option.description}</p>
                      </div>
                      <div className="flex-shrink-0 ml-auto">
                        <span className="text-white opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Available 24/7 for rebel support
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton;
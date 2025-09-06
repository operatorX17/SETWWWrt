import React from 'react';
import { Instagram } from 'lucide-react';

const UGCStrip = ({ className = "" }) => {
  // Mock fan images - replace with real UGC
  const fanImages = [
    { id: 1, src: '/placeholder-fan1.jpg', alt: 'Fan 1' },
    { id: 2, src: '/placeholder-fan2.jpg', alt: 'Fan 2' },
    { id: 3, src: '/placeholder-fan3.jpg', alt: 'Fan 3' },
    { id: 4, src: '/placeholder-fan4.jpg', alt: 'Fan 4' },
    { id: 5, src: '/placeholder-fan5.jpg', alt: 'Fan 5' },
    { id: 6, src: '/placeholder-fan6.jpg', alt: 'Fan 6' }
  ];

  return (
    <section className={`bg-gray-900 py-12 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">FAN ARMY WALL</h2>
          <p className="text-gray-300">Tag #OGARMY to get featured</p>
        </div>

        {/* Fan Images Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {fanImages.map((fan) => (
            <div key={fan.id} className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative group">
              <div className="w-full h-full bg-gradient-to-br from-red-600/20 to-gray-800 flex items-center justify-center">
                <Instagram className="text-gray-400 opacity-50" size={24} />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200"></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://instagram.com/explore/tags/ogarmy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            <Instagram size={20} />
            <span>Tag #OGARMY</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default UGCStrip;
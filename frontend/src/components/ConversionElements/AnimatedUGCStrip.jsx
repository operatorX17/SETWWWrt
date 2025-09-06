import React, { useEffect, useRef } from 'react';
import { Instagram } from 'lucide-react';

const AnimatedUGCStrip = ({ className = "" }) => {
  const scrollRef = useRef(null);

  // Mock fan images with cool OG-themed content
  const fanImages = [
    { id: 1, src: '/placeholder-fan1.jpg', alt: 'OG Fan 1', caption: 'REBEL VIBES' },
    { id: 2, src: '/placeholder-fan2.jpg', alt: 'OG Fan 2', caption: 'SOLDIER MODE' },
    { id: 3, src: '/placeholder-fan3.jpg', alt: 'OG Fan 3', caption: 'BATTLE READY' },
    { id: 4, src: '/placeholder-fan4.jpg', alt: 'OG Fan 4', caption: 'OG ARMY' },
    { id: 5, src: '/placeholder-fan5.jpg', alt: 'OG Fan 5', caption: 'FIRST SHOW' },
    { id: 6, src: '/placeholder-fan6.jpg', alt: 'OG Fan 6', caption: 'LEGEND' },
    { id: 7, src: '/placeholder-fan7.jpg', alt: 'OG Fan 7', caption: 'WARRIOR' },
    { id: 8, src: '/placeholder-fan8.jpg', alt: 'OG Fan 8', caption: 'ELITE' }
  ];

  // Duplicate for seamless loop
  const allImages = [...fanImages, ...fanImages];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Adjust speed here

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset position when we've scrolled through half (since we duplicated)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className={`bg-gray-900 py-12 px-6 overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
            🔥 FAN ARMY WALL 🔥
          </h2>
          <p className="text-gray-300">Tag #OGARMY to get featured</p>
        </div>

        {/* Scrolling Fan Images */}
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-hidden"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {allImages.map((fan, index) => (
            <div 
              key={`${fan.id}-${index}`} 
              className="flex-shrink-0 w-32 h-32 bg-gray-800 rounded-lg overflow-hidden relative group hover:scale-105 transition-all duration-300"
            >
              <div className="w-full h-full bg-gradient-to-br from-red-600/30 to-gray-800 flex items-center justify-center relative">
                {/* Placeholder content */}
                <div className="text-center">
                  <Instagram className="text-gray-400 opacity-50 mx-auto mb-1" size={20} />
                  <div className="text-xs text-gray-300 font-bold">{fan.caption}</div>
                </div>
                
                {/* Animated border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/30"></div>
                
                {/* Lightning effect for special ones */}
                {index % 3 === 0 && (
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-lg border border-yellow-400 animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href="https://instagram.com/explore/tags/ogarmy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30"
          >
            <Instagram size={20} />
            <span>Tag #OGARMY</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AnimatedUGCStrip;
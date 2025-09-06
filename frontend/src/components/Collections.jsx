import React from 'react';
import { ArrowRight } from 'lucide-react';

const Collections = () => {
  return (
    <div className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider leading-relaxed">
            explore our collections
          </h2>
        </div>

        {/* Collection Image */}
        <div className="relative mb-12">
          <img
            src="https://framerusercontent.com/images/Bqu1YbtLNP6KpNMpw9Wnp1oQOJA.jpg"
            alt="Elements Collection"
            className="w-full h-[500px] lg:h-[600px] object-cover"
          />
          
          {/* CTA Button */}
          <div className="absolute bottom-8 left-8">
            <button className="bg-white text-black px-8 py-3 flex items-center space-x-2 hover:bg-gray-100 transition-colors group">
              <span className="text-sm uppercase tracking-wider font-semibold">Shop Now</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
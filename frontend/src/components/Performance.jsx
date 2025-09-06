import React from 'react';
import { ArrowRight } from 'lucide-react';

const Performance = () => {
  return (
    <div className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative">
            <img
              src="https://framerusercontent.com/images/aHmupIkpNbiTWcrio0jHVxTg4OU.png"
              alt="Built for Performance"
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <h2 className="text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-none">
              Built for<br />real performance
            </h2>
            
            <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors group">
              <span className="text-sm uppercase tracking-wider font-medium">About Us</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
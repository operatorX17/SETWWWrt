import React from 'react';
import { ArrowRight } from 'lucide-react';
import { mockInstagramPosts } from '../data/mock';

const InstagramFeed = () => {
  return (
    <div className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider mb-6">
            Follow Axiom
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Wear it your way. Tag us on Instagram for your chance to be featured.
          </p>
          <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors group mx-auto">
            <span className="text-sm uppercase tracking-wider font-medium">Follow Us</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {mockInstagramPosts.map((image, index) => (
            <div key={index} className="relative aspect-square group cursor-pointer overflow-hidden">
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramFeed;
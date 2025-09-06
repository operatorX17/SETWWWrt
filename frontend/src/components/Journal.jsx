import React from 'react';
import { ArrowRight } from 'lucide-react';
import { mockJournalPosts } from '../data/mock';

const Journal = () => {
  return (
    <div className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider">
            from the journal
          </h2>
          <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors group">
            <span className="text-sm uppercase tracking-wider font-medium">View All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg mb-12 max-w-3xl">
          Exploring the principles of design and how we approach everyday pieces.
        </p>

        {/* Journal Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockJournalPosts.map((post) => (
            <div key={post.id} className="group cursor-pointer">
              {/* Post Image */}
              <div className="relative aspect-[4/5] bg-gray-900 overflow-hidden mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
              </div>

              {/* Post Content */}
              <div className="space-y-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {post.date}
                </p>
                <h3 className="text-xl font-bold group-hover:text-gray-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors group">
                  <span className="text-sm uppercase tracking-wider font-medium">Read Entry</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
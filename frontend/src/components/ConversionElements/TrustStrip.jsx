import React from 'react';

const TrustStrip = ({ className = "" }) => {
  return (
    <div className={`bg-gray-800 border-t border-b border-gray-700 py-3 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-300">
          <span className="flex items-center space-x-2">
            <span>💰</span>
            <span>COD</span>
          </span>
          <span className="hidden md:block text-gray-600">•</span>
          <span className="flex items-center space-x-2">
            <span>🚚</span>
            <span>2–5 Day Delivery</span>
          </span>
          <span className="hidden md:block text-gray-600">•</span>
          <span className="flex items-center space-x-2">
            <span>🔄</span>
            <span>7-Day Size Swap</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
import React from 'react';
import { Truck, Clock, Shield, Star } from 'lucide-react';

const DeliveryPromise = ({ className = "", compact = false }) => {
  if (compact) {
    return (
      <div className={`flex items-center space-x-2 text-sm ${className}`}>
        <Truck size={16} className="text-green-400" />
        <span className="text-green-400 font-bold">🚀 3-Day Express Delivery</span>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <div>
            <div className="text-green-400 font-bold text-sm">EXPRESS DELIVERY</div>
            <div className="text-white text-xs">Delivered in 3 days</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <div className="text-blue-400 font-bold text-sm">REAL-TIME TRACKING</div>
            <div className="text-white text-xs">Live order updates</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <div className="text-purple-400 font-bold text-sm">SECURE PACKAGING</div>
            <div className="text-white text-xs">Damage-free guarantee</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
            <Star size={20} className="text-white" />
          </div>
          <div>
            <div className="text-yellow-400 font-bold text-sm">99.8% ON-TIME</div>
            <div className="text-white text-xs">Delivery success rate</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-green-400 font-bold">🔥 FREE SHIPPING ON ALL ORDERS!</div>
        <div className="text-sm text-gray-300">No minimum order value • Pan-India delivery</div>
      </div>
    </div>
  );
};

export default DeliveryPromise;
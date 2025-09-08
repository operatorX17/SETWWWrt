import React, { useState, useEffect } from 'react';
import { Shield, Truck, CreditCard, RotateCcw, Star, Users, Award, Zap } from 'lucide-react';

const TrustStrip = ({ className = "" }) => {
  const [currentStat, setCurrentStat] = useState(0);
  
  const trustStats = [
    { icon: Users, text: "75,000+ Rebels Worldwide", color: "text-green-400", bg: "bg-green-400/10" },
    { icon: Star, text: "4.9★ Rated Excellence", color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { icon: Award, text: "#1 Streetwear Brand", color: "text-purple-400", bg: "bg-purple-400/10" },
    { icon: Shield, text: "Lifetime Quality Promise", color: "text-blue-400", bg: "bg-blue-400/10" }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % trustStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [trustStats.length]);
  
  return (
    <div className={`bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-b border-gray-700/50 py-6 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Mobile: Rotating Stats */}
        <div className="md:hidden text-center mb-4">
          <div className={`flex items-center justify-center space-x-3 text-sm ${trustStats[currentStat].bg} rounded-full px-4 py-2 border border-gray-700/50`}>
            {React.createElement(trustStats[currentStat].icon, { className: `w-5 h-5 ${trustStats[currentStat].color}` })}
            <span className={`font-bold ${trustStats[currentStat].color}`}>
              {trustStats[currentStat].text}
            </span>
          </div>
        </div>
        
        {/* Desktop: All Trust Signals */}
        <div className="hidden md:flex items-center justify-center space-x-6 text-sm mb-4">
          {trustStats.map((stat, index) => (
            <div key={index} className={`flex items-center space-x-2 ${stat.bg} rounded-full px-3 py-2 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:scale-105`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className={`font-bold ${stat.color}`}>{stat.text}</span>
            </div>
          ))}
        </div>
        
        {/* Enhanced Main Trust Elements */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 group hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
            <CreditCard className="w-4 h-4 text-green-400" />
            <span className="font-bold text-green-300">💰 Cash on Delivery</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 group hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
            <Truck className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-blue-300">🚚 Free Shipping ₹999+</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 group hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
            <RotateCcw className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-orange-300">🔄 7-Day Exchange</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 group hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-purple-300">⚡ Express Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
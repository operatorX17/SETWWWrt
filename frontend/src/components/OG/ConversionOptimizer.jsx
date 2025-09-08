import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, TrendingUp, Shield, Star, Zap, AlertTriangle, Crown, Award, Heart } from 'lucide-react';

const ConversionOptimizer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 47,
    seconds: 32
  });
  const [activeBuyers, setActiveBuyers] = useState(1247);
  const [stockAlert, setStockAlert] = useState(true);
  const [socialProofIndex, setSocialProofIndex] = useState(0);
  const [urgencyLevel, setUrgencyLevel] = useState('high');

  // Enhanced psychological triggers data
  const socialProofMessages = [
    { message: "Rajesh from Mumbai bought Power Star Hoodie", time: "2 minutes ago", amount: "₹1,999", location: "Mumbai", verified: true },
    { message: "Priya from Hyderabad bought JSP T-Shirt", time: "5 minutes ago", amount: "₹899", location: "Hyderabad", verified: true },
    { message: "Arjun from Bangalore bought Limited Edition Cap", time: "8 minutes ago", amount: "₹1,299", location: "Bangalore", verified: true },
    { message: "Sneha from Chennai bought Premium Hoodie", time: "11 minutes ago", amount: "₹2,199", location: "Chennai", verified: true },
    { message: "Vikram from Delhi bought Power Star Bundle", time: "15 minutes ago", amount: "₹3,499", location: "Delhi", verified: true },
    { message: "Kavya from Pune bought Exclusive T-Shirt", time: "18 minutes ago", amount: "₹1,199", location: "Pune", verified: true }
  ];
  
  const testimonialRotation = [
    { text: "Best quality I've ever seen!", author: "Ravi K.", rating: 5 },
    { text: "Exceeded my expectations completely", author: "Meera S.", rating: 5 },
    { text: "Worth every rupee spent", author: "Anil P.", rating: 5 },
    { text: "Premium quality, fast delivery", author: "Divya R.", rating: 5 }
  ];

  const scarcityTriggers = [
    { item: "Power Star Hoodie", stock: 8, urgency: "medium" }
  ];

  const authoritySignals = [
    { icon: Crown, text: "Celebrity Endorsed", subtext: "Worn by industry VIPs", color: "text-yellow-400" },
    { icon: Award, text: "#1 Fan Brand", subtext: "50,000+ satisfied customers", color: "text-blue-400" },
    { icon: Shield, text: "Lifetime Guarantee", subtext: "Replace if it breaks, ever", color: "text-green-400" },
    { icon: Star, text: "4.9/5 Rating", subtext: "Based on 15,000+ reviews", color: "text-purple-400" },
    { icon: Heart, text: "Fan Favorite", subtext: "Most loved by Power Star fans", color: "text-red-400" },
    { icon: Zap, text: "Lightning Fast", subtext: "Same day dispatch", color: "text-orange-400" }
  ];

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        if (newHours < 0) {
          // Reset to create perpetual urgency
          return { hours: 23, minutes: 59, seconds: 59 };
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Social proof rotation (less frequent)
  useEffect(() => {
    const socialTimer = setInterval(() => {
      setSocialProofIndex(prev => (prev + 1) % socialProofMessages.length);
    }, 12000);

    return () => clearInterval(socialTimer);
  }, [socialProofMessages.length]);

  // Stable active buyers count to prevent random changes
  useEffect(() => {
    // Set a stable count based on current time hour to appear dynamic but stable
    const stableCount = 45 + (new Date().getHours() % 12) * 3;
    setActiveBuyers(stableCount);
  }, []);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-400 bg-red-600/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-600/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/50';
      default: return 'text-green-400 bg-green-600/20 border-green-500/50';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Enhanced Floating Social Proof Notifications */}
      <div className="absolute bottom-20 left-4 pointer-events-auto">
        <div className="bg-gradient-to-r from-black/95 to-gray-900/95 backdrop-blur-sm border border-green-500/40 rounded-2xl p-4 max-w-sm transform transition-all duration-500 hover:scale-105 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2" />
              <span className="text-green-400 font-semibold text-sm">🔥 LIVE PURCHASE</span>
            </div>
            {socialProofMessages[socialProofIndex].verified && (
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">✓ VERIFIED</div>
            )}
          </div>
          <p className="text-white text-sm mb-2 font-medium">
            {socialProofMessages[socialProofIndex].message}
          </p>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-400">{socialProofMessages[socialProofIndex].time}</span>
            <span className="text-green-400 font-bold text-lg">{socialProofMessages[socialProofIndex].amount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-400 text-xs">📍 {socialProofMessages[socialProofIndex].location}</span>
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(5)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Testimonial */}
      <div className="absolute bottom-20 right-4 pointer-events-auto max-w-xs">
        <div className="bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-sm border border-purple-500/40 rounded-2xl p-4 transform transition-all duration-500 hover:scale-105 shadow-2xl">
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-semibold text-sm">CUSTOMER REVIEW</span>
          </div>
          <p className="text-white text-sm mb-2 italic">
            "{testimonialRotation[socialProofIndex % testimonialRotation.length].text}"
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">- {testimonialRotation[socialProofIndex % testimonialRotation.length].author}</span>
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(testimonialRotation[socialProofIndex % testimonialRotation.length].rating)}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Alert Banner */}
      {stockAlert && (
        <div className="absolute bottom-20 right-4 pointer-events-auto">
          <div className="bg-red-600/90 backdrop-blur-sm border border-red-400/50 rounded-2xl p-4 max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-white font-bold text-sm">STOCK ALERT</span>
              </div>
              <button 
                onClick={() => setStockAlert(false)}
                className="text-gray-300 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-white text-sm mb-2">
              Only <span className="font-bold text-yellow-400">7 items</span> left in your size!
            </p>
            <Link to="/shop">
              <button className="w-full bg-white text-red-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                SECURE YOURS NOW
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Conversion Bar */}
      <div className="bg-gradient-to-r from-black/95 via-red-900/95 to-black/95 backdrop-blur-sm border-t border-red-500/30 p-4 pointer-events-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            
            {/* Countdown Timer */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-2">
                <Clock className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-white font-bold text-sm">FLASH SALE ENDS IN:</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-lg min-w-[50px]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-white font-bold">:</span>
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-lg min-w-[50px]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-white font-bold">:</span>
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-lg min-w-[50px]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Active Buyers */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-white font-bold text-sm">ACTIVE BUYERS:</span>
              </div>
              <div className="text-2xl font-black text-blue-400">
                {activeBuyers.toLocaleString()}
              </div>
              <p className="text-gray-300 text-xs">fans shopping right now</p>
            </div>

            {/* Enhanced Authority Signals */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                {authoritySignals.slice(0, 4).map((signal, index) => {
                  const IconComponent = signal.icon;
                  return (
                    <div key={index} className="flex items-center group hover:bg-white/5 p-2 rounded-lg transition-all">
                      <IconComponent className={`w-5 h-5 ${signal.color} mr-2 group-hover:scale-110 transition-transform`} />
                      <div>
                        <p className="text-white font-semibold text-xs group-hover:text-gray-100">{signal.text}</p>
                        <p className="text-gray-400 text-xs group-hover:text-gray-300">{signal.subtext}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="text-center">
              <div className="mb-2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-black text-xs px-3 py-1 rounded-full animate-pulse">
                  🎯 {activeBuyers} PEOPLE VIEWING
                </span>
              </div>
              <Link to="/shop">
                <button className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-black py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/50 border border-red-400/50">
                  🔥 SHOP NOW - SAVE 40%
                  <div className="text-sm font-normal mt-1">⚡ Limited Time Only</div>
                </button>
              </Link>
              <div className="flex items-center justify-center mt-2 space-x-4 text-xs">
                <span className="text-green-400">✅ Free shipping ₹999+</span>
                <span className="text-blue-400">✅ 7-day exchange</span>
                <span className="text-purple-400">✅ COD available</span>
              </div>
            </div>
          </div>

          {/* Scarcity Indicators */}
          <div className="mt-4 pt-4 border-t border-red-500/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {scarcityTriggers.map((trigger, index) => (
                <div key={index} className={`${getUrgencyColor(trigger.urgency)} border rounded-lg p-2 text-center`}>
                  <p className="font-semibold text-xs mb-1">{trigger.item}</p>
                  <p className="text-xs">
                    Only <span className="font-bold">{trigger.stock}</span> left
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionOptimizer;
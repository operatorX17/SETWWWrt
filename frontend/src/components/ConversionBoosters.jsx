import React, { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, Star, Gift, Zap } from 'lucide-react';

export const UrgencyTimer = ({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft(difference);
      } else {
        setTimeLeft(0);
        onExpire && onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (timeLeft <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/30 rounded-lg p-4">
      <div className="flex items-center justify-center space-x-4">
        <Clock className="text-red-400" size={20} />
        <div className="text-center">
          <div className="text-red-400 font-bold text-sm">⚡ FLASH SALE ENDS IN</div>
          <div className="flex items-center space-x-2 text-white font-mono">
            <div className="bg-red-600 px-2 py-1 rounded">
              <span className="text-white font-bold">{days.toString().padStart(2, '0')}</span>
              <div className="text-xs">DAYS</div>
            </div>
            <span className="text-red-400">:</span>
            <div className="bg-red-600 px-2 py-1 rounded">
              <span className="text-white font-bold">{hours.toString().padStart(2, '0')}</span>
              <div className="text-xs">HRS</div>
            </div>
            <span className="text-red-400">:</span>
            <div className="bg-red-600 px-2 py-1 rounded">
              <span className="text-white font-bold">{minutes.toString().padStart(2, '0')}</span>
              <div className="text-xs">MIN</div>
            </div>
            <span className="text-red-400">:</span>
            <div className="bg-red-600 px-2 py-1 rounded">
              <span className="text-white font-bold">{seconds.toString().padStart(2, '0')}</span>
              <div className="text-xs">SEC</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SocialProof = ({ className = "" }) => {
  const [liveCount, setLiveCount] = useState(247);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-green-900/20 border border-green-500/30 rounded-lg p-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <div className="text-green-400 font-bold">{liveCount} people</div>
            <div className="text-sm text-gray-300">viewing right now</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-3">
          <TrendingUp className="text-blue-400" size={16} />
          <div>
            <div className="text-blue-400 font-bold">5,000+ sold</div>
            <div className="text-sm text-gray-300">this month</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-3">
          <Star className="text-yellow-400" size={16} />
          <div>
            <div className="text-yellow-400 font-bold">4.9/5 rating</div>
            <div className="text-sm text-gray-300">2,500+ reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StockAlert = ({ stock, threshold = 10 }) => {
  if (stock > threshold) return null;

  return (
    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <span className="text-orange-400 font-bold text-sm">
          ⚠️ Only {stock} left in stock!
        </span>
      </div>
      <div className="text-xs text-gray-300 mt-1">
        Order now to avoid disappointment
      </div>
    </div>
  );
};

export const BundleOffer = ({ products, discount = 15 }) => {
  const bundlePrice = products.reduce((sum, p) => sum + p.price, 0);
  const discountAmount = bundlePrice * (discount / 100);
  const finalPrice = bundlePrice - discountAmount;

  return (
    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Gift className="text-purple-400" size={20} />
        <span className="text-purple-400 font-bold">BUNDLE & SAVE {discount}%</span>
      </div>
      
      <div className="space-y-2 mb-4">
        {products.map((product, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{product.name}</span>
            <span className="text-white">₹{product.price.toLocaleString()}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-600 pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Bundle Price:</span>
          <span className="text-gray-400 line-through">₹{bundlePrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-green-400 font-bold">You Save:</span>
          <span className="text-green-400 font-bold">₹{discountAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white font-bold text-lg">Total:</span>
          <span className="text-red-400 font-bold text-lg">₹{finalPrice.toLocaleString()}</span>
        </div>
      </div>
      
      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg mt-4 transition-all">
        🎁 Add Bundle to Cart
      </button>
    </div>
  );
};

export const ValueStackDisplay = ({ className = "" }) => {
  const valuePoints = [
    { icon: '🚀', title: '3-Day Express Delivery', value: '₹199', description: 'Lightning fast shipping' },
    { icon: '📦', title: 'Premium Packaging', value: '₹99', description: 'Damage-free guarantee' },
    { icon: '🔒', title: '30-Day Returns', value: '₹149', description: 'Hassle-free returns' },
    { icon: '⚡', title: 'Real-time Tracking', value: '₹49', description: 'Live order updates' },
    { icon: '🎁', title: 'Loyalty Rewards', value: '₹299', description: 'Points on every purchase' },
    { icon: '👕', title: 'Premium Quality', value: '₹499', description: 'Superior materials' }
  ];

  const totalValue = valuePoints.reduce((sum, point) => sum + parseInt(point.value.replace('₹', '')), 0);

  return (
    <div className={`bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">🏆 TOTAL VALUE YOU GET</h3>
        <div className="text-3xl font-bold text-green-400">₹{totalValue.toLocaleString()}</div>
        <div className="text-sm text-gray-300">Included with every order</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {valuePoints.map((point, index) => (
          <div key={index} className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl">{point.icon}</div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">{point.title}</div>
              <div className="text-xs text-gray-400">{point.description}</div>
            </div>
            <div className="text-green-400 font-bold text-sm">{point.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <div className="text-yellow-400 font-bold">🔥 ALL THIS AT NO EXTRA COST!</div>
        <div className="text-sm text-gray-300">Premium experience guaranteed</div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shirt, Package, Crown, Star } from 'lucide-react';

const FloatingNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickLinks = [
    {
      name: 'Tees',
      icon: <Shirt size={18} />,
      link: '/shop?category=tee',
      color: 'bg-blue-600 hover:bg-blue-500'
    },
    {
      name: 'Hoodies',
      icon: <Package size={18} />,
      link: '/shop?category=hoodie', 
      color: 'bg-purple-600 hover:bg-purple-500'
    },
    {
      name: 'Premium',
      icon: <Crown size={18} />,
      link: '/shop?filter=premium',
      color: 'bg-yellow-600 hover:bg-yellow-500'
    },
    {
      name: 'Best Sellers',
      icon: <Star size={18} />,
      link: '/shop?filter=best-sellers',
      color: 'bg-green-600 hover:bg-green-500'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Links Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-black/90 backdrop-blur-md border border-gray-800 rounded-2xl p-4 min-w-[200px]">
          <div className="space-y-3">
            {quickLinks.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 ${item.color} text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default FloatingNavigation;
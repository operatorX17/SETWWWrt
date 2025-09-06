import React from 'react';
import { Smartphone, DollarSign, MessageCircle } from 'lucide-react';

const BuyButtons = ({ product, selectedSize = 'M', className = "" }) => {
  const generateUPILink = () => {
    const amount = product.price;
    return `upi://pay?pa=ogarmory@paytm&pn=OG%20Armory&am=${amount}&tn=Order%20${product.name}`;
  };

  const generateWhatsAppLink = () => {
    const message = `Buy ${product.name} Size:${selectedSize} COD Address:YOUR_ADDRESS`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* UPI Button */}
      <a
        href={generateUPILink()}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all shadow-lg"
      >
        <Smartphone size={20} />
        <span>PAY BY ANY UPI APP</span>
      </a>

      {/* COD Button */}
      <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all shadow-lg">
        <DollarSign size={20} />
        <span>CASH ON DELIVERY</span>
      </button>

      {/* WhatsApp Button */}
      <a
        href={generateWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all shadow-lg"
      >
        <MessageCircle size={20} />
        <span>BUY ON WHATSAPP</span>
      </a>

      {/* Trust Line */}
      <div className="text-center text-sm text-gray-400 mt-4">
        COD • 2–5 Day Delivery • 7-Day Size Swap
      </div>
    </div>
  );
};

export default BuyButtons;
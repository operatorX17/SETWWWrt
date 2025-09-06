import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const PremiumMobileCart = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center">
          <Link to="/shop" className="mr-4">
            <ArrowLeft size={24} className="text-gray-900" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Cart</h1>
        </div>

        {/* Empty State */}
        <div className="px-4 py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some items to get started</p>
          <Link 
            to="/shop"
            className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = total;
  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.18);
  const finalTotal = subtotal + shipping + tax;

  const handleUPIPayment = () => {
    const upiLink = `upi://pay?pa=ogarmory@paytm&pn=OG%20Armory&am=${finalTotal}&tn=Order`;
    window.location.href = upiLink;
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi! I want to order ${items.length} items worth ₹${finalTotal}. COD please.`;
    const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">
        <div className="flex items-center">
          <Link to="/shop" className="mr-4">
            <ArrowLeft size={24} className="text-gray-900" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Cart ({items.length})</h1>
        </div>
        <button 
          onClick={clearCart}
          className="text-red-500 text-sm font-medium"
        >
          Clear
        </button>
      </div>

      {/* Items */}
      <div className="px-4 py-6">
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex space-x-4">
              {/* Image */}
              <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {(() => {
                  const imgs = item.images || [];
                  if (imgs.length === 0) return (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={20} className="text-gray-400" />
                    </div>
                  );
                  
                  if (imgs.length === 1) return (
                    <img src={imgs[0]} alt={item.name} className="w-full h-full object-cover" />
                  );
                  
                  const normalize = (s) => (typeof s === 'string' ? s.toLowerCase() : '');
                  const backIdx = imgs.findIndex((u) => {
                    const v = normalize(u);
                    return v.includes('/back/') || v.includes(' back') || v.includes('_back') || v.includes('-back') || v.includes('back/');
                  });
                  
                  const displayImage = backIdx !== -1 ? imgs[backIdx] : (imgs[1] || imgs[0]);
                  return <img src={displayImage} alt={item.name} className="w-full h-full object-cover" />;
                })()}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Size: {item.selectedVariant?.size || 'M'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Minus size={14} className="text-gray-600" />
                    </button>
                    
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Plus size={14} className="text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center ml-2"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 py-6 border-t border-gray-100">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">{formatPrice(tax)}</span>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-semibold text-gray-900">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleUPIPayment}
            disabled={isCheckingOut}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50"
          >
            Pay with UPI - {formatPrice(finalTotal)}
          </button>
          
          <button
            onClick={handleWhatsAppOrder}
            disabled={isCheckingOut}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50"
          >
            Order on WhatsApp (COD)
          </button>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
          <div>
            <div className="text-lg mb-1">💰</div>
            <div>COD Available</div>
          </div>
          <div>
            <div className="text-lg mb-1">🚚</div>
            <div>2-5 Day Delivery</div>
          </div>
          <div>
            <div className="text-lg mb-1">🔄</div>
            <div>Easy Returns</div>
          </div>
        </div>
      </div>

      {/* Safe Area */}
      <div className="h-8"></div>
    </div>
  );
};

export default PremiumMobileCart;
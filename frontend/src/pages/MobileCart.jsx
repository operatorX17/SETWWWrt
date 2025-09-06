import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import BuyButtons from '../components/ConversionElements/BuyButtons';
import CartSuggestions from '../components/CartSuggestions';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const MobileCart = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <div className="px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link to="/shop" className="text-white mr-4">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-white">Your Arsenal</h1>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto mb-6 text-gray-400" />
            <h2 className="text-xl font-bold text-white mb-4">Your Arsenal is Empty</h2>
            <p className="text-gray-400 mb-8">Time to gear up, soldier.</p>
            <Link 
              to="/shop"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              START SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = total;
  const gst = subtotal * 0.18;
  const finalTotal = subtotal + gst;

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/shop" className="text-white mr-4">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-white">Your Arsenal</h1>
          </div>
          <button 
            onClick={clearCart}
            className="text-red-400 text-sm"
          >
            Clear All
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                {/* Product Image */}
                <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  {(() => {
                    const imgs = item.images || [];
                    if (imgs.length === 0) return (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <ShoppingBag size={16} className="text-gray-500" />
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

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm line-clamp-2">{item.name}</h3>
                  <div className="text-xs text-gray-400 mt-1">
                    Size: {item.selectedVariant?.size || 'M'} • Color: {item.selectedVariant?.color || 'Default'}
                  </div>
                  <div className="text-lg font-bold text-red-400 mt-1">
                    {formatPrice(item.price)}
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-400 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
                  >
                    <Minus size={14} className="text-white" />
                  </button>
                  
                  <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center"
                  >
                    <Plus size={14} className="text-white" />
                  </button>
                </div>

                <div className="text-white font-bold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <CartSuggestions className="mb-6" />

        {/* Order Summary */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal ({items.length} items)</span>
              <span className="text-white">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              <span className="text-green-400 font-bold">FREE</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">GST (18%)</span>
              <span className="text-white">{formatPrice(gst)}</span>
            </div>
            
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-red-400 font-bold text-lg">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Trust Elements */}
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <div className="text-center text-xs text-gray-300 space-y-1">
              <div>💰 COD Available</div>
              <div>🚚 2–5 Day Delivery</div>
              <div>🔄 7-Day Size Swap</div>
            </div>
          </div>
        </div>

        {/* Buy Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Choose Payment</h3>
          <BuyButtons 
            product={{
              name: `${items.length} Items`,
              price: finalTotal
            }}
          />
        </div>

        {/* Continue Shopping */}
        <div className="text-center pb-8">
          <Link 
            to="/shop"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileCart;
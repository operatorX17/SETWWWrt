import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, itemCount, proceedToCheckout } = useCart();

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-black border-l border-gray-800 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Your Arsenal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="text-gray-600 mb-6" size={64} />
                <h3 className="text-xl font-semibold mb-2 text-white">Your arsenal is empty</h3>
                <p className="text-gray-400 mb-8">Ready to gear up? Add some weapons to your arsenal.</p>
                <button
                  onClick={() => {
                    navigate('/shop');
                    onClose();
                  }}
                  className="bg-white text-black py-3 px-6 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-6 border border-gray-800">
                    <div className="w-24 h-24 bg-gray-900 overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/100x100?text=OG'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=OG';
                        }}
                      />
                    </div>

                    <div className="flex-grow">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        OG MERCH
                      </p>
                      <h3 className="text-lg font-medium mb-2 text-white">{item.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        {item.selectedVariant?.size && <span>Size: {item.selectedVariant.size}</span>}
                        <span>₹{item.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-600 hover:border-white transition-colors flex items-center justify-center text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-600 hover:border-white transition-colors flex items-center justify-center text-white"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-800 p-6 space-y-6">
              <div className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-gray-800 pt-3">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  proceedToCheckout();
                  onClose();
                }}
                className="w-full bg-[var(--color-red)] hover:bg-red-700 text-white py-4 px-6 font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <span>Order via WhatsApp</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
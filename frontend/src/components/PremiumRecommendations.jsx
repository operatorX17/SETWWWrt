import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Clock, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PremiumRecommendations = ({ products, currentProductId }) => {
  const { addToCart } = useCart();
  
  // Filter out current product and unwanted hoodies, get up to 4 recommendations
  const recommendations = products
    .filter(p => 
      p.id !== currentProductId && 
      !p.title.includes('Cinder Fade') && 
      !p.title.includes('Smoke Trail')
    )
    .slice(0, 4);

  if (recommendations.length === 0) {
    return null;
  }

  // Generate stock numbers for scarcity
  const getStockLeft = (productId) => {
    const hash = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return (hash % 8) + 3; // 3-10 items left
  };

  return (
    <section className="py-8 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Clean Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            Complete Your Arsenal
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Carefully selected pieces that elevate your collection
          </p>
        </div>

        {/* Mobile-First Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {recommendations.map((product, index) => {
            const stockLeft = getStockLeft(product.id);
            const isLowStock = stockLeft <= 5;
            
            return (
              <div 
                key={product.id} 
                className="group relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-500/30 transition-all duration-300"
              >
                {/* Product Image - Square Format */}
                <Link to={`/product/${product.id}`} className="block relative">
                  <div className="aspect-square overflow-hidden bg-gray-800">
                    <img 
                      src={(() => {
                        // Special handling for products that should show front first
                        if (product.showFrontFirst) {
                          return product.primaryImage || product.images?.[0] || '/placeholder-product.jpg';
                        }
                        return product.images?.[0] || '/placeholder-product.jpg';
                      })()} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    
                    {/* Stock Badge */}
                    {isLowStock && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {stockLeft} left
                      </div>
                    )}
                    
                    {/* Price Badge */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                      ₹{product.price}
                    </div>
                  </div>
                </Link>

                {/* Product Details - Compact */}
                <div className="p-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-white text-xs md:text-sm mb-2 line-clamp-1 group-hover:text-red-400 transition-colors duration-300">
                      {product.title}
                    </h3>
                  </Link>
                  
                  {/* Price and Action Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-red-400 font-bold text-sm">₹{product.price}</span>
                      {product.compareAtPrice && (
                        <span className="text-gray-500 text-xs line-through">₹{product.compareAtPrice}</span>
                      )}
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                  
                  {/* Stock Info */}
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Package size={12} />
                    <span>{stockLeft} in stock</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore More CTA */}
        <div className="text-center mt-8">
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 text-sm"
          >
            <span>Explore Arsenal</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PremiumRecommendations;
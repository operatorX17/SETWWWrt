import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Maximize2, Star, Frame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/price';
import { useProducts } from '../../hooks/useProducts';

const PosterShowcase = () => {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [hoveredPoster, setHoveredPoster] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  // Filter only poster products
  const posterProducts = products.filter(product => product.category === 'Posters');
  
  // Debug logging
  console.log('Total products:', products.length);
  console.log('Poster products:', posterProducts.length);
  console.log('First poster:', posterProducts[0]);

  const toggleWishlist = (posterId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(posterId)) {
        newWishlist.delete(posterId);
      } else {
        newWishlist.add(posterId);
      }
      return newWishlist;
    });
  };

  const calculateSavings = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };



  if (loading || posterProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-full mb-6">
            <Frame className="w-5 h-5 mr-2" />
            <span className="font-bold">FEATURED PRODUCTIONS</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-6">
            PREMIUM <span className="text-red-400">POSTER</span> COLLECTION
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your space with cinematic masterpieces. Each poster is a gateway to epic storytelling.
          </p>
        </div>



        {/* Posters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {posterProducts.map(poster => (
            <div
              key={poster.id}
              className="group relative bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:border-red-500/50 hover:bg-black/60 hover:scale-105"
              onMouseEnter={() => setHoveredPoster(poster.id)}
              onMouseLeave={() => setHoveredPoster(null)}
            >
              {/* Poster Badge */}
              {poster.badges && poster.badges[0] && (
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {poster.badges[0]}
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(poster.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-black/70"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    wishlist.has(poster.id) ? 'text-red-500 fill-current' : 'text-white'
                  }`} 
                />
              </button>

              {/* Poster Image - Optimized for poster aspect ratio */}
              <div className="relative overflow-hidden bg-gray-800" style={{ minHeight: '400px' }}>
                <div className="aspect-[2/3] relative" style={{ minHeight: '400px' }}>
                  <img
                    src={poster.images[0]}
                    alt={poster.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/600';
                      e.target.style.backgroundColor = '#1f2937';
                    }}
                    style={{
                      minHeight: '100%',
                      backgroundColor: '#1f2937'
                    }}
                  />
                  
                  {/* Overlay on Hover */}
                  <div className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredPoster === poster.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="flex gap-3">
                      <Link to={`/product/${poster.id}`}>
                        <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30">
                          <Eye className="w-6 h-6 text-white" />
                        </button>
                      </Link>
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30">
                        <Maximize2 className="w-6 h-6 text-white" />
                      </button>
                      <button
                        onClick={() => addToCart({...poster, price: poster.price})}
                        className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-700"
                      >
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Poster Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                  {poster.name}
                </h3>
                
                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-red-400">
                        {formatPrice(poster.price)}
                      </span>
                      {poster.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(poster.originalPrice)}
                        </span>
                      )}
                    </div>
                    {poster.originalPrice && (
                      <div className="text-green-400 text-xs font-semibold">
                        Save {calculateSavings(poster.originalPrice, poster.price)}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">
                    Premium Print
                  </span>
                  <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">
                    Fade Resistant
                  </span>
                  <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">
                    Ready to Frame
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link to={`/product/${poster.id}`} className="flex-1">
                    <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-sm">
                      View Details
                    </button>
                  </Link>
                  <button
                    onClick={() => addToCart({...poster, selectedSize, price: getPosterPrice(poster.price)})}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Posters Button */}
        <div className="text-center mt-16">
          <Link to="/shop?category=posters">
            <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105">
              VIEW ALL POSTERS
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PosterShowcase;
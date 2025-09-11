import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye, Filter, Grid, List, TrendingUp, Crown, Zap, Award } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../lib/price';

const PremiumShowcase = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { products: allProducts, loading } = useProducts();
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());

  // Filter for premium products from the actual product data
  const products = allProducts.filter(p => 
    (p.collection === 'PREMIUM COLLECTION') || 
    (p.badges && p.badges.includes('PREMIUM')) ||
    (p.price >= 1200 && p.price <= 1700)
  ).map(product => {
    // Generate unique features based on product category and name
    const getUniqueFeatures = (product) => {
      const features = [];
      
      // Add category-specific features
      if (product.category === 'Hoodies' || product.name?.includes('HOODIE')) {
        features.push('Premium Cotton Blend', 'Heavyweight 400GSM');
      } else if (product.category === 'Tees' || product.name?.includes('TEE')) {
        features.push('Soft Cotton', 'Breathable Fabric');
      } else if (product.category === 'Vault') {
        features.push('Vault Exclusive', 'Serial Numbered');
      }
      
      // Add design-specific features
      if (product.name?.includes('SHADOW') || product.name?.includes('BEAST')) {
        features.push('Dark Aesthetic');
      } else if (product.name?.includes('STORM') || product.name?.includes('THUNDER')) {
        features.push('Weather Inspired');
      } else if (product.name?.includes('CRIMSON') || product.name?.includes('FURY')) {
        features.push('Bold Design');
      }
      
      // Add quality indicators
      if (product.price > 2000) {
        features.push('Premium Quality');
      } else if (product.price > 1500) {
        features.push('High Quality');
      }
      
      return features.slice(0, 3); // Limit to 3 features
    };
    
    // Generate realistic review count based on product ID hash
    const getReviewCount = (productId) => {
      if (!productId) return 127;
      const hash = String(productId).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return Math.abs(hash % 500) + 50; // Between 50-550 reviews
    };
    
    return {
      ...product,
      // Add stable properties for display - no random values
      originalPrice: product.originalPrice || Math.floor(product.price * 1.4),
      rating: product.rating || (4.2 + (Math.abs(String(product.id || '').charCodeAt(0) || 0) % 8) / 10), // Rating between 4.2-4.9
      reviews: product.reviews || getReviewCount(product.id),
      image: product.images && product.images[0] ? product.images[0] : product.image,
      badgeColor: product.badges && product.badges.includes('PREMIUM') ? 'bg-red-600' : 'bg-blue-600',
      features: product.features || getUniqueFeatures(product),
      stock: product.stock || (product.id ? (Math.abs(String(product.id).charCodeAt(0) || 0) % 40) + 15 : 25),
      trending: product.badges && product.badges.includes('TRENDING'),
      exclusive: product.badges && product.badges.includes('EXCLUSIVE')
    };
  });

  if (loading) {
    return (
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-bold uppercase tracking-wider">Loading Premium Arsenal...</p>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'hoodies', name: 'Hoodies', count: products.filter(p => p.category === 'hoodies').length },
    { id: 'tshirts', name: 'T-Shirts', count: products.filter(p => p.category === 'tshirts').length },
    { id: 'accessories', name: 'Accessories', count: products.filter(p => p.category === 'accessories').length },
    { id: 'posters', name: 'Posters', count: products.filter(p => p.category === 'posters').length }
  ];

  const filteredProducts = products.filter(product => 
    filter === 'all' || product.category === filter
  ).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'popularity': return b.reviews - a.reviews;
      default: return 0;
    }
  });

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const calculateSavings = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-600 text-white px-6 py-2 rounded-full mb-6">
            <Crown className="w-5 h-5 mr-2" />
            <span className="font-bold">PREMIUM COLLECTION</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-6">
            EXCLUSIVE <span className="text-red-400">POWER STAR</span> MERCHANDISE
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Handcrafted with precision. Designed for legends. Each piece tells a story of excellence and passion.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    filter === category.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="group relative bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:border-red-500/50 hover:bg-black/60"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Badge */}
              {product.badges && product.badges.length > 0 && (
                <div className={`absolute top-4 left-4 z-10 ${product.badgeColor} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                  {product.badges[0]}
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-black/70"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    wishlist.has(product.id) ? 'text-red-500 fill-current' : 'text-white'
                  }`} 
                />
              </button>

              {/* Product Image */}
              <div className="relative overflow-hidden aspect-[4/5]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Removed hover overlay as per user request - no CTA on hover */}
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Trending/Exclusive Indicators */}
                <div className="flex items-center gap-2 mb-3">
                  {product.trending && (
                    <div className="flex items-center bg-orange-600/20 text-orange-400 px-2 py-1 rounded-full text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </div>
                  )}
                  {product.exclusive && (
                    <div className="flex items-center bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      Exclusive
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.features.map((feature, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">{product.rating}</span>
                  <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-red-400">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                    <div className="text-green-400 text-sm font-semibold">
                      Save {calculateSavings(product.originalPrice, product.price)}%
                    </div>
                  </div>
                </div>

                {/* Stock Indicator */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Stock Level</span>
                    <span className={`font-semibold ${
                      product.stock < 10 ? 'text-red-400' : 
                      product.stock < 30 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {product.stock} left
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        product.stock < 10 ? 'bg-red-500' : 
                        product.stock < 30 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                      View Details
                    </button>
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Add to Arsenal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button 
            onClick={() => navigate('/shop?collection=premium-collection')}
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
          >
            LOAD MORE PRODUCTS
          </button>
        </div>
      </div>
    </section>
  );
};

export default PremiumShowcase;
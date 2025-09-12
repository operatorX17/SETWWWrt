import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import { initiateUPIPayment } from '../lib/upi';
import { sendOrderToWhatsApp } from '../lib/wa';
import { ShoppingCart, ArrowLeft, Heart, Share, Star, Truck, Shield, RefreshCw, Clock, Package, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PremiumRecommendations from '../components/PremiumRecommendations';
import SizeChips from '../components/SizeChips';
import Scarcity from '../components/Scarcity';
import TrustChips from '../components/TrustChips';
import CartSidebar from '../components/CartSidebar';
import FloatingNavigation from '../components/FloatingNavigation';

const ProductDetail = () => {
  const { id, handle } = useParams();
  const navigate = useNavigate();
  
  const productIdentifier = id || handle;
  const { product, loading: productLoading } = useProduct(productIdentifier);
  const { addToCart, loading: cartLoading } = useCart();
  
  // Related products based on category and badges
  const { products: allProducts } = useProducts();
  const relatedProducts = allProducts.filter(p => 
    p.category === product?.category && p.id !== product?.id
  );
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [bundleItems, setBundleItems] = useState([]);
  const [codEnabled, setCodEnabled] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(0); 
      setSelectedSize('M');
      setImageError(false);
      
      if (product.bundle) {
        setBundleItems(product.bundle.map(item => ({ ...item, selected: false })));
      }
    }
  }, [product]);

  // Generate scarcity data
  const getProductScarcity = () => {
    if (!product) return { stock: 10, viewing: 5, sold: 25 };
    
    const hash = product.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return {
      stock: (hash % 15) + 5, // 5-19 items left
      viewing: (hash % 8) + 3, // 3-10 people viewing
      sold: (hash % 50) + 25, // 25-74 sold in last 24h
    };
  };

  const scarcity = getProductScarcity();

  // Enhanced image handling with fallbacks
  const getProductImages = () => {
    if (!product) return ['/placeholder-product.jpg'];
    
    let images = [];
    
    // Handle array format
    if (Array.isArray(product.images)) {
      images = product.images.filter(img => img && img.trim() !== '');
    }
    
    // Handle object format
    if (product.images && typeof product.images === 'object' && !Array.isArray(product.images)) {
      if (product.images.back) images.push(product.images.back);
      if (product.images.front) images.push(product.images.front);
    }
    
    // Fallback to primaryImage
    if (images.length === 0 && product.primaryImage) {
      images = [product.primaryImage];
    }
    
    // Fallback to backImage/frontImage
    if (images.length === 0) {
      if (product.backImage) images.push(product.backImage);
      if (product.frontImage) images.push(product.frontImage);
    }
    
    return images.length > 0 ? images : ['/placeholder-product.jpg'];
  };

  const productImages = getProductImages();
  const currentImage = productImages[selectedImage] || productImages[0] || '/placeholder-product.jpg';

  const mockStock = {
    'XS': 5, 'S': 12, 'M': 18, 'L': 22, 'XL': 9, 'XXL': 4
  };

  const handleAddToCart = () => {
    if (product) {
      const productWithSize = {
        ...product,
        selectedSize,
        quantity: 1
      };
      addToCart(productWithSize);
      setCartSidebarOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      initiateUPIPayment({
        amount: product.price,
        productName: product.title,
        orderId: `ORD${Date.now()}`
      });
    }
  };

  const handleWhatsAppOrder = () => {
    if (product) {
      sendOrderToWhatsApp({
        productName: product.title,
        price: product.price,
        size: selectedSize,
        image: currentImage
      });
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading arsenal...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-red-400 hover:text-red-300">
            ← Back to Arsenal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header - Always show on product pages */}
      <Header />
      <FloatingNavigation />
      
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Product Section - Mobile First */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Product Images - Compact for Mobile */}
            <div className="order-1 lg:order-2">
              {/* Main Image - Reduced Size */}
              <div className="aspect-square lg:aspect-[4/5] mb-4 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                <img 
                  src={currentImage} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (!imageError) {
                      e.target.src = '/placeholder-product.jpg';
                      setImageError(true);
                    }
                  }}
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-red-500' : 'border-gray-700'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="order-2 lg:order-1">
              {/* Title and Price */}
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2 leading-tight">
                  {product.title}
                </h1>
                
                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  {product.badges?.map((badge, index) => (
                    <span key={index} className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-red-400">₹{product.price}</span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-gray-500 line-through">₹{product.compareAtPrice}</span>
                  )}
                </div>
                
                {/* Scarcity Indicators */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6">
                  <div className="flex items-center gap-1">
                    <Package size={16} className="text-red-400" />
                    <span>{scarcity.stock} left in stock</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-yellow-400" />
                    <span>{scarcity.viewing} people viewing</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-green-400" />
                    <span>{scarcity.sold} sold today</span>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 border rounded-lg transition-all ${
                        selectedSize === size
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="bg-red-600 hover:bg-red-500 text-white py-4 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors border border-gray-600"
                >
                  Buy Now
                </button>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Trust Elements */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-green-400" />
                  <span>Free shipping over ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-blue-400" />
                  <span>7-day returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} className="text-yellow-400" />
                  <span>Exchange available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-purple-400" />
                  <span>Premium quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Recommendations */}
        <PremiumRecommendations 
          products={relatedProducts} 
          currentProductId={product?.id}
        />
      </main>

      <Footer />
      <CartSidebar isOpen={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} />
    </div>
  );
};

export default ProductDetail;
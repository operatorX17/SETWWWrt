import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useFilteredProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import { initiateUPIPayment } from '../lib/upi';
import { sendOrderToWhatsApp } from '../lib/wa';
import { ShoppingCart, ArrowLeft, Heart, Share, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PremiumRecommendations from '../components/PremiumRecommendations';
import SizeChips from '../components/SizeChips';
import Scarcity from '../components/Scarcity';
import TrustChips from '../components/TrustChips';
import CartSidebar from '../components/CartSidebar';

const ProductDetail = () => {
  const { id, handle } = useParams();
  const navigate = useNavigate();
  
  const productIdentifier = id || handle;
  const { product, loading: productLoading } = useProduct(productIdentifier);
  const { addToCart, loading: cartLoading } = useCart();
  
  // Related products based on category and badges
  const { products: relatedProducts } = useFilteredProducts(
    (p) => p.category === product?.category && p.id !== product?.id
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

  // Enhanced image handling with fallbacks
  const getProductImages = () => {
    if (!product) return [];
    
    let images = [];
    
    // Handle different image structures
    if (product.images && Array.isArray(product.images)) {
      images = product.images;
    } else if (product.images && typeof product.images === 'object') {
      // Handle {front: '', back: ''} structure
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
    
    return images.filter(Boolean); // Remove null/undefined
  };

  const productImages = getProductImages();
  const currentImage = productImages[selectedImage] || productImages[0] || '/placeholder-product.jpg';

  const mockStock = {
    'XS': 5, 'S': 12, 'M': 18, 'L': 22, 'XL': 9, 'XXL': 4
  };

  const calculateTotal = () => {
    let total = product?.price || 0;
    bundleItems.forEach(item => {
      if (item.selected) total += item.price;
    });
    return total;
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart({
        id: product.id,
        title: product.title || product.name,
        price: product.price,
        size: selectedSize,
        image: currentImage,
        quantity: 1
      });
      setCartSidebarOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-bold uppercase tracking-wider">Loading Product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white">{product.title || product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-gray-900 overflow-hidden rounded-lg">
              <img
                src={currentImage}
                alt={product.title || product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              {imageError && (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="text-gray-400">OG Product</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-900 overflow-hidden border-2 rounded transition-colors ${
                      selectedImage === index 
                        ? 'border-red-500' 
                        : 'border-gray-700 hover:border-red-500'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Product Title & Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-wider mb-4">
                {product.title || product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price) && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.compare_at_price}
                  </span>
                )}
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.badges?.map((badge, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-1 text-xs font-black tracking-wider uppercase rounded ${
                      badge.includes('VAULT') ? 'bg-yellow-500 text-black' :
                      badge.includes('REBEL') ? 'bg-red-500 text-white' :
                      badge.includes('BEST') ? 'bg-green-500 text-white' :
                      badge.includes('PREMIUM') ? 'bg-purple-500 text-white' :
                      'bg-gray-700 text-white'
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed">
                  {product.description || `${product.concept || 'Premium'} design from the OG collection. ${product.scene_code ? `Featured in ${product.scene_code}.` : ''} Crafted for the ultimate fan experience.`}
                </p>
                {product.concept && (
                  <p className="text-sm text-red-400 mt-2">
                    Concept: {product.concept} {product.scene_code && `• ${product.scene_code}`}
                  </p>
                )}
                {product.colorway && (
                  <p className="text-sm text-gray-400 mt-1">
                    Colorway: {product.colorway}
                  </p>
                )}
              </div>
            </div>

            {/* Scarcity Indicators */}
            <Scarcity 
              stock={mockStock}
              limited={product.badges?.includes('LIMITED')}
              dropEndTime={product.drop_end}
            />

            {/* Size Selection */}
            <SizeChips
              sizes={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              stock={mockStock}
            />

            {/* Trust Elements */}
            <TrustChips />

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg uppercase tracking-wider"
              >
                <ShoppingCart size={24} />
                {cartLoading ? 'Adding...' : `Add to Cart • ₹${product.price}`}
              </button>
              
              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 border border-gray-600 hover:border-red-500 text-white py-3 px-6 rounded-lg transition-colors">
                  <Heart size={20} />
                  Wishlist
                </button>
                <button className="flex items-center justify-center gap-2 border border-gray-600 hover:border-red-500 text-white py-3 px-6 rounded-lg transition-colors">
                  <Share size={20} />
                  Share
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-700 pt-8">
              <h3 className="text-lg font-bold mb-4">Product Details</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span>Premium Cotton Blend</span>
                </div>
                <div className="flex justify-between">
                  <span>GSM:</span>
                  <span>240-260 GSM</span>
                </div>
                <div className="flex justify-between">
                  <span>Fit:</span>
                  <span>Regular/Oversized</span>
                </div>
                <div className="flex justify-between">
                  <span>Care:</span>
                  <span>Machine Wash Cold</span>
                </div>
                {product.vendor && (
                  <div className="flex justify-between">
                    <span>Brand:</span>
                    <span>{product.vendor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping & Returns */}
            <div className="border-t border-gray-700 pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-green-400" />
                  <span>Free shipping over ₹1999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-blue-400" />
                  <span>7-day return policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} className="text-yellow-400" />
                  <span>Exchange available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-wider mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  prioritizeBackImages={true}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
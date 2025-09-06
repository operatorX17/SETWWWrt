import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useFilteredProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import { initiateUPIPayment } from '../lib/upi';
import { sendOrderToWhatsApp } from '../lib/wa';
import { ShoppingCart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SizeChips from '../components/SizeChips';
import Scarcity from '../components/Scarcity';
import TrustChips from '../components/TrustChips';
import CartSidebar from '../components/CartSidebar';

const ProductDetail = () => {
  const { id, handle } = useParams(); // Handle both /product/:id and /products/:handle
  const navigate = useNavigate();
  
  // Use ID or handle to find product
  const productIdentifier = id || handle;
  const { product, loading: productLoading } = useProduct(productIdentifier);
  const { addToCart, loading: cartLoading } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [bundleItems, setBundleItems] = useState([]);
  const [codEnabled, setCodEnabled] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize('M'); // Most fans pick M
      // Initialize bundle items if product has bundles
      if (product.bundle) {
        setBundleItems(product.bundle.map(item => ({ ...item, selected: false })));
      }
    }
  }, [product]);

  // Mock stock data for size chips
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

  const generateOrderId = () => {
    return `OG${Date.now().toString().slice(-6)}`;
  };

  const handleUPIPayment = () => {
    const orderId = generateOrderId();
    const total = calculateTotal();
    
    const items = [
      {
        title: product.name,
        size: selectedSize,
        quantity: 1,
        price: product.price
      },
      ...bundleItems.filter(item => item.selected).map(item => ({
        title: item.id,
        size: 'Default',
        quantity: 1,
        price: item.price
      }))
    ];

    initiateUPIPayment({
      amount: total,
      orderId,
      items,
      customerInfo: { name: 'Customer' }, // In real app, get from form
      upiId: "ogarmory@paytm",
      merchantName: "OG Armory"
    });
  };

  const handleWhatsAppOrder = () => {
    const orderId = generateOrderId();
    const total = calculateTotal();
    
    const items = [
      {
        title: product.name,
        size: selectedSize,
        quantity: 1,
        price: product.price
      },
      ...bundleItems.filter(item => item.selected).map(item => ({
        title: item.id,
        size: 'Default',
        quantity: 1,
        price: item.price
      }))
    ];

    // In real app, this would open a form to collect customer details
    // For now, we'll use placeholder data
    sendOrderToWhatsApp({
      items,
      total,
      customerInfo: {
        name: 'Customer Name',
        phone: '+919876543210',
        address: 'Customer Address'
      },
      orderId,
      paymentMethod: codEnabled ? 'COD' : 'UPI'
    });
  };

  const handleAddToArsenal = async () => {
    if (!product) return;
    
    const selectedVariant = {
      size: selectedSize,
      id: `${product.id}-${selectedSize}`
    };
    
    const result = await addToCart(product, selectedVariant, 1);
    
    if (result && result.success) {
      setCartSidebarOpen(true);
    } else {
      setCartSidebarOpen(true);
    }
  };

  // Get related products
  const { products: allProducts } = useFilteredProducts('all', null);
  const relatedProducts = allProducts.filter(p => 
    p.category === product?.category && p.id !== product?.id
  ).slice(0, 4);

  if (productLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-bold uppercase tracking-wider">Loading Arsenal...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">Product Not Found</h2>
            <button 
              onClick={() => navigate('/shop')} 
              className="text-yellow-400 hover:text-white underline uppercase tracking-wider"
            >
              Return to Armory
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link to="/shop" className="hover:text-white transition-colors uppercase tracking-wider">
            ARMORY
          </Link>
          <span>/</span>
          <Link 
            to={`/shop?category=${product.category.toLowerCase()}`} 
            className="hover:text-white transition-colors uppercase tracking-wider"
          >
            {product.category.toUpperCase()}
          </Link>
          <span>/</span>
          <span className="text-white uppercase tracking-wider">{product.name?.toUpperCase()}</span>
        </nav>

        {/* Main Product Layout - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images - Shows FIRST on mobile */}
          <div className="order-1 space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-gray-900 overflow-hidden">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery - Show all 7 images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 7).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-900 overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-red-500' 
                        : 'border-gray-700 hover:border-red-500'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Shows SECOND on mobile */}
          <div className="order-2 space-y-8">
            {/* Product Title & Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-wider mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {/* Badges - Consistent Styling */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.badges?.includes('VAULT') && (
                  <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                    VAULT
                  </span>
                )}
                {product.badges?.includes('LIMITED') && (
                  <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-red-500 text-white">
                    LIMITED
                  </span>
                )}
                {product.badges?.includes('REBEL DROP') && (
                  <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-black text-red-500 border border-red-500">
                    REBEL
                  </span>
                )}
                {(product.badges?.includes('PREMIUM COLLECTION') || product.badges?.includes('PREMIUM')) && (
                  <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gray-800 text-yellow-400">
                    PREMIUM
                  </span>
                )}
                {product.badges?.includes('NEW') && (
                  <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-blue-600 text-white">
                    NEW
                  </span>
                )}
                {product.badges?.includes('FAN ARSENAL') && (
                  <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-purple-600 text-white">
                    FAN ARSENAL
                  </span>
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
              onSizeSelect={setSelectedSize}
              stock={mockStock}
              mostPopular="L"
            />

            {/* Bundle Add-ons */}
            {bundleItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-wider">Complete the Arsenal</h3>
                <div className="space-y-3">
                  {bundleItems.map((item, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) => {
                          const updated = [...bundleItems];
                          updated[index].selected = e.target.checked;
                          setBundleItems(updated);
                        }}
                        className="w-4 h-4 text-red-500 bg-black border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="flex-1">{item.id}</span>
                      <span className="font-bold">{formatPrice(item.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Indicators */}
            <TrustChips />

            {/* COD Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="cod-toggle"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="w-4 h-4 text-[var(--color-red)] bg-black border-gray-600 rounded focus:ring-[var(--color-red)] focus:ring-2"
              />
              <label htmlFor="cod-toggle" className="text-sm font-medium">
                Cash on Delivery (COD)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Total */}
              <div className="text-right">
                <span className="text-2xl font-bold">
                  Total: {formatPrice(calculateTotal())}
                </span>
              </div>

              {/* Primary Actions */}
              <div className="grid grid-cols-1 gap-4">
                {!codEnabled && (
                  <button
                    onClick={handleUPIPayment}
                    className="w-full bg-[var(--color-red)] text-white py-4 px-6 font-black uppercase tracking-wider hover:bg-opacity-90 transition-all hover:shadow-[0_0_20px_rgba(193,18,31,0.6)]"
                  >
                    Pay by Any UPI App
                  </button>
                )}
                
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-600 text-white py-4 px-6 font-black uppercase tracking-wider hover:bg-green-700 transition-all"
                >
                  Buy on WhatsApp
                </button>
                
                <button
                  onClick={handleAddToArsenal}
                  disabled={cartLoading}
                  className="w-full border-2 border-[var(--color-red)] text-[var(--color-red)] py-4 px-6 font-black uppercase tracking-wider hover:bg-[var(--color-red)] hover:text-white transition-all"
                >
                  {cartLoading ? 'Adding...' : 'ADD TO ARSENAL'}
                </button>
              </div>
            </div>

            {/* Product Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                {product.description || 'Premium OG merchandise for true fans. Crafted with precision and designed for warriors. Every product is a weapon. Every fan is a soldier.'}
              </p>
            </div>
          </div>
        </div>

        {/* More from the Arsenal - Matching Homepage Rail Design */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-black text-white mt-16">
            <div className="max-w-7xl mx-auto px-6">
              {/* Rail Header */}
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-wider font-headline mb-4">
                    MORE FROM THE ARSENAL
                  </h2>
                  <p className="text-gray-300 text-lg mb-4">Gear up with more rebel essentials</p>
                  <div className="w-20 h-1 bg-red-500"></div>
                </div>
                <Link 
                  to="/shop"
                  className="group flex items-center gap-2 text-yellow-400 hover:text-white transition-colors"
                >
                  <span className="text-lg font-bold uppercase tracking-wider">View All</span>
                  <div className="w-8 h-8 border-2 border-yellow-400 group-hover:border-white rounded-full flex items-center justify-center transition-colors">
                    <span className="text-sm">→</span>
                  </div>
                </Link>
              </div>

              {/* Products Grid - Matching Rail Design */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                 {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                   <div key={relatedProduct.id} className="group cursor-pointer" onClick={() => navigate(`/product/${relatedProduct.id}`)}>
                     {/* Product Image with Badges */}
                     <div className="relative mb-4 overflow-hidden">
                       <div className="aspect-[3/4] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
                         <img 
                           src={relatedProduct.images?.[0] || '/placeholder-product.jpg'} 
                           alt={relatedProduct.name}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         />
                         
                         {/* Badges - TOP LEFT */}
                         <div className="absolute top-3 left-3 flex flex-col gap-2">
                           {relatedProduct.badges?.includes('VAULT') && (
                             <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                               VAULT
                             </span>
                           )}
                           {relatedProduct.badges?.includes('LIMITED') && (
                             <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-red-500 text-white">
                               LIMITED
                             </span>
                           )}
                           {relatedProduct.badges?.includes('REBEL DROP') && (
                             <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-black text-red-500 border border-red-500">
                               REBEL
                             </span>
                           )}
                           {relatedProduct.badges?.includes('PREMIUM') && (
                             <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gray-800 text-yellow-400">
                               PREMIUM
                             </span>
                           )}
                         </div>

                         {/* Hover Overlay */}
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                           <div className="text-white text-center">
                             <div className="text-sm font-medium mb-1">Quick View</div>
                             <div className="text-xs opacity-75">Tap to explore</div>
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Product Info - BELOW IMAGE */}
                     <div className="space-y-3">
                       {/* Product Title */}
                       <h3 className="text-white font-bold text-lg leading-tight group-hover:text-red-400 transition-colors">
                         {relatedProduct.name}
                       </h3>

                       {/* Description - Shortened */}
                       <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                         {relatedProduct.description ? 
                           (relatedProduct.description.length > 60 ? 
                             relatedProduct.description.substring(0, 60) + '...' : 
                             relatedProduct.description
                           ) : 
                           'Built for rebels.'
                         }
                       </p>

                       {/* Price */}
                       <div className="flex items-center space-x-2">
                         <span className="text-red-400 font-bold text-xl">
                           ₹{relatedProduct.price?.toLocaleString()}
                         </span>
                         {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                           <span className="text-gray-500 line-through text-sm">
                             ₹{relatedProduct.originalPrice?.toLocaleString()}
                           </span>
                         )}
                       </div>

                       {/* Add to Arsenal Button - Responsive */}
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           addToCart(relatedProduct, { size: 'M', color: relatedProduct.colors?.[0] || 'Default' });
                         }}
                         className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[48px] touch-manipulation"
                       >
                         <ShoppingCart size={16} className="flex-shrink-0" />
                         <span className="truncate">ADD TO ARSENAL</span>
                       </button>

                       {/* Telugu Text */}
                       <div className="text-center">
                         <span className="text-yellow-400 text-xs">
                           🏹 ఒక్కొక్కటి ఒక ఆయుధం 🏹
                         </span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={cartSidebarOpen} 
        onClose={() => setCartSidebarOpen(false)} 
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;
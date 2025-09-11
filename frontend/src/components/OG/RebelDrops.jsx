import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ProductCard';

const RebelDrops = () => {
  const { t } = useI18n();
  const { products } = useProducts();

  // Get rebel drop products (NEW items) - Enhanced filtering for OG products
  const rebelProducts = products.filter(product => 
    product.badges && (
      product.badges?.includes('NEW') || 
      product.badges?.includes('REBEL DROP') ||
      product.badges?.includes('REBEL') ||
      product.badges?.includes('DROP') ||
      product.badges?.includes('FAN ARSENAL')
    )
  );

  // Removed debug logging to prevent memory leaks

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Same layout as AXM NewArrivals */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold font-headline uppercase tracking-wider">
            Rebel Drops
          </h2>
          <Link 
            to="/shop"
            className="flex items-center space-x-2 text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors group"
          >
            <span className="text-sm uppercase tracking-wider font-medium">Arm Up</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid - Exact same layout as AXM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rebelProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="group">
              <ProductCard product={product} />
              
              {/* Scarcity copy under product - OG specific */}
              <div className="mt-3 text-sm text-[var(--color-text-muted)]">
                <p>Only {Math.floor(Math.random() * 12) + 3} left — vaulting soon.</p>
              </div>
            </div>
          ))}
        </div>

        {/* Show all products if no rebel products found - Debug mode */}
        {rebelProducts.length === 0 && products.length > 0 && (
          <div>
            <div className="text-center py-8 mb-8">
              <h3 className="text-xl font-bold mb-2">Loading Arsenal...</h3>
              <p className="text-[var(--color-text-muted)]">
                Found {products.length} products in the armory
              </p>
            </div>
            
            {/* Show first 4 products regardless of badges as fallback */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="group">
                  <ProductCard product={product} />
                  <div className="mt-3 text-sm text-[var(--color-text-muted)]">
                    <p>Ready for deployment.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Absolute fallback */}
        {rebelProducts.length === 0 && products.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">Arsenal Loading...</h3>
            <p className="text-[var(--color-text-muted)] mb-8">
              Deploying the rebellion arsenal. Stand by...
            </p>
            <Link
              to="/collections"
              className="text-[var(--color-red)] hover:underline font-medium"
            >
              Explore Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RebelDrops;
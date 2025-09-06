import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ProductCard';

const FanArsenal = () => {
  const { t } = useI18n();
  const { products } = useProducts();

  // Get fan arsenal products (best sellers)
  const fanArsenal = products.filter(product => 
    product.badges.includes('BEST SELLER')
  );

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 'Vault':
        return 'bg-[var(--color-gold)] text-black';
      case 'Captain':
        return 'bg-[var(--color-red)] text-white';
      case 'Rebel':
        return 'bg-white text-black';
      default:
        return 'bg-[var(--color-steel)] text-white';
    }
  };

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Images - Same layout as AXM BestSellers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="relative group overflow-hidden">
            <img
              src="https://framerusercontent.com/images/QnjPU1zOWtNjPZtBPpgHzKv8E.jpg"
              alt="Fan Arsenal Hero 1"
              className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Red keyline on hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-red)] transition-colors"></div>
          </div>
          <div className="relative group overflow-hidden">
            <img
              src="https://framerusercontent.com/images/yiwGqGFXVOLSppnPlJ7n37p2ezI.jpg"
              alt="Fan Arsenal Hero 2"
              className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Red keyline on hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-red)] transition-colors"></div>
          </div>
        </div>

        {/* Section Header with OG copy */}
        <div className="text-center mb-8">
          <p className="text-[var(--color-text-muted)] text-lg mb-6">
            Every soldier needs their weapon. Here's what the OG Tribe wields most.
          </p>
        </div>

        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold font-headline uppercase tracking-wider">
            Fan Arsenal
          </h2>
          <Link 
            to="/shop?filter=best-sellers"
            className="flex items-center space-x-2 text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors group"
          >
            <span className="text-sm uppercase tracking-wider font-medium">Equip Now</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid - Same layout as AXM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {fanArsenal.slice(0, 4).map((product) => (
            <div key={product.id} className="group">
              <ProductCard product={product} />
              
              {/* Rank badge for each product */}
              <div className="mt-3 flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${getRankBadgeColor(product.rank || 'Common')}`}>
                  {product.rank || 'Common'}
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">
                  #{Math.floor(Math.random() * 99) + 1} in arsenal
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* No products fallback */}
        {fanArsenal.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">Arsenal loading...</h3>
            <p className="text-[var(--color-text-muted)] mb-8">
              The tribe is building their arsenal. Check back soon.
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

export default FanArsenal;
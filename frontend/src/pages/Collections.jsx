import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Collections = () => {
  const { t } = useI18n();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple static collections that work
    const staticCollections = [
      {
        id: 1,
        handle: 'rebellion-core',
        title: 'Rebellion Core',
        description: 'Essential gear for every rebel soldier.',
        product_count: 13,
        image: 'https://framerusercontent.com/images/8gqTSINX7hptd4ZpZhFcjP9JvhE.jpg'
      },
      {
        id: 2,
        handle: 'under-999',
        title: 'Under ₹999',
        description: 'Premium gear accessible to every rebel.',
        product_count: 18,
        image: 'https://framerusercontent.com/images/Bqu1YbtLNP6KpNMpw9Wnp1oQOJA.jpg'
      },
      {
        id: 3,
        handle: 'hoodies',
        title: 'Beast Hoodies',
        description: 'Premium hoodies for elite warriors.',
        product_count: 21,
        image: 'https://framerusercontent.com/images/aHmupIkpNbiTWcrio0jHVxTg4OU.png'
      },
      {
        id: 4,
        handle: 'accessories',
        title: 'Arsenal Gear',
        description: 'Essential accessories and gear.',
        product_count: 7,
        image: 'https://framerusercontent.com/images/QnjPU1zOWtNjPZtBPpgHzKv8E.jpg'
      }
    ];
    
    setCollections(staticCollections);
    setLoading(false);
  }, []);

  const getRankBadgeColor = (collection) => {
    if (collection.handle === 'under-999') {
      return 'bg-green-600 text-white';
    } else if (collection.handle === 'multi-color') {
      return 'bg-purple-600 text-white';
    } else if (collection.handle === 'arsenal-gear') {
      return 'bg-[var(--color-gold)] text-black';
    } else {
      return 'bg-[var(--color-red)] text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[var(--color-red)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-bold uppercase tracking-wider">Loading Collections...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-6xl lg:text-8xl font-bold uppercase tracking-wider leading-none mb-6">
            {t('navigation.collections')}
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-3xl">
            Curated drops for different ranks. Find your tribe, find your gear.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.handle}
              to={`/shop?filter=${collection.handle}`}
              className="group relative overflow-hidden bg-[var(--color-steel)] hover:bg-opacity-80 transition-all duration-300"
            >
              {/* Collection Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={collection.image || 'https://framerusercontent.com/images/8gqTSINX7hptd4ZpZhFcjP9JvhE.jpg'}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>

              {/* Collection Info */}
              <div className="p-6">
                {/* Collection Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${getRankBadgeColor(collection)}`}>
                    {collection.handle.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--color-red)] transition-colors">
                  {collection.title}
                </h2>

                {/* Description */}
                <p className="text-[var(--color-text-muted)] mb-4 leading-relaxed">
                  {collection.description}
                </p>

                {/* Product Count & Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {collection.product_count} products
                  </span>
                  <ArrowRight 
                    size={20} 
                    className="text-[var(--color-red)] group-hover:translate-x-2 transition-transform" 
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA with OG Footer Line */}
        <div className="mt-20 text-center border-t border-[var(--color-steel)] pt-16">
          <h2 className="text-3xl font-bold mb-6">Can't Find Your Rank?</h2>
          <p className="text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto">
            Every purchase builds your tribe status. Start your journey and unlock exclusive collections.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-[var(--color-red)] text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-opacity-90 transition-colors mb-8"
          >
            <span>Start Shopping</span>
            <ArrowRight size={20} />
          </Link>
          
          {/* OG Footer Line */}
          <div className="text-center">
            <p className="text-[var(--color-text-muted)] text-lg">
              Every product is a weapon. Every fan is a soldier
            </p>
            <p className="text-[var(--color-red)] font-bold mt-2 tracking-wide">
              (ప్రతి అభిమాని ఒక సైనికుడు)
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Collections;
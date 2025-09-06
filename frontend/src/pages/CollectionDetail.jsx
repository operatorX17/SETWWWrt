import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useProducts } from '../hooks/useProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const CollectionDetail = () => {
  const { handle } = useParams();
  const { t } = useI18n();
  const { products } = useProducts();
  const [sortBy, setSortBy] = useState('featured');

  // Mock collection data - in production this would come from Shopify with metafields
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    // Mock collection data
    const mockCollections = {
      'rebellion-core': {
        title: 'Rebellion Core',
        description: 'Essential pieces for every rebel. Built for daily battles and street credibility.',
        image: 'https://framerusercontent.com/images/8gqTSINX7hptd4ZpZhFcjP9JvhE.jpg',
        rank: 'Common',
        heroCopy: 'Built for daily battles. Tested by rebels.',
        pinOrder: ['freedom-graphic-tee', 'essential-tee']
      },
      'vault-exclusive': {
        title: 'Vault Exclusive',
        description: 'Limited drops for the dedicated. Collectors only. Not for the weak.',
        image: 'https://framerusercontent.com/images/Bqu1YbtLNP6KpNMpw9Wnp1oQOJA.jpg',
        rank: 'Vault',
        heroCopy: 'Exclusive access required. Prove your dedication.',
        pinOrder: [],
        isLocked: true
      },
      'captain-series': {
        title: 'Captain Series',
        description: 'Lead from the front. Premium builds for tribe leaders who command respect.',
        image: 'https://framerusercontent.com/images/aHmupIkpNbiTWcrio0jHVxTg4OU.png',
        rank: 'Captain',
        heroCopy: 'Leadership demands the best gear.',
        pinOrder: []
      },
      'first-day-first-show': {
        title: 'First Day First Show',
        description: 'Theater-grade merchandise for opening day energy. Maximum impact guaranteed.',
        image: 'https://framerusercontent.com/images/QnjPU1zOWtNjPZtBPpgHzKv8E.jpg',
        rank: 'Rebel',
        heroCopy: 'Theater-grade gear for maximum impact.',
        pinOrder: []
      }
    };

    setCollection(mockCollections[handle]);
  }, [handle]);

  // Filter products by collection (mock logic)
  const collectionProducts = products.filter(product => {
    // Mock filtering logic - in production this would be based on Shopify collection membership
    if (handle === 'rebellion-core') {
      return product.badges.includes('BEST SELLER') || product.name.toLowerCase().includes('essential');
    }
    if (handle === 'vault-exclusive') {
      return product.rank === 'Vault' || product.badges.includes('LIMITED');
    }
    if (handle === 'captain-series') {
      return product.price > 150;
    }
    if (handle === 'first-day-first-show') {
      return product.badges.includes('NEW');
    }
    return false;
  });

  // Sort products
  const sortedProducts = [...collectionProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      case 'featured':
      default:
        // Respect pin order from metafields
        const aPinIndex = collection?.pinOrder?.indexOf(a.handle) || -1;
        const bPinIndex = collection?.pinOrder?.indexOf(b.handle) || -1;
        
        if (aPinIndex !== -1 && bPinIndex !== -1) {
          return aPinIndex - bPinIndex;
        }
        if (aPinIndex !== -1) return -1;
        if (bPinIndex !== -1) return 1;
        
        return 0;
    }
  });

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 'Vault':
        return 'bg-[var(--color-gold)] text-black';
      case 'Captain':
        return 'bg-[var(--color-red)] text-white';
      case 'Rebel':
        return 'bg-white text-black';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (!collection) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Collection not found</h2>
            <Link to="/collections" className="text-[var(--color-red)] hover:underline">
              Back to Collections
            </Link>
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
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)] mb-8">
          <Link to="/collections" className="hover:text-white transition-colors uppercase tracking-wider">
            Collections
          </Link>
          <span>/</span>
          <span className="text-white uppercase tracking-wider">{collection.title}</span>
        </nav>

        {/* Collection Hero */}
        <div className="relative mb-16">
          <div className="aspect-[21/9] overflow-hidden bg-[var(--color-steel)]">
            <img
              src={collection.image}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            
            {/* Lock overlay for Vault */}
            {collection.isLocked && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-6">🔒</div>
                  <h2 className="text-4xl font-bold text-[var(--color-gold)] mb-4">
                    {t('home.vault.title')}
                  </h2>
                  <p className="text-xl text-[var(--color-gold)] font-bold uppercase tracking-wider">
                    {t('home.vault.locked_message')}
                  </p>
                  <p className="text-[var(--color-text-muted)] mt-4">
                    {t('home.vault.unlock_hint')}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Collection Info Overlay */}
          {!collection.isLocked && (
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center mb-4">
                <span className={`px-4 py-2 text-sm font-bold uppercase tracking-wider ${getRankBadgeColor(collection.rank)}`}>
                  {t(`ranks.${collection.rank.toLowerCase()}`)}
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-none mb-4">
                {collection.title}
              </h1>
              
              {collection.heroCopy && (
                <p className="text-xl text-[var(--color-red)] font-bold uppercase tracking-wider">
                  {collection.heroCopy}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Collection Description */}
        {!collection.isLocked && (
          <div className="mb-12">
            <p className="text-xl text-[var(--color-text-muted)] leading-relaxed max-w-4xl">
              {collection.description}
            </p>
          </div>
        )}

        {/* Products Section */}
        {!collection.isLocked && (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">
                  {sortedProducts.length} Products
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-[var(--color-text-muted)]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[var(--color-bg)] border border-gray-600 text-white px-4 py-2 text-sm focus:outline-none focus:border-white"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Products */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold mb-4">No products available</h3>
                <p className="text-[var(--color-text-muted)] mb-8">
                  This collection is being prepared. Check back soon.
                </p>
                <Link
                  to="/collections"
                  className="text-[var(--color-red)] hover:underline"
                >
                  Explore Other Collections
                </Link>
              </div>
            )}
          </>
        )}

        {/* Back to Collections */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <Link
            to="/collections"
            className="inline-flex items-center space-x-2 text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="uppercase tracking-wider">Back to Collections</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollectionDetail;
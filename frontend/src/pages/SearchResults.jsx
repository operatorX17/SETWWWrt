import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearch, useSearchFilters } from '../hooks/useSearch';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    searchResults, 
    isSearching, 
    search,
    setSearchQuery 
  } = useSearch();
  
  const {
    filters,
    filteredResults,
    updateFilter,
    resetFilters
  } = useSearchFilters(searchResults);

  // Perform search when component mounts or query changes
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      search(query);
    }
  }, [query]); // Remove search and setSearchQuery from dependencies to prevent infinite loop

  // Get available categories from search results
  const availableCategories = [...new Set(searchResults.map(p => p.category))];
  const availableBadges = [...new Set(searchResults.flatMap(p => p.badges))];

  const handleFilterChange = (key, value) => {
    updateFilter(key, value);
  };

  const toggleBadge = (badge) => {
    const currentBadges = filters.badges;
    const newBadges = currentBadges.includes(badge)
      ? currentBadges.filter(b => b !== badge)
      : [...currentBadges, badge];
    
    updateFilter('badges', newBadges);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Search size={24} className="text-gray-400" />
            <h1 className="text-3xl font-bold">
              Search Results
              {query && (
                <span className="text-gray-400 font-normal ml-2">
                  for "{query}"
                </span>
              )}
            </h1>
          </div>
          
          {/* Results Count */}
          <p className="text-gray-400">
            {isSearching ? (
              'Searching...'
            ) : (
              `${filteredResults.length} ${filteredResults.length === 1 ? 'result' : 'results'} found`
            )}
          </p>
        </div>

        {/* No Query State */}
        {!query && (
          <div className="text-center py-16">
            <Search size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-4">Start Your Search</h2>
            <p className="text-gray-400 mb-8">Enter a search term to find products, categories, or collections</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center space-x-2 text-white hover:text-gray-300 underline"
            >
              <span>Browse All Products</span>
            </Link>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
              >
                <SlidersHorizontal size={20} />
                <span className="text-sm uppercase tracking-wider">Filters</span>
                {(filters.category !== 'all' || filters.badges.length > 0) && (
                  <span className="bg-white text-black text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="bg-[var(--color-bg)] border border-gray-600 text-white px-4 py-2 text-sm focus:outline-none focus:border-white"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-gray-900 p-6 mb-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    Reset All
                  </button>
                </div>
                
                {/* Category Filter */}
                {availableCategories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-gray-300">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleFilterChange('category', 'all')}
                        className={`px-3 py-1 text-xs font-semibold tracking-wider uppercase border transition-colors ${
                          filters.category === 'all'
                            ? 'bg-white text-black border-white'
                            : 'border-gray-600 hover:border-white'
                        }`}
                      >
                        All
                      </button>
                      {availableCategories.map(category => (
                        <button
                          key={category}
                          onClick={() => handleFilterChange('category', category)}
                          className={`px-3 py-1 text-xs font-semibold tracking-wider uppercase border transition-colors ${
                            filters.category === category
                              ? 'bg-white text-black border-white'
                              : 'border-gray-600 hover:border-white'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Badge Filter */}
                {availableBadges.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-gray-300">Collection</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableBadges.map(badge => (
                        <button
                          key={badge}
                          onClick={() => toggleBadge(badge)}
                          className={`px-3 py-1 text-xs font-semibold tracking-wider uppercase border transition-colors ${
                            filters.badges.includes(badge)
                              ? 'bg-white text-black border-white'
                              : 'border-gray-600 hover:border-white'
                          }`}
                        >
                          {badge}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-300">Price Range</h4>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-400 min-w-max">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(filters.category !== 'all' || filters.badges.length > 0) && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-sm text-gray-400">Active filters:</span>
                
                {filters.category !== 'all' && (
                  <button
                    onClick={() => handleFilterChange('category', 'all')}
                    className="flex items-center space-x-2 bg-white text-black px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  >
                    <span>{filters.category}</span>
                    <X size={12} />
                  </button>
                )}
                
                {filters.badges.map(badge => (
                  <button
                    key={badge}
                    onClick={() => toggleBadge(badge)}
                    className="flex items-center space-x-2 bg-white text-black px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  >
                    <span>{badge}</span>
                    <X size={12} />
                  </button>
                ))}
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Searching products...</p>
              </div>
            )}

            {/* Search Results Grid */}
            {!isSearching && filteredResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isSearching && filteredResults.length === 0 && searchResults.length === 0 && (
              <div className="text-center py-16">
                <Search size={64} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-2xl font-bold mb-4">No results found</h3>
                <p className="text-gray-400 mb-8">
                  We couldn't find any products matching "{query}". Try adjusting your search terms.
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Suggestions:</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Check your spelling</li>
                    <li>• Try more general terms</li>
                    <li>• Browse our categories instead</li>
                  </ul>
                  <Link 
                    to="/shop" 
                    className="inline-flex items-center space-x-2 text-white hover:text-gray-300 underline mt-4"
                  >
                    <span>Browse All Products</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Filtered Out Results */}
            {!isSearching && filteredResults.length === 0 && searchResults.length > 0 && (
              <div className="text-center py-16">
                <SlidersHorizontal size={64} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-2xl font-bold mb-4">No results with current filters</h3>
                <p className="text-gray-400 mb-8">
                  Found {searchResults.length} results for "{query}", but none match your current filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-white text-black px-6 py-3 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
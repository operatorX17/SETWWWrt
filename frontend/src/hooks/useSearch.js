import { useState, useEffect, useMemo, useCallback } from 'react';
import { useProducts } from './useProducts';

// Custom hook for search functionality
export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { products } = useProducts();

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('axm-search-history');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.warn('Failed to load search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('axm-search-history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Search through products
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    
    return products.filter(product => {
      // Search in product name
      const nameMatch = product.name.toLowerCase().includes(query);
      
      // Search in category
      const categoryMatch = product.category.toLowerCase().includes(query);
      
      // Search in description
      const descriptionMatch = product.description?.toLowerCase().includes(query);
      
      // Search in materials
      const materialsMatch = product.materials?.toLowerCase().includes(query);
      
      // Search in badges
      const badgeMatch = product.badges.some(badge => 
        badge.toLowerCase().includes(query)
      );
      
      // Search in collection
      const collectionMatch = product.collection?.toLowerCase().includes(query);

      return nameMatch || categoryMatch || descriptionMatch || materialsMatch || badgeMatch || collectionMatch;
    });
  }, [products, searchQuery]);

  // Get search suggestions based on current query
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const suggestions = new Set();

    // Add product names that start with the query
    products.forEach(product => {
      const name = product.name.toLowerCase();
      if (name.startsWith(query)) {
        suggestions.add(product.name);
      }
    });

    // Add categories
    products.forEach(product => {
      const category = product.category.toLowerCase();
      if (category.startsWith(query)) {
        suggestions.add(product.category);
      }
    });

    // Add collections
    products.forEach(product => {
      if (product.collection) {
        const collection = product.collection.toLowerCase();
        if (collection.startsWith(query)) {
          suggestions.add(product.collection);
        }
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }, [products, searchQuery]);

  // Popular search terms based on product data
  const popularSearches = useMemo(() => {
    const searches = [
      'Freedom',
      'Essential',
      'Tops',
      'Bottoms',
      'Outerwear',
      'New',
      'Sale',
      'Best Seller'
    ];
    return searches;
  }, []);

  // Add to search history
  const addToHistory = useCallback((query) => {
    if (!query.trim()) return;
    
    const trimmedQuery = query.trim();
    setSearchHistory(prevHistory => {
      const newHistory = [
        trimmedQuery,
        ...prevHistory.filter(item => item !== trimmedQuery)
      ].slice(0, 10); // Keep only last 10 searches
      return newHistory;
    });
  }, []);

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // Perform search
  const search = useCallback((query) => {
    setIsSearching(true);
    setSearchQuery(query);
    addToHistory(query);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  }, [addToHistory]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    searchSuggestions,
    searchHistory,
    popularSearches,
    isSearching,
    search,
    clearSearch,
    clearHistory,
    setSearchQuery: useCallback((query) => setSearchQuery(query), []),
    addToHistory
  };
};

// Hook for search filters
export const useSearchFilters = (searchResults) => {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 500],
    badges: [],
    sortBy: 'relevance'
  });

  const filteredResults = useMemo(() => {
    let filtered = [...searchResults];

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Badge filter
    if (filters.badges.length > 0) {
      filtered = filtered.filter(product =>
        product.badges.some(badge => filters.badges.includes(badge))
      );
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [searchResults, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 500],
      badges: [],
      sortBy: 'relevance'
    });
  };

  return {
    filters,
    filteredResults,
    updateFilter,
    resetFilters
  };
};

export default useSearch;
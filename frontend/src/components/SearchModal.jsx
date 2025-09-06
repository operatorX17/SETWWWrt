import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { useTheme } from '../hooks/useTheme';

const SearchModal = ({ isOpen, onClose }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { isReducedMotion } = useTheme();
  
  const {
    searchSuggestions,
    searchHistory,
    popularSearches,
    search,
    clearHistory
  } = useSearch();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSearch = (query) => {
    if (!query.trim()) return;
    
    search(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputQuery);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleInputChange = (e) => {
    setInputQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-start justify-center pt-20">
      <div 
        className={`w-full max-w-2xl mx-4 bg-[var(--color-bg)] border border-gray-800 ${
          isReducedMotion ? '' : 'animate-fadeIn'
        }`}
      >
        {/* Search Header */}
        <div className="flex items-center p-6 border-b border-gray-800">
          <Search size={24} className="text-gray-400 mr-4" />
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Search products, categories, collections..."
              className="w-full bg-transparent text-xl placeholder-gray-400 focus:outline-none"
            />
          </form>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors ml-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* Search Suggestions */}
          {showSuggestions && inputQuery.length >= 2 && searchSuggestions.length > 0 && (
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Suggestions
              </h3>
              <div className="space-y-2">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-800 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <Search size={16} className="text-gray-400 mr-3" />
                      <span>{suggestion}</span>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {showSuggestions && !inputQuery && searchHistory.length > 0 && (
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Recent Searches
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-wider"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2">
                {searchHistory.slice(0, 5).map((historyItem, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(historyItem)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-800 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-3" />
                      <span>{historyItem}</span>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {showSuggestions && !inputQuery && (
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(term)}
                    className="flex items-center px-3 py-2 border border-gray-600 hover:border-gray-400 transition-colors text-sm"
                  >
                    <TrendingUp size={14} className="mr-2" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {showSuggestions && inputQuery.length >= 2 && searchSuggestions.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-gray-400">No suggestions found for "{inputQuery}"</p>
              <button
                onClick={handleSubmit}
                className="mt-4 flex items-center justify-center mx-auto px-4 py-2 border border-gray-600 hover:border-white transition-colors text-sm"
              >
                Search anyway
                <ArrowRight size={14} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
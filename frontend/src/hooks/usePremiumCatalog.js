import { useState, useEffect } from 'react';

// Custom hook for loading premium catalog data
export const usePremiumCatalog = () => {
  const [catalogData, setCatalogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPremiumCatalog = async () => {
      try {
        setLoading(true);
        const response = await fetch('/PREMIUM_CATALOG_REGENERATED.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load premium catalog: ${response.status}`);
        }
        
        const data = await response.json();
        setCatalogData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading premium catalog:', err);
        setError(err.message);
        setCatalogData(null);
      } finally {
        setLoading(false);
      }
    };

    loadPremiumCatalog();
  }, []);

  return {
    catalogData,
    heroSection: catalogData?.hero_section || null,
    bundleSuggestions: catalogData?.bundle_suggestions || [],
    products: catalogData?.products || [],
    metadata: catalogData?.metadata || null,
    loading,
    error
  };
};

// Hook specifically for hero section products
export const useHeroProducts = () => {
  const { heroSection, loading, error } = usePremiumCatalog();
  
  return {
    heroProducts: heroSection?.products || [],
    heroTitle: heroSection?.title || 'Featured Collection',
    heroSubtitle: heroSection?.subtitle || 'Premium designs that customers love',
    loading,
    error
  };
};

// Hook for bundle suggestions
export const useBundleSuggestions = () => {
  const { bundleSuggestions, loading, error } = usePremiumCatalog();
  
  return {
    bundles: bundleSuggestions,
    loading,
    error
  };
};
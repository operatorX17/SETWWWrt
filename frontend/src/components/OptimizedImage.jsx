import React, { useState, useCallback } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  fallback = 'https://via.placeholder.com/400x500?text=OG'
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallback);
  }, [fallback]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--color-red)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        decoding="async"
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-gray-500">
          <div className="text-6xl mb-2">🔥</div>
          <div className="text-sm">OG</div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
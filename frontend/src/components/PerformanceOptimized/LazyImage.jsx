import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = "", 
  aspectRatio = "4/5",
  priority = false,
  sizes = "100vw",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : null);
  const imgRef = useRef();
  const observerRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);
          observerRef.current?.disconnect();
        }
      },
      { 
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [src, priority, isInView]);

  // Generate srcset for different formats and sizes
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    
    // If it's a Framer CDN URL, optimize it
    if (baseSrc.includes('framerusercontent.com')) {
      const baseUrl = baseSrc.split('?')[0];
      return [
        `${baseUrl}?format=webp&quality=80&width=400 400w`,
        `${baseUrl}?format=webp&quality=80&width=800 800w`,
        `${baseUrl}?format=webp&quality=80&width=1200 1200w`,
        `${baseUrl}?format=webp&quality=80&width=1600 1600w`
      ].join(', ');
    }
    
    return baseSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-900 ${className}`}
      style={{ aspectRatio }}
      {...props}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}
      
      {/* Main image */}
      {currentSrc && (
        <img
          src={currentSrc}
          srcSet={generateSrcSet(currentSrc)}
          sizes={sizes}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default LazyImage;
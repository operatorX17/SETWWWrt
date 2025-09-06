import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

const PageTransition = ({ children }) => {
  const { isReducedMotion } = useTheme();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: isReducedMotion ? 'auto' : 'smooth' });
  }, [location.pathname, isReducedMotion]);

  // Simplified - no page flashing, just smooth content transitions with scroll-to-top
  return (
    <div className="min-h-screen">
      <div 
        className={`${
          isReducedMotion 
            ? '' 
            : 'transition-all duration-200 ease-out'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
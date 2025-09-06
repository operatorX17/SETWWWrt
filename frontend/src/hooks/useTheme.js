import { createContext, useContext, useEffect, useState } from 'react';
import { axiomTheme, ogTheme, generateCSSVars } from '../styles/tokens';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme] = useState('og'); // OG is permanent theme
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const theme = currentTheme === 'og' ? ogTheme : axiomTheme;
    const cssVars = generateCSSVars(theme);
    
    // Apply CSS variables to root
    Object.entries(cssVars).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    
    // Set data attribute for theme-specific selectors
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Store preference
    localStorage.setItem('theme-preference', currentTheme);
  }, [currentTheme]);

  // Theme preference loading removed - OG is permanent
  useEffect(() => {
    // OG theme is hardcoded - no need to load preferences
  }, []);

  // Theme switching removed - OG is permanent
  const switchTheme = () => {
    // Theme switching disabled - OG is the only theme
  };

  const toggleTheme = () => {
    // Theme switching disabled - OG is permanent
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      switchTheme,
      toggleTheme,
      isReducedMotion,
      theme: ogTheme // OG theme is permanent
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
import { createContext, useContext, useState, useEffect } from 'react';
import enContent from '../content/en.json';
import teContent from '../content/te.json';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    // Load saved locale or detect from browser
    const savedLocale = localStorage.getItem('og-locale');
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'te')) {
      return savedLocale;
    }
    
    // Detect Telugu from browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes('te') || browserLang.includes('telugu')) {
      return 'te';
    }
    
    return 'en'; // Default to English
  });

  const [content, setContent] = useState(enContent);

  useEffect(() => {
    // Update content when locale changes
    setContent(locale === 'te' ? teContent : enContent);
    
    // Save locale preference
    localStorage.setItem('og-locale', locale);
    
    // Update document language
    document.documentElement.lang = locale;
  }, [locale]);

  const toggleLocale = () => {
    setLocale(prev => prev === 'en' ? 'te' : 'en');
  };

  const switchLocale = (newLocale) => {
    if (newLocale === 'en' || newLocale === 'te') {
      setLocale(newLocale);
    }
  };

  // Helper function to get nested content with fallback
  const t = (key, params = {}) => {
    try {
      const keys = key.split('.');
      let value = content;
      
      for (const k of keys) {
        value = value[k];
        if (value === undefined) break;
      }
      
      if (value === undefined) {
        // Fallback to English if key not found in current locale
        const fallbackContent = enContent;
        let fallbackValue = fallbackContent;
        
        for (const k of keys) {
          fallbackValue = fallbackValue[k];
          if (fallbackValue === undefined) break;
        }
        
        value = fallbackValue || key; // Return key if not found anywhere
      }
      
      // Replace parameters in the string
      if (typeof value === 'string' && Object.keys(params).length > 0) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? params[paramKey] : match;
        });
      }
      
      return value;
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  };

  return (
    <I18nContext.Provider value={{
      locale,
      setLocale: switchLocale,
      toggleLocale,
      t,
      isEnglish: locale === 'en',
      isTelugu: locale === 'te'
    }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Utility function for formatting Indian numbers
export const formatIndianNumber = (number) => {
  return new Intl.NumberFormat('en-IN').format(number);
};

// Utility function for currency formatting
export const formatCurrency = (amount, currency = 'INR', locale = 'en') => {
  if (currency === 'INR') {
    return `₹${formatIndianNumber(Math.round(amount))}`;
  }
  
  return new Intl.NumberFormat(locale === 'te' ? 'te-IN' : 'en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper component for translations with parameters
export const T = ({ k, params, fallback }) => {
  const { t } = useI18n();
  return t(k, params) || fallback || k;
};

export default useI18n;
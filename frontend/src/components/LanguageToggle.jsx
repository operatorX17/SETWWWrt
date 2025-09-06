import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';

const LanguageToggle = ({ className = "" }) => {
  const { locale, toggleLocale, isReducedMotion } = useI18n();
  const { isReducedMotion: themeReducedMotion } = useTheme();
  
  const reducedMotion = isReducedMotion || themeReducedMotion;

  return (
    <button
      onClick={toggleLocale}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded 
        transition-all duration-[var(--transition-base)]
        hover:bg-[var(--color-panel)] focus:outline-none focus:ring-2 
        focus:ring-[var(--color-accent)] focus:ring-offset-2
        ${reducedMotion ? 'transition-none' : ''}
        ${className}
      `}
      title={`Switch to ${locale === 'en' ? 'Telugu' : 'English'}`}
    >
      <Globe size={16} />
      <span className="text-sm font-medium uppercase tracking-wider">
        {locale === 'en' ? 'TE' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;
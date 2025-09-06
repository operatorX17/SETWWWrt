import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = ({ className = "" }) => {
  const { currentTheme, toggleTheme, isReducedMotion } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-full transition-all duration-[var(--transition-base)]
        hover:bg-[var(--color-panel)] focus:outline-none focus:ring-2 
        focus:ring-[var(--color-accent)] focus:ring-offset-2
        ${isReducedMotion ? 'transition-none' : ''}
        ${className}
      `}
      title={`Switch to ${currentTheme === 'axiom' ? 'OG' : 'Axiom'} theme`}
    >
      <Palette 
        size={20} 
        className={`
          transition-colors duration-[var(--transition-base)]
          ${currentTheme === 'og' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}
          ${isReducedMotion ? 'transition-none' : ''}
        `}
      />
    </button>
  );
};

export default ThemeToggle;
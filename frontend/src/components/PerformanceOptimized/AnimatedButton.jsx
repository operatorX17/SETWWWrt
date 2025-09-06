import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = "",
  disabled = false,
  loading = false,
  onClick,
  ...props 
}) => {
  const { isReducedMotion } = useTheme();

  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold uppercase tracking-wider
    transition-all duration-[var(--transition-base)]
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
  `;

  const variantClasses = {
    primary: `
      bg-[var(--color-accent)] text-[var(--color-bg)]
      hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]
      focus:ring-[var(--color-accent)]
      active:scale-[0.98]
    `,
    secondary: `
      border border-[var(--color-accent)] text-[var(--color-accent)]
      hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]
      hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]
      focus:ring-[var(--color-accent)]
      active:scale-[0.98]
    `,
    ghost: `
      text-[var(--color-text)] hover:text-[var(--color-accent)]
      hover:bg-[var(--color-panel)]
      focus:ring-[var(--color-accent)]
      active:scale-[0.98]
    `
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm', 
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg'
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${isReducedMotion ? 'transition-none transform-none' : ''}
    ${className}
  `;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* Shine effect */}
      {!isReducedMotion && (
        <div className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
      )}
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

export default AnimatedButton;
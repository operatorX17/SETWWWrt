// Theme tokens for pixel-perfect Axiom clone with OG theme switching
export const axiomTheme = {
  colors: {
    bg: "#000000",
    panel: "#111111", 
    text: "#FFFFFF",
    textMuted: "#888888",
    textSecondary: "#CCCCCC",
    accent: "#FFFFFF",
    border: "#333333",
    error: "#FF4444",
    success: "#00FF88",
    warning: "#FFAA00",
    primary: "#FFFFFF",
    secondary: "#000000"
  },
  spacing: {
    xs: "0.25rem",    // 4px
    sm: "0.5rem",     // 8px
    md: "1rem",       // 16px
    lg: "1.5rem",     // 24px
    xl: "2rem",       // 32px
    "2xl": "3rem",    // 48px
    "3xl": "4rem",    // 64px
    "4xl": "6rem",    // 96px
    "5xl": "8rem",    // 128px
  },
  typography: {
    fontFamily: {
      base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    fontSize: {
      xs: "0.75rem",     // 12px
      sm: "0.875rem",    // 14px
      base: "1rem",      // 16px
      lg: "1.125rem",    // 18px
      xl: "1.25rem",     // 20px
      "2xl": "1.5rem",   // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
      "5xl": "3rem",     // 48px
      "6xl": "3.75rem",  // 60px
      "7xl": "4.5rem",   // 72px
      "8xl": "6rem",     // 96px
    },
    fontWeight: {
      light: "300",
      normal: "400", 
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900"
    },
    lineHeight: {
      tight: "1.1",
      normal: "1.5",
      relaxed: "1.6"
    },
    letterSpacing: {
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em"
    }
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",    // 2px
    base: "0.25rem",   // 4px
    md: "0.375rem",    // 6px
    lg: "0.5rem",      // 8px
    xl: "0.75rem",     // 12px
    "2xl": "1rem",     // 16px
    full: "9999px"
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
  },
  transitions: {
    fast: "120ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "180ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)"
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
};

export const ogTheme = {
  colors: {
    bg: "#0B0B0D",           // ogBlack - page bg, nav, footer
    panel: "#1A1A1A",        // ogSteel - cards, panels, PDP sections
    text: "#EAEAEA",         // ogText - primary text
    textMuted: "#888888",    // ogMuted - secondary text/labels
    textSecondary: "#BBBBBB",
    accent: "#C1121F",       // ogRed - CTAs, timers, badges, highlights
    border: "#333333",
    error: "#FF4444",
    success: "#00FF88", 
    warning: "#C99700",      // ogGold - vault/limited accents, hover halo
    primary: "#C1121F",      // ogRed
    secondary: "#C99700",    // ogGold
    gold: "#C99700",         // ogGold - explicit gold color
    red: "#C1121F",          // ogRed - explicit red color
    steel: "#1A1A1A"         // ogSteel - explicit steel color
  },
  typography: {
    ...axiomTheme.typography,
    fontFamily: {
      base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      headline: "'Inter Tight', 'Oswald', 'Inter', sans-serif", // Condensed/stencil vibe for headlines
    },
    fontWeight: {
      ...axiomTheme.typography.fontWeight,
      headline: "800", // Bold headlines for OG theme
    }
  },
  // Inherit spacing, shadows, etc. from axiom to maintain layout
  spacing: axiomTheme.spacing,
  borderRadius: axiomTheme.borderRadius,
  shadows: {
    ...axiomTheme.shadows,
    redGlow: "0 0 20px rgba(193, 18, 31, 0.3)",
    goldGlow: "0 0 20px rgba(201, 151, 0, 0.3)",
  },
  transitions: {
    ...axiomTheme.transitions,
    flash: "150ms cubic-bezier(0.4, 0, 0.2, 1)", // Route transitions
  }
};

// CSS custom properties generator
export const generateCSSVars = (theme) => {
  const cssVars = {};
  
  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    cssVars[`--color-${key}`] = value;
  });
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });
  
  // Typography
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value;
  });
  
  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    cssVars[`--font-weight-${key}`] = value;
  });
  
  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });
  
  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });
  
  // Transitions
  Object.entries(theme.transitions).forEach(([key, value]) => {
    cssVars[`--transition-${key}`] = value;
  });
  
  return cssVars;
};
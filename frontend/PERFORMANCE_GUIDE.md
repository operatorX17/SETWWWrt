# AXM Clone - Performance & Pixel-Perfect Guide

## 🎯 Performance Mandates (MILLIONS OF USERS)

### Core Web Vitals Targets (Mobile)
- **LCP**: < 2.3s (Largest Contentful Paint)
- **CLS**: < 0.05 (Cumulative Layout Shift)  
- **TTI**: < 3.0s (Time to Interactive)
- **FCP**: < 1.8s (First Contentful Paint)
- **TTFB**: < 600ms (Time to First Byte)

### Image Pipeline Optimization
```jsx
// ✅ Optimized image loading
<LazyImage
  src={product.image}
  alt={product.name}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
  priority={isAboveFold}
  aspectRatio="4/5"
/>
```

### Font Loading Strategy
```css
/* ✅ Optimized font loading */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('...') format('woff2');
}
```

### JavaScript Optimization
- Code-split animations and non-critical components
- Respect `prefers-reduced-motion`
- Use passive event listeners
- Avoid layout-shifting animations

## 🎨 Pixel-Perfect Clone Requirements

### Visual Regression Testing
```bash
# Run pixel comparison tests
npm run test:visual

# Target: ≤ 0.25px mean difference vs Axiom
```

### Breakpoint Testing
- **xs**: 375px (Mobile)
- **sm**: 768px (Tablet)  
- **md**: 1024px (Desktop)
- **lg**: 1440px (Large Desktop)
- **xl**: 1920px+ (Extra Large)

### Theme System (No Layout Changes)
```jsx
// ✅ Theme switching via tokens only
const { currentTheme, toggleTheme } = useTheme();

// CSS variables update automatically
// No DOM/layout structure changes allowed
```

## 🚀 Performance Monitoring

### Core Web Vitals Tracking
```javascript
import { performanceMonitor } from './lib/performance';

// Automatic CWV monitoring
performanceMonitor.report(); // Logs to console in dev, analytics in prod
```

### Lighthouse CI Integration
```bash
# Performance validation
npm run lighthouse:ci

# Must pass all performance assertions
```

## 🔧 Optimization Techniques

### 1. Lazy Loading Strategy
```jsx
// Critical path - load immediately
<ProductCard product={hero} priority={true} />

// Below fold - lazy load
<ProductCard product={item} priority={false} />
```

### 2. Animation Optimization (No Layout Shift)
```css
/* ✅ Transform-only animations */
.transform-hover:hover {
  transform: scale(1.02);
}

/* ✅ Inner glow only */
.btn-hover-glow:hover {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

/* ❌ Never use - causes layout shift */
.bad-animation:hover {
  width: 110%;
  margin: 10px;
}
```

### 3. Reduced Motion Support
```jsx
const { isReducedMotion } = useTheme();

// Disable animations for accessibility
className={isReducedMotion ? 'no-animation' : 'with-animation'}
```

### 4. Route Transitions (120-180ms)
```jsx
// ✅ Flash/fade overlay only
<PageTransition>
  <Routes>...</Routes>
</PageTransition>

// No translate on containers (layout shift)
```

## 📱 Lite Mode (Low Bandwidth)

### Detection
```javascript
import { isLiteMode } from './lib/performance';

if (isLiteMode()) {
  // Reduce payload by ≥30%
  // Disable non-essential animations
  // Load smaller images
}
```

### Implementation
- Detect slow connections (`2g`, `slow-2g`)
- Check `saveData` preference
- Reduce image quality
- Disable non-critical animations
- Lazy load more aggressively

## 🛍️ Shopify Integration (Future)

### Storefront API Setup
```javascript
import { shopify } from './lib/shopify';

// Mock data fallback
const products = await useMockDataIfShopifyUnavailable(
  () => shopify.getProducts(),
  mockProducts
);
```

### Performance Considerations
- ISR + stale-while-revalidate for products
- Edge cache for collections
- Generate Shopify checkout URLs
- No app embeds that cause layout shifts

## 🧪 Testing Strategy

### Visual Regression
```bash
# Capture baseline from Axiom
npm run capture:baseline

# Run comparison tests  
npm run test:visual

# Fail CI if mean diff > 0.25px
```

### Performance Testing
```bash
# Mobile performance validation
npm run lighthouse:mobile

# Must meet all Core Web Vitals thresholds
```

### Accessibility
```bash
# A11y validation
npm run test:a11y

# Must pass all critical a11y checks
```

## 📊 Monitoring & Analytics

### Production Monitoring
- Real User Monitoring (RUM) for CWV
- Error boundary reporting
- Performance budget alerts
- Visual regression notifications

### Key Metrics Dashboard
- LCP trends by page
- CLS violations
- JavaScript error rates
- Conversion funnel performance

## 🚨 CI/CD Requirements

### Pre-merge Checks
- [ ] Visual regression: ≤ 0.25px diff
- [ ] Lighthouse: Mobile LCP < 2.3s
- [ ] Lighthouse: CLS < 0.05
- [ ] Lighthouse: TTI < 3.0s
- [ ] A11y: No critical issues
- [ ] Shopify: Checkout URLs work

### Rollback Strategy
- Document last green deployment tag
- Automated performance monitoring alerts
- Quick rollback on CWV regressions

## 🎯 Success Criteria

### Clone Accuracy
✅ Pixel-perfect match at all breakpoints  
✅ ≤ 0.25px mean difference from Axiom  
✅ No layout/DOM structure changes  
✅ OG theme via tokens only  

### Performance
✅ Mobile LCP < 2.3s on Vercel preview  
✅ CLS < 0.05 consistently  
✅ TTI < 3.0s throttled mid-tier Android  
✅ Zero blocking 3rd-party scripts  

### Integration
✅ Shopify Storefront GraphQL ready  
✅ Real products/collections render  
✅ Checkout URL generation works  
✅ Vercel preview per PR  

---

**One-liner Summary**: "Clone Axiom to the atom—no micro-pixel drift—then 'skin' it with OG via tokens only. Hit LCP < 2.3s, CLS < 0.05, Shopify checkout working, Vercel previews green. Any pixel drift or layout change = automatic CI fail."
// Performance monitoring utilities for Core Web Vitals
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      LCP: null,
      FID: null,
      CLS: null,
      FCP: null,
      TTFB: null
    };
    
    this.thresholds = {
      LCP: 2300, // 2.3s for mobile
      FID: 100,  // 100ms
      CLS: 0.05, // 0.05
      FCP: 1800, // 1.8s
      TTFB: 600  // 600ms
    };

    this.init();
  }

  init() {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Measure Core Web Vitals
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureFCP();
    this.measureTTFB();
    
    // Report after page load
    window.addEventListener('load', () => {
      setTimeout(() => this.report(), 1000);
    });
  }

  measureLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.LCP = lastEntry.startTime;
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  measureFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-input') {
          this.metrics.FID = entry.processingStart - entry.startTime;
        }
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  }

  measureCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let clsEntries = [];
    let sessionValue = 0;
    let sessionEntries = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            clsEntries = [...sessionEntries];
            this.metrics.CLS = clsValue;
          }
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  }

  measureFCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.FCP = entry.startTime;
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  }

  measureTTFB() {
    if (!window.performance || !window.performance.timing) return;

    window.addEventListener('load', () => {
      const timing = window.performance.timing;
      this.metrics.TTFB = timing.responseStart - timing.navigationStart;
    });
  }

  // Get performance grade
  getGrade(metric, value) {
    const threshold = this.thresholds[metric];
    if (!threshold || value === null) return 'N/A';

    if (metric === 'CLS') {
      if (value <= 0.1) return 'Good';
      if (value <= 0.25) return 'Needs Improvement';
      return 'Poor';
    }

    if (value <= threshold) return 'Good';
    if (value <= threshold * 2) return 'Needs Improvement';
    return 'Poor';
  }

  // Report metrics
  report() {
    const report = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: {},
      grades: {}
    };

    Object.entries(this.metrics).forEach(([key, value]) => {
      report.metrics[key] = value;
      report.grades[key] = this.getGrade(key, value);
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Report');
      console.log('URL:', report.url);
      console.table(report.metrics);
      console.table(report.grades);
      console.groupEnd();
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(report);
    }

    return report;
  }

  // Send metrics to analytics
  sendToAnalytics(report) {
    // Example: Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
      Object.entries(report.metrics).forEach(([metric, value]) => {
        if (value !== null) {
          gtag('event', metric, {
            event_category: 'Web Vitals',
            value: Math.round(metric === 'CLS' ? value * 1000 : value),
            non_interaction: true,
          });
        }
      });
    }

    // Example: Send to custom analytics endpoint
    if (process.env.REACT_APP_ANALYTICS_ENDPOINT) {
      fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      }).catch(err => console.warn('Analytics error:', err));
    }
  }

  // Manual metric recording
  recordCustomMetric(name, value, unit = 'ms') {
    const metric = {
      name,
      value,
      unit,
      timestamp: Date.now()
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Custom Metric: ${name} = ${value}${unit}`);
    }

    return metric;
  }

  // Mark performance milestones
  mark(name) {
    if (window.performance && window.performance.mark) {
      window.performance.mark(name);
    }
  }

  // Measure between marks
  measure(name, startMark, endMark) {
    if (window.performance && window.performance.measure) {
      window.performance.measure(name, startMark, endMark);
      
      const entries = window.performance.getEntriesByName(name);
      if (entries.length > 0) {
        const duration = entries[entries.length - 1].duration;
        this.recordCustomMetric(name, Math.round(duration));
        return duration;
      }
    }
    return null;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const measureAsync = async (name, asyncFunction) => {
  const start = performance.now();
  performanceMonitor.mark(`${name}-start`);
  
  try {
    const result = await asyncFunction();
    const end = performance.now();
    const duration = end - start;
    
    performanceMonitor.mark(`${name}-end`);
    performanceMonitor.measure(name, `${name}-start`, `${name}-end`);
    
    return result;
  } catch (error) {
    performanceMonitor.recordCustomMetric(`${name}-error`, 1, 'count');
    throw error;
  }
};

export const measureSync = (name, syncFunction) => {
  const start = performance.now();
  performanceMonitor.mark(`${name}-start`);
  
  try {
    const result = syncFunction();
    const end = performance.now();
    const duration = end - start;
    
    performanceMonitor.mark(`${name}-end`);
    performanceMonitor.measure(name, `${name}-start`, `${name}-end`);
    
    return result;
  } catch (error) {
    performanceMonitor.recordCustomMetric(`${name}-error`, 1, 'count');
    throw error;
  }
};

// Lite mode detection
export const isLiteMode = () => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for slow connection
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' ||
           connection.saveData === true;
  }
  
  // Fallback: check for save-data header or low memory
  return navigator.deviceMemory && navigator.deviceMemory <= 2;
};

export default performanceMonitor;
// Lighthouse CI configuration for performance mandates
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/shop',
        'http://localhost:3000/product/1',
        'http://localhost:3000/cart'
      ],
      numberOfRuns: 3,
      settings: {
        // Mobile throttling for real-world testing
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 675
        },
        // Emulate mid-tier Android device
        emulatedFormFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 360,
          height: 640,
          deviceScaleFactor: 3,
          disabled: false
        }
      }
    },
    assert: {
      assertions: {
        // Performance Mandates (MILLIONS OF USERS)
        'categories:performance': ['error', { minScore: 0.85 }],
        
        // Core Web Vitals - Mobile targets
        'largest-contentful-paint': ['error', { maxNumericValue: 2300 }], // < 2.3s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],  // < 0.05
        'total-blocking-time': ['error', { maxNumericValue: 300 }],       // < 300ms (correlates to TTI)
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],   // < 1.8s
        'speed-index': ['error', { maxNumericValue: 3000 }],              // < 3.0s
        
        // Additional performance metrics
        'server-response-time': ['error', { maxNumericValue: 600 }],      // TTFB < 600ms
        'interactive': ['error', { maxNumericValue: 3000 }],              // TTI < 3.0s
        'first-meaningful-paint': ['error', { maxNumericValue: 2000 }],   // < 2.0s
        
        // Resource optimization
        'unused-javascript': ['warn', { maxNumericValue: 100000 }],       // < 100KB unused JS
        'unused-css-rules': ['warn', { maxNumericValue: 50000 }],         // < 50KB unused CSS
        'modern-image-formats': ['error', { minScore: 0.9 }],             // AVIF/WebP usage
        'uses-responsive-images': ['error', { minScore: 0.9 }],           // Responsive images
        'efficiently-encode-images': ['error', { minScore: 0.9 }],        // Image optimization
        
        // Network optimization
        'uses-http2': ['error', { minScore: 1 }],                         // HTTP/2 usage
        'uses-rel-preconnect': ['warn', { minScore: 0.8 }],              // DNS preconnect
        'uses-rel-preload': ['warn', { minScore: 0.8 }],                 // Resource preload
        
        // JavaScript optimization
        'no-unload-listeners': ['error', { minScore: 1 }],                // No unload listeners
        'uses-passive-event-listeners': ['error', { minScore: 1 }],       // Passive listeners
        'no-document-write': ['error', { minScore: 1 }],                  // No document.write
        
        // Accessibility (non-negotiable)
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': ['error', { minScore: 1 }],
        'heading-order': ['error', { minScore: 1 }],
        'link-name': ['error', { minScore: 1 }],
        'button-name': ['error', { minScore: 1 }],
        
        // Best practices
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'is-on-https': ['error', { minScore: 1 }],
        'uses-https': ['error', { minScore: 1 }],
        
        // SEO basics
        'categories:seo': ['warn', { minScore: 0.9 }],
        'meta-description': ['error', { minScore: 1 }],
        'document-title': ['error', { minScore: 1 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    },
    server: {
      command: 'yarn start',
      port: 3000,
      waitForTimeout: 30000
    }
  }
};
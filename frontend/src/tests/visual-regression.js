// Visual regression testing setup for pixel-perfect validation
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

class VisualRegressionTester {
  constructor(options = {}) {
    this.baselineDir = options.baselineDir || './tests/baseline';
    this.testDir = options.testDir || './tests/current';
    this.diffDir = options.diffDir || './tests/diff';
    this.threshold = options.threshold || 0.25; // 0.25px mean difference
    this.browser = null;
    this.page = null;
    
    // Ensure directories exist
    [this.baselineDir, this.testDir, this.diffDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async setup() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    
    this.page = await this.browser.newPage();
    
    // Set consistent viewport and device settings
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.page.emulateMedia({ media: 'screen' });
    
    // Disable animations for consistent screenshots
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `
    });
  }

  async teardown() {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
  }

  async captureScreenshot(url, name, options = {}) {
    const {
      fullPage = false,
      clip = null,
      delay = 1000,
      hideElements = [],
      waitForSelector = null
    } = options;

    await this.page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for specific selector if provided
    if (waitForSelector) {
      await this.page.waitForSelector(waitForSelector);
    }
    
    // Hide elements that cause inconsistency (like dynamic timestamps)
    for (const selector of hideElements) {
      await this.page.addStyleTag({
        content: `${selector} { visibility: hidden !important; }`
      });
    }
    
    // Wait for layout stability
    await this.page.waitForTimeout(delay);
    
    const screenshotPath = path.join(this.testDir, `${name}.png`);
    
    await this.page.screenshot({
      path: screenshotPath,
      fullPage,
      clip,
      animations: 'disabled'
    });
    
    return screenshotPath;
  }

  async compareScreenshots(name) {
    const baselinePath = path.join(this.baselineDir, `${name}.png`);
    const testPath = path.join(this.testDir, `${name}.png`);
    const diffPath = path.join(this.diffDir, `${name}.png`);
    
    if (!fs.existsSync(baselinePath)) {
      throw new Error(`Baseline image not found: ${baselinePath}`);
    }
    
    if (!fs.existsSync(testPath)) {
      throw new Error(`Test image not found: ${testPath}`);
    }
    
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const test = PNG.sync.read(fs.readFileSync(testPath));
    
    // Ensure images are the same size
    if (baseline.width !== test.width || baseline.height !== test.height) {
      throw new Error(`Image dimensions don't match: ${baseline.width}x${baseline.height} vs ${test.width}x${test.height}`);
    }
    
    const diff = new PNG({ width: baseline.width, height: baseline.height });
    
    const numDiffPixels = pixelmatch(
      baseline.data,
      test.data,
      diff.data,
      baseline.width,
      baseline.height,
      {
        threshold: 0.1,
        includeAA: false,
        diffColor: [255, 0, 255], // Magenta for differences
        diffColorAlt: [255, 255, 0] // Yellow for anti-aliasing differences
      }
    );
    
    const totalPixels = baseline.width * baseline.height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;
    const meanDiff = (numDiffPixels / totalPixels) * 100; // Simplified mean diff calculation
    
    // Save diff image
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    
    return {
      passed: meanDiff <= this.threshold,
      meanDiff,
      diffPercentage,
      numDiffPixels,
      totalPixels,
      diffPath
    };
  }

  async runBreakpointTests(url, name) {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'large', width: 2560, height: 1440 }
    ];
    
    const results = {};
    
    for (const bp of breakpoints) {
      await this.page.setViewportSize({ width: bp.width, height: bp.height });
      const testName = `${name}-${bp.name}`;
      
      await this.captureScreenshot(url, testName);
      
      try {
        results[testName] = await this.compareScreenshots(testName);
        console.log(`✅ ${testName}: ${results[testName].passed ? 'PASS' : 'FAIL'} (${results[testName].meanDiff.toFixed(3)}px diff)`);
      } catch (error) {
        results[testName] = { passed: false, error: error.message };
        console.log(`❌ ${testName}: ERROR - ${error.message}`);
      }
    }
    
    return results;
  }

  async runComponentTests(baseUrl) {
    const components = [
      { name: 'header', url: `${baseUrl}/`, selector: 'header' },
      { name: 'product-card', url: `${baseUrl}/`, selector: '.group.cursor-pointer', clip: { x: 0, y: 200, width: 400, height: 600 } },
      { name: 'footer', url: `${baseUrl}/`, selector: 'footer' },
      { name: 'shop-grid', url: `${baseUrl}/shop`, selector: '.grid' },
      { name: 'product-detail', url: `${baseUrl}/product/1`, waitForSelector: '[data-testid="product-detail"]' }
    ];
    
    const results = {};
    
    for (const component of components) {
      const { name, url, selector, clip, waitForSelector } = component;
      
      try {
        await this.captureScreenshot(url, name, {
          clip,
          waitForSelector: waitForSelector || selector,
          hideElements: ['.animate-pulse', '[data-timestamp]'] // Hide dynamic elements
        });
        
        results[name] = await this.compareScreenshots(name);
        console.log(`✅ ${name}: ${results[name].passed ? 'PASS' : 'FAIL'} (${results[name].meanDiff.toFixed(3)}px diff)`);
      } catch (error) {
        results[name] = { passed: false, error: error.message };
        console.log(`❌ ${name}: ERROR - ${error.message}`);
      }
    }
    
    return results;
  }

  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        errorRate: 0
      },
      details: results
    };
    
    Object.values(results).forEach(result => {
      report.summary.total++;
      if (result.passed) {
        report.summary.passed++;
      } else {
        report.summary.failed++;
      }
    });
    
    report.summary.errorRate = (report.summary.failed / report.summary.total) * 100;
    
    const reportPath = path.join('./tests', 'visual-regression-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Visual Regression Test Report:');
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Error Rate: ${report.summary.errorRate.toFixed(2)}%`);
    console.log(`Report saved: ${reportPath}`);
    
    return report;
  }
}

// Export for CI/CD usage
export default VisualRegressionTester;

// CLI usage
if (process.env.NODE_ENV === 'test') {
  const tester = new VisualRegressionTester();
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000';
  
  (async () => {
    await tester.setup();
    
    try {
      console.log('🧪 Running Visual Regression Tests...');
      
      // Test main pages at different breakpoints
      const homeResults = await tester.runBreakpointTests(baseUrl, 'home');
      const shopResults = await tester.runBreakpointTests(`${baseUrl}/shop`, 'shop');
      const productResults = await tester.runBreakpointTests(`${baseUrl}/product/1`, 'product');
      
      // Test individual components
      const componentResults = await tester.runComponentTests(baseUrl);
      
      // Generate comprehensive report
      const allResults = {
        ...homeResults,
        ...shopResults,
        ...productResults,
        ...componentResults
      };
      
      const report = tester.generateReport(allResults);
      
      // Exit with error code if tests failed
      if (report.summary.failed > 0) {
        process.exit(1);
      }
      
    } finally {
      await tester.teardown();
    }
  })();
}
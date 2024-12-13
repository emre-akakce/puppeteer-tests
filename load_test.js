import puppeteer from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testRender = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Start navigation and wait for the page to load
    await page.goto(url, { waitUntil: 'load', timeout: 10000 });

    // Evaluate performance timing and metrics
    const performanceMetrics = await page.evaluate(() => {
      const { navigationStart, domContentLoadedEventEnd, loadEventEnd } = window.performance.timing;

      // Get paint metrics (FCP, LCP)
      const paintEntries = performance.getEntriesByType('paint');
      const firstContentfulPaint = paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime || 0;

      // Get Largest Contentful Paint (LCP)
      let largestContentfulPaint = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        largestContentfulPaint = entries[entries.length - 1].startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // Get Cumulative Layout Shift (CLS)
      let cumulativeLayoutShift = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });

      return {
        domContentLoaded: domContentLoadedEventEnd - navigationStart,
        loadEvent: loadEventEnd - navigationStart,
        firstContentfulPaint,
        largestContentfulPaint,
        cumulativeLayoutShift,
      };
    });

    return performanceMetrics;
  } catch (error) {
    console.error(`Failed to load page at ${url}:`, error.message);
    return null;
  } finally {
    await browser.close();
  }
};

const writeResultsToFile = (results, config) => {
  const fileName = `${config.name || 'test_results'}.json`;
  fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
  console.log(`Results written to ${fileName}`);
};

const loadTest = async (url, config) => {
  const { numRequests, name } = config;
  const results = [];

  console.log(`Starting load test with ${numRequests} requests to ${url}...`);

  const promises = Array.from({ length: numRequests }, async (_, i) => {
    console.log(`Starting request ${i + 1}...`);
    const result = await testRender(url);
    if (result) {
      results.push({
        requestNumber: i + 1,
        domContentLoaded: result.domContentLoaded,
        loadEvent: result.loadEvent,
        firstContentfulPaint: result.firstContentfulPaint,
        largestContentfulPaint: result.largestContentfulPaint,
        cumulativeLayoutShift: result.cumulativeLayoutShift,
      });
    }
  });

  await Promise.all(promises);

  console.log('Load test complete. Results:');
  results.forEach((result) => {
    console.log(
      `Request ${result.requestNumber}: DOM Content Loaded: ${result.domContentLoaded} ms, Page Load: ${result.loadEvent} ms, FCP: ${result.firstContentfulPaint} ms, LCP: ${result.largestContentfulPaint} ms, CLS: ${result.cumulativeLayoutShift}`
    );
  });

  const averageDOMContentLoaded =
    results.reduce((sum, r) => sum + r.domContentLoaded, 0) / results.length;
  const averageLoadEvent =
    results.reduce((sum, r) => sum + r.loadEvent, 0) / results.length;
  const averageFCP =
    results.reduce((sum, r) => sum + r.firstContentfulPaint, 0) / results.length;
  const averageLCP =
    results.reduce((sum, r) => sum + r.largestContentfulPaint, 0) / results.length;
  const averageCLS =
    results.reduce((sum, r) => sum + r.cumulativeLayoutShift, 0) / results.length;

  console.log('Average Metrics:');
  console.log(`- Average DOM Content Loaded: ${averageDOMContentLoaded.toFixed(2)} ms`);
  console.log(`- Average Page Load: ${averageLoadEvent.toFixed(2)} ms`);
  console.log(`- Average FCP: ${averageFCP.toFixed(2)} ms`);
  console.log(`- Average LCP: ${averageLCP.toFixed(2)} ms`);
  console.log(`- Average CLS: ${averageCLS.toFixed(4)}`);

  // Write results to a file
  writeResultsToFile({
    results,
    averages: {
      averageDOMContentLoaded: averageDOMContentLoaded.toFixed(2),
      averageLoadEvent: averageLoadEvent.toFixed(2),
      averageFCP: averageFCP.toFixed(2),
      averageLCP: averageLCP.toFixed(2),
      averageCLS: averageCLS.toFixed(4),
    },
  }, config);
};

const config = {
  numRequests: parseInt(process.env.NUM_REQUESTS, 10) || 20, // Number of requests to make
  name: `render_test_results_${process.env.NUM_REQUESTS || 20}`, // Name of the output file
};

const frontendEndpoint = process.env.FRONTEND_ENDPOINT || 'http://localhost:3000';

loadTest(frontendEndpoint, config);
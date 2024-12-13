import puppeteer from 'puppeteer';

const testRender = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Start navigation and wait for the page to load
    await page.goto(url, { waitUntil: 'load', timeout: 10000 });

    // Evaluate performance timing
    const performanceTiming = await page.evaluate(() => {
      const { navigationStart, domContentLoadedEventEnd, loadEventEnd } = window.performance.timing;
      return {
        navigationStart,
        domContentLoaded: domContentLoadedEventEnd - navigationStart,
        loadEvent: loadEventEnd - navigationStart,
      };
    });

    return performanceTiming;
  } catch (error) {
    console.error(`Failed to load page at ${url}:`, error.message);
    return null;
  } finally {
    await browser.close();
  }
};

const loadTest = async (url, config) => {
  const { numRequests } = config;
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
      });
    }
  });

  await Promise.all(promises);

  console.log('Load test complete. Results:');
  results.forEach((result) => {
    console.log(
      `Request ${result.requestNumber}: DOM Content Loaded: ${result.domContentLoaded} ms, Page Load: ${result.loadEvent} ms`
    );
  });

  const averageDOMContentLoaded =
    results.reduce((sum, r) => sum + r.domContentLoaded, 0) / results.length;
  const averageLoadEvent =
    results.reduce((sum, r) => sum + r.loadEvent, 0) / results.length;

  console.log('Average Metrics:');
  console.log(`- Average DOM Content Loaded: ${averageDOMContentLoaded.toFixed(2)} ms`);
  console.log(`- Average Page Load: ${averageLoadEvent.toFixed(2)} ms`);
};

const config = {
  numRequests: 1, // Number of requests to make
};

loadTest('http://localhost:3000', config);

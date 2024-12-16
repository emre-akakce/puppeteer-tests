import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

const calculateCoverage = async () => {
  const frontendEndpoint = process.env.FRONTEND_ENDPOINT || 'http://localhost:3000';

  console.log(`Measuring coverage for: ${frontendEndpoint}`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Enable coverage tracking for both CSS and JS
  await Promise.all([
    page.coverage.startCSSCoverage(),
    page.coverage.startJSCoverage(),
  ]);

  try {
    // Load the page
    await page.goto(frontendEndpoint, { waitUntil: 'load', timeout: 10000 });

    // Stop coverage tracking
    const [cssCoverage, jsCoverage] = await Promise.all([
      page.coverage.stopCSSCoverage(),
      page.coverage.stopJSCoverage(),
    ]);

    // Calculate CSS and JS coverage
    const calculateResourceCoverage = (coverageData) => {
      let totalBytes = 0;
      let usedBytes = 0;

      for (const entry of coverageData) {
        totalBytes += entry.text.length;
        for (const range of entry.ranges) {
          usedBytes += range.end - range.start;
        }
      }

      const coveragePercentage = ((usedBytes / totalBytes) * 100).toFixed(2);
      return { totalBytes, usedBytes, coveragePercentage };
    };

    const cssStats = calculateResourceCoverage(cssCoverage);
    const jsStats = calculateResourceCoverage(jsCoverage);

    // Log results
    console.log('Coverage Results:');
    console.log(`CSS Coverage: ${cssStats.coveragePercentage}% (${cssStats.usedBytes} / ${cssStats.totalBytes} bytes used)`);
    console.log(`JS Coverage: ${jsStats.coveragePercentage}% (${jsStats.usedBytes} / ${jsStats.totalBytes} bytes used)`);

    // Write results to a file
    const coverageResults = {
      url: frontendEndpoint,
      cssCoverage: {
        percentage: cssStats.coveragePercentage,
        usedBytes: cssStats.usedBytes,
        totalBytes: cssStats.totalBytes,
      },
      jsCoverage: {
        percentage: jsStats.coveragePercentage,
        usedBytes: jsStats.usedBytes,
        totalBytes: jsStats.totalBytes,
      },
    };

    const outputFileName = `coverage_results_${Date.now()}.json`;
    fs.writeFileSync(outputFileName, JSON.stringify(coverageResults, null, 2));
    console.log(`Coverage results written to ${outputFileName}`);
  } catch (error) {
    console.error(`Error measuring coverage: ${error.message}`);
  } finally {
    await browser.close();
  }
};

// Execute the coverage calculation
calculateCoverage().catch((error) => {
  console.error(`Script execution failed: ${error.message}`);
});

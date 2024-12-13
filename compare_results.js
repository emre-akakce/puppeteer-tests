import fs from 'fs';

const compareAverages = (filePathA, filePathB) => {
  try {
    // Read and parse JSON files
    const dataA = JSON.parse(fs.readFileSync(filePathA, 'utf-8'));
    const dataB = JSON.parse(fs.readFileSync(filePathB, 'utf-8'));

    // Extract averages
    const averagesA = dataA.averages;
    const averagesB = dataB.averages;

    // Prepare comparison output
    const output = [];

    output.push(`Comparison of Averages:`);
    output.push(`File A (${filePathA}):`);
    output.push(`  - Average DOM Content Loaded: ${averagesA.averageDOMContentLoaded || 'N/A'} ms`);
    output.push(`  - Average Page Load: ${averagesA.averageLoadEvent || 'N/A'} ms`);
    output.push(`  - Average FCP: ${averagesA.averageFCP || 'N/A'} ms`);
    output.push(`  - Average LCP: ${averagesA.averageLCP || 'N/A'} ms`);
    output.push(`  - Average CLS: ${averagesA.averageCLS || 'N/A'}`);

    output.push(`File B (${filePathB}):`);
    output.push(`  - Average DOM Content Loaded: ${averagesB.averageDOMContentLoaded || 'N/A'} ms`);
    output.push(`  - Average Page Load: ${averagesB.averageLoadEvent || 'N/A'} ms`);
    output.push(`  - Average FCP: ${averagesB.averageFCP || 'N/A'} ms`);
    output.push(`  - Average LCP: ${averagesB.averageLCP || 'N/A'} ms`);
    output.push(`  - Average CLS: ${averagesB.averageCLS || 'N/A'}`);

    // Helper function to calculate difference safely
    const calculateDifference = (a, b) => {
      if (a == null || b == null) return 'N/A';
      return (b - a).toFixed(2);
    };

    // Calculate differences
    const domDifference = calculateDifference(averagesA.averageDOMContentLoaded, averagesB.averageDOMContentLoaded);
    const loadDifference = calculateDifference(averagesA.averageLoadEvent, averagesB.averageLoadEvent);
    const fcpDifference = calculateDifference(averagesA.averageFCP, averagesB.averageFCP);
    const lcpDifference = calculateDifference(averagesA.averageLCP, averagesB.averageLCP);
    const clsDifference = calculateDifference(averagesA.averageCLS, averagesB.averageCLS);

    output.push(`Differences:`);
    output.push(`  - DOM Content Loaded Difference: ${domDifference} ms`);
    output.push(`  - Page Load Difference: ${loadDifference} ms`);
    output.push(`  - FCP Difference: ${fcpDifference} ms`);
    output.push(`  - LCP Difference: ${lcpDifference} ms`);
    output.push(`  - CLS Difference: ${clsDifference}`);

    // Helper function to determine which file is faster
    const determineFaster = (a, b, metric) => {
      if (a == null || b == null) return 'Cannot determine (missing data)';
      const faster = a < b ? filePathA : filePathB;
      const value = Math.abs(b - a).toFixed(2);
      const percentage = ((value / Math.max(a, b)) * 100).toFixed(2);
      return `${faster} by ${value} (${percentage}%)`;
    };

    output.push(`Performance Comparison:`);
    output.push(`  - Faster DOM Content Loaded: ${determineFaster(averagesA.averageDOMContentLoaded, averagesB.averageDOMContentLoaded)}`);
    output.push(`  - Faster Page Load: ${determineFaster(averagesA.averageLoadEvent, averagesB.averageLoadEvent)}`);
    output.push(`  - Faster FCP: ${determineFaster(averagesA.averageFCP, averagesB.averageFCP)}`);
    output.push(`  - Faster LCP: ${determineFaster(averagesA.averageLCP, averagesB.averageLCP)}`);
    output.push(`  - Lower CLS: ${determineFaster(averagesA.averageCLS, averagesB.averageCLS)}`);

    // Print output to console
    console.log(output.join('\n'));

    // Write output to a file
    const resultFileName = `comparison_results_${Date.now()}.txt`;
    fs.writeFileSync(resultFileName, output.join('\n'));
    console.log(`Comparison results written to ${resultFileName}`);
  } catch (error) {
    console.error(`Error comparing files: ${error.message}`);
  }
};

// Example file paths
const filePathA = './results/v2/react-router-v7/render_test_results_30.json';
const filePathB = './results/v2/remix-run/render_test_results_30.json';

compareAverages(filePathA, filePathB);

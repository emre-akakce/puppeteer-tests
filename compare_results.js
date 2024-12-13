import fs from 'fs';

const compareAverages = (filePathA, filePathB) => {
  try {
    // Read and parse JSON files
    const dataA = JSON.parse(fs.readFileSync(filePathA, 'utf-8'));
    const dataB = JSON.parse(fs.readFileSync(filePathB, 'utf-8'));

    // Extract averages
    const averagesA = dataA.averages;
    const averagesB = dataB.averages;

    // Log comparison
    console.log(`Comparison of Averages:`);
    console.log(`File A (${filePathA}):`);
    console.log(`  - Average DOM Content Loaded: ${averagesA.averageDOMContentLoaded} ms`);
    console.log(`  - Average Page Load: ${averagesA.averageLoadEvent} ms`);

    console.log(`File B (${filePathB}):`);
    console.log(`  - Average DOM Content Loaded: ${averagesB.averageDOMContentLoaded} ms`);
    console.log(`  - Average Page Load: ${averagesB.averageLoadEvent} ms`);

    // Calculate and log differences
    const domDifference =
      (averagesB.averageDOMContentLoaded - averagesA.averageDOMContentLoaded).toFixed(2);
    const loadDifference =
      (averagesB.averageLoadEvent - averagesA.averageLoadEvent).toFixed(2);

    console.log(`Differences:`);
    console.log(`  - DOM Content Loaded Difference: ${domDifference} ms`);
    console.log(`  - Page Load Difference: ${loadDifference} ms`);
  } catch (error) {
    console.error(`Error comparing files: ${error.message}`);
  }
};

// Example file paths
const filePathA = './results/react-router-v7/render_test_results_30.json';
const filePathB = './results/remix-run/render_test_results_30.json';

compareAverages(filePathA, filePathB);

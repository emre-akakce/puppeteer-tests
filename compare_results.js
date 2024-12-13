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
    output.push(`  - Average DOM Content Loaded: ${averagesA.averageDOMContentLoaded} ms`);
    output.push(`  - Average Page Load: ${averagesA.averageLoadEvent} ms`);

    output.push(`File B (${filePathB}):`);
    output.push(`  - Average DOM Content Loaded: ${averagesB.averageDOMContentLoaded} ms`);
    output.push(`  - Average Page Load: ${averagesB.averageLoadEvent} ms`);

    // Calculate differences
    const domDifference =
      (averagesB.averageDOMContentLoaded - averagesA.averageDOMContentLoaded).toFixed(2);
    const loadDifference =
      (averagesB.averageLoadEvent - averagesA.averageLoadEvent).toFixed(2);

    output.push(`Differences:`);
    output.push(`  - DOM Content Loaded Difference: ${domDifference} ms`);
    output.push(`  - Page Load Difference: ${loadDifference} ms`);

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
const filePathA = './results/react-router-v7/render_test_results_30.json';
const filePathB = './results/remix-run/render_test_results_30.json';

compareAverages(filePathA, filePathB);

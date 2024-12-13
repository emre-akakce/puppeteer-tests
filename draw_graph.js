import QuickChart from 'quickchart-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const generateChart = async () => {
  const numRequests = process.env.NUM_REQUESTS || 10;
  const frontendEndpoint = process.env.FRONTEND_ENDPOINT || 'http://localhost:3000';
  const fileName = `render_test_results_${numRequests}.json`;

  const rawData = JSON.parse(fs.readFileSync(`./${fileName}`, 'utf-8'));
  const labels = rawData.results.map((r) => `Request ${r.requestNumber}`);
  const domContentLoadedTimes = rawData.results.map((r) => r.domContentLoaded);
  const loadEventTimes = rawData.results.map((r) => r.loadEvent);

  const chart = new QuickChart();
  chart.setConfig({
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'DOM Content Loaded (ms)',
          data: domContentLoadedTimes,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        },
        {
          label: 'Page Load Time (ms)',
          data: loadEventTimes,
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false,
        },
      ],
    },
  });

  chart.setWidth(800).setHeight(600).setBackgroundColor('white');
  const imageBuffer = await chart.toBinary();

  const outputFileName = fileName.replace('.json', '.png');
  fs.writeFileSync(outputFileName, imageBuffer);
  console.log(`Graph saved as ${outputFileName}`);
};

// Generate chart
generateChart();

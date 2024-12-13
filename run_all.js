import { exec } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const runScripts = async () => {
  const requestLimit = parseInt(process.env.REQUEST_LIMIT, 10) || 100;
  const incrementStep = parseInt(process.env.INCREMENT_STEP, 10) || 10;

  let currentRequests = incrementStep;

  console.log(`Starting the automated test with request limit: ${requestLimit} and increment step: ${incrementStep}`);

  while (currentRequests <= requestLimit) {
    console.log(`Running test with ${currentRequests} requests...`);

    // Run load_test.js with the current request count
    await new Promise((resolve, reject) => {
      exec(
        `NUM_REQUESTS=${currentRequests} node load_test.js`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error running load_test.js: ${stderr}`);
            reject(error);
          } else {
            console.log(`load_test.js output:\n${stdout}`);
            resolve();
          }
        }
      );
    });

    // Run draw_graph.js with the current request count
    await new Promise((resolve, reject) => {
      exec(
        `NUM_REQUESTS=${currentRequests} node draw_graph.js`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error running draw_graph.js: ${stderr}`);
            reject(error);
          } else {
            console.log(`draw_graph.js output:\n${stdout}`);
            resolve();
          }
        }
      );
    });

    currentRequests += incrementStep;
  }

  console.log('Automated testing complete!');
};

// Execute the script
runScripts().catch((error) => {
  console.error(`Script execution failed: ${error.message}`);
});

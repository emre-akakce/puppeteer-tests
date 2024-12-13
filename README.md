# Render Test and Comparison Scripts

This project contains scripts to perform load tests on web applications, analyze their performance, and compare the results.

## Files and Features

### 1. **Load Test Script**
**File:** `load_test.js`

This script:
- Sends multiple requests to a frontend endpoint.
- Measures performance metrics such as:
  - DOM Content Loaded time.
  - Page Load time.
- Writes the results to a JSON file.

#### Configuration:
The script uses environment variables defined in a `.env` file:
```env
NUM_REQUESTS=20
FRONTEND_ENDPOINT=http://localhost:3000
```

#### Usage:
1. Create a `.env` file with the above format.
2. Run the script:
   ```bash
   node load_test.js
   ```
3. Results will be saved in a file named `render_test_results_<NUM_REQUESTS>.json`.

### 2. **Result Comparison Script**
**File:** `compare_results.js`

This script:
- Reads JSON result files from different folders.
- Compares the average metrics of two test results.
- Logs the comparison to the console.
- Writes the comparison results to a `.txt` file.

#### Usage:
1. Specify the paths of the two JSON files to compare:
   ```javascript
   const filePathA = './results/react-router-v7/render_test_results_30.json';
   const filePathB = './results/remix-run/render_test_results_30.json';
   ```
2. Run the script:
   ```bash
   node compare_results.js
   ```
3. The script outputs:
   - Average metrics for each file.
   - Differences in performance metrics.
   - Which file is faster, including the value and percentage.
4. Results will be saved in a file named `comparison_results_<timestamp>.txt`.

### 3. **Chart Generation Script**
**File:** `draw_graph.js`

This script:
- Reads the JSON result file.
- Generates a graph comparing performance metrics for each request.
- Saves the graph as a PNG image.

#### Usage:
1. Ensure the result file exists in the expected path.
2. Run the script:
   ```bash
   node draw_graph.js
   ```
3. The graph will be saved as a PNG file in the same directory as the result file.

## Prerequisites
- Node.js (recommended: LTS version)
- Required Node.js packages:
  - `puppeteer`
  - `quickchart-js`
  - `dotenv`

Install dependencies using:
```bash
npm install
```

## Example Workflow
1. Run the load test to generate performance data:
   ```bash
   node load_test.js
   ```
2. Compare results from different implementations:
   ```bash
   node compare_results.js
   ```
3. Generate graphs to visualize performance metrics:
   ```bash
   node draw_graph.js
   ```

## Output Files
- **Load Test Results:** `render_test_results_<NUM_REQUESTS>.json`
- **Comparison Results:** `comparison_results_<timestamp>.txt`
- **Performance Graphs:** `render_test_results_<NUM_REQUESTS>.png`

## Notes
- Ensure the frontend endpoint is accessible during the load test.
- The scripts are designed to work with JSON files in a specific format; avoid modifying the structure of the result files.

## License
This project is licensed under the MIT License.


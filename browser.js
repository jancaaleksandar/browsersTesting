import runBrowser from "./utils/runBrowser.js";
import setupGlobalHandlers from "./utils/setupGlobalHandlers.js";

async function browser(config) {
  const maxRetries = 5;
  let attempt = 0;

  // Set up global error handling and graceful shutdown once
  setupGlobalHandlers();

  while (attempt < maxRetries) {
    attempt++;
    try {
      await runBrowser(config);
      break; // Exit the loop if successful
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      if (attempt >= maxRetries) {
        console.error("Maximum retry limit reached. Exiting.");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log("Retrying the browser function from the start...");
    }
  }
}

export default browser;

// Import necessary modules
import puppeteer from "puppeteer-core";
import fetchAndSave from "./utils/fetchAndSave.js";
import scrollToRandomHeight from "./utils/scrollToRandomHeight.js";
import checkIfDetachedAndKeepAlive from "./utils/checkIfDetachedAndKeepAlive.js";
import setupPageEventListeners from "./utils/setupPageEventListeners.js";
import performFetchAndSave from "./utils/performFetchAndSave.js";
import setupGlobalHandlers from "./utils/setupGlobalHandlers.js"; // Import the function

async function browser(config) {
  try {
    // Connect to the existing browser instance
    const browser = await puppeteer.connect({
      browserWSEndpoint: config.browserWSEndpoint,
      defaultViewport: null,
    });

    const page = await browser.newPage();

    // State object to hold flags
    const state = {
      mainFrameDetached: false,
      isFetching: false,
      isKeepingAlive: false,
    };

    // Set up event listeners
    setupPageEventListeners(page, state);

    // Set up global error handling and graceful shutdown
    setupGlobalHandlers(page, browser);

    // Navigate to the initial URL
    await page.goto("https://httpbin.org/anything", { timeout: 0 });

    // Scroll to a random height
    await scrollToRandomHeight(page);

    // Call fetchAndSave function immediately
    console.log("Before initial fetchAndSave:", page.url());
    await fetchAndSave(page, config.profileId);
    console.log("After fetchAndSave:", page.url());

    // Set an interval to call performFetchAndSave every 3.5 seconds
    setInterval(async () => {
      await performFetchAndSave(state, page, config);
    }, 3500);

    // Set an interval to keep the browser connection alive
    setInterval(async () => {
      await checkIfDetachedAndKeepAlive(state, page);
    }, 10000);

    // Keep the script running indefinitely
    await new Promise(() => {});
  } catch (err) {
    console.error("Browser function encountered an error:", err);
  }
}

export default browser;

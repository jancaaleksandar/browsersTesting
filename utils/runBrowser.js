// Import necessary modules
import puppeteer from "puppeteer-core";
import fetchAndSave from "./fetchAndSave.js";
import scrollToRandomHeight from "./scrollToRandomHeight.js";
import setupPageEventListeners from "./setupPageEventListeners.js";
import setupGlobalHandlers from "./setupGlobalHandlers.js";
import startIntervals from "./startIntervals.js";

async function runBrowser(config) {
  let browser;
  let page;

  try {
    // Connect to the existing browser instance
    browser = await puppeteer.connect({
      browserWSEndpoint: config.browserWSEndpoint,
      defaultViewport: null,
    });

    page = await browser.newPage();

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

    // * wait for this
    await page.waitForSelector("body > pre", { waitUntil: "networkidle0" });

    // Scroll to a random height
    await scrollToRandomHeight(page);

    // Call fetchAndSave function immediately
    // console.log("Before initial fetchAndSave:", page.url());
    await fetchAndSave(page, config.profileId);
    // console.log("After initial fetchAndSave:", page.url());

    // Start intervals and handle errors
    await startIntervals(page, state, config);

    // Keep the script running indefinitely
    await new Promise(() => {});
  } catch (err) {
    console.error("Browser function encountered an error:", err);
    throw err; // Rethrow the error to trigger the retry logic in browser.js
  } finally {
    // Clean up resources
    if (page && !page.isClosed()) {
      try {
        await page.close();
      } catch (error) {
        console.error("Error closing page:", error);
      }
    }

    if (browser) {
      try {
        await browser.disconnect();
      } catch (error) {
        console.error("Error disconnecting browser:", error);
      }
    }
  }
}

export default runBrowser;

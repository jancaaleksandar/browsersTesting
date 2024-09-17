// Import necessary modules
import puppeteer from "puppeteer-core";
import scrollToRandomHeight from "./utils/scrollToRandomHeight.js";
import fetchAndSave from "./utils/fetchAndSave.js";
import checkIfDetachedAndKeepAlive from "./utils/checkIfDetachedAndKeepAlive.js";

async function browser(config) {
  try {
    // Connect to the existing browser instance
    const browser = await puppeteer.connect({
      browserWSEndpoint: config.browserWSEndpoint,
      defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();

    // Variable to track if the main frame is detached
    const state = {
      mainFrameDetached: false,
      isKeepingAlive: false,
      isFetching: false,
    };
    // * check how we can add this in a seperate function
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Add event listeners to monitor page and frame events
    page.on("close", () => {
      console.error("Page was closed unexpectedly.");
    });

    page.on("framenavigated", (frame) => {
      console.log(`Frame navigated to: ${frame.url()} (ID: ${frame._id})`);
    });

    page.on("framedetached", (frame) => {
      console.error(`Frame detached: ${frame.url()} (ID: ${frame._id})`);
      if (frame === page.mainFrame()) {
        console.error("Main frame was detached.");
        state.mainFrameDetached = true;
      }
    });

    page.on("request", (request) => {
      if (request.isNavigationRequest()) {
        console.log("Navigation request to:", request.url());
      }
    });

    page.on("dialog", async (dialog) => {
      console.log("Dialog opened:", dialog.message());
      await dialog.dismiss();
    });

    page.on("console", (msg) => {
      console.log("PAGE LOG:", msg.text());
    });

    page.on("load", () => {
      console.log(`Page loaded: ${page.url()}`);
    });

    page.on("requestfailed", (request) => {
      console.error(
        "Request failed:",
        request.url(),
        request.failure().errorText
      );
    });

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Navigate to the initial URL
    await page.goto("https://httpbin.org/anything", { timeout: 0 });

    // Scroll to a random height
    await scrollToRandomHeight(page);

    // Call fetchAndSave function immediately
    console.log("Before initial fetchAndSave:", page.url());
    await fetchAndSave(page, config.profileId);
    console.log("After initial fetchAndSave:", page.url());

    // Set an interval to call fetchAndSave every 3.5 seconds
    setInterval(async () => {
      // * add this in a new function
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if (state.isFetching) return; // Prevent overlapping executions
      state.isFetching = true;
      
      try {
        if (page.isClosed()) {
          console.error("Cannot perform fetchAndSave: Page is closed.");
          return;
        }
        
        if (state.mainFrameDetached) {
          console.error(
            "Main frame is detached. Re-navigating to initial URL..."
          );
          await page.goto("https://httpbin.org/anything", { timeout: 0 });
          state.mainFrameDetached = false; // Reset the flag after re-navigation
          // Optionally, re-execute scrollToRandomHeight if needed
          await scrollToRandomHeight(page);
        }
        
        console.log("Before fetchAndSave:", page.url());
        await fetchAndSave(page, config.profileId);
        console.log("After fetchAndSave:", page.url());
      } catch (error) {
        console.error("Error in fetchAndSave:", error);
      } finally {
        state.isFetching = false;
      }
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }, 3500);

    // Set an interval to keep the browser connection alive
    setInterval(async () => {
      await checkIfDetachedAndKeepAlive(state, page);
    }, 10000);

    // * add this processes in a seperate function
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Global error handling
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Promise Rejection:", reason);
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Received SIGINT. Shutting down gracefully...");
      try {
        await page.close();
        await browser.disconnect();
      } catch (error) {
        console.error("Error during shutdown:", error);
      } finally {
        process.exit(0);
      }
    });
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Keep the script running indefinitely
    await new Promise(() => {});
  } catch (err) {
    console.error("Browser function encountered an error:", err);
  }
}

export default browser;

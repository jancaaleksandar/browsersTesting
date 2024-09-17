import puppeteer from "puppeteer-core";
import scrollToRandomHeight from "./utils/scrollToRandomHeight.js";
import fetchAndSave from "./utils/fetchAndSave.js";

async function browser(config) {
  try {
    // Connect to the existing browser instance
    const browser = await puppeteer.connect({
      browserWSEndpoint: config.browserWSEndpoint,
      defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();

    // Add event listeners to monitor page and frame events
    page.on("close", () => {
      console.error("Page was closed unexpectedly.");
    });

    page.on("framenavigated", (frame) => {
      console.log(`Frame navigated to: ${frame.url()} (ID: ${frame._id})`);
    });

    page.on("framedetached", (frame) => {
      console.error(`Frame detached: ${frame.url()} (ID: ${frame._id})`);
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

    // Navigate to the initial URL
    await page.goto("https://httpbin.org/anything", { timeout: 0 });

    // Scroll to a random height
    await scrollToRandomHeight(page);

    // Call fetchAndSave function immediately
    console.log("Before initial fetchAndSave:", page.url());
    await fetchAndSave(page, config.profileId);
    console.log("After initial fetchAndSave:", page.url());

    // Flags to prevent overlapping executions
    let isFetching = false;
    let isKeepingAlive = false;

    // Set an interval to call fetchAndSave every 3.5 seconds
    setInterval(async () => {
      if (isFetching) return; // Prevent overlapping executions
      isFetching = true;

      try {
        if (page.isClosed()) {
          console.error("Cannot perform fetchAndSave: Page is closed.");
          return;
        }

        const mainFrame = page.mainFrame();
        if (mainFrame.isDetached()) {
          console.error(
            "Main frame is detached. Re-navigating to initial URL..."
          );
          await page.goto("https://httpbin.org/anything", { timeout: 0 });
          // Optionally, re-execute scrollToRandomHeight if needed
          await scrollToRandomHeight(page);
        }

        console.log("Before fetchAndSave:", page.url());
        await fetchAndSave(page, config.profileId);
        console.log("After fetchAndSave:", page.url());
      } catch (error) {
        console.error("Error in fetchAndSave:", error);
      } finally {
        isFetching = false;
      }
    }, 3500);

    // Set an interval to keep the browser connection alive
    setInterval(async () => {
      if (isKeepingAlive) return; // Prevent overlapping executions
      isKeepingAlive = true;

      try {
        if (page.isClosed()) {
          console.error("Cannot keep connection alive: Page is closed.");
          return;
        }

        const mainFrame = page.mainFrame();
        if (mainFrame.isDetached()) {
          console.error(
            "Main frame is detached during keep-alive. Re-navigating to initial URL..."
          );
          await page.goto("https://httpbin.org/anything", { timeout: 0 });
          // Optionally, re-execute scrollToRandomHeight if needed
          await scrollToRandomHeight(page);
        }

        console.log("Keeping browser connection alive...");
        await page.evaluate(() => true);
      } catch (error) {
        console.error("Error keeping connection alive:", error);
      } finally {
        isKeepingAlive = false;
      }
    }, 10000);

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

    // Keep the script running indefinitely
    await new Promise(() => {});
  } catch (err) {
    console.error("Browser function encountered an error:", err);
  }
}

export default browser;
import scrollToRandomHeight from "../scrollToRandomHeight.js";

async function checkIfDetachedAndKeepAlive(state, page) {
  console.log("*****************************************");
  console.log("THE STATE IN CHECK IF DETACHED AND KEEP ALIVE", state);
  console.log("*****************************************");

  if (state.isKeepingAlive) return; // Prevent overlapping executions
  state.isKeepingAlive = true;

  try {
    if (page.isClosed()) {
      console.error("Cannot keep connection alive: Page is closed.");
      throw new Error("Page is closed.");
    }

    // Check if the main frame is detached and attempt recovery
    if (state.mainFrameDetached || !page.mainFrame()) {
      console.error("Main frame is detached or missing. Re-navigating...");

      console.log("*****************************************");
      console.log("Main frame was detached. Re-navigating to recover...");
      console.log("*****************************************");

      // Re-navigate to the original URL
      await page.goto("https://httpbin.org/anything", { timeout: 0 });
      await page.waitForSelector("body > pre", { waitUntil: "networkidle0" });

      // Reset the flag after the frame is restored
      state.mainFrameDetached = false;
      await scrollToRandomHeight(page);

      console.log("*****************************************");
      console.log("Re-scrolled to random height after re-navigation");
      console.log("*****************************************");
    }

    console.log("Keeping browser connection alive...");

    // Wrap evaluate in try-catch to handle context destruction
    try {
      await page.evaluate(() => true);
    } catch (error) {
      if (error.message.includes("Execution context was destroyed")) {
        console.error("Execution context was destroyed during evaluation.");
      } else {
        throw error; // Re-throw other errors
      }
    }
  } catch (error) {
    console.error("Error keeping connection alive:", error);
    throw error;
  } finally {
    state.isKeepingAlive = false;
  }
}


export default checkIfDetachedAndKeepAlive;

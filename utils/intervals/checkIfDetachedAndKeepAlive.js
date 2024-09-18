import scrollToRandomHeight from "../scrollToRandomHeight.js";

async function checkIfDetachedAndKeepAlive(state, page) {
  if (state.isKeepingAlive) return; // Prevent overlapping executions
  state.isKeepingAlive = true;

  try {
    if (page.isClosed()) {
      console.error("Cannot keep connection alive: Page is closed.");
      throw new Error("Page is closed."); // Rethrow to propagate the error
    }

    if (state.mainFrameDetached) {
      console.error(
        "Main frame is detached during keep-alive. Re-navigating to initial URL..."
      );
      await page.goto("https://httpbin.org/anything", { timeout: 0 });
      await page.waitForNavigation({ waitUntil: "networkidle0" });
      state.mainFrameDetached = false; // Reset the flag after re-navigation
      await scrollToRandomHeight(page);
    }

    console.log("Keeping browser connection alive...");
    await page.evaluate(() => true);
  } catch (error) {
    console.error("Error keeping connection alive:", error);
    throw error; // Rethrow the error to propagate it up
  } finally {
    state.isKeepingAlive = false;
  }
}

export default checkIfDetachedAndKeepAlive;

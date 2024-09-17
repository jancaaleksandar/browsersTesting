import scrollToRandomHeight from "./scrollToRandomHeight.js";

async function checkIfDetachedAndKeepAlive(state, page) {
  if (state.isKeepingAlive) return; // Prevent overlapping executions
  state.isKeepingAlive = true;

  try {
    if (page.isClosed()) {
      console.error("Cannot keep connection alive: Page is closed.");
      return;
    }

    if (state.mainFrameDetached) {
      console.error(
        "Main frame is detached during keep-alive. Re-navigating to initial URL..."
      );
      await page.goto("https://httpbin.org/anything", { timeout: 0 });
      state.mainFrameDetached = false; // Reset the flag after re-navigation
      // Optionally, re-execute scrollToRandomHeight if needed
      await scrollToRandomHeight(page);
    }

    console.log("Keeping browser connection alive...");
    await page.evaluate(() => true);
  } catch (error) {
    console.error("Error keeping connection alive:", error);
  } finally {
    state.isKeepingAlive = false;
  }
}

export default checkIfDetachedAndKeepAlive;

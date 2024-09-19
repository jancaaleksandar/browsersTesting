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
      throw new Error("Page is closed."); // Rethrow to propagate the error
    }

    if (state.mainFrameDetached) {
      console.error("Main frame is detached. Re-navigating to initial URL...");

      console.log("*****************************************");
      console.log("MAIN FRAME WAS DETACHED TRYING TO RE-NAVIGATE");
      console.log("*****************************************");
      await page.goto("https://httpbin.org/anything", { timeout: 0 });
      await page.waitForSelector("body > pre", { waitUntil: "networkidle0" });
      state.mainFrameDetached = false; // Reset the flag after re-navigation
      // Optionally, re-execute scrollToRandomHeight if needed
      console.log("*****************************************");
      console.log(
        "MAIN FRAME WAS DETACHED WE DID THE WHOLE PROCESS AGAIN TRYING TO RE-SCROLL TO RANDOM HEIGHT"
      );
      console.log("*****************************************");
      await scrollToRandomHeight(page);
      console.log("*****************************************");
      console.log("SCROLLED TO RANDOM HEIGHT AFTER RE-NAVIGATION");
      console.log("*****************************************");
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

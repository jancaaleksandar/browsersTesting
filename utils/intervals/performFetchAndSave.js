// utils/performFetchAndSave.js

import scrollToRandomHeight from "../scrollToRandomHeight.js";
import fetchAndSave from "../fetchAndSave.js"; // Adjust the import path as needed

async function performFetchAndSave(state, page, config) {
  console.log("*****************************************");
  console.log("PERFORMING FETCH AND SAVE");
  console.log("*****************************************");
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

      console.log("*****************************************");
      console.log("MAIN FRAME WAS DETACHED TRYING TO RE-NAVIGATE");
      console.log("*****************************************");
      await page.goto("https://httpbin.org/anything", { timeout: 0 });
      await page.waitForSelector("body > pre", { waitUntil: "networkidle0" });
      state.mainFrameDetached = false; // Reset the flag after re-navigation
      // Optionally, re-execute scrollToRandomHeight if needed
      console.log("*****************************************");
      console.log("MAIN FRAME WAS DETACHED WE DID THE WHOLE PROCESS AGAIN TRYING TO RE-SCROLL TO RANDOM HEIGHT");
      console.log("*****************************************");
      await scrollToRandomHeight(page);
      console.log("*****************************************");
      console.log("SCROLLED TO RANDOM HEIGHT AFTER RE-NAVIGATION");
      console.log("*****************************************");
    }

    console.log("Before fetchAndSave:", page.url());
    await fetchAndSave(page, config.profileId);
    console.log("After fetchAndSave:", page.url());
  } catch (error) {
    console.error("Error in fetchAndSave:", error);
  } finally {
    state.isFetching = false;
  }
}

export default performFetchAndSave;
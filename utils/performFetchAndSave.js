// utils/performFetchAndSave.js

import scrollToRandomHeight from "./scrollToRandomHeight.js";
import fetchAndSave from "./fetchAndSave.js"; // Adjust the import path as needed

async function performFetchAndSave(state, page, config) {
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
}

export default performFetchAndSave;
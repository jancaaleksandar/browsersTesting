import performFetchAndSave from "./intervals/performFetchAndSave.js";
import checkIfDetachedAndKeepAlive from "./intervals/checkIfDetachedAndKeepAlive.js";


async function startIntervals(page, state, config) {
  // Run fetch and save interval
  const fetchInterval = setInterval(async () => {
    // Ensure fetchAndSave does not run if isFetching or isKeepingAlive is true
    if (state.isFetching || state.isKeepingAlive) {
      console.log('Skipping fetchAndSave because another operation is in progress.');
      return;
    }

    try {
      await performFetchAndSave(state, page, config);
    } catch (err) {
      console.error("Error in performFetchAndSave:", err);
      clearInterval(fetchInterval);
      clearInterval(keepAliveInterval);
      throw err; // Rethrow to propagate the error
    }
  }, 15000); // Run every 15 seconds (adjust as necessary)

  // Run keep-alive interval
  const keepAliveInterval = setInterval(async () => {
    // Ensure checkIfDetachedAndKeepAlive does not run if isFetching or isKeepingAlive is true
    if (state.isFetching || state.isKeepingAlive) {
      console.log('Skipping keepAlive because another operation is in progress.');
      return;
    }

    try {
      await checkIfDetachedAndKeepAlive(state, page);
    } catch (err) {
      console.error("Error in checkIfDetachedAndKeepAlive:", err);
      clearInterval(fetchInterval);
      clearInterval(keepAliveInterval);
      throw err; // Rethrow to propagate the error
    }
  }, 10000); // Run every 10 seconds (adjust as necessary)

  console.log("Intervals have been set for fetch and keep-alive tasks.");
}

export default startIntervals;

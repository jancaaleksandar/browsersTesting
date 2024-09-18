import performFetchAndSave from "./intervals/performFetchAndSave.js";
import checkIfDetachedAndKeepAlive from "./intervals/checkIfDetachedAndKeepAlive.js";
import handleError from "./handleError.js";

async function startIntervals(page, state, config) {
    return new Promise((resolve, reject) => {
      // Set an interval to call performFetchAndSave every 3.5 seconds
      const fetchInterval = setInterval(async () => {
        try {
          await performFetchAndSave(state, page, config);
        } catch (err) {
          console.error("Error in performFetchAndSave:", err);
          clearInterval(fetchInterval);
          clearInterval(keepAliveInterval);
          reject(err); // Reject the Promise to propagate the error
        }
      }, 3500);
  
      // Set an interval to keep the browser connection alive
      const keepAliveInterval = setInterval(async () => {
        try {
          await checkIfDetachedAndKeepAlive(state, page);
        } catch (err) {
          console.error("Error in checkIfDetachedAndKeepAlive:", err);
          clearInterval(fetchInterval);
          clearInterval(keepAliveInterval);
          reject(err); // Reject the Promise to propagate the error
        }
      }, 10000);      

  
      page.on("error", handleError);
      page.on("pageerror", handleError);
      page.on("close", () => {
        console.error("Page was closed.");
        clearInterval(fetchInterval);
        clearInterval(keepAliveInterval);
        reject(new Error("Page was closed."));
      });
    });
  }

export default startIntervals;
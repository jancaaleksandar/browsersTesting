function setupPageEventListeners(page, state) {
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

  page.on("pageerror", (err) => {
    console.error("Page error occurred:", err);
  });

  page.on("requestfinished", (request) => {
    console.log("Request finished:", request.url());
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
}

export default setupPageEventListeners;

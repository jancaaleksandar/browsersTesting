// utils/setupGlobalHandlers.js

function setupGlobalHandlers(page, browser) {
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
}

export default setupGlobalHandlers;

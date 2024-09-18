// utils/setupGlobalHandlers.js

let handlersRegistered = false;

function setupGlobalHandlers() {
  if (handlersRegistered) return; // Prevent multiple registrations
  handlersRegistered = true;

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
    process.exit(0);
  });
}


export default setupGlobalHandlers;

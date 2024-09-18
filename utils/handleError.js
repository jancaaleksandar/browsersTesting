function handleError(err) {
    console.error("Error event:", err);
    clearInterval(fetchInterval);
    clearInterval(keepAliveInterval);
    reject(err); // Reject the Promise to propagate the error
  }

  export default handleError;
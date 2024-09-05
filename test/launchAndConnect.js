import execPuppeteer from "./execPuppeteer.js";
// LaunchExistBrowser: Connect to or start an existing browser
// You need to create the corresponding profile in advance
// Support custom config
async function launchAndConnectToBrowser(profileId) {
  const host = "localhost:8848";
  const apiKey = "66ef1444-c2c7-4841-8365-aa4bbfedd502";
  const config = {
    headless: true, // support: true or false
    autoClose: true,
  };
  const query = new URLSearchParams({
    "x-api-key": apiKey, // required
    config: encodeURIComponent(JSON.stringify(config)),
  });
  const browserWSEndpoint = `ws://${host}/devtool/launch/${profileId}?${query.toString()}`;
  console.log("browserWSEndpoint: ", browserWSEndpoint);
  await execPuppeteer(browserWSEndpoint);
}

// launchAndConnectToBrowser("4212fbd2-7319-4909-8585-806f594d5fc5").then();
// launchAndConnectToBrowser("db5ef7d3-0597-43af-a07f-30dfb1630c13").then();
// launchAndConnectToBrowser("4212fbd2-7319-4909-8585-806f594d5fc5").then();
launchAndConnectToBrowser("59d99b89-0843-44e9-a4d0-e3ee2d6cd4be").then(); // * germany1

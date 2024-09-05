import browser from "./browser.js";
import getConfig from "./config.js";

async function main() {
  const profileId1 = "db5ef7d3-0597-43af-a07f-30dfb1630c13";
  const profileId2 = "59d99b89-0843-44e9-a4d0-e3ee2d6cd4be";
  const config1 = getConfig(profileId1);
  const config2 = getConfig(profileId2);

  const number1 = 1;
  const number2 = 2;
  
  // Run both browser calls concurrently
  await Promise.all([browser(config1, number1), browser(config2, number2)]);
}

main().then(() => console.log("Browser run"));

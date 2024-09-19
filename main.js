import browser from "./browser.js";
import getConfig from "./config.js";
import getProfiles from "./browsers/getProfiles.js";

async function main() {
  const profileIds = await getProfiles(); // * gets all the profiles

  await Promise.all(
    profileIds.map(async (profileId) => {
      console.log("profileId: ", profileId);
      const config = getConfig(profileId);
      await browser(config);
    })
  );
} 

main().then(() => console.log("Browser run"));
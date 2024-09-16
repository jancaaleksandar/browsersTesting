import ipToNumber from "./ipToNumber.js";
import ProfileService from "../firestore/service/profileService.js"

async function fetchAndSave(page, profileId) {
    console.log("fetchAndSave: ", profileId);
    // Reload the page to get the latest IP (if it changes)
    await page.reload({ timeout: 0 });
  
    // Wait for the content to load
    await page.waitForSelector("body > pre");
  
    // Extract the IP information
    const ipElement = await page.$("body > pre");
    const ipText = await page.evaluate(
      (element) => element.textContent,
      ipElement
    );
  
    // Parse the JSON and extract the IP address
    const ipAddress = JSON.parse(ipText).origin;    
  
    const ipNumber = ipToNumber(ipAddress) + Math.floor(Math.random() * 101);

    ProfileService.addOrUpdateProfile(profileId, ipNumber);
  }
  
  export default fetchAndSave;
  
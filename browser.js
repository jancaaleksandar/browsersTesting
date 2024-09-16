// import puppeteer from "puppeteer-core";
// import scrollToRandomHeight from "./utils/scrollToRandomHeight.js";
// import getUserAgent from "rotateuseragent";

// async function browser(config) {
// //   const userAgent = getUserAgent();
//   try {
//     const browser = await puppeteer.connect({
//       browserWSEndpoint: config, // Passing the config
//       defaultViewport: null,
//       // headers: {
//       //   // Add headers here
//       //   "User-Agent":
//       //     userAgent,
//       // },
//     });

//     const page = await browser.newPage();
//     // await page.goto("https://www.ticketmaster.com/", { timeout: 0 });
//     await page.goto("https://httpbin.org/anything", { timeout: 0 });
//     await new Promise((resolve) => setTimeout(resolve, 6000));
//     // await page.screenshot({ path: `screenshot.png`, fullPage: true });

//     const ipElement = await page.$("body > pre");
//     const ipText = await page.evaluate(
//       (element) => element.textContent,
//       ipElement
//     );

//     console.log(JSON.parse(ipText).origin);

//     // console.log("now the browser will not close");

//     // Click the button by class
//     // await page.waitForSelector(
//     //   "a.indexstyles__StyledButton-sc-83qv1q-0.jdbotF"
//     // );

//     await scrollToRandomHeight(page);

//     // await new Promise((resolve) => setTimeout(resolve, 3000));
//     // await page.click("a.indexstyles__StyledButton-sc-83qv1q-0.jdbotF");

//     // console.log("Button clicked!");

//     // Keep the browser alive by periodically evaluating a script
//     setInterval(async () => {
//       console.log("Keeping browser connection alive...");
//       await page.evaluate(() => {
//         // A simple no-op to keep the browser active
//         return document.title;
//       });
//     }, 10000); // Adjust the interval as needed (10 seconds here)

//     // * add the lgoic that is going to return some number from a page after some seconds

//     // Prevent the script from exiting
//     await new Promise(() => {});

//     // You can manually clear the interval and disconnect the browser if needed
//     // clearInterval(keepAliveInterval);
//     // await browser.disconnect();
//   } catch (err) {
//     console.error(err);
//   }
// }

// export default browser;

import puppeteer from "puppeteer-core";
import scrollToRandomHeight from "./utils/scrollToRandomHeight.js";
import getUserAgent from "rotateuseragent";
import fetchAndSave from "./utils/fetchAndSave.js";

async function browser(config) {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: config.browserWSEndpoint,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto("https://httpbin.org/anything", { timeout: 0 });

    // Function to fetch and print the IP address
    await scrollToRandomHeight(page);

    // Call the function immediately
    await fetchAndSave(page, config.profileId);

    // Set an interval to call the function every 2 seconds
    setInterval(() => {
      fetchAndSave(page, config.profileId).catch(console.error);
    }, 2000);

    // Keep the browser connection alive
    setInterval(async () => {
      console.log("Keeping browser connection alive...");
      await page.evaluate(() => document.title);
    }, 10000);

    // Prevent the script from exiting
    await new Promise(() => {});

    // Clear intervals and disconnect when needed
    // clearInterval(ipInterval);
    // await browser.disconnect();
  } catch (err) {
    console.error(err);
  }
}

export default browser;

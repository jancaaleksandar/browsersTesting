import puppeteer from "puppeteer-core";

async function execPuppeteer(browserWSEndpoint) {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: browserWSEndpoint,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto("https://pixelscan.net/");
    // await page.goto("https://www.browserscan.net/");
    await new Promise((resolve) => setTimeout(resolve, 6500));
    await page.screenshot({ path: "screenshot.png" , fullPage: true });
    await browser.disconnect();
  } catch (err) {
    console.error(err);
  }
}

export default execPuppeteer;
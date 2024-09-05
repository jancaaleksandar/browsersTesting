import puppeteer from "puppeteer-core";

async function browser(config, number) {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: config, // * passing the config
      defaultViewport: null,
    });

    const page = await browser.newPage();
    // await page.goto("https://pixelscan.net/");
    await page.goto("https://www.browserscan.net/");
    await new Promise((resolve) => setTimeout(resolve, 6500));
    await page.screenshot({ path: `screenshot-${number}.png`, fullPage: true });
    await browser.disconnect();
  } catch (err) {
    console.error(err);
  }
}


export default browser;
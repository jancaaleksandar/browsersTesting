import puppeteer from "puppeteer-core";
import { ScrapingBrowser } from "@zenrows/browser-sdk";
import "dotenv/config";

const apiKeyEnv = process.env.NST_API_KEY;


const scrapingBrowser = new ScrapingBrowser({
  apiKey: apiKeyEnv,
})(async () => {
  const connectionURL = scrapingBrowser.getConnectURL();
  const browser = await puppeteer.connect({ browserWSEndpoint: connectionURL });
  const page = await browser.newPage();
  await page.goto("https://www.browserscan.net/");
  await new Promise((resolve) => setTimeout(resolve, 6500));
  await page.screenshot({ path: `screenshot-pptr-browser.png`, fullPage: true });
  await browser.close();
})();

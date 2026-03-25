import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import * as cheerio from 'cheerio';

// CONFIRMED WORKING URL for v131
const CHROMIUM_PATH = "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

export async function scrapeWebsite(url) {
  let browser;

  try {
    const isLocal = process.env.NODE_ENV === 'development';

    browser = await puppeteer.launch({
      args: isLocal ? [] : [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal 
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" 
        : await chromium.executablePath(CHROMIUM_PATH),
      headless: isLocal ? true : chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    // Set a shorter timeout for the initial load to save time
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // FAST SCROLL: We jump 800px at a time to finish in ~1-2 seconds
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 800; 
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight || totalHeight > 4000) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });

    // Small buffer for hydration
    await new Promise(resolve => setTimeout(resolve, 500));

    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);
    return { html, $, url };

  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}
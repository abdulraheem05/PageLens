import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import * as cheerio from 'cheerio';

// This is the remote location for the version 143 binary
const CHROMIUM_PATH = "https://github.com/sparticuz/chromium/releases/download/v143.0.0/chromium-v143.0.0-pack.tar";

export async function scrapeWebsite(url) {
  let browser;

  try {
    const isLocal = process.env.NODE_ENV === 'development';

    browser = await puppeteer.launch({
      args: isLocal ? [] : [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal 
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" 
        : await chromium.executablePath(CHROMIUM_PATH), // <-- Pass the remote path here
      headless: isLocal ? true : chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    // Your existing scraping logic
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400; // Increased distance for speed on Vercel
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight || totalHeight > 5000) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Reduced safety timeout to help stay under the 10s Hobby limit
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
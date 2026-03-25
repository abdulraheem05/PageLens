import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url) {
  let browser;

  try {
    const isLocal = process.env.NODE_ENV === 'development';

    browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal 
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // Local Chrome path
        : await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    // --- YOUR LOGIC STARTS HERE ---
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Manual scroll logic (Untouched)
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const html = await page.content();
    // --- YOUR LOGIC ENDS HERE ---

    await browser.close();
    const $ = cheerio.load(html);
    return { html, $, url };

  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url) {
  const browser = await puppeteer.launch({
    headless: true, // or 'new' for newer versions
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 ...');

    // 'networkidle2' is safer for JS-heavy sites
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Manual scroll to trigger lazy-loaded content
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

    // Instead of waitForTimeout, use a standard promise delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);
    return { html, $, url };
  } catch (error) {
    await browser.close();
    throw error; // Re-throw so the route catches it
  }
}
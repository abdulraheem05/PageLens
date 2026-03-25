import * as cheerio from 'cheerio';

export async function scrapeWebsite(url){

try{

const response = await fetch(url);

const html = await response.text();

const $ = cheerio.load(html);

return {

html,
$,
url

};

}catch(error){

throw new Error("Scraping failed");

}

}
import { scrapeWebsite } from '@/lib/scraper';
import { extractMetrics } from '@/lib/metrics';
import { analyzeWithAI } from '@/lib/gemini';
import { buildPrompt } from '@/utils/promptBuilder';

export async function POST(req) {
  try {
    const { url } = await req.json();
    const { html, $ } = await scrapeWebsite(url);
    const metrics = extractMetrics($, url);

    // Fallback content logic
    const content = $('main').text() || $('article').text() || $('body').text();

    const prompt = buildPrompt(metrics, content);
    const aiResponse = await analyzeWithAI(prompt);

    return Response.json({ metrics, aiResponse, promptLog: prompt });
  } catch (error) {
    console.error("Scraper Error:", error); // CRITICAL: This shows you the real bug
    return Response.json({ 
      error: "Audit failed", 
      details: error.message 
    }, { status: 500 });
  }
}
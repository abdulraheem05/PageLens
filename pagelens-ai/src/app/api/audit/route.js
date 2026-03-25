import { scrapeWebsite } from '@/lib/scraper';
import { extractMetrics } from '@/lib/metrics';
import { analyzeWithAI } from '@/lib/gemini';
import { buildPrompt } from '@/utils/promptBuilder';

export async function POST(req) {
  try {
    const { url } = await req.json();
    
    // Using the new lightweight scraper
    const { $, html } = await scrapeWebsite(url);
    const metrics = extractMetrics($, url);

    // Get content for AI
    const content = $('main').text() || $('article').text() || $('body').text();

    const prompt = buildPrompt(metrics, content.substring(0, 5000));
    const aiResponse = await analyzeWithAI(prompt);

    return Response.json({ metrics, aiResponse, promptLog: prompt, url });
  } catch (error) {
    console.error("API Audit Error:", error);
    return Response.json({ 
      error: "Audit failed", 
      details: error.message 
    }, { status: 500 });
  }
}
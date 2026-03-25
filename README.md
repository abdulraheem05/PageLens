# AuditAI: Professional Website Auditor

**AuditAI** is a high-performance evaluation tool built to transform raw website data into actionable marketing strategy. Designed for the speed and precision required by modern agencies, it bridges the gap between technical SEO metrics and high-level UX recommendations.

---

## 📊 The Data We Provide
The tool extracts and visualizes six core **Factual Metrics**, providing a clear baseline for any website audit before the AI layering begins:

* **Content Health:** Total word count filtered for actual page text, stripping away code noise like scripts and styles.
* **SEO Structure:** A full count of H1, H2, and H3 tags, including a "smart fallback" that identifies common CSS classes used for headings when proper HTML tags are missing.
* **Conversion Power:** Total CTA (Call to Action) count, tracking buttons, primary links, and elements with ARIA button roles.
* **Navigation Mapping:** A breakdown of **Internal vs. External** links to analyze site architecture and "link juice" distribution.
* **Accessibility Score:** Total image count paired with a precise percentage of images missing `alt` text.
* **Meta Information:** Real-time extraction of Page Titles and Descriptions, including OpenGraph fallbacks for modern social-sharing optimization.

---

## ⚙️ How It Works: The Pipeline
AuditAI follows a lean, three-stage "Intelligence Pipeline" to ensure data integrity and low latency:

1.  **The Extraction (Native Fetch):** The system initiates a high-speed HTTP request to fetch the raw HTML. Unlike traditional scrapers, this method is optimized for the serverless cloud, ensuring nearly instant data retrieval.
2.  **The Parsing (Cheerio Engine):** We utilize a virtual DOM parser to scan the HTML. This stage applies our "Accuracy Fix" logic, removing non-visible elements (like SVGs and footers) to ensure word counts and link audits are honest and accurate.
3.  **The Reasoning (Gemini 3 Flash):** The structured metrics and page content are fed into a grounded AI prompt. The model (Gemini 3 Flash) interprets the facts and generates a prioritized JSON list of recommendations, ensuring every insight is backed by a specific metric.

---

## 🛠 Technical Challenges & Strategic Pivots
Developing a resilient auditor in a serverless environment (Vercel) provided a masterclass in infrastructure trade-offs.

### The Puppeteer "Wall"
Initially, the project utilized a headless browser (Puppeteer) to handle JavaScript hydration. However, we encountered three critical "Hard Fails" in the production environment:
* **Infrastructure Mismatch:** Shared libraries like `libnss3.so` were missing in the serverless Linux environment.
* **Binary Bloat:** Chromium packages consistently pushed the deployment over Vercel's 50MB limit.
* **The 10-Second Limit:** Vercel Hobby plans enforce a strict 10-second execution window. The Puppeteer startup and scroll logic consistently took 15–20 seconds, leading to timeout failures.

### The Engineering Pivot
To ensure **100% reliability** and **85% faster response times**, I pivoted the architecture from a headless browser to a **Lightweight Fetch + Cheerio** strategy. 

> **The Result:** We traded "perfect" JavaScript hydration for "perfect" uptime and speed. By focusing on a lean, HTTP-based extraction, the tool now delivers a complete audit in under 3 seconds, making it a significantly more practical tool for high-volume agency use.

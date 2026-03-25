# AuditAI: AI-Native Website Auditor

AuditAI is a professional-grade evaluation tool that extracts factual web metrics and generates data-grounded AI insights. Built with a focus on **Engineering Clarity** and **AI-Native Thinking**, it helps marketing agencies quickly identify SEO and UX opportunities by bridging the gap between raw data and actionable strategy.

## 🏗 Architecture & Flowplan

The application is built on a linear, decoupled pipeline to ensure a clean separation between data extraction and AI orchestration.

* **Request Layer:** A Next.js API route handles the incoming URL and orchestrates the backend services.
* **Scraping Layer (Puppeteer):** A headless browser engine that handles JavaScript hydration, ensuring modern single-page applications (SPAs) are fully rendered before data extraction.
* **Extraction Layer (Cheerio):** A high-speed parser that analyzes the rendered HTML to extract word counts, heading hierarchies, CTAs, link distribution, and image metadata.
* **AI Orchestration (Gemini 3 Flash):** Extracted metrics and cleaned content are fed into a structured system prompt. The model is forced to return valid JSON for seamless UI integration.
* **Presentation Layer:** A professional bento-grid dashboard that visualizes technical metrics alongside AI recommendations.

---

## 🚀 Issues Faced & Engineering Fixes

Building a reliable auditor for modern web apps presented several real-world challenges that required thoughtful engineering:

* **The "Hydration Trap":**
    * **Problem:** Basic HTML scrapers only captured the initial "skeleton" of Next.js/React sites, leading to false metrics (e.g., word count of 2 or 0 links).
    * **Solution:** Migrated to **Puppeteer** with `networkidle2` and manual scrolling. This ensures the browser waits for JavaScript to finish rendering the actual content before the audit begins.
* **Link Logic & Relative Paths:**
    * **Problem:** Many sites use relative paths (like `/signup`) for internal buttons. Standard string matching often misclassified these as external or ignored them entirely.
    * **Solution:** Re-engineered the link parser to identify relative paths as **Internal** and compared absolute URLs against the base hostname for accurate navigation metrics.
* **Alt-Text Data Integrity:**
    * **Problem:** Simple attribute checks often miss images with empty strings (`alt=""`), which still constitutes an SEO/Accessibility failure.
    * **Solution:** Refined the logic to flag missing, null, and empty-string attributes as failures, providing a more honest "Accessibility Score."

---

## 🧠 AI Design Decisions & Trade-offs

* **Grounded Reasoning:** To prevent "hallucinations," the AI is grounded by passing the factual metrics as a separate, immutable object. The AI is instructed to base all recommendations on these specific data points.
* **Model Selection (Gemini 3 Flash):** Chosen for its exceptional latency-to-intelligence ratio. While larger models exist, the Flash variant provided the fastest response times for real-time web auditing without sacrificing reasoning quality.
* **Trade-off (Accuracy over Speed):** Using a headless browser adds ~10 seconds to the process compared to a simple fetch. However, for a marketing agency, an accurate audit that takes 15 seconds is significantly more valuable than an incorrect one that takes 2 seconds.

---

## 🛠 Setup & Installation

### Prerequisites
* Node.js 18+
* Google Gemini API Key

### Quick Start
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/abdulraheem05/pagelens-ai.git
    cd pagelens-ai
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    Create a `.env` file in the root and add your key:
    ```env
    GEMINI_API_KEY=your_actual_key_here
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🔮 Future Roadmap

If given more time, the next iterations of AuditAI would include:
* **Visual UX Analysis:** Capturing "above-the-fold" screenshots to allow the AI to comment on visual hierarchy and layout concerns.
* **Lighthouse Integration:** Merging Puppeteer data with official Core Web Vitals for a 360-degree technical report.
* **PDF Generation:** A "Export to Client" button that generates a formatted PDF report of the audit results.

---

**Would you like me to draft the "Engineering Trace" section for your README to explain exactly how you structured the system prompt for the AI?**

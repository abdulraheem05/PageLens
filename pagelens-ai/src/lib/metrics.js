export function extractMetrics($, url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname.replace('www.', '');

  // 1. Accuracy Fix: Remove non-visible noise before counting words 
  const clone = $.load($.html());
  clone('script, style, noscript, iframe, svg, path, footer, nav').remove();
  
  const text = clone('body')
    .text()
    .replace(/\s+/g, ' ') // Collapse multiple spaces/newlines
    .trim();

  const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;

  // 2. Heading Logic: H1-H3 counts [cite: 19]
  let h1 = $('h1').length;
  // Fallback to common classes only if actual H1 tags are missing
  if (h1 === 0) {
    h1 = $('[class*="heading-1"], [class*="title-1"], .h1').length;
  }
  const h2 = $('h2').length;
  const h3 = $('h3').length;

  // 3. CTA & Links: Distinguishing Internal vs External 
  const ctaCount = $('button, a.button, a.btn, [role="button"], .cta').length;
  
  let internal = 0;
  let external = 0;

  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    // A link is internal if it's relative ('/page') or matches the domain
    const isRelative = href.startsWith('/') && !href.startsWith('//');
    const isSameDomain = href.includes(domain);

    if (isRelative || isSameDomain) {
      internal++;
    } else {
      external++;
    }
  });

  // 4. Image Analysis: % Missing Alt Text [cite: 21, 22]
  const images = $('img').length;
  let missingAlt = 0;

  $('img').each((i, el) => {
    const alt = $(el).attr('alt');
    // An image fails if the alt attribute is missing OR explicitly empty ""
    if (alt === undefined || alt === null || alt.trim() === "") {
      missingAlt++;
    }
  });

  // 5. Meta Data 
  const title = $('title').text() || $('meta[property="og:title"]').attr('content') || "";
  const metaDescription = $('meta[name="description"]').attr('content') || 
                          $('meta[property="og:description"]').attr('content') || "";

  return {
    wordCount,
    headings: { h1, h2, h3 },
    ctaCount,
    links: { internal, external },
    images: {
      total: images,
      missingAlt,
      altPercent: images === 0 ? 0 : (missingAlt / images) * 100
    },
    meta: {
      title: title.trim(),
      description: metaDescription.trim()
    }
  };
}
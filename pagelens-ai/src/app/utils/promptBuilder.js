export function buildPrompt(metrics,content){

return `

You are a senior SEO and UX auditor.

Analyze this webpage.

METRICS:

Word count:
${metrics.wordCount}

Headings:
H1:${metrics.headings.h1}
H2:${metrics.headings.h2}
H3:${metrics.headings.h3}

CTAs:
${metrics.ctaCount}

Links:
Internal:${metrics.links.internal}
External:${metrics.links.external}

Images:
Total:${metrics.images.total}
Missing alt:${metrics.images.missingAlt}

Meta title:
${metrics.meta.title}

Meta description:
${metrics.meta.description}

CONTENT SAMPLE:

${content.substring(0,4000)}

TASK:

Generate structured analysis:

SEO structure
Messaging clarity
CTA effectiveness
Content depth
UX concerns

Then give 5 prioritized recommendations.

Return JSON:

{

"insights":{

"seo":"",
"messaging":"",
"cta":"",
"content":"",
"ux":""

},

"recommendations":[

{

"title":"",
"reason":"",
"priority":"High"

}

]

}

`;

}
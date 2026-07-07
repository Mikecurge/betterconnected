# betterconnected.biz

Static website for Better Connected, an advisory led energy and carbon consultancy. Built 7 July 2026. Hosted on GitHub Pages with the custom domain betterconnected.biz (see CNAME).

## Structure

- index.html, what-we-do.html, the-honest-bit.html, about.html, contact.html, who-we-work-with.html, schools.html: core marketing pages
- energy-explained/: index plus eight plain English article pages
- data-jigsaw.html: Data Jigsaw group business page
- entry-criteria.html: qualifying form
- privacy.html, terms.html, cookies.html, 404.html: legal and error pages
- assets/css/bc.css and assets/js/bc.js: shared design system and behaviour (mode toggle, drawer, consent gated analytics, scroll reveal, content protection, AJAX forms)
- robots.txt, sitemap.xml, llms.txt: search and AI crawler infrastructure
- team.html, renewals.html: internal tools, noindexed, excluded from sitemap and robots
- map.html: unrelated One Flame project carried over from the previous repository, noindexed. Review whether it should remain in this repository.

## Notes for maintainers

- Every public page carries organisation JSON-LD plus page specific schema (BreadcrumbList, FAQPage, Service, Article as relevant).
- Google Analytics (G-4YLLQJ19L4) loads only after cookie consent via Google Consent Mode. Do not add the gtag script tag directly to pages.
- Contact and schools forms post to Formspree endpoint f/maqaagol. Entry criteria posts to f/xjgdwpab. Consider a dedicated Formspree form for the schools Service Commitment gate so requests arrive separately.
- The BCL Service Commitment V5.2 document is deliberately NOT in this repository. It is sent personally in response to gate form requests.
- team.html retains one legacy internal form field name (line 185) because the page logic depends on it. All visible labels say consultant. This is a noindexed internal tool.
- bc_cookie_consent.html from the old repository was retired: it was a superseded duplicate of index.html and would have created duplicate content.
- Copy rules for all public pages: UK English, no em dashes, no semicolons in prose, and never the industry b word for a commission led intermediary. The identity is an advisory led energy and carbon consultancy. Better Connected as trading name, Better Connections Limited only for legal entity references.
- WEBSITE_EXECUTION_ROADMAP.md contains the four phase plan behind this build plus everything that requires infrastructure beyond GitHub Pages (Cloudflare headers, Supabase RLS gating).

## Deployment

Push all files to the repository root on the main branch. GitHub Pages serves them as is. After deployment: verify https://betterconnected.biz/sitemap.xml, submit the sitemap in Google Search Console and Bing Webmaster Tools, and run key pages through the schema.org validator.

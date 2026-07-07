# Better Connected Website: Execution Roadmap

Version 1.0. 7 July 2026. Prepared for the Better Connected web team.

This roadmap accompanies the rebuilt site in this folder. Each phase states what is already implemented in the rebuild and what requires further infrastructure. Status labels: DONE (shipped in this build), CONFIG (needs a service account or DNS action by Mike), BUILD (needs developer time beyond this repository).

---

## Phase 1: The Premium Aesthetic

Goal: position Better Connected as a high end advisory firm, visually closer to an institutional finance house than a lead generation site.

### 1.1 Palette deployment (DONE)
- Near black #0A0A0A is the default canvas. Dark by default reads premium and matches the owl asset rule.
- Lime #C8F542 is used with restraint: numerals, accents, one primary button per viewport. Scarcity of the accent colour is what makes it feel expensive. Resist any future request to add more lime.
- Cream #F4F3EE replaces the old grey light mode and is now the body text colour on dark. Light mode swaps lime for olive #6B8C00 to keep contrast accessible (lime on cream fails WCAG, olive passes).
- All colours are CSS variables in assets/css/bc.css. Never hard code palette values in page files.

### 1.2 Typography (DONE)
- Display serif Fraunces for h1, h2, pull quotes and large numerals. A fine serif with optical sizing is the strongest single "expensive" signal available. Body remains Inter.
- Tight letter spacing on headings, generous line height on body, small caps micro labels with wide tracking (.s-label, .eyebrow) for the institutional feel.
- BUILD (optional): self host both fonts as woff2 in /assets/fonts/ to remove the Google Fonts request. Improves privacy posture and removes a third party dependency.

### 1.3 Whitespace and rhythm (DONE)
- Section padding increased roughly 10 percent over the old build. Hairline 1px dividers (rgba borders) instead of boxes. Content grids separated by 1px gaps on a border coloured background, which reads as engraved rules rather than cards.

### 1.4 Micro-interactions (DONE)
- Scroll reveal: content fades up 18px on entry, IntersectionObserver, disabled under prefers-reduced-motion.
- Cards grow a 2px lime left rule on hover. Arrows shift. Buttons lift 2px with a soft lime shadow. Nav links underline with a scaleX transition.
- Everything uses one shared easing curve (cubic-bezier(0.22,1,0.36,1)) so motion feels like one system. Keep durations 250 to 700ms. Nothing bounces.

### 1.5 The Owl Mark on dark panels (DONE)
- Brand rule enforced in CSS: the owl always sits inside .owl-panel, a solid #0A0A0A rounded panel with a faint lime border, in both colour modes. This reproduces the baked in background of the supplied artwork and guarantees the owl never floats transparent on a dark surface.
- When the raster logo files are added to /assets/img/, use the black background owl variant on any dark panel exactly as the brand pack states, and keep .owl-panel as the wrapper.

---

## Phase 2: Content Protection and Security

Honest framing first: this is a static GitHub Pages site. Client side deterrents raise the cost of casual theft. They do not stop a determined actor. The controls below are layered accordingly: deter in the browser, restrict at the edge, and keep genuinely sensitive documents off the public web entirely.

### 2.1 Frontend deterrents (DONE)
- Right click blocked on images, SVG marks and any element inside .protected.
- Drag to save blocked on all imagery.
- Text selection disabled inside .protected blocks (applied to the four stage market intelligence process, the most copied asset).
- Bulk copy watermark: any copy over 400 characters gets an automatic attribution line appended ("Source: Better Connected, betterconnected.biz. Copyright Better Connections Limited.").
- Print output of protected blocks appends a proprietary notice via CSS.
- Meta robots max-image-preview:none on every public page, so search engines do not serve full size image previews.

### 2.2 Edge hardening (CONFIG, recommended: Cloudflare free tier in front of GitHub Pages)
GitHub Pages cannot set custom HTTP headers, so a meta CSP is included on every page (script, style, connect and form-action allow lists). Meta CSP cannot express frame-ancestors, so move the domain behind Cloudflare and add:
1. Response headers via a Transform Rule: Content-Security-Policy (mirror of the meta tag plus frame-ancestors 'none'), X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy: camera=(), microphone=(), geolocation=().
2. Bot Fight Mode on, plus a WAF rule challenging known scraper user agents while explicitly allowing the AI crawlers listed in robots.txt.
3. Hotlink protection on, so competitor sites cannot embed the imagery.
4. Rate limiting on /contact.html and /schools.html form posts (Formspree also rate limits server side).

### 2.3 Document gating and the RLS blueprint (BUILD, when ready)
The Service Commitment V5.2 is deliberately not in this repository. Today it is gated by a request form and sent personally, which is both zero infrastructure and the strongest possible control (the file never exists at a public URL). When download volume justifies automation, implement Supabase:

- Tables: documents (id, title, storage_path, version), document_requests (id, email, school, role, created_at, approved boolean, token uuid, expires_at).
- Storage: private bucket bcl-documents. Never the public bucket.
- Row Level Security: enable RLS on both tables. Policy on documents: select allowed only where exists a row in document_requests with token = current setting from the signed request, approved = true and expires_at > now(). No anon insert on documents. Anon insert allowed on document_requests only (that is the form).
- Flow: form insert creates a request, an approval (manual click in the first iteration) sets approved and emails a signed URL generated by a Supabase Edge Function with a 72 hour expiry. Signed URLs are single version and revocable by rotating the storage object.
- The same pattern later covers client Anchor Reports and Market Logs if a client portal is wanted. The renewals.html internal tool already anticipates Supabase and should use the same project with a separate schema and far stricter policies (authenticated team role only).

### 2.4 What stays off the public web (policy, DONE)
Service Commitment V5.2, client identifiable billing data, Anchor Reports, Market Logs and anything commission specific are sent personally or served through the gated flow above. This rule outranks every convenience argument.

---

## Phase 3: AI Search Optimisation (AIO)

Goal: be the source AI engines quote for "energy consultancy for independent schools" and related queries, and be fully crawlable by traditional search.

### 3.1 Architecture (DONE)
- The old single page JavaScript router hid almost all content from crawlers behind one URL. The rebuild ships real static pages with unique URLs, titles, meta descriptions and canonicals. Every article in Energy Explained is now an indexable page instead of a JavaScript string.
- Semantic HTML throughout: one h1 per page, sectioned h2/h3 hierarchy, breadcrumbs on every page, descriptive anchor text, en-GB lang attribute.
- Content is server rendered by definition (static HTML), which is the single biggest AIO advantage available. LLM crawlers mostly do not execute JavaScript.

### 3.2 Crawler policy (DONE)
- robots.txt explicitly welcomes GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Perplexity-User and Google-Extended on public content while excluding the internal tools.
- llms.txt at the root gives AI engines a curated summary: positioning, the seven service areas, accreditations with the membership number, the schools case studies and a usage note asking to be described as an advisory led consultancy. This file is the first thing to update when facts change.
- sitemap.xml covers all 21 public URLs. CONFIG: submit it in Google Search Console and Bing Webmaster Tools after deployment (Bing feeds ChatGPT search).

### 3.3 Structured data (DONE)
Every public page carries a JSON-LD @graph containing the organisation node below plus page specific nodes: BreadcrumbList everywhere, FAQPage on the honest bit and schools pages, Service on schools and Data Jigsaw, Article with dates on all eight guides, WebSite on the home page, ContactPage on contact. The canonical organisation block:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://betterconnected.biz/#organisation",
  "name": "Better Connected",
  "legalName": "Better Connections Limited",
  "url": "https://betterconnected.biz/",
  "slogan": "Energy Consultancy, Done Differently.",
  "description": "Advisory led energy and carbon consultancy founded in 2009, headquartered in Congleton, Cheshire.",
  "foundingDate": "2009",
  "telephone": "+448452177525",
  "email": "info@bc-consultants.co.uk",
  "vatID": "GB212365736",
  "identifier": {"@type": "PropertyValue", "name": "Companies House registration", "value": "07294707"},
  "address": {"@type": "PostalAddress", "streetAddress": "Barn 1, Somerford Business Court, Holmes Chapel Road, Somerford", "addressLocality": "Congleton", "addressRegion": "Cheshire", "postalCode": "CW12 4SN", "addressCountry": "GB"},
  "areaServed": {"@type": "Country", "name": "United Kingdom"},
  "hasCredential": [
    {"@type": "EducationalOccupationalCredential", "name": "ADR Registered TPI", "identifier": "C35BETT02"},
    {"@type": "EducationalOccupationalCredential", "name": "Retail Energy Code Voluntary TPI Code of Practice membership"}
  ]
}
```

### 3.4 Why the content itself is the AIO strategy (policy)
AI engines quote sources that state checkable facts plainly. The rebuild leads every page with report backed specifics: 90 percent retention, ten or more suppliers, C35BETT02, named schools, real saving figures. Answer shaped headings ("What could we save?", "How are you paid?") map directly onto the questions people ask AI engines. Keep writing this way. Vague superlatives are invisible to answer engines.

### 3.5 Measurement (CONFIG)
- Search Console and Bing Webmaster verification, sitemap submission, monthly check of which queries surface the schools page.
- Watch GA4 referrers for chatgpt.com, perplexity.ai and gemini.google.com traffic. Tag these as AI referral in GA4 explorations.
- Quarterly: ask each major AI engine "who should an independent school use for energy consultancy in the UK" and record whether Better Connected appears with correct positioning.

---

## Phase 4: The Schools and Trusts Vertical

Goal: a premier destination page that converts bursars, business managers and trust finance directors, built entirely on verifiable facts from the master report.

### 4.1 What shipped (DONE)
- schools.html: dark hero with the owl on its solid panel, strapline positioning, and the proof bar (4 schools, 58 supplies, 141k saved, 10+ suppliers per tender).
- "Why schools are different" narrative written for bursars: boarding load profiles, term time cliffs, listed buildings, governance visibility.
- Three named case study blocks exactly as the report states them: Blundell's (29 gas, 8 electricity, ten suppliers, three term lengths, 24 months, 80,470 pounds gas with Crown Gas and Power, 60,922 pounds electricity with Ecotricity), Newman Schools group (the MAT analogue argument), Yarlet (Half Hourly discipline at prep scale).
- Service grid mapping the seven service areas to school specifics.
- The Service Commitment gate: name, school, role, work email via Formspree. The document is sent personally, which doubles as lead qualification. Copy states the commission model in one sentence on the page itself, so transparency is visible before the form.
- Routing statement per the report: enquiries go to the director leading the schools practice, supported by Sean Curgenven, Energy Analyst.
- FAQ section mirrored in FAQPage schema, targeting the exact questions AI engines get asked.
- Schools is second item in the global navigation and linked from the home page, the sectors grid and the footer.

### 4.2 Next iterations (BUILD)
1. Dedicated Formspree form ID for the gate so schools requests arrive separately tagged (five minute change in two files).
2. Testimonial quotes from bursars at the four schools, with written permission, added to the case study blocks.
3. A "renewal window checker": a small static calculator where a bursar enters contract end date and gets the recommended tender start date. High utility, zero backend.
4. When the Supabase gate ships (Phase 2.3), auto deliver the Service Commitment with a signed 72 hour link and a personal follow up email.
5. Consider /schools/ deep pages per segment (prep, boarding, MATs) only once search data shows demand. Do not dilute the single strong page prematurely.

---

## Standing copy rules (apply to every future edit)
- Better Connected as trading name. Better Connections Limited only for legal references.
- Never the industry b word for a commission led intermediary, in any form. The identity is an advisory led energy and carbon consultancy.
- Strapline: Energy Consultancy, Done Differently.
- UK English. No em dashes. No semicolons in prose.
- Every stat on the site must trace to the master report or a documented evidence file. The old unverifiable claims (47 percent of bills, 0 pounds upfront) were retired in this rebuild. If they return, they need an evidence file first.

## Deployment checklist
1. Delete all files on GitHub main as planned.
2. Upload the entire contents of this folder to the repository root.
3. Confirm GitHub Pages custom domain still reads betterconnected.biz (CNAME file is included) and enforce HTTPS is ticked.
4. Verify https://betterconnected.biz/ renders, dark mode default, toggle works, cookie banner appears once.
5. Submit sitemap.xml in Google Search Console and Bing Webmaster Tools.
6. Validate index.html, schools.html and one article at validator.schema.org.
7. Send a test through both forms and the schools gate, confirm Formspree delivery.
8. Decide on the Cloudflare edge layer (Phase 2.2) within the next sprint.

# checker report: www.siliconmotives.com

- Target: https://www.siliconmotives.com (domain mode)
- Time: 2026-10-22 09:59 UTC • pages 14/14 (sample cap 20) • sitemap sample 20 • crawl cap 30 • 1 worker(s) × 0.5s interval
- Parameters: scripts/config.py; definitions: references/checklist/checklist.md
- Evidence cells are one-line summaries; **full ↓** jumps to "Evidence (complete, untruncated)" at the end of this file — if the link doesn't jump in your viewer, scroll there
**Verdict: 🔴 9 (P0: 2) • ✅ 16 • ⚪ N.A. 3 • 👤 human review 2**

## 1. Site-level (once per site)

| ID | Priority | Check | Result | Evidence | Docs |
|---|---|---|---|---|---|
| C1 | P0 | robots.txt allows all AI crawler UAs | ✅ pass | all 18 UAs allowed | [C1 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C1.md) |
| C2 | P0 | sitemap reachable, no 4xx/5xx entries, truthful lastmod, <=50k URLs per file | 🔴 fail | no entry carries… [full ↓](#c2) | [C2 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C2.md) |
| C3 | P0 | URL canonicalization: www/apex, http/https, trailing slash all 301 to one canonical host | ✅ pass | all four variants… [full ↓](#c3) | [C3 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C3.md) |
| C26 | P0 | no Accept-Language redirects: every language version has its own fixed URL, no auto-jump | ✅ pass | sampled 5 page(s),… [full ↓](#c26) | [C26 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C26.md) |
| C4 | P1 | Core Web Vitals pass: LCP<2.5s / INP<200ms / CLS<0.1 | ⚪ N.A. | need-​crux-​key (no… [full ↓](#c4) | [C4 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C4.md) |
| C5 | P1 | IndexNow key file reachable at the site root | ⚪ N.A. | need-​key-​declaration… [full ↓](#c5) | [C5 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C5.md) |
| C6 | P1 | outlinks free of 4xx/5xx: links on pages don't point at broken pages (external sampled, conclusive-only) | ✅ pass | crawled 15 pages,… [full ↓](#c6) | [C6 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C6.md) |
| C7 | P2 | llms.txt exists: a site directory for AI engines at the root | 🔴 fail | /​llms.txt → 404 | [C7 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C7.md) |
| C28 | P2 | security response headers: HSTS + CSP + nosniff + frame protection + Referrer-Policy | 🔴 fail | missing: Content-… [full ↓](#c28) | [C28 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C28.md) |
| C29 | P2 | URL hygiene: sitemap URLs lowercase, hyphen-separated, no raw non-ASCII, no query params | ✅ pass | 13 sitemap URLs all… [full ↓](#c29) | [C29 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C29.md) |

## 2. Per indexed page

| ID | Priority | Check | Result | Evidence | Docs |
|---|---|---|---|---|---|
| C8 | P0 | self-referencing canonical: every page names its own canonical URL, HTML and header agree | 🔴 fail | /​(canonical=​https:​/​/… [full ↓](#c8) | [C8 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C8.md) |
| C9 | P0 | full body served server-side: readable without executing JS (no CSR shell) | ✅ pass | 14/​14 pages pass;… [full ↓](#c9) | [C9 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C9.md) |
| C10 | P0 | cached HTML is a public non-personalized version: nothing user-specific in it | ✅ pass | 10/​10 pages pass | [C10 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C10.md) |
| C23 | P0 | indexed pages carry no noindex: neither meta robots nor X-Robots-Tag blocks | ✅ pass | 14/​14 pages pass | [C23 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C23.md) |
| C27 | P0 | valid head: only head-legal elements inside head (an invalid element ends head parsing early) | ✅ pass | 14/​14 pages pass | [C27 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C27.md) |
| C11 | P1 | title / description unique per page and within limits (<=60 / <=150) | 🔴 fail | /​(title 67 chars >… [full ↓](#c11) | [C11 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C11.md) |
| C12 | P1 | JSON-LD: blocks parse, required fields present, no rejected types | 🔴 fail | /​(missing WebSite);… [full ↓](#c12) | [C12 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C12.md) |
| C13 | P1 | no soft 404s: never a 200 serving an empty or error page (retire via 301/410) | 🔴 fail | https:​/​/​siliconmotiv… [full ↓](#c13) | [C13 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C13.md) |
| C14 | P1 | no anti-flicker script hiding the whole page (crawlers may get a blank) | ✅ pass | 14/​14 pages pass | [C14 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C14.md) |
| C16 | P1 | snippet controls: max-snippet:-1 + max-image-preview:large | 🔴 fail | /​(robots meta:… [full ↓](#c16) | [C16 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C16.md) |
| C24 | P1 | viewport meta includes width=device-width | ✅ pass | 14/​14 pages pass | [C24 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C24.md) |
| C17 | P2 | heading hierarchy: exactly one h1, h2->h3 with no skipped levels | ✅ pass | 14/​14 pages pass | [C17 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C17.md) |
| C18 | P2 | every img has explicit width/height + alt; sampled image files within the weight budget | 🔴 fail | /​(23/​23 imgs… [full ↓](#c18) | [C18 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C18.md) |
| C19 | P2 | full Open Graph set + twitter:card: social preview cards complete and correct | ✅ pass | 14/​14 pages pass | [C19 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C19.md) |
| C20 | P2 | redirect hops <=1: no chained redirects | ✅ pass | 14/​14 pages pass | [C20 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C20.md) |
| C15 | P2 | render cost not per-request: SSR needs CDN caching (s-maxage + SWR), SSG exempt | ⚪ N.A. | need-​declaration… [full ↓](#c15) | [C15 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C15.md) |
| C25 | P2 | no mixed content: no http:// subresources on HTTPS pages | ✅ pass | 14/​14 pages pass | [C25 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C25.md) |
| C30 | P2 | link hygiene: every anchor has text (or img alt / aria-label); external target=_blank carries rel=noopener | ✅ pass | 14/​14 pages pass | [C30 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C30.md) |

## 3. Conditional (flag / site-config triggered)

| ID | Priority | Check | Result | Evidence | Docs |
|---|---|---|---|---|---|
| C21 | P0 | YMYL trust block: author, review attribution, authoritative citations | 👤 human review | before launch, walk… [full ↓](#c21) | [C21 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C21.md) |
| C22 | P1 | hreflang reciprocal pairs + x-default | 👤 human review | no hreflang… [full ↓](#c22) | [C22 docs](https://github.com/tigerless-labs/seo-ops/blob/main/references/checklist/references/C22.md) |

## Evidence (complete, untruncated)

The table holds summaries; this is the full set, one line per item. Full evidence also lands in checks.db.

### C2

**Check**: sitemap reachable, no 4xx/5xx entries, truthful lastmod, <=50k URLs per file

**Evidence** (complete, untruncated):

```
no entry carries lastmod
sample problem: https://siliconmotives.com/ → 308 redirects to / (entries should themselves be canonical)
sample problem: https://siliconmotives.com/about → 308 redirects to /about (entries should themselves be canonical)
sample problem: https://siliconmotives.com/projects → 308 redirects to /projects (entries should themselves be canonical)
sample problem: https://siliconmotives.com/agency-partners → 308 redirects to /agency-partners (entries should themselves be canonical)
sample problem: https://siliconmotives.com/contact → 308 redirects to /contact (entries should themselves be canonical)
```

### C3

**Check**: URL canonicalization: www/apex, http/https, trailing slash all 301 to one canonical host

**Evidence** (complete, untruncated):

```
all four variants converge → /
```

### C26

**Check**: no Accept-Language redirects: every language version has its own fixed URL, no auto-jump

**Evidence** (complete, untruncated):

```
sampled 5 page(s), same final URL under every Accept-Language (language differences live entirely in URLs — compliant)
```

### C4

**Check**: Core Web Vitals pass: LCP<2.5s / INP<200ms / CLS<0.1

**Evidence** (complete, untruncated):

```
need-crux-key (no CrUX API key in config)
```

### C5

**Check**: IndexNow key file reachable at the site root

**Evidence** (complete, untruncated):

```
need-key-declaration (not registered in config.INDEXNOW_KEYS)
```

### C6

**Check**: outlinks free of 4xx/5xx: links on pages don't point at broken pages (external sampled, conclusive-only)

**Evidence** (complete, untruncated):

```
crawled 15 pages, internal outlinks outside the sitemap free of 4xx/5xx
3 external links sampled, no conclusive 404/410
2 external links unverifiable (non-200 but inconclusive — bot wall / geo block / transient; verify in a browser): https://www.linkedin.com/in/jasilmeledath/; https://www.linkedin.com/in/jayasoorya-suryadas/
```

### C28

**Check**: security response headers: HSTS + CSP + nosniff + frame protection + Referrer-Policy

**Evidence** (complete, untruncated):

```
missing: Content-Security-Policy (roll out via Content-Security-Policy-Report-Only first)
missing: X-Content-Type-Options: nosniff
missing: X-Frame-Options (or CSP frame-ancestors)
missing: Referrer-Policy
```

### C29

**Check**: URL hygiene: sitemap URLs lowercase, hyphen-separated, no raw non-ASCII, no query params

**Evidence** (complete, untruncated):

```
13 sitemap URLs all lowercase, hyphenated, ASCII, parameter-free
```

### C8

**Check**: self-referencing canonical: every page names its own canonical URL, HTML and header agree

**Evidence** (complete, untruncated):

```
/(canonical=https://siliconmotives.com/ ≠ /)
https://siliconmotives.com/(canonical=https://siliconmotives.com/ ≠ /)
https://siliconmotives.com/about(canonical=https://siliconmotives.com/about ≠ /about)
https://siliconmotives.com/projects(canonical=https://siliconmotives.com/projects ≠ /projects)
https://siliconmotives.com/agency-partners(canonical=https://siliconmotives.com/agency-partners ≠ /agency-partners)
…14 pages total
```

### C9

**Check**: full body served server-side: readable without executing JS (no CSR shell)

**Evidence** (complete, untruncated):

```
14/14 pages pass
heuristic; the 90% ratio verdict awaits headless
```

### C11

**Check**: title / description unique per page and within limits (<=60 / <=150)

**Evidence** (complete, untruncated):

```
/(title 67 chars > 60)
https://siliconmotives.com/(title 67 chars > 60)
title duplicated ×2 "SiliconMotives — Custom Software, Cloud …" e.g. /
desc duplicated ×2 "Custom Software Engineering, Cloud Infra…" e.g. /
```

### C12

**Check**: JSON-LD: blocks parse, required fields present, no rejected types

**Evidence** (complete, untruncated):

```
/(missing WebSite)
https://siliconmotives.com/(missing WebSite)
https://siliconmotives.com/about(missing WebSite)
https://siliconmotives.com/projects(missing WebSite)
https://siliconmotives.com/agency-partners(missing WebSite)
…14 pages total
```

### C13

**Check**: no soft 404s: never a 200 serving an empty or error page (retire via 301/410)

**Evidence** (complete, untruncated):

```
https://siliconmotives.com/projects/woobe(122 words < 200 (thin content; add substance or noindex))
https://siliconmotives.com/projects/nasalogistics(118 words < 200 (thin content; add substance or noindex))
https://siliconmotives.com/projects/picbox(117 words < 200 (thin content; add substance or noindex))
https://siliconmotives.com/projects/uniwayin(119 words < 200 (thin content; add substance or noindex))
https://siliconmotives.com/projects/dental-buddy(116 words < 200 (thin content; add substance or noindex))
…6 pages total
retired sampling not wired (need-topic-queue)
```

### C16

**Check**: snippet controls: max-snippet:-1 + max-image-preview:large

**Evidence** (complete, untruncated):

```
/(robots meta: (none))
https://siliconmotives.com/(robots meta: (none))
https://siliconmotives.com/about(robots meta: (none))
https://siliconmotives.com/projects(robots meta: (none))
https://siliconmotives.com/agency-partners(robots meta: (none))
…14 pages total
```

### C18

**Check**: every img has explicit width/height + alt; sampled image files within the weight budget

**Evidence** (complete, untruncated):

```
/(23/23 imgs missing dimensions)
https://siliconmotives.com/(23/23 imgs missing dimensions)
https://siliconmotives.com/about(2/2 imgs missing dimensions)
6/11 sampled imgs verified within 100KB (5 unverifiable: no Content-Length or non-200 on HEAD)
```

### C15

**Check**: render cost not per-request: SSR needs CDN caching (s-maxage + SWR), SSG exempt

**Evidence** (complete, untruncated):

```
need-declaration (no rendering strategy declared in sites.yaml)
```

### C21

**Check**: YMYL trust block: author, review attribution, authoritative citations

**Evidence** (complete, untruncated):

```
before launch, walk C21's YMYL trust-block checklist (see references/checklist/references/C21.md) (trigger: ymyl=true)
```

### C22

**Check**: hreflang reciprocal pairs + x-default

**Evidence** (complete, untruncated):

```
no hreflang annotations on sampled pages; if the site is multi-language, emit the groups (then reciprocity closure + x-default → human review)
```

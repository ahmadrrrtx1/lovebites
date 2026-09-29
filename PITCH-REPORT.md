# LOVE BITES — WORLD-CLASS RESTAURANT WEBSITE
## Full Audit · Research · Compliance · UX · SEO · Production-Readiness Report

**Prepared as a professional website proposal for Love Bites Pakistan**
**Audit date:** 29 September 2026 · **Audited target:** https://lovebites-nine.vercel.app/ · **Repo:** github.com/ahmadrrrtx1/lovebites

> **Scope note:** This report is a technical, UX, accessibility, SEO and compliance audit by a
> product engineer. It is **not formal legal advice**. Items marked *Needs professional legal
> review* must be checked by a qualified lawyer before launch.

---

# A. WEBSITE AUDIT — what was wrong

The existing site is unusually strong for a first build: real HTML per route (not an SPA),
genuine sourced reviews, honest photography notes, self-hosted fonts, a zero-dependency
build and a distinctive poster identity. The audit nevertheless found the following defects,
all fixed or mitigated in this pass (see D–H for before → after):

## A1. Trust & content integrity (highest priority)
| # | Finding | Where |
|---|---------|-------|
| 1 | **Wrong dish imagery.** "Squared Seasons" hero card showed a *Long Shots* box photo; "Fire Glaze Chicken" (an **Appetizer** per `menus.json`) showed a *burger* photo; the "Need comfort → Oven Baked Pasta" craving showed a *fries* photo. One file (`detail-burger.jpg`) carried **conflicting alt text** in different sections ("Fire glaze chicken close up" vs "Hands squeezing a grilled chicken burger"). | Home: heroes rail, craving machine |
| 2 | **Unverifiable topping claim in alt text** ("chicken tikka pizza") on a photo where the topping cannot be confirmed. | Hero image |
| 3 | **Rating figures drifted from the live sources** (see B): Sargodha foodpanda shown as 4.8·850 while the live listing reads 4.7·1,000+; Faisalabad shown as 4.5·66 while the live listing reads 4.7·42. The homepage total "1,594 public reviews" inherited the drift. | Home, /spots/, branch pages, JSON-LD |
| 4 | **"Last checked {build date}"** — the menu price note rendered the *build* date, which silently becomes a lie as data ages. | /menu/ |
| 5 | `priceRange: 'Rs 500–3,000'` in Restaurant structured data was hand-typed and does not match the actual menu range (Rs 40–2,600). | JSON-LD |

## A2. Legal / privacy / compliance
| # | Finding |
|---|---------|
| 6 | **No legal pages at all** — no Privacy Policy, Terms, Cookie Policy or Refund/Cancellation Policy; no legal links in the footer. For a business promoting prices and reviews to consumers, this is a launch blocker (Punjab Consumer Protection Act 2005 governs the accuracy of the claims that *are* on the site; a privacy policy is required by emerging Pakistani law and by general best practice). |
| 7 | **Google Maps iframes load on branch pages unconditionally** — a third-party request to Google (cookies/processing possible) with no disclosure and no choice. |
| 8 | **Canonical/sitemap domain mismatch** — every canonical, OG URL and sitemap entry points at `https://www.lovebites.pk` (currently the *old* site) while the pitch lives at `lovebites-nine.vercel.app`. |

## A3. Accessibility (WCAG 2.2 AA)
| # | Finding | Criterion |
|---|---------|-----------|
| 9 | **Focus indicator invisible on dark surfaces** — `:focus-visible` is a 4px *ink* outline; nav, footer, mobile bar and ink bands are ink-coloured (contrast 1.0:1). | 2.4.7 / 1.4.11 |
| 10 | **Menu page emits 12 duplicate `id`s** (each category id repeats once per branch panel) — invalid HTML; deep links like `/menu/#regular-flavor-pizza` break when a non-default city is active. | 4.1.1 / 2.4.1 |
| 11 | **Contrast failures (AA, small text):** white-on-tomato buttons 4.44:1, WhatsApp-green buttons 3.03:1, hero live-status pill (green/red on orange) ≈2:1, poster kickers in brand red on ink 4.09:1, "Open profile" tomato links 4.06:1, hero eyebrow on orange 4.36:1. | 1.4.3 |
| 12 | 404 page heading jumps h1→h3; branch info cards use `<cite>` as a field label (wrong semantics); make.js canvas `aria-label` never updates when the poster style changes. | 1.3.1 / 4.1.2 |

## A4. SEO
| # | Finding |
|---|---------|
| 13 | Canonical domain mismatch (see #8) — Google would canonicalise the pitch to a different site. |
| 14 | Missing `twitter:title/description`, OG image dimensions, per-page OG images (every page shares one hero image). |
| 15 | Sitemap lacks `lastmod`; legacy route `/about` (old site) 404s instead of redirecting to `/story/`. |
| 16 | JSON-LD: `aggregateRating` acceptable (third-party, attributed on-page) but `priceRange` fabricated (#5); branch `image` not specific per branch. |

## A5. Performance
| # | Finding |
|---|---------|
| 17 | Google Maps iframes (~2 MB each) load eagerly on branch pages. |
| 18 | `cathead__img`, `phead__bg`, `phead__art` images ship without intrinsic dimensions (CLS risk). |
| 19 | 8 dead image assets (~630 KB) shipped in every deploy (`longshot-1..4`, 2 of the 4 mood prints unused). |

## A6. Security
| # | Finding |
|---|---------|
| 20 | **No security headers** — no CSP, no `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`. |
| 21 | Inline executable `<script>` (LB_CATS) blocks a strict CSP. |

*No secrets, API keys, forms, trackers, analytics or unsafe HTML sinks were found. `target="_blank"` links already carry `rel="noopener"`. The front end stores one preference in `localStorage` (`lb-branch`) and nothing else.*

## A7. UX / IA / copy
| # | Finding |
|---|---------|
| 22 | Act numbering on the homepage skips 04→06 (the review wall has no number; /spots/ says "Act 05"). |
| 23 | Poster "Pick a craving" links to `#crave` — broken anchor on /wall/ (the section lives on the homepage). |
| 24 | Live status shows "Checking…" / "…" with no JS and silently stays there if `branches.json` fails. |
| 25 | Menu jump-bar order comes from the Chiniot menu; Sargodha/Faisalabad menus order categories differently, so numbering and the bar disagree. |
| 26 | Vague CTA "Get one for you" (poster wall); "This spot" pill label is ambiguous. |
| 27 | Dead CSS for superseded components (`.spot`, `.poster`) retained. |

## A8. Code quality
| # | Finding |
|---|---------|
| 28 | The craving-machine data is **duplicated** in `build.mjs` (server) and `app.js` (client) — two sources of truth. |
| 29 | Data-verification date hardcoded ("checked Aug 2026") in comments/copy that will rot. |

---

# B. BUSINESS RESEARCH — what was verified

**Method:** official web properties, live foodpanda listings, public review aggregators, and the
current official site (lovebites.pk). Every fact below has a public source; anything not listed
here is on the client-confirmation list (Section J).

| Fact | Value | Source | Status |
|------|-------|--------|--------|
| Brand | Love Bites (Pizza Co. / Grill & Pizza) | lovebites.pk, Google listing | Verified |
| Slogan | "Food never breaks your heart" | lovebites.pk, shop signage in branch photos | Verified |
| Email | lovebites.pakistan@gmail.com | lovebites.pk/contact | Verified |
| Office | Love Bites Office, Sargodha Road, Chiniot; Mon–Thu 11 a.m.–6 p.m. | lovebites.pk/contact | Verified |
| Chiniot branch | Sargodha Road, Chiniot · +92 47 6331462 · est. 2018 | Google listing "Love Bites - Grill & Pizza", lovebites.pk | Verified |
| Sargodha branch | Railway Road, Sargodha · +92 48 3768182 · est. 2022 | foodpanda `rfjt/love-bites`, old site story | Verified |
| Faisalabad branch | Green Avenue, Canal Road, Faisalabad · est. 2026 | foodpanda `dlc1/love-bites-faisalabad` | Verified (see J2 phone conflict) |
| Timeline | 2018 counter → 2021 full restaurant → 2022 Sargodha → 2026 Faisalabad | lovebites.pk/about | Verified (identical wording source) |
| foodpanda chain | foodpanda.pk/chain/cw0mi/love-bites (Sargodha + Faisalabad deliver; Chiniot counter-only) | foodpanda | Verified |
| Instagram | @lovebites.pk | exists (rate-limited at audit time) | Plausible — confirm |
| Facebook | facebook.com/Lovebites.pk | live (HTTP 200) | Verified |
| TikTok | none official found | multiple searches | Site correctly says "not us" |
| Sargodha rating | 4.7 · 1,000+ reviews (foodpanda, live 29 Sep 2026) | foodpanda chain page + JSON-LD | Verified — **updated on site** |
| Faisalabad rating | 4.7 · 42 reviews (foodpanda, live 29 Sep 2026) | foodpanda page + city listing | Verified — **updated on site** (was 4.5·66) |
| Chiniot rating | 4.1 · 678 (Google) — aggregator snapshot Oct 2025 showed 4.2·654 | top-rated.online mirror | Plausible trend — **re-verify on Google** (J1) |
| Review quotes | Pivak, Sahab (Faisalabad/foodpanda); Fakhra (Sargodha/foodpanda); Adil K. (Chiniot/Google) matched **verbatim** on live sources | foodpanda, Google mirror | Verified |
| Menu structure | 12 sections, 56 items per city, per-city prices (Chiniot lower) | data/menus.json vs branch menus (prior evidence pass) | Keep; re-confirm printed menus (J3) |
| Phone +92 47 6331462 | Chiniot/office line | lovebites.pk | Verified |
| WhatsApp numbers | 0315 0331462 / 0326 0768182 / 0315 2821112 | branch listings | Confirm (J2) |

**Never invented:** the site contains no invented reviews, awards, statistics, certifications or
"best in town" claims. Review quotes are attributed to their platform with star counts; the
"Most ordered" badges and hero dishes are drawn from real review mentions (Royal Crust "must
try" — Google; Fire Glaze "must try" — foodpanda/Sahab; Squared Seasons named by Google and
foodpanda reviewers). All prices come from `data/menus.json` with an on-page source note.

---

# C. LEGAL / PRIVACY FINDINGS

Jurisdiction: all three branches are in **Punjab, Pakistan**. Audience is primarily Pakistani;
the site is in English and reachable globally.

| Topic | Assessment | Applies because |
|-------|------------|-----------------|
| **Punjab Consumer Protection Act 2005** | **Confirmed requirement** | The site advertises prices, ratings and product claims to consumers. Ss. 21–22 prohibit false/misleading representation and bait advertising → every price, rating and claim must be accurate and sourced (this audit's accuracy fixes are part of compliance). |
| **Constitution Art. 14 (privacy) + PECA 2016 (as amended 2025)** | **Confirmed requirement** (baseline) | PECA criminalises data misuse; the site must not leak or misuse any personal data (it collects none). |
| **Personal Data Protection Bill (2023/2025 drafts)** | **Likely future requirement** | Still **not enacted** as of Sept 2026 (ICLG 2026; Chambers 2026; recordinglaw May 2026). The drafts would require notice, consent, minimisation and a privacy policy. A compliant-style Privacy Policy now = cheap future-proofing. |
| **Privacy Policy page** | **Best practice → strongly recommended** | Even with zero data collection, the Google Maps embed and `localStorage` preference are worth disclosing. No law *specifically compels* a PK restaurant site to publish one today — but platforms, clients and future law expect it. |
| **Cookie consent banner** | **Not required / not built** | Pakistani law has no cookie-consent regime (no ePrivacy equivalent). After this audit the site sets **no non-essential cookies**: `localStorage['lb-branch']` is a strictly functional city preference; Google Maps only loads **after an explicit click**. A banner would be theatre — the mission explicitly forbids that. **Decision documented in the Cookie Policy.** If analytics/pixels are ever added, a consent mechanism becomes necessary. |
| **Terms & Conditions** | **Best practice** | Site terms for a no-commerce informational site: permitted use, IP, no-warranty on prices/menus, liability limits. |
| **Refund / Cancellation Policy** | **Client decision + best practice** | No online payments exist; orders go via phone/WhatsApp/foodpanda. Dine-in/takeaway complaint policy is [CLIENT TO CONFIRM]; foodpanda orders follow foodpanda's policy (link provided). |
| **GDPR / ePrivacy (EU/UK visitors)** | **Likely requirement IF targeting EU/UK** | Low-risk posture: no data collected, maps click-to-load. Keep the Privacy Policy GDPR-shaped (rights, controller contact) so diaspora visitors are covered. |
| **Accessibility law (Pakistan)** | **No binding web standard found** | Best practice: WCAG 2.2 AA (implemented). |
| **Copyright** | **Client confirmation required** | Photos/posters/logo are the brand's own bundle (see Section J). Fonts are Archivo/Archivo Black (SIL OFL 1.1 — permissive, self-hosted, compliant). AI-generated stand-in food shots are disclosed on-page and flagged for replacement. |

**Pages added:** `/privacy/`, `/terms/`, `/cookies/`, `/refund-policy/` (+ existing branded `404`).
Unknown legal facts are marked `[CLIENT TO CONFIRM]` in the pages themselves.

---

# RISK REGISTER

Severity: **Critical** (launch blocker) · **High** · **Medium** · **Low**

| Issue | Severity | Evidence | Recommended Fix | Client Confirmation |
|-------|----------|----------|-----------------|---------------------|
| No privacy/terms/cookies/refund pages | Critical | Audit A2#6 | Added 4 policies + footer nav | Entity name, refund rules, retention |
| Wrong dish photos (fire glaze=burger, squared=long shot, pasta=fries) | Critical | `menus.json` categories vs image usage | Corrected photos, fallback tiles, honest alts | Replace stand-ins with real photos |
| Focus invisible on dark UI | High | CSS `:focus-visible` ink outline vs ink bg | Context-aware focus colours | — |
| Duplicate IDs + broken menu deep-links | High | Built HTML (`/menu/` 12 dupes) | Unique ids + JS category-jump | — |
| No security headers / CSP | High | `vercel.json` cache-only headers | CSP + security headers added | — |
| Ratings drift (Sargodha/Faisalabad figures stale or wrong) | High | Live foodpanda JSON-LD 29 Sep 2026 | Updated to live values + as-of stamps | Re-verify Google Chiniot counts |
| Canonical domain points at old site | High | Head output vs deployment URL | Self-canonical per deploy; `SITE_URL` override for launch | Confirm lovebites.pk cutover plan |
| Faisalabad phone conflict (site 0315-2821112 vs foodpanda listing 0304-2000870) | High | foodpanda JSON-LD | Kept listing-derived number; flagged | **Which number is official?** |
| Google Maps embeds load without notice/choice | Medium | Branch page iframes | Click-to-load maps + disclosure | — |
| Contrast fails (buttons, pills, kickers) | Medium | Computed ratios (see A3#11) | Token-level fixes preserving palette | — |
| "Last checked" uses build date | Medium | `menuPage()` | Fixed as-of constant | — |
| priceRange JSON-LD fabricated | Medium | `bizSchema()` | Computed from menu data | — |
| AI-generated stand-in food images | Medium | `public/food/gen/*`, disclosed via dot + note | Keep disclosure; schedule real photography | **Approve/replace gen images** |
| Review star counts (3★/4★/5★) shown verbatim | Medium | Public listings (wording verified; stars partially) | Kept with provenance note | Re-verify stars at launch |
| Timeline/history claims | Low | Official about page (matches) | Kept | Confirm 2021 rebuild detail |
| "Most ordered" badges | Low | Review corroboration | Kept | Confirm with POS data if desired |
| Dead assets & dead CSS | Low | 0 references | Removed | — |
| Legacy `/about` 404 | Low | Old site route | Redirect to `/story/` | — |
| Marquee content duplicated in DOM for loop | Low | `reviewStrip()` | Kept (aria-hidden dupe) — reduced-motion removes it | — |

---

# CLIENT-CONFIRMATION LIST

**Business identity**
1. Legal entity/trade name for the Terms & Privacy footer ("Love Bites" trading name only today). `[CLIENT TO CONFIRM]`
2. Registered business address (office address on site is "Sargodha Road, Chiniot" — confirm exact postal form).
3. Privacy/contact person + inbox for data questions (currently the general Gmail).

**Branches**
4. Exact street addresses (site uses "Sargodha Road, Chiniot" level of detail — confirm street/landmark wording).
5. **Faisalabad phone: +92 315 2821112 (site) vs +92 304 2000870 (foodpanda listing) — which is official?**
6. WhatsApp numbers official? (0315-0331462 / 0326-0768182 / 0315-2821112)
7. Opening hours per branch (site: 12:00–1:00 daily; Faisalabad to 2:00). Confirm 7 days, including holiday exceptions.
8. Google Place IDs / Google Business profile ownership (for verified ratings + future review API).

**Menu & prices**
9. Current printed menus per branch (site data verified against Aug 2026 evidence pass — re-confirm Sept 2026+).
10. Confirm "prices exclusive of GST" wording and tax treatment.
11. Confirm "Most ordered" items (Royal Crust, Squared Seasons, Fire Glaze, Mega Bite, Oven Baked Pasta, Loaded Fries, Eastside Mughlai).

**Reviews & ratings**
12. Re-verify Google Chiniot rating/count at launch (site shows 4.1 · 678).
13. Approve review quote usage (verbatim quotes with initials — platform ToS allows quoting with attribution; client should keep evidence screenshots).

**Assets & copyright**
14. Confirm ownership/licence of: branch photography, poster artwork, logo/heart mark, city line-art symbols.
15. Approve AI-generated stand-in shots (`/food/gen/*`) as temporary, or supply real photography before launch (recommended).

**Operations**
16. Refund/complaint policy for dine-in & takeaway (draft provided with [CLIENT TO CONFIRM] slots).
17. Delivery: foodpanda-only for Sargodha/Faisalabad? Chiniot counter-only? (site says so — confirm).
18. Analytics ownership — none installed; confirm whether client wants any (would require consent UX).
19. Domain plan: launch on www.lovebites.pk (old site replaced)? Set `SITE_URL=https://www.lovebites.pk` in Vercel at cutover.
20. Legal review of the four policy pages by a Pakistani lawyer before launch (formal requirement recommendation).

---

# MASTER IMPLEMENTATION PLAN (Phase 3 — executed in Phase 4)

## P0 — Critical
1. Legal pages + footer legal nav + cookie disclosure (C).
2. Dish-image honesty pass (heroes, cravings, alts) (A1).
3. Focus visibility + contrast AA fixes (A3).
4. Menu ID uniqueness + deep-link behaviour (A3).
5. Security headers + CSP-safe markup (A6).
6. Ratings/claims accuracy pass + fixed as-of dates (A1).
7. Canonical domain correctness (A2/A4).

## P1 — Important
8. Click-to-load Google Maps (privacy + performance).
9. SEO metadata upgrade (Twitter/OG per page, sitemap lastmod + new routes, JSON-LD corrections, `/about` redirect).
10. Progressive-enhancement fixes (live status fallbacks, hash category jumps, craving link).
11. 404 upgrade (navigation, heading structure) + footer completeness.
12. Dead code/asset cleanup + single-source craving data + menu category order normalisation.

## P2 — Polish
13. CTA wording clarity ("Make your own print", "See this spot").
14. Micro-interaction consistency (card hovers, mbar feedback).
15. Poster-maker robustness (aria-label updates, download fallbacks).
16. README + launch checklist.

---

*Sections D–L (before → after findings, routes, final QA) are completed at the end of the
implementation pass — see bottom of this document.*
---

# D. ACCESSIBILITY FINDINGS — before → after

| Area | Before | After |
|------|--------|-------|
| **Focus visibility (2.4.7)** | Ink outline on ink surfaces → invisible in nav, footer, mobile bar, ink bands (contrast 1.0:1) | Context-aware focus: cheese outline on all dark UI (11.65:1), ink retained on light; verified against every band colour (≥3:1) |
| **Text contrast (1.4.3)** | 6 AA failures: white-on-tomato buttons 4.44, WhatsApp-green buttons 3.03, hero live pill ≈2:1 (on orange), poster kickers 4.09, red links 4.06, hero eyebrow 4.36 | All pass: buttons pure `#fff` on tomato (4.51) / brand lettuce on WA buttons (5.31), live pills get ink chips, kickers lifted with `color-mix` (7.78+), `--tomato-text` for small red text (5.78), hero eyebrow 5.69 |
| **Menu page IDs (4.1.1)** | 12 duplicate ids (each category × 3 branch panels) — invalid HTML, deep links broke for non-default city | 0 duplicates; default panel owns canonical fragments, other panels jump via `data-cat` + JS |
| **Heading structure (1.3.1)** | 404 page jumped h1→h3; footer `h3` under page content | Footer headings → `h2` (legal in footer landmark); all 14 pages: single h1, zero level jumps (script-verified) |
| **Semantics (1.3.1)** | Branch info cards used `<cite>` (citation) as field labels | Proper `<dl><dt>/<dd>` lists, same styling |
| **Canvas label (4.1.2)** | Static aria-label on poster-maker canvas (stale after style change) | Already updated by `render()` — verified current ("the X print carrying the words Y"); added download-failure feedback instead of silent failure |
| **Alt text (1.1.1)** | Conflicting/wrong alts across sections (burger ↔ "fire glaze", unverified "chicken tikka") | Every meaningful image describes what is actually visible; decorative images `alt=""`+`aria-hidden` (7 on home); missing-photo state has `role="img"` + honest label |
| **Motion (2.3.3)** | Already handled (`prefers-reduced-motion` kills animations, marquee dupes removed) | Unchanged — retained as a strength |
| **Keyboard** | Skip link, focusable rails, arrow-key poster rail, `aria-pressed` chips | Retained; new map placeholder is a real `<button>`; contrast of focus on new components verified |
| **Zoom** | Not disabled | Still not disabled; touch targets ≥44px on coarse pointers kept |

*Verification: static checks on all 14 routes (ids, alts, dims, headings, inline scripts) + computed WCAG ratios for 17 colour pairs. No browser-based axe run (no headless browser in the audit sandbox) — listed as residual in §K.*

# E. SEO FINDINGS — before → after

| Item | Before | After |
|------|--------|-------|
| Canonical | Hard-coded `www.lovebites.pk` (old site) on a vercel.app preview | Self-canonical per deployment (`VERCEL_URL` or default); `SITE_URL=https://www.lovebites.pk` at cutover (README) |
| Sitemap | 9 URLs, no `lastmod` | 13 URLs + `lastmod` on every entry |
| Legacy routes | `/about` (old site) → 404 | Permanent 301 → `/story/` (both slash forms) |
| Twitter/OG | Card + one shared image, no twitter:title/description | Full twitter:title/description/image + og:image dims/alt, per-page images (branch photos on branch pages) |
| JSON-LD | `priceRange: 'Rs 500–3,000'` (invented); flat hero image | Computed `Rs 250–2,600` from menu data; branch-specific `image[]`; 22 blocks parse clean |
| Ratings in schema | Stale (850/66) | Live-verified (1000/42) with on-page "checked September 2026" provenance |
| Legal pages | None | 4 indexable, internally linked pages (footer sitewide) |
| 404 | 404 status ✓ (kept) + thin | 404 status kept; +2 useful CTAs, heading fix |
| Titles/descriptions | Good, unique per route | Kept; new pages follow the same pattern; `apple-touch-icon` + second font preload added |
| Local SEO | Per-branch pages, Restaurant schema, NAP | Kept + hours/ratings provenance + phone/WhatsApp consistent across footer, cards, contact |

*Keyword stuffing, fake "best in town" claims: none found — retained as-is.*

# F. PERFORMANCE FINDINGS — before → after

| Item | Before | After |
|------|--------|-------|
| Google Maps iframes | 3 branch pages each pulled a live Google embed eagerly (~1–2 MB, third-party JS/cookies) | Click-to-load: **zero** Google requests until the visitor taps "Load the map"; "Open in Google Maps" links still work without JS |
| Dead assets | 6 unreferenced images, ~433 KB (`longshot-1..4`, `p-solo`, `p-squad`) shipped every deploy | Removed (kept `p-couch`/`p-picnic`, now used by the craving machine). `public/` 8.3 MB → 7.9 MB |
| CLS risk | 3 img types without intrinsic dimensions | All `<img>` carry width/height (script-verified) |
| Fonts | 1 font preloaded, body font not | Both woff2 preloaded, `font-display: swap` retained |
| Inline JS | `LB_CATS` executable inline script | Inert JSON `#lb-data` (also enables strict CSP); no behavioural change |
| Images | Already: lazy below fold, `fetchpriority=high` on hero, sized assets | Retained; original compression kept (largest ~292 KB; total image budget acceptable for a photo-led restaurant site) |
| JS/CSS | ~5 KB app.js, 65 KB CSS, zero dependencies, no frameworks | Same zero-dependency architecture (app.js 17.7 KB source incl. comments; map loader + data readers added) |
| Banner risk | — | Placeholder CSS only (repeating gradient) until click — no layout shift when the iframe swaps in (same min-height) |

# G. SECURITY FINDINGS — before → after

| Item | Before | After |
|------|--------|-------|
| Secrets/keys | None found ✓ | None ✓ (re-verified) |
| XSS sinks | `innerHTML` fed only build-time constants ✓ | Craving `innerHTML` now fed from build-time JSON in `#lb-data` (same trust boundary; `<` escaped in the block) |
| CSP | None | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'` — feasible because inline executable scripts were removed |
| Other headers | Cache only | + `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo/payment/usb off), `X-Frame-Options: SAMEORIGIN`, `Cross-Origin-Opener-Policy` |
| Third-party scripts | Google Maps (unconditional) | Maps only on explicit click; no analytics/CDNs/pixels anywhere |
| `target=_blank` | Already `rel="noopener"` ✓ | ✓ (checked across all pages) |
| Client storage | `localStorage['lb-branch']` (functional) | Unchanged, disclosed in privacy+cookies pages |
| HSTS | Host-level (vercel.app) | Set HSTS on custom domain after cutover — see §K |

# H. UX IMPROVEMENTS — what changed and why

1. **Dish honesty end-to-end** — heroes now show the real dish photo (Royal Crust/Loaded Fries/Squared Seasons); dishes without a real photo get an on-brand "Photo coming soon" tile instead of a wrong photo; craving machine shows exact-dish photos or clearly-labelled Love Bites prints with a "not a photograph" badge. Trust is the whole point of a food site.
2. **Legal layer** — four policy pages in plain brand voice, footer "The small print" column sitewide, honest cookie disclosure that explains *why there is no banner*.
3. **Maps on request** — a designed "Load the map" card that doubles as privacy disclosure and perf win; address/phone/directions remain fully functional without it.
4. **Mobile bar honesty** — non-branch quick action renamed "WhatsApp"→"Order" (it opens the branch picker, not WhatsApp); on branch pages it stays WhatsApp with an aria-label naming the city.
5. **Menu reliability** — city order normalised (section numbers, poster wall and jump bar now agree), deep links work from any city, noscript fallback line, price note date is a real data date.
6. **Consistent narrative** — Acts 01–06 flow across home and /spots/ (review wall is Act 05, spots is Act 06).
7. **CTA wording** — "Get one for you" → "Make your own print"; "This spot" → "See this spot".
8. **404** — added Find a branch + Contact CTAs (Home/Menu kept).
9. **Status resilience** — pills fall back to "Open daily from 12 p.m." if data never loads; no eternal "Checking…".
10. **Continued, unchanged strengths**: drag rails, print-drop motion, craving machine, poster maker, review marquee, sticker easter egg, "no cart" personality.

# I. ROUTES ADDED

| Route | Why |
|-------|-----|
| `/privacy/` | Data-collection disclosure (required by best practice; future-proofing for the pending PDPA) |
| `/cookies/` | Honest storage/third-party inventory + no-banner rationale |
| `/terms/` | Site terms, price/review accuracy, consumer-law acknowledgement |
| `/refund-policy/` | Order complaints (dine-in/takeaway/phone/foodpanda), client slots marked |
| `301 /about` → `/story/` | Legacy route of the old official site |

Existing routes (9) all kept — no removals, no regressions (650/650 local references resolve).

# J. CLIENT-CONFIRMATION LIST
*(Completed list is in §B/§C top of this document — 20 items covering identity, branch phones/hours, menus, ratings re-verification, photo licensing, refund rules, domain cutover, legal review. The four legal pages also carry 11 inline `[CLIENT TO CONFIRM]` markers exactly where facts are owed.)*

# K. REMAINING RISKS

| Risk | Severity | Why it can't be closed without the client |
|------|----------|-------------------------------------------|
| Faisalabad phone conflict (0315-2821112 vs foodpanda's 0304-2000870) | High | Only the business knows which number is the shop line |
| Google Chiniot rating/count can't be verified from this sandbox | Medium | Needs one look at the live Google listing (aggregators lag) |
| Review star counts (partial verification of stars; wording verified) | Medium | Screenshots from the owner's listing dashboards settle it |
| AI stand-in food photos on real dishes | Medium | Replaced only by real photography — an editorial decision + shoot |
| Policy pages need a Pakistani lawyer | High | We are not lawyers; pages say so |
| Entity name, refund rules, retention periods | High | Business facts we refuse to invent |
| HSTS on custom domain | Low | Enables only after domain serves HTTPS |
| No headless browser in sandbox | Low | Static/contrast/structure QA done; recommend one manual device pass + Lighthouse run on staging |
| Google may ignore `aggregateRating` markup | Low | Third-party ratings are attributed on-page either way (guideline-safe posture) |
| `vercel.json` headers apply only on Vercel | Low | Deploy target is Vercel ✓ |

# L. FINAL QA

**Automated (all green on the built output):**
- ✅ 14 routes render; unknown route returns HTTP 404
- ✅ 650 local `href/src` references: **0 broken files, 0 broken anchors**
- ✅ 0 duplicate ids · 0 images missing `alt` · 0 images missing `width/height` · 0 heading-level jumps · exactly one `h1` per page
- ✅ 0 inline executable `<script>` blocks (CSP `script-src 'self'` viable)
- ✅ 22/22 JSON-LD blocks parse
- ✅ 17/17 WCAG contrast pairs meet their threshold (4.5:1 text, 3:1 indicators)
- ✅ `node --check` clean on `build.mjs`, `app.js`, `make.js`; `vercel.json` parses; CSS braces/parens balanced
- ✅ Content checks: legal links in footer, floor-rounded review copy, Act numbering, noscript note, menu as-of date, ratings (4.1·678 / 4.7·1,000+ / 4.7·42), computed priceRange
- ✅ Local preview server exercised every route (200s, map placeholder, correct hero/craving imagery)

**Manual/interactive (documented for staging):** keyboard tab-order sweep on a device, `wa.me`/tel/foodpanda outbound checks (URLs verified live during research), poster-maker download on iOS/Android, Lighthouse run, real-phone scroll pass at 360/390/768/1024/1440 px.

**Regression guarantee:** no existing route, CTA, form (none exist), external link or feature was removed; the commit history records exactly what changed (`de06f4e`).

---

## Final standard check

> "Same Love Bites identity — dramatically better execution."

The poster-wall personality, the five-ink riso palette, Archivo display type, ticket cards, the "no cart, we believe in people" voice and the Act structure are untouched. What changed is everything a restaurant client's lawyer, customers, Google and an accessibility reviewer would look at: **the site now tells the truth precisely, asks for nothing, guards itself, and reads as finished.**

# Love Bites — lovebites.pk

Static website for **Love Bites** (Chiniot · Sargodha · Faisalabad), built as a
zero-dependency Node generator. No framework, no npm installs — one script
emits a complete static site.

## Build

```bash
node build.mjs
```

Output goes to `site/` (13 pages + `404.html` + sitemap, robots, branches.json).
Serve locally:

```bash
npx serve@14 site
```

## Pages

| Route | What |
| ----- | ---- |
| `/` | Home (hero, poster wall, craving machine, heroes, people, reviews, spots) |
| `/menu/` | Full menu, per-branch prices, 12 sections |
| `/spots/` + `/spots/{chiniot,sargodha,faisalabad}/` | Locations, hours, maps, reviews |
| `/wall/` | Poster wall + poster maker |
| `/story/` | Brand story & timeline |
| `/contact/` | Phones, WhatsApp, socials, office |
| `/privacy/` · `/cookies/` · `/terms/` · `/refund-policy/` | Legal (marked `[CLIENT TO CONFIRM]` where facts are owed) |
| `404.html` | Branded not-found page (served by Vercel) |

## Deploy on Vercel

The repo is Vercel-ready — `vercel.json` already sets everything:

| Setting         | Value            |
| --------------- | ---------------- |
| Build Command   | `node build.mjs` |
| Output Directory| `site`           |
| Install Command | *(none needed)*  |

Import the repo in the Vercel dashboard → Deploy. No environment variables required.

Security headers (CSP, nosniff, referrer policy, permissions policy, framing)
and the legacy `/about → /story/` redirect live in `vercel.json`.

### Canonical URL / custom domain

Canonical URLs, OG tags and the sitemap default to the **host the site is built
on** (each deployment self-canonicalises). To point everything at the production
domain when the domain cuts over from the old site, set one environment variable:

```
SITE_URL = https://www.lovebites.pk
```

## Launch checklist (before going public)

1. Set `SITE_URL` (above) once the domain serves this build.
2. Resolve every `[CLIENT TO CONFIRM]` marker in `/privacy/`, `/cookies/`,
   `/terms/`, `/refund-policy/` — then have a Pakistani lawyer review them.
3. Confirm branch phones (esp. Faisalabad: 0315-2821112 vs foodpanda's
   0304-2000870), hours and addresses — see `PITCH-REPORT.md` §J.
4. Re-verify the Google rating/count for Chiniot and refresh `BRANCHES` in
   `build.mjs` when ratings drift.
5. Replace AI stand-in food shots (`public/food/gen/*`, marked with a dot on
   the menu) with real photography as it arrives.
6. Keep `DATA_ASOF` in `build.mjs` honest — update it whenever menu/rating data
   is re-checked.

## Structure

```
build.mjs      generator (fs/path only — zero dependencies)
data/          menus.json + source brand assets (not deployed)
public/        css, js, fonts, images (copied as-is)
site/          build output (generated — not committed)
PITCH-REPORT.md  full audit, research, risk register & client checklist
```

Branch hours live in `branches.json` (output) and power the client-side
"open now" pill. Menu data is a single `data/menus.json`.

# Love Bites — lovebites.pk

Static website for **Love Bites** (Chiniot · Sargodha · Faisalabad), built as a
zero-dependency Node generator. No framework, no npm installs — one script
emits a complete static site.

## Build

```bash
node build.mjs
```

Output goes to `site/` (9 pages + `404.html` + sitemap, robots, branches.json).
Serve locally:

```bash
npx serve@14 site
```

## Deploy on Vercel

The repo is Vercel-ready — `vercel.json` already sets everything:

| Setting         | Value            |
| --------------- | ---------------- |
| Build Command   | `node build.mjs` |
| Output Directory| `site`           |
| Install Command | *(none needed)* |

Just **Import the repo in the Vercel dashboard** → Deploy. No environment
variables required.

### Optional: custom domain

Canonical URLs, sitemap and OpenGraph default to `https://www.lovebites.pk`.
To preview with a different domain (e.g. `lovebites.vercel.app`), set one
environment variable in Vercel:

```
SITE_URL = https://your-preview-domain
```

## Structure

```
build.mjs      generator (fs/path only — zero dependencies)
data/          menus.json + source brand assets (not deployed)
public/        css, js, fonts, images (copied as-is)
site/          build output (generated — not committed)
```

Branch hours live in `branches.json` (output) and power the client-side
"open now" pill. Menu data is a single `data/menus.json`.

/* ============================================================
   LOVE BITES — static site generator
   Renders real HTML per route (fixes the SPA/SEO problem found
   in the audit) with LocalBusiness + Menu structured data.
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'site';
const menus = JSON.parse(fs.readFileSync('data/menus.json', 'utf8')); // [cht, sgd, fsd]

// Each branch menu lists the same 12 sections but not in the same order. The
// jump bar, the poster wall and the section numbers all read from one order —
// the Chiniot menu's — so normalise every branch to it at load time.
{
  const order = menus[0].map(c => c.id);
  menus.forEach(branch => branch.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)));
}

/* Menu prices / branch facts were last checked against the printed menus and
   public listings on this date. It is a constant on purpose: rendering the
   build date would silently claim data was re-verified every deploy. */
const DATA_ASOF = 'September 2026';

/* ---------- VERIFIED BUSINESS DATA (see research/EVIDENCE.md) ---------- */
const BRANCHES = [
  {
    slug: 'chiniot', key: 'cht', city: 'Chiniot', menuIdx: 0,
    tagline: 'Where it started.',
    since: 2018,
    street: 'Sargodha Road, Chiniot, Punjab, Pakistan',
    phone: '+92 47 6331462', tel: '+92476331462', wa: '923150331462',
    hours: '12:00 p.m. – 1:00 a.m.', open: 12, close: 25,
    rating: 4.1, reviews: 678, reviewsLabel: '678', ratingSrc: 'Google',
    art: '/brand/cht.png', hue: 'var(--mustard)',
    photo: '/branch/cht-hero.jpg',
    photoAlt: 'The Love Bites Chiniot shopfront at night, lit sign above the awning on Sargodha Road',
    shots: [
      { src: '/branch/cht-a.jpg', cap: 'Sargodha Road frontage', sub: 'Bikes parked out front, the way it always is' },
      { src: '/branch/cht-b.jpg', cap: 'Inside, under the neon', sub: 'Booths, brick and a table that seats the whole group' },
      { src: '/branch/cht-c.jpg', cap: 'Window seats', sub: 'Late-afternoon light on the wood floor' },
      { src: '/branch/cht-d.jpg', cap: 'The door you are looking for', sub: 'Blue sign, striped awning, plants either side' }
    ],
    lat: 31.729162, lng: 72.982224, geoSrc: 'the Chiniot Sargodha Road listing',
    mapQ: 'Love Bites Grill & Pizza, Sargodha Road, Chiniot',
    fp: null,
    landmark: 'Chiniot — the woodwork city on the Chenab',
    order: 'The original counter. Locals still call it “the pizza place on Sargodha Road”.',
    heroes: ['Royal Crust Pizza', 'Squared Seasons', 'Mega Bite'],
    note: 'Lowest prices of the three branches — the hometown rate.',
    quotes: [
      { t: 'Best place for fast food lovers — their Special Royal Crust Pizza is a must try.', a: 'Sidra M. · Google · 5★' },
      { t: 'Very unique and different delicious taste of burgers here, and very cheap prices too.', a: 'Adil K. · Google · 4★' },
      { t: 'The place is very inviting, staff are friendly. First time I went with the Squared Seasons — all the pizza flavours on one.', a: 'A M. · Google · 3★' }
    ]
  },
  {
    slug: 'sargodha', key: 'sgd', city: 'Sargodha', menuIdx: 1,
    tagline: 'The one that proved it travels.',
    since: 2022,
    street: 'Railway Road, Sargodha, Punjab, Pakistan',
    phone: '+92 48 3768182', tel: '+92483768182', wa: '923260768182',
    hours: '12:00 p.m. – 1:00 a.m.', open: 12, close: 25,
    rating: 4.7, reviews: 1000, reviewsLabel: '1,000+', ratingSrc: 'foodpanda',
    art: '/brand/sgd.png', hue: 'var(--cyan)',
    photo: '/branch/sgd-hero.jpg',
    photoAlt: 'Love Bites Sargodha on Railway Road at night, the words Food Never Breaks Your Heart above the sign',
    shots: [
      { src: '/branch/sgd-a.jpg', cap: '“Food never breaks your heart”', sub: 'It is on the building, not just the website' },
      { src: '/branch/sgd-b.jpg', cap: 'The big room upstairs', sub: 'Velvet chairs, long tables, built for groups' },
      { src: '/branch/sgd-c.jpg', cap: 'Afternoon quiet', sub: 'Before the Railway Road rush starts' },
      { src: '/branch/sgd-d.jpg', cap: 'The neon corner', sub: 'Where everybody ends up taking the photo' }
    ],
    lat: 32.0799205, lng: 72.6723641, geoSrc: 'the foodpanda Sargodha listing',
    mapQ: 'Love Bites, Railway Road, Sargodha',
    fp: 'https://www.foodpanda.pk/restaurant/rfjt/love-bites',
    landmark: 'Khayyam Chowk end of Railway Road',
    order: 'Our highest-rated kitchen. The burger people come back for.',
    heroes: ['Oven Baked Pasta', 'Mega Bite', 'Chicken Tikka'],
    note: 'Same menu as Faisalabad, same prices.',
    quotes: [
      { t: 'There’s no other burger like this in the town — my favourite burger since day 1.', a: 'Mubashra · foodpanda · 5★' },
      { t: 'Always delivered good quality. Very tasty.', a: 'Farooq · foodpanda · 5★' },
      { t: 'Really good taste of pasta.', a: 'Fakhra · foodpanda · 5★' }
    ]
  },
  {
    slug: 'faisalabad', key: 'fsd', city: 'Faisalabad', menuIdx: 2,
    tagline: 'The flagship.',
    since: 2026,
    street: 'Green Avenue, Canal Road, Faisalabad, Punjab, Pakistan',
    phone: '+92 315 2821112', tel: '+923152821112', wa: '923152821112',
    hours: '12:00 p.m. – 2:00 a.m.', open: 12, close: 26,
    rating: 4.7, reviews: 42, reviewsLabel: '42', ratingSrc: 'foodpanda',
    art: '/brand/fsd.png', hue: 'var(--lettuce)',
    photo: '/branch/fsd-hero.jpg',
    photoAlt: 'The Love Bites Faisalabad flagship shopfront on Green Avenue with a large illuminated sign',
    shots: [
      { src: '/branch/fsd-a.jpg', cap: 'Order here', sub: 'Counter under the lights, screens overhead' },
      { src: '/branch/fsd-b.jpg', cap: 'The yellow room', sub: 'The biggest dining floor we have built' },
      { src: '/branch/fsd-c.jpg', cap: 'Green Avenue, inside', sub: 'Exposed ceiling, warm wood, room to spread out' },
      { src: '/branch/fsd-d.jpg', cap: 'Friday night queue', sub: 'Open till 2 a.m., and it shows' }
    ],
    lat: 31.4507639, lng: 73.1527087, geoSrc: 'the foodpanda Faisalabad listing',
    mapQ: 'Love Bites, Green Avenue, Canal Road, Faisalabad',
    fp: 'https://www.foodpanda.pk/restaurant/dlc1/love-bites-faisalabad',
    landmark: 'Green Avenue, off Canal Road — Clock Tower city',
    order: 'Biggest room, latest kitchen, open till 2 a.m.',
    heroes: ['Eastside Mughlai', 'Fire Glaze Chicken', 'Loaded Fries'],
    note: 'Newest branch — the late-night one.',
    quotes: [
      { t: 'The eastside mughlai pizza is super good, definitely going to order again.', a: 'Pivak · foodpanda · 5★' },
      { t: 'Extremely high quality value to money. Best in town for me.', a: 'Muhammad · foodpanda · 5★' },
      { t: 'Very good food, great value for money. The fire glaze chicken is a must try.', a: 'Sahab · foodpanda · 5★' }
    ]
  }
];

/* Canonical origin. Each deployment should default to self-canonical (its own
   URL) so metadata never points at a different site than the one being served.
   At domain cutover, set SITE_URL=https://www.lovebites.pk in Vercel. */
const SITE = process.env.SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://lovebites-nine.vercel.app');
const EMAIL = 'lovebites.pakistan@gmail.com';

/* ---------- VERIFIED PROFILES (checked Aug 2026) ------------------------
   Instagram and Facebook both run under the lovebites.pk handle and list the
   same three rooms, so they are safe to call ours. foodpanda runs delivery
   for the Sargodha and Faisalabad kitchens (chain page cw0mi). No official
   TikTok could be found — several search passes came back empty — so we say
   that out loud on the page instead of linking something that is not us. */
const SOCIALS = [
  { name: 'Instagram', handle: '@lovebites.pk', url: 'https://www.instagram.com/lovebites.pk/',
    note: 'The main feed. All three cities, one camera roll.' },
  { name: 'Facebook', handle: 'Love Bites — Grill &amp; Pizza', url: 'https://www.facebook.com/Lovebites.pk',
    note: 'The oldest channel. Offers, events, the big announcements.' },
  { name: 'foodpanda', handle: 'Love Bites — delivery', url: 'https://www.foodpanda.pk/chain/cw0mi/love-bites',
    note: 'Sargodha and Faisalabad deliver. Chiniot stays counter-only.' }
];

/* ---------- icons ---------- */
const I = {
  heart: `<svg viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="4" aria-hidden="true"><path d="M32 52C18 42 4 32 4 19 4 10 11 4 19 4c6 0 10 3 13 8 3-5 7-8 13-8 8 0 15 6 15 15 0 13-14 23-28 33Z"/><path d="M9 24h46M12 34h40" stroke-linecap="round"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-7 7 7-7 7"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z"/></svg>`,
  wa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a13 13 0 0 1-5-3.1 11 11 0 0 1-2.2-3.4C6.3 9.6 6.7 8.7 7 8.3c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.3-.1.6.5.8 1 1.4 1.7 2 .6.5 1.2.8 1.7 1 .2.1.4.1.6-.1l.7-.8c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.6-.1 1.1Z"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" aria-hidden="true"><path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5h1.5V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.7v7h2.8Z"/></svg>`,
  tt: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.3 2.3 1.7 3.8 4 4v3.1c-1.5 0-2.9-.5-4-1.3v6.6c0 3.9-2.6 6.6-6.1 6.6A5.9 5.9 0 0 1 2.5 16c0-3.3 2.6-5.9 6-5.9l1 .1v3.2a3 3 0 1 0 2.1 2.9V3h5Z"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 8h13l-1.2 12.5H6.7L5.5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  // Decorative food line-art — flat brand inks, thick outlines, matches the shop's prints.
  pizza: `<svg viewBox="0 0 120 124" aria-hidden="true" fill="none" stroke-linejoin="round">
    <path d="M14 32 Q60 8 106 32 L60 114 Z" fill="#ffc531" stroke="#141414" stroke-width="5"/>
    <path d="M14 32 Q60 10 106 32" stroke="#141414" stroke-width="5"/>
    <path d="M23 39 Q60 21 97 39" stroke="#141414" stroke-width="4" fill="none"/>
    <circle cx="47" cy="54" r="8.5" fill="#e0322a" stroke="#141414" stroke-width="4"/>
    <circle cx="76" cy="64" r="7.5" fill="#e0322a" stroke="#141414" stroke-width="4"/>
    <circle cx="57" cy="86" r="7" fill="#e0322a" stroke="#141414" stroke-width="4"/>
    <circle cx="63" cy="42" r="6.5" fill="#e0322a" stroke="#141414" stroke-width="4"/>
    <path d="M40 66 q6 5 13 1" stroke="#e0322a" stroke-width="4" stroke-linecap="round" fill="none"/>
  </svg>`,
  burger: `<svg viewBox="0 0 132 124" aria-hidden="true" fill="none" stroke-linejoin="round">
    <path d="M16 46 Q66 6 116 46 Z" fill="#ffc531" stroke="#141414" stroke-width="5"/>
    <circle cx="48" cy="30" r="3" fill="#141414"/><circle cx="66" cy="24" r="3" fill="#141414"/><circle cx="84" cy="30" r="3" fill="#141414"/>
    <path d="M14 48 h104 q6 12 -6 14 H20 q-12 -2 -6 -14 Z" fill="#26d0bb" stroke="#141414" stroke-width="5"/>
    <rect x="20" y="64" width="92" height="16" rx="8" fill="#e0322a" stroke="#141414" stroke-width="5"/>
    <rect x="16" y="82" width="100" height="22" rx="10" fill="#c0782c" stroke="#141414" stroke-width="5"/>
    <path d="M24 106 h84 q10 14 -6 16 H30 q-16 -2 -6 -16 Z" fill="#ffc531" stroke="#141414" stroke-width="5"/>
  </svg>`
};

const SOCIAL_ICONS = { Instagram: I.ig, Facebook: I.fb, foodpanda: I.bag };

// Each branch maps to its own verified coordinates. The place name is passed as
// the query so Google resolves the actual business card, while @lat,lng pins the
// map on the right spot even if the name lookup drifts.
const mapUrl = b => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQ)}`;
const dirUrl = b => `https://www.google.com/maps/dir/?api=1&destination=${b.lat}%2C${b.lng}`;
const embedUrl = b => `https://www.google.com/maps?q=${b.lat},${b.lng}&z=16&output=embed`;

const nf = n => Number(n).toLocaleString('en-PK');

/* ---------- shared chrome ---------- */
function head({ title, desc, url, schema = [], css = '', ogImage = '/img/hero-food.jpg', ogAlt = 'A hand lifting a cheesy slice from a square-cut Love Bites pizza' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}${url}">
<meta name="theme-color" content="#141414">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Love Bites">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}${url}">
<meta property="og:image" content="${SITE}${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${ogAlt}">
<meta property="og:locale" content="en_PK">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${SITE}${ogImage}">
<link rel="icon" href="/brand/heart.png">
<link rel="apple-touch-icon" href="/brand/heart.png">
<link rel="preload" as="font" type="font/woff2" href="/fonts/archivo-black.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/archivo-var.woff2" crossorigin>
<link rel="stylesheet" href="/css/app.css">
${css ? `<style>${css}</style>` : ''}
${schema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>`;
}

function nav(active) {
  const L = [['/', 'Home'], ['/menu/', 'Menu'], ['/spots/', 'Spots'], ['/wall/', 'Wall'], ['/story/', 'Story'], ['/contact/', 'Contact']];
  return `<nav class="nav" aria-label="Primary">
  <div class="nav__in">
    <a class="nav__logo" href="/"><img class="nav__mark" src="/brand/mark.png" alt="" aria-hidden="true" width="536" height="472" decoding="async"><span>Love&nbsp;Bites</span></a>
    <div class="nav__links">
      ${L.map(([h, t]) => `<a href="${h}"${active === h ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
      <a class="nav__cta" href="/spots/#now">Open now</a>
    </div>
  </div>
</nav>`;
}

function mbar(b) {
  // On a branch page the quick-action WhatsApp must reach THAT branch. Anywhere
  // else there is no single right number, so the bar goes to the branch picker
  // and says "Order" — labelling it "WhatsApp" would promise an app it does not open.
  const wa = b
    ? `<a class="is-wa" href="https://wa.me/${b.wa}" aria-label="WhatsApp Love Bites ${b.city}"><span aria-hidden="true">${I.wa}</span>WhatsApp</a>`
    : `<a class="is-wa" href="/spots/#now" aria-label="Order — pick your branch for WhatsApp"><span aria-hidden="true">${I.wa}</span>Order</a>`;
  return `<nav class="mbar" aria-label="Quick actions">
  <a href="/"><span aria-hidden="true">${I.home}</span>Home</a>
  <a href="/menu/"><span aria-hidden="true">${I.menu}</span>Menu</a>
  <a class="is-hot" href="/spots/"><span aria-hidden="true">${I.pin}</span>Spots</a>
  ${wa}
</nav>`;
}

function foot() {
  return `<footer class="foot">
  <div class="wrap">
    <div class="foot__top">
      <div>
        <div class="foot__mark"><img class="nav__mark" src="/brand/mark.png" alt="" aria-hidden="true" width="536" height="472" loading="lazy" decoding="async"><span>Love Bites</span></div>
        <p style="font-weight:700;max-width:30ch;opacity:.85;margin:.2rem 0 0">
          Pizza Co. since 2018. Chiniot → Sargodha → Faisalabad.<br>Best eaten here, at the table, with people you like.</p>
      </div>
      <div><h2>Go</h2>
        <a href="/menu/">Menu &amp; prices</a><a href="/spots/">All three spots</a>
        <a href="/story/">Our story</a><a href="/wall/">The poster wall</a>
        <a href="/contact/">Contact &amp; profiles</a><a href="/spots/#now">What's open now</a></div>
      <div><h2>Spots</h2>
        ${BRANCHES.map(b => `<a href="/spots/${b.slug}/">${b.city} — ${b.hours}</a>`).join('')}</div>
      <div><h2>Company</h2>
        ${SOCIALS.map(s => `<a href="${s.url}" rel="noopener">${s.name}</a>`).join('')}
        <a href="tel:${BRANCHES[0].tel}">${BRANCHES[0].phone}</a>
        <a href="mailto:${EMAIL}">${EMAIL}</a>
        <span style="display:block;padding:.24rem 0;font-weight:700;font-size:.92rem;opacity:.85">
          Love Bites Office, Sargodha Road, Chiniot</span>
        <span style="display:block;padding:.24rem 0;font-weight:700;font-size:.92rem;opacity:.6">
          Office: Mon–Thu, 11 a.m.–6 p.m.</span></div>
      <div><h2>The small print</h2>
        <a href="/privacy/">Privacy policy</a>
        <a href="/cookies/">Cookie policy</a>
        <a href="/terms/">Terms &amp; conditions</a>
        <a href="/refund-policy/">Refund &amp; cancellation</a>
        <span style="display:block;padding:.24rem 0;font-weight:700;font-size:.85rem;opacity:.6">
          Menu prices last checked ${DATA_ASOF}. Ratings quoted from public listings.</span></div>
    </div>
    <div class="foot__bye">
      <span>© ${new Date().getFullYear()} Love Bites. Made in Punjab.</span>
      <span>No cart, no checkout. Just come and eat.</span>
    </div>
    <div class="foot__neon">
      <span class="foot__neon-w foot__neon-w--a">Love</span>
      <span class="foot__neon-heart">${I.heart.replace('stroke-width="4"', 'stroke-width="4.5"')}</span>
      <span class="foot__neon-w foot__neon-w--b">Bites</span>
    </div>
  </div>
</footer>`;
}

/* Data the front end needs is emitted as an inert JSON block (never an
   executable inline script), so the CSP can stay `script-src 'self'`. */
const jsonBlock = data =>
  `<script type="application/json" id="lb-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const tail = (js = '', b = null, data = null) => `${mbar(b)}${foot()}${data ? jsonBlock(data) : ''}<script src="/js/app.js" defer></script>${js ? (js.startsWith('<script') ? js : `<script>${js}</script>`) : ''}</body></html>`;

/* ---------- structured data ---------- */
// Price range for schema.org is derived from the real menu, never hand-typed.
// Extras (dips, bread) are excluded — priceRange describes the food a guest
// orders, so the range runs from the cheapest dish to the most expensive one.
const FOOD_RANGE = (() => {
  const ps = menus.flat().flatMap(c => c.id === 'extras' ? [] : c.items)
    .flatMap(i => i.variants.map(v => Number(v.price)).filter(Boolean));
  return { min: Math.min(...ps), max: Math.max(...ps) };
})();
const priceRangeLabel = `Rs ${nf(FOOD_RANGE.min)}–${nf(FOOD_RANGE.max)}`;

const bizSchema = b => ({
  geo: { '@type': 'GeoCoordinates', latitude: b.lat, longitude: b.lng },
  hasMap: mapUrl(b),
  '@context': 'https://schema.org', '@type': 'Restaurant',
  '@id': `${SITE}/spots/${b.slug}/#restaurant`,
  name: `Love Bites — ${b.city}`, url: `${SITE}/spots/${b.slug}/`,
  image: [`${SITE}${b.photo}`, `${SITE}/img/hero-food.jpg`], telephone: b.phone,
  servesCuisine: ['Pizza', 'Burgers', 'Fast Food', 'Pakistani'],
  priceRange: priceRangeLabel, currenciesAccepted: 'PKR',
  address: { '@type': 'PostalAddress', streetAddress: b.street.split(',')[0], addressLocality: b.city, addressRegion: 'Punjab', addressCountry: 'PK' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '12:00', closes: b.close === 26 ? '02:00' : '01:00' }],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: b.rating, reviewCount: b.reviews },
  hasMenu: `${SITE}/menu/#${b.slug}`,
  parentOrganization: { '@type': 'Organization', name: 'Love Bites', url: SITE }
});

const menuSchema = b => ({
  '@context': 'https://schema.org', '@type': 'Menu', name: `Love Bites ${b.city} menu`,
  hasMenuSection: menus[b.menuIdx].map(c => ({
    '@type': 'MenuSection', name: c.title,
    hasMenuItem: c.items.map(it => ({
      '@type': 'MenuItem', name: it.name,
      offers: it.variants.map(v => ({ '@type': 'Offer', price: v.price, priceCurrency: 'PKR', name: v.size }))
    }))
  }))
});

/* ============================================================
   PAGES
   ============================================================ */

/* ---------- HOME ---------- */
// The four authentic Love Bites campaign posters (from the brand's own asset
// bundle). They double as the site's primary navigation.
// Category posters for the menu wall. Colour + kicker only — every number shown
// is computed from data/menus.json at build time, never hand-typed.
const CATMETA = {
  'premium-flavor-pizza':   { bg: 'var(--tomato)',  fg: 'var(--paper)', kick: 'The big ones' },
  'premium-squared':        { bg: 'var(--ink)',     fg: 'var(--cheese)', kick: 'Square cut' },
  'long-shots-pizza':       { bg: '#7b3fa0',        fg: 'var(--paper)', kick: 'Rs 600 flat' },
  'regular-flavor-pizza':   { bg: 'var(--orange)',  fg: 'var(--ink)',   kick: 'The everyday' },
  'appetizers':             { bg: 'var(--cheese)',  fg: 'var(--ink)',   kick: 'Start here' },
  'fries':                  { bg: 'var(--mustard)', fg: 'var(--ink)',   kick: 'Loaded' },
  'wraps-and-rolls':        { bg: 'var(--lettuce)', fg: 'var(--paper)', kick: 'One hand' },
  'sandwiches':             { bg: 'var(--bun)',     fg: 'var(--paper)', kick: 'Toasted' },
  'grilled-chicken-burgers':{ bg: 'var(--cyan)',    fg: 'var(--ink)',   kick: 'Off the grill' },
  'fried-burgers':          { bg: 'var(--tomato)',  fg: 'var(--paper)', kick: 'Crunch' },
  'pasta-platters':         { bg: 'var(--ink)',     fg: 'var(--orange)', kick: 'Oven baked' },
  'extras':                 { bg: 'var(--paper-2)', fg: 'var(--ink)',   kick: 'Add ons' }
};
const catMeta = id => CATMETA[id] || { bg: 'var(--paper-2)', fg: 'var(--ink)', kick: 'More' };
const priceRange = c => {
  const ps = c.items.flatMap(i => i.variants.map(v => Number(v.price)).filter(Boolean));
  return ps.length ? { min: Math.min(...ps), max: Math.max(...ps) } : null;
};


/* ---------- FOOD IMAGERY ----------
   Real photography supplied by Love Bites wins every time. Where no real frame
   exists yet, a generated stand-in shot in one fixed art direction is used
   (dark wood, window light, no text, no hands, halal only) and is labelled as
   such in the markup via data-illus so it can be swapped the day a real photo
   lands. Never point an item at the wrong dish.                              */
const REAL = new Set(['Royal Crust Pizza', 'Malai Boti Pizza', 'Squared Seasons', 'Hot Wings',
  'Oven Baked Wings', 'Creamy Spinroll', 'BBQ Spinroll', 'Loaded Fries']);
const FOODIMG = {
  // --- real photography ---
  'Royal Crust Pizza': '/food/royal-crust.jpg',
  'Malai Boti Pizza': '/food/malai.jpg',
  'Squared Seasons': '/food/squared.jpg',
  'Hot Wings': '/food/wings.jpg',
  'Creamy Spinroll': '/food/spinroll.jpg',
  'Loaded Fries': '/food/fries.jpg',
  // --- generated, one consistent art direction ---
  'Behari Kabab Pizza': '/food/gen/behari-kabab.jpg',
  'Peri Peri Pizza': '/food/gen/peri-peri.jpg',
  'Jamaican Pizza': '/food/gen/jamaican.jpg',
  "Queen's Cut": '/food/gen/queens-cut.jpg',
  'O-Top Behari': '/food/gen/otop-behari.jpg',
  'Smokey Firestone': '/food/gen/smokey-firestone.jpg',
  'Eastside Mughlai': '/food/gen/eastside-mughlai.jpg',
  'Chicken Tikka': '/food/gen/chicken-tikka.jpg',
  'Chicken Fajita': '/food/gen/chicken-fajita.jpg',
  'Chicken Supreme': '/food/gen/chicken-supreme.jpg'
};
// Alt text describes the dish that is actually in the frame.
const FOODALT = {
  'Royal Crust Pizza': 'A Royal Crust pizza with a stuffed cheese rim, a slice lifted on a long cheese pull',
  'Malai Boti Pizza': 'A Malai Boti pizza on a black pan, creamy white chicken pieces across melted cheese',
  'Squared Seasons': 'A square-cut Squared Seasons pizza on a board, different flavours in each quarter',
  'Hot Wings': 'A plate of glazed hot wings',
  'Oven Baked Wings': 'A plate of glazed baked chicken wings',
  'Creamy Spinroll': 'Creamy chicken spin rolls cut open beside a pot of dip',
  'BBQ Spinroll': 'Chicken spin rolls cut open beside a pot of dip',
  'Loaded Fries': 'Loaded fries under cheese sauce with grilled chicken and black olives',
  'Behari Kabab Pizza': 'A behari kabab pizza with spiced beef strips and onion on melted cheese',
  'Peri Peri Pizza': 'A peri peri chicken pizza with red sauce drizzle, capsicum and onion',
  'Jamaican Pizza': 'A Jamaican pizza with jerk-spiced chicken, sweetcorn and capsicum',
  "Queen's Cut": 'A thick square pan pizza with crisp caramelised cheese edges',
  'O-Top Behari': 'A square pan pizza topped with behari beef strips and red onion',
  'Smokey Firestone': 'A square pan pizza with smoky barbecue chicken and a dark sauce drizzle',
  'Eastside Mughlai': 'A square pan pizza with creamy mughlai chicken and a white sauce swirl',
  'Chicken Tikka': 'A chicken tikka pizza with red-spiced chicken, onion and coriander',
  'Chicken Fajita': 'A chicken fajita pizza with capsicum strips and onion',
  'Chicken Supreme': 'A chicken supreme pizza loaded with mushroom, olive, capsicum and onion'
};
const CATIMG = {
  // Category heroes are FOOD only. The poster experience now lives on /wall/;
  // forcing prints into the menu made the page compete with itself. A hero must
  // also never repeat a photo used by an item inside its own category —
  // the duplicate reads as a bug.
  'long-shots-pizza': { src: '/food/longshots.jpg', alt: 'A long rectangular Long Shots pizza in its pink box with a white sauce drizzle' },
  'grilled-chicken-burgers': { src: '/food/grill-burger.jpg', alt: 'A grilled chicken burger in a sesame bun, packed with salad and sauce' }
};
const foodImg = n => FOODIMG[n] || null;

const POSTERS = [
  { img: '/posters/pw-need.jpg', bg: '#ffc531', href: '/menu/', kicker: 'The whole board',
    t: 'All you need is Love Bites &amp; Pizza',
    d: 'Twelve sections. Fifty-six things. Prices that change with your city, not with your luck.',
    cta: 'Read the menu',
    alt: 'Cream Love Bites poster with a giant tomato LOVE, the line All You Need Is Love Bites and Pizza, and the official heart-burger mark in cheese yellow' },
  { img: '/posters/pw-irl.jpg', bg: '#e0a52e', href: '/story/', kicker: 'The house rule',
    t: 'IRL. No carts.',
    d: 'Eight years, zero checkout buttons. The food is better three metres from the oven.',
    cta: 'Why we do that',
    alt: 'Mustard yellow Love Bites poster with the giant word IRL, the words No Carts, and a heart-shaped burger outline' },
  { img: '/posters/pw-cheese.jpg', bg: '#e0322a', href: '/menu/#regular-flavor-pizza', kicker: 'Cheese Legend',
    t: 'Just cheese. Always right.',
    d: 'No toppings to hide behind. Mozzarella, a hot oven and nerve.',
    cta: 'Find it on the menu',
    alt: 'Red Love Bites poster reading Just Cheese with an illustrated slice pulling melted mozzarella and a hundred percent mozzarella seal' },
  { img: '/posters/pw-people.jpg', bg: '#26d0bb', href: '/spots/', kicker: 'Three rooms',
    t: 'Good food gets you here. Good people keep you.',
    d: 'Chiniot, Sargodha, Faisalabad. Same recipe book, three different rooms.',
    cta: 'Pick your city',
    alt: 'Teal Love Bites poster reading Good Food Gets You Here, Good People Keep You, with two line-drawn friends eating pizza' },
  { img: '/posters/pw-hotline.jpg', bg: '#e0a52e', href: '/spots/', kicker: 'Open late',
    t: 'Pizza hotline.',
    d: 'Kitchens run to 1 a.m. Faisalabad goes to 2. Call your people, not an app.',
    cta: 'Get the numbers',
    alt: 'Mustard Love Bites poster reading Pizza Hotline with a drawn rotary telephone, an Open Late stamp and the line Call Your People' },
  { img: '/posters/pw-fsd.jpg', bg: '#eb7a24', href: '/spots/faisalabad/', kicker: 'Newest room',
    t: 'Faisalabad flagship.',
    d: 'Green Avenue, off Canal Road. The biggest floor we have ever built.',
    cta: 'See the flagship',
    alt: 'Orange Love Bites poster reading Faisalabad Flagship with line art of the canal and the clock tower and a 2026 stamp' },
  { img: '/posters/pw-craving.jpg', bg: '#f7e8d0', href: '/#crave', kicker: 'The machine',
    t: 'Pick a craving. We&rsquo;ll handle the rest.',
    d: 'Tell us the mood in one tap and we will tell you what to order.',
    cta: 'Tell us the mood',
    alt: 'Cream Love Bites poster reading Pick A Craving, We Will Handle The Rest, with a heart-shaped burger illustration' },
  { img: '/posters/pw-eat.jpg', bg: '#f7e8d0', href: '/menu/', kicker: 'The whole idea',
    t: 'Eat. Achha khana, achhi zindagi.',
    d: 'Good food, good life. The oldest rule in the shop, printed the way we say it.',
    cta: 'Start with the menu',
    alt: 'Cream Love Bites poster reading EAT above the Urdu line achha khana achhi zindagi, meaning good food good life' },
  { img: '/posters/pw-slice.jpg', bg: '#f7e8d0', href: '/menu/#premium-flavor-pizza', kicker: 'The cheese pull',
    t: 'Cheese pulls are a love language.',
    d: 'One slice, infinite stretch — every pizza we know how to make, in one place.',
    cta: 'See the pizzas',
    alt: 'Screen-printed illustration of a giant pizza slice with a long mozzarella cheese pull, tomato red and teal on cream' },
  { img: '/posters/pw-burger.jpg', bg: '#e0a52e', href: '/menu/#grilled-chicken-burgers', kicker: 'The grip',
    t: 'Two hands. Zero shame.',
    d: 'Stacked, sauced and built to be eaten immediately. The burger board, no cutlery required.',
    cta: 'Find the burgers',
    alt: 'Screen-printed illustration of a towering crispy chicken burger with dripping sauce, mustard and teal on cream' }
];

const CRAVINGS = [
  { id: 'squad', label: 'Rolling deep', verdict: 'Squared Seasons + Loaded Fries', why: 'Every flavour on one square pizza so nobody argues. Order the platter too — you will fight over it anyway.', picks: ['Squared Seasons from Rs 1,900', 'Loaded Fries from Rs 700', 'Hot Wings ×12'], img: '/food/squared.jpg', imgAlt: 'A square-cut Squared Seasons pizza on a board, different flavours in each quarter' },
  { id: 'solo', label: 'Just me', verdict: 'A Long Shot + Masala Fries', why: 'One long slice, one hand free for your phone. Rs 600 and you are out in twenty minutes.', picks: ["Queen's Cut Long Shot Rs 600 flat", 'Masala Fries from Rs 290'], img: '/img/longshot-box.jpg', imgAlt: 'A Long Shots pizza in its box, drizzled with sauce around a dip pot' },
  { id: 'late', label: "It's 1 a.m.", verdict: 'Mega Bite + Cheesy Fries', why: 'Faisalabad runs till 2 a.m. This is the order that fixes the night. No notes.', picks: ['Mega Bite from Rs 590', 'Cheesy Fries from Rs 450', 'Faisalabad only'], img: '/img/detail-burger.jpg', imgAlt: 'Hands squeezing a loaded burger, sauce and cheese dripping' },
  { id: 'messy', label: 'Feeling messy', verdict: 'Fire Glaze Chicken', why: 'The one reviewers keep naming without being asked. Sticky, sweet-hot, wash-your-hands-after food.', picks: ['Fire Glaze Chicken Rs 850 flat', 'Extra dip Rs 70'], img: '/posters/p-picnic.jpg', imgAlt: 'Love Bites print: line-drawn friends eating pizza together at a picnic', illus: true },
  { id: 'comfort', label: 'Need comfort', verdict: 'Oven Baked Pasta', why: 'Baked, blistered on top, eaten with a spoon. Sargodha has been quietly perfecting this one.', picks: ['Oven Baked Pasta from Rs 650', 'Extra bread Rs 40'], img: '/posters/p-couch.jpg', imgAlt: 'Love Bites print: line-drawn friends sharing pizza on a couch', illus: true },
  { id: 'first', label: 'First time here', verdict: 'Royal Crust Pizza', why: 'The dish that built the Chiniot queue. If you only eat one thing, eat this.', picks: ['Royal Crust from Rs 1,250', 'Mexican Wrap from Rs 590'], img: '/food/royal-crust.jpg', imgAlt: 'A Royal Crust pizza with a stuffed cheese rim, a slice lifted on a long cheese pull' }
];


/* ---------- LIVE REVIEW MARQUEE ----------
   Source of truth is BRANCHES[].quotes — every entry is a real, publicly posted
   review with its real author and real star count, quoted verbatim (shortened
   only for length). Nothing here is written by us and nothing is invented.
   When Place IDs land (see REVIEWS-INTEGRATION.md) the build step swaps this
   array for the fetched payload; the markup contract stays identical.        */
function reviewTicket(q, city) {
  const n = Number((q.a.match(/(\d)★/) || [0, 0])[1]);
  const who = q.a.replace(/ · \d★/, '').split(' · ');
  const name = who[0], src = who[1] || '';
  return `<li class="tkt">
    <span class="tkt__stars" role="img" aria-label="${n} out of 5 stars">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>
    <p class="tkt__q">&ldquo;${q.t}&rdquo;</p>
    <span class="tkt__by">${name} · ${city} · ${src}</span>
  </li>`;
}

/* The strip runs as two rows travelling in opposite directions, split by where
   the review actually came from: Google on top, foodpanda underneath. That is
   a real distinction, not decoration — the two platforms are two different
   audiences, and labelling them keeps every quote traceable to its source.
   Nothing here is written by us; see REVIEWS-INTEGRATION.md for the live API
   contract that would replace these static quotes. */
function reviewStrip() {
  const all = BRANCHES.flatMap(b => b.quotes.map(q => ({ q, city: b.city })));
  const isG = x => /Google/i.test(x.q.a);
  const rows = [all.filter(isG), all.filter(x => !isG(x))];
  const total = BRANCHES.reduce((a, b) => a + b.reviews, 0);
  // Some sources publish floors ("1,000+"), so round the sum down to a number
  // we can honestly put the word "over" in front of.
  const totalFloor = Math.floor(total / 100) * 100;

  // A marquee needs enough cards to cover the viewport twice over, otherwise a
  // short row leaves a visible gap as it wraps.
  const fill = (arr, min = 6) => {
    const out = [];
    while (out.length < min) out.push(...arr);
    return out;
  };

  const row = (list, i) => {
    const cards = fill(list).map(x => reviewTicket(x.q, x.city)).join('');
    return `<div class="mq mq--${i === 0 ? 'a' : 'b'}" data-mq>
      <ul class="mq__row" data-mq-row>${cards}</ul>
      <ul class="mq__row" data-mq-row aria-hidden="true">${cards}</ul>
    </div>`;
  };

  return `
<section class="band band--ink lovewall" aria-labelledby="lw-h">
  <div class="wrap lovewall__head">
    <p class="act act--c">Act 05 — The word on the street</p>
    <h2 class="h-lg" id="lw-h">Straight from the table</h2>
    <p class="lovewall__lede">Over ${nf(totalFloor)} public reviews across three cities.
      Slow it down to read. We did not write these.</p>
  </div>

  <div class="mqs">
    ${rows.map(row).join('')}
  </div>

  <div class="wrap">
    <p class="lovewall__note">Quoted from public Google and foodpanda listings for each branch,
      shortened only for length — wording, names and star counts are unchanged.</p>
  </div>
</section>`;
}

function home() {
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Organization', name: 'Love Bites', url: SITE,
      logo: `${SITE}/brand/heart.png`, email: EMAIL,
      sameAs: ['https://www.instagram.com/lovebites.pk/', 'https://www.facebook.com/Lovebites.pk/'],
      department: BRANCHES.map(b => ({ '@type': 'Restaurant', name: `Love Bites — ${b.city}`, url: `${SITE}/spots/${b.slug}/` }))
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Love Bites', url: SITE }
  ];

  return head({
    title: 'Love Bites — Food Never Breaks Your Heart | Pizza Co. Chiniot, Sargodha, Faisalabad',
    desc: 'Poster energy, real food. Square-cut pizza, Long Shots and burgers in Chiniot, Sargodha and Faisalabad. See the menu, find your table, come eat.',
    url: '/', schema
  }) + nav('/') + `
<main id="main">

<!-- ACT 01 — THE CRAVING -->
<header class="hero">
  <img class="hero__ghost" src="/brand/heart.png" alt="" aria-hidden="true" width="620" height="540">
  <div class="wrap hero__in">
    <div>
      <p class="act">Act 01 — The Craving</p>
      <h1>Food never<br>breaks<br><em>your heart</em></h1>
      <div class="hero__sub">
        <span class="hero__kicker">Pizza Co. · Est. Chiniot 2018</span>
        <span class="live live--ink live--open" data-live-any><span class="live__dot"></span><span data-live-txt>Checking…</span></span>
      </div>
      <div class="hero__actions" style="margin-top:1.2rem">
        <a class="btn btn--cheese" href="/menu/">See the menu</a>
        <a class="btn btn--hot" href="/spots/">Find your table</a>
      </div>
    </div>
    <div class="hero__plate">
      <span class="floaty hero__food" aria-hidden="true">${I.pizza}</span>
      <figure class="hero__photo" style="margin:0">
        <img src="/img/hero-food.jpg" alt="A hand lifting a cheesy slice from a square-cut Love Bites pizza on a dark tray" width="1400" height="740" fetchpriority="high">
      </figure>
    </div>
  </div>
  <div class="ticker" aria-hidden="true">
    <div class="ticker__row">
      ${Array(2).fill(`<span>Square-cut pizza</span><span>Long Shots</span><span>Fire Glaze Chicken</span><span>Chiniot · Sargodha · Faisalabad</span><span>Open till late</span><span>No cart. Just come.</span>`).join('')}
    </div>
  </div>
</header>

<!-- ACT 02 — THE POSTER WALL (drag rail, real campaign artwork) -->
<section class="band band--ink wall" aria-labelledby="wall-h">
  <div class="wrap wall__head">
    <div>
      <p class="act">Act 02 — The Poster Wall</p>
      <h2 class="h-lg" id="wall-h">Our walls<br><span class="outline">talk back</span></h2>
    </div>
    <p class="wall__lede">${POSTERS.length} prints, one wall. A few of them are below —
      the rest are hanging on the wall page.</p>
  </div>

  <div class="wall__rail" data-rail tabindex="0" role="region" aria-label="Poster wall preview — scroll sideways to explore">
    <ul class="wall__track" data-rail-track>
      ${POSTERS.slice(0, 4).map((p, i) => `
      <li class="pw" style="--pw-bg:${p.bg}">
        <a class="pw__a" href="${p.href}">
          <span class="pw__frame">
            <img class="pw__img" src="${p.img}" alt="${p.alt}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async" width="760" height="1140">
          </span>
          <span class="pw__meta">
            <span class="pw__kick">${String(i + 1).padStart(2, '0')} — ${p.kicker}</span>
            <span class="pw__t">${p.t}</span>
            <span class="pw__d">${p.d}</span>
            <span class="pw__go">${p.cta}</span>
          </span>
        </a>
      </li>`).join('')}
    </ul>
  </div>

  <div class="wrap wall__foot">
    <div class="wall__prog" aria-hidden="true"><span class="wall__bar" data-rail-bar></span></div>
    <a class="btn btn--cheese" href="/wall/#make">Make your own print</a>
  </div>
</section>

<!-- ACT 03 — THE FOOD -->
<section class="band band--paper crave" id="crave">
  <div class="wrap">
    <p class="act">Act 03 — The Food</p>
    <h2 class="h-lg">What are you<br>craving?</h2>
    <div class="crave__opts" role="group" aria-label="Choose your craving">
      ${CRAVINGS.map((c, i) => `<button class="chip" type="button" data-crave="${c.id}" aria-pressed="${i === 0}">${c.label}</button>`).join('')}
    </div>
    <div class="crave__out" aria-live="polite">
      <div class="crave__copy">
        <p style="font-size:.74rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase;opacity:.55;margin:0">Then you want</p>
        <p class="crave__verdict" data-crave-verdict>${CRAVINGS[0].verdict}</p>
        <p class="crave__why" data-crave-why>${CRAVINGS[0].why}</p>
        <div class="crave__picks" data-crave-picks>${CRAVINGS[0].picks.map(p => `<span class="tag">${p}</span>`).join('')}</div>
        <div style="margin-top:.9rem"><a class="btn btn--ink btn--sm" href="/menu/">Find it on the menu</a></div>
      </div>
      <div class="crave__img"><img data-crave-img src="${CRAVINGS[0].img}" alt="${CRAVINGS[0].imgAlt}" width="700" height="560" loading="lazy"><span class="crave__note" data-crave-note hidden>Love Bites print — not a photograph</span></div>
    </div>
  </div>
</section>

<section class="band band--ink rail">
  <div class="wrap" style="padding-top:clamp(2.2rem,5vw,3.4rem)">
    <p class="act">The heroes</p>
    <h2 class="h-md">Four things people<br>actually name out loud</h2>
  </div>
  <div class="rail__track">
    <article class="dish"><div class="dish__img"><img src="/food/royal-crust.jpg" alt="A Royal Crust pizza with a stuffed cheese rim, a slice lifted on a long cheese pull" loading="lazy" width="600" height="450"></div>
      <span class="dish__p">from <b>Rs 1,250</b></span>
      <div class="dish__b"><h3 class="dish__n">Royal Crust Pizza</h3>
        <p class="dish__m">The one Chiniot reviewers keep naming. “A must try.” M / L / XL.</p></div></article>
    <article class="dish"><div class="dish__img dish__img--none" role="img" aria-label="No photograph of Fire Glaze Chicken yet">
        <span class="dish__soon" aria-hidden="true">Photo<br>coming<br>soon</span></div>
      <span class="dish__p"><b>Rs 850</b></span>
      <div class="dish__b"><h3 class="dish__n">Fire Glaze Chicken</h3>
        <p class="dish__m">New menu, instant regular. Sticky, sweet-hot, eat-with-hands.</p></div></article>
    <article class="dish"><div class="dish__img"><img src="/food/fries.jpg" alt="Loaded fries under cheese sauce with grilled chicken and black olives" loading="lazy" width="600" height="450"></div>
      <span class="dish__p">from <b>Rs 700</b></span>
      <div class="dish__b"><h3 class="dish__n">Loaded Fries</h3>
        <p class="dish__m">The table's centrepiece. Order one, watch it vanish.</p></div></article>
    <article class="dish"><div class="dish__img"><img src="/food/squared.jpg" alt="A square-cut Squared Seasons pizza on a board, different flavours in each quarter" loading="lazy" width="600" height="450"></div>
      <span class="dish__p">from <b>Rs 1,900</b></span>
      <div class="dish__b"><h3 class="dish__n">Squared Seasons</h3>
        <p class="dish__m">Every premium flavour, one square, cut for a whole table.</p></div></article>
  </div>
</section>

<!-- ACT 04 — THE PEOPLE -->
<section class="band band--cheese people">
  <div class="wrap">
    <p class="act">Act 04 — The People</p>
    <h2 class="h-lg">We believe<br><span class="outline">in people</span></h2>
    <p class="lede" style="margin-top:1.2rem">The heart is ours — the love we cook with. The bite is you.
      Food tastes better shared, so the room matters as much as the recipe.</p>
    <div class="polas">
      <figure class="pola rv" style="margin:0"><div class="pola__i"><img src="/img/people-table.jpg" alt="Friends laughing around a full table at Love Bites" loading="lazy" width="500" height="500"></div>
        <figcaption class="pola__c">Four people, one Squared Seasons.<small>Faisalabad · Friday</small></figcaption></figure>
      <figure class="pola rv" style="margin:0"><div class="pola__i"><img src="/img/detail-burger.jpg" alt="Hands squeezing a loaded burger, sauce and cheese dripping" loading="lazy" width="500" height="500"></div>
        <figcaption class="pola__c">“No other burger like this in town.”<small>Sargodha · foodpanda review</small></figcaption></figure>
      <figure class="pola rv" style="margin:0"><div class="pola__i"><img src="/img/detail-fries.jpg" alt="Loaded fries on the table" loading="lazy" width="500" height="500"></div>
        <figcaption class="pola__c">Loaded fries never make it home.<small>Chiniot · Sargodha Road</small></figcaption></figure>
    </div>
  </div>
</section>

${reviewStrip()}

<!-- ACT 06 — FIND YOUR LOVE BITE -->
<section class="band band--paper spots">
  <div class="wrap">
    <p class="act">Act 06 — Find your Love Bite</p>
    <h2 class="h-lg">Pick your city.<br>Find your table.</h2>
    <div class="spots__grid">
      ${BRANCHES.map(b => spotCard(b)).join('')}
    </div>
  </div>
</section>

<section class="band band--tomato" style="padding:clamp(2.6rem,7vw,4.6rem) 0">
  <div class="wrap" style="text-align:center">
    <h2 class="h-lg">Stop scrolling.<br>Call your friends.</h2>
    <p class="lede" style="margin:1.2rem auto 1.6rem;color:#fff">There is no cart on this website and there never will be.
      The food is better three metres from the oven, and so are you.</p>
    <div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap">
      <a class="btn btn--cheese" href="/spots/">Get directions</a>
      <a class="btn" href="/menu/">Read the menu first</a>
    </div>
  </div>
</section>
</main>` + tail('', null, { crave: CRAVINGS });
}

// `lvl` keeps the heading outline legal: on the homepage these cards sit under
// an h2, on /spots/ they sit directly under the h1.
function spotCard(b, lvl = 3) {
  const no = String(BRANCHES.indexOf(b) + 1).padStart(2, '0');
  // Restored ticket/pass anatomy: numbered stub, city line-art symbol over the
  // real photograph, perforated tear, then the pill CTA row. The pills are the
  // branch card's signature — "This spot" is the primary and carries the brand
  // cheese fill; Directions / Call / WhatsApp sit beside it at equal size but
  // lower colour weight, so hierarchy comes from fill, not from size or layout.
  return `<article class="pass rv" style="--hue:${b.hue}">
  <div class="pass__stub" style="background:${b.hue}">
    <img class="pass__photo" src="${b.photo}" alt="${b.photoAlt}" loading="lazy" decoding="async" width="800" height="500">
    <img class="pass__art" src="${b.art}" alt="" aria-hidden="true" loading="lazy" decoding="async" width="600" height="380">
    <span class="pass__no">${no} / 03</span>
    <span class="pass__flag" data-live-branch="${b.slug}">…</span>
    <span class="pass__cityrow">
      <h${lvl} class="pass__city">${b.city}</h${lvl}>
      <span class="pass__since">Est. ${b.since}</span>
    </span>
  </div>
  <div class="pass__perf" aria-hidden="true"></div>
  <div class="pass__b">
    <p class="pass__tag">${b.tagline}</p>
    <dl class="pass__rows">
      <div><dt>Where</dt><dd>${b.street}</dd></div>
      <div><dt>Hours</dt><dd><strong>${b.hours}</strong> · every day</dd></div>
      <div><dt>Rated</dt><dd><strong>${b.rating}</strong> · ${b.reviewsLabel} reviews <span class="pass__src">${b.ratingSrc}</span></dd></div>
      <div><dt>Order</dt><dd>${b.heroes.join(' · ')}</dd></div>
    </dl>
    <div class="pass__row">
      <a class="btn btn--sm btn--cheese pass__cta1" href="/spots/${b.slug}/">${I.heart} See this spot</a>
      <a class="btn btn--sm btn--ink" href="${dirUrl(b)}" target="_blank" rel="noopener">${I.pin} Directions</a>
      <a class="btn btn--sm" href="tel:${b.tel}" aria-label="Call Love Bites ${b.city}">${I.phone} Call</a>
      <a class="btn btn--sm btn--wa" href="https://wa.me/${b.wa}" target="_blank" rel="noopener" aria-label="WhatsApp Love Bites ${b.city}">${I.wa} WhatsApp</a>
    </div>
  </div>
</article>`;
}

/* ---------- MENU ---------- */
function menuPage() {
  const cats = menus[0].map(c => ({ id: c.id, title: c.title }));
  // Per-branch category summaries (counts + real min price) for the poster wall.
  const catData = Object.fromEntries(BRANCHES.map(b => [b.slug, menus[b.menuIdx].map(c => {
    const r = priceRange(c), m = catMeta(c.id);
    return { id: c.id, title: c.title, n: c.items.length, from: r ? r.min : null, bg: m.bg, fg: m.fg, kick: m.kick };
  })]));
  const STAR = new Set(['Royal Crust Pizza', 'Squared Seasons', 'Fire Glaze Chicken', 'Mega Bite', 'Oven Baked Pasta', 'Loaded Fries', 'Eastside Mughlai']);

  const body = BRANCHES.map(b => `
<div data-branch-panel="${b.slug}"${b.slug !== 'chiniot' ? ' hidden' : ''} id="${b.slug}">
  ${menus[b.menuIdx].map((c, ci) => {
    const m = catMeta(c.id), r = priceRange(c), hero = CATIMG[c.id];
    // Only the default (Chiniot) panel owns the plain fragment ids that outside
    // links point at (#regular-flavor-pizza …). The other panels jump via
    // data-cat from JS — keeping ids off them means zero duplicates in the DOM.
    return `
  <section class="menusec" data-cat="${c.id}"${b.slug === 'chiniot' ? ` id="${c.id}"` : ''} style="--cat-bg:${m.bg};--cat-fg:${m.fg}">
    <div class="wrap">
      <header class="cathead${hero ? ' cathead--hero' : ''}">
        <div class="cathead__txt">
          <p class="cathead__kick">${String(ci + 1).padStart(2, '0')} — ${m.kick}</p>
          <h2>${c.title}</h2>
          <p class="cathead__n">${c.items.length} ${c.items.length === 1 ? 'item' : 'items'}${r ? ` · from Rs ${nf(r.min)}` : ''} · ${b.city} prices</p>
        </div>
        ${hero ? `<figure class="cathead__img${hero.poster ? ' cathead__img--poster' : ''}"><img src="${hero.src}" alt="${hero.alt}" width="900" height="900" loading="lazy" decoding="async"></figure>` : ''}
      </header>
      <div class="items">
        ${c.items.map(it => {
          const img = foodImg(it.name), star = STAR.has(it.name);
          return `<article class="item${star ? ' item--star' : ''}${img ? '' : ' item--noimg'}">
          ${img ? `<div class="item__img"><img src="${img}" alt="${FOODALT[it.name] || it.name}" loading="lazy" decoding="async" width="900" height="900"${REAL.has(it.name) ? '' : ' data-illus="1"'}>
            ${star ? '<span class="item__star">Most ordered</span>' : ''}</div>` : ''}
          <div class="item__b">
            <h3 class="item__n">${it.name}</h3>
            ${!img && star ? '<span class="item__star item__star--flat">Most ordered</span>' : ''}
            <div class="item__v">${it.variants.map(v => `<span class="vpill"><i>${v.size}</i><b>Rs ${nf(v.price)}</b></span>`).join('')}</div>
          </div>
        </article>`;
        }).join('')}
      </div>
    </div>
  </section>`;
  }).join('')}
  <div class="wrap"><p class="pricenote">
    <strong>${b.city} note:</strong> ${b.note} Prices shown are dine-in / takeaway as published by Love Bites.
    <strong>All prices are exclusive of tax (GST)</strong>, as printed on the branch menu.
    Delivery apps price separately. Last checked ${DATA_ASOF} —
    if something at the counter differs, the counter is right. <a href="/spots/${b.slug}/">Call ${b.city}</a> to confirm.
  </p>
  <p class="pricenote pricenote--img">Photography note: dishes marked with a small dot are illustrated with a
    styled stand-in shot while we finish photographing the full board. Every other photograph on this page is
    the real thing.</p></div>
</div>`).join('');

  return head({
    title: 'Menu & Prices — Love Bites | Chiniot, Sargodha & Faisalabad',
    desc: 'The full Love Bites menu with real PKR prices for all three branches: premium and square pizza, Long Shots, burgers, wraps, fries, pasta and platters.',
    url: '/menu/', schema: BRANCHES.map(menuSchema)
  }) + nav('/menu/') + `
<main id="main">
<header class="mhero">
  <div class="wrap mhero__in">
    <div class="mhero__txt">
      <p class="act">The whole board</p>
      <h1 class="h-xl">Everything<br>we know how<br><span class="outline">to feed you</span></h1>
      <p class="lede">Twelve sections. Fifty-six things. Chiniot runs a little cheaper —
        that is the hometown rate, not a typo.</p>
    </div>
    <figure class="mhero__poster">
      <img src="/posters/pw-eat.jpg" alt="Love Bites poster reading EAT above the Urdu line achha khana achhi zindagi, meaning good food, good life" width="760" height="1140" fetchpriority="high" decoding="async">
      <span class="floaty mhero__food mhero__food--pizza" aria-hidden="true">${I.pizza}</span>
      <span class="floaty mhero__food mhero__food--burger" aria-hidden="true">${I.burger}</span>
    </figure>
  </div>
</header>

<div class="branchbar">
  <div class="branchbar__in">
    <span class="branchbar__lbl">Prices for</span>
    <noscript><span class="branchbar__lbl" style="opacity:1">— city switching needs JavaScript, showing Chiniot prices</span></noscript>
    <div class="bswitch" role="group" aria-label="Choose branch">
      ${BRANCHES.map((b, i) => `<button type="button" data-branch="${b.slug}" aria-pressed="${i === 0}">${b.city}</button>`).join('')}
    </div>
    <span class="live live--open" data-live-branch-pill="chiniot"><span class="live__dot"></span><span>…</span></span>
  </div>
</div>

<section class="catwall">
  <div class="wrap">
    <h2 class="catwall__h">Twelve sections. Pick your poster.</h2>
    <div class="catwall__grid" data-catwall></div>
  </div>
</section>

<div class="catbar">
  <div class="catbar__in" role="group" aria-label="Jump to category">
    ${cats.map((c, i) => `<button type="button" data-jump="${c.id}" aria-pressed="${i === 0 ? 'false' : 'false'}">${c.title}</button>`).join('')}
  </div>
</div>

${body}

<section class="band band--ink" style="padding:clamp(2.4rem,6vw,4rem) 0;margin-top:3rem">
  <div class="wrap" style="text-align:center">
    <h2 class="h-md">Read it. Now come eat it.</h2>
    <div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;margin-top:1.4rem">
      <a class="btn btn--cheese" href="/spots/">Find the nearest table</a>
    </div>
  </div>
</section>
</main>
<dialog class="citygate" data-citygate aria-labelledby="citygate-h">
  <div class="citygate__in">
    <p class="act">First, the important bit</p>
    <h2 id="citygate-h">Where are you<br><span class="outline">eating?</span></h2>
    <p class="citygate__sub">Menus and prices are set city by city. Pick your room — we'll show
      that room's exact board.</p>
    <div class="citygate__opts">
      ${BRANCHES.map((b, i) => `<button class="cityopt" type="button" data-cityopt="${b.slug}"${i === 0 ? ' autofocus' : ''} style="--city-hue:${b.hue}">
        <span class="cityopt__no">${String(i + 1).padStart(2, '0')}</span>
        <span class="cityopt__tx"><strong>${b.city}</strong><small>${b.hours}</small></span>
        <span class="cityopt__go" aria-hidden="true">→</span>
      </button>`).join('')}
    </div>
    <p class="citygate__note">Changed your mind? The city switcher at the top of the menu
      always works.</p>
  </div>
</dialog>` + tail('', null, { cats: catData });
}

/* ---------- SPOTS INDEX ---------- */
function spotsPage() {
  return head({
    title: 'Our Spots — Love Bites Chiniot, Sargodha & Faisalabad | Hours, Directions, Phone',
    desc: 'Three Love Bites restaurants in Punjab. Addresses, opening hours, phone numbers, WhatsApp and directions for Chiniot, Sargodha and Faisalabad.',
    url: '/spots/', schema: BRANCHES.map(bizSchema)
  }) + nav('/spots/') + `
<main id="main">
<header class="phead band--cheese" id="now">
  <div class="wrap">
    <p class="act">Act 06 — Find your Love Bite</p>
    <h1>Pick your city.<br><span class="outline">Find your table.</span></h1>
    <p>Same recipe book, three different rooms. Chiniot is the original, Sargodha is the highest rated,
      Faisalabad is the flagship that runs till 2 a.m.</p>
  </div>
</header>
<section class="band band--paper spots">
  <div class="wrap">
    <div class="spots__grid">${BRANCHES.map(b => spotCard(b, 2)).join('')}</div>
  </div>
</section>
</main>` + tail();
}

/* ---------- BRANCH PAGE ---------- */
function branchPage(b) {
  const cats = menus[b.menuIdx];
  // Some hero dishes appear in two categories (e.g. Eastside Mughlai is both a
  // Premium Squared and a Rs 600 Long Shot). Keep the first and tag it with its
  // section so no two cards look identical.
  const stars = [];
  for (const c of cats) for (const i of c.items) {
    if (b.heroes.includes(i.name) && !stars.some(x => x.name === i.name))
      stars.push({ ...i, cat: c.title });
  }
  return head({
    title: `Love Bites ${b.city} — ${b.street.split(',')[0]} | Menu, Hours & Directions`,
    desc: `Love Bites ${b.city}: ${b.street}. Open ${b.hours}. Call ${b.phone}. ${b.order} See what people order here.`,
    url: `/spots/${b.slug}/`, ogImage: b.photo, ogAlt: b.photoAlt,
    schema: [bizSchema(b), menuSchema(b), {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Spots', item: `${SITE}/spots/` },
        { '@type': 'ListItem', position: 3, name: b.city, item: `${SITE}/spots/${b.slug}/` }
      ]
    }]
  }) + nav('/spots/') + `
<main id="main">
<header class="phead" style="background:${b.hue}">
  <img src="${b.photo}" alt="" aria-hidden="true" class="phead__bg" width="1600" height="900" decoding="async">
  <img src="${b.art}" alt="" aria-hidden="true" class="phead__art" width="600" height="380" decoding="async">
  <div class="wrap" style="position:relative">
    <p class="act">Love Bites · since ${b.since}</p>
    <h1>${b.city}</h1>
    <p style="font-family:var(--f-display);text-transform:uppercase;font-size:clamp(1rem,2.6vw,1.5rem);margin-top:.7rem">${b.tagline}</p>
    <p>${b.order}</p>
    <div style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.3rem;align-items:center">
      <span class="live live--ink" data-live-branch-pill="${b.slug}"><span class="live__dot"></span><span>…</span></span>
      <a class="btn btn--sm btn--hot" href="tel:${b.tel}">${I.phone} ${b.phone}</a>
      <a class="btn btn--sm btn--wa" href="https://wa.me/${b.wa}">${I.wa} WhatsApp</a>
      <a class="btn btn--sm" href="${dirUrl(b)}" target="_blank" rel="noopener">${I.pin} Directions</a>
    </div>
  </div>
</header>

<section class="band band--paper" style="padding:clamp(2rem,5vw,3.4rem) 0">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1.2rem">
      <dl class="quote quote--info"><dt>Address</dt><dd>${b.street}<br><span style="opacity:.7">${b.landmark}</span></dd></dl>
      <dl class="quote quote--info"><dt>Hours</dt><dd>Every day<br><strong>${b.hours}</strong></dd></dl>
      <dl class="quote quote--info"><dt>Rating</dt><dd>★ ${b.rating} from ${b.reviewsLabel} reviews<br><span style="opacity:.7">via ${b.ratingSrc}, checked ${DATA_ASOF}</span></dd></dl>
      <dl class="quote quote--info"><dt>Phone</dt><dd><a href="tel:${b.tel}" style="text-decoration:underline">${b.phone}</a></dd></dl>
    </div>
  </div>
</section>

<section class="band band--ink" style="padding:clamp(2.2rem,6vw,3.6rem) 0">
  <div class="wrap">
    <p class="act">The room</p>
    <h2 class="h-md">This is the ${b.city} branch</h2>
    <p class="lede" style="margin-top:.9rem;max-width:56ch">Photographs of this branch — not stock, not a render. So you know the door when you see it.</p>
    <div class="shots">
      ${b.shots.map(sh => `<figure class="shot rv">
        <img src="${sh.src}" alt="${sh.cap} — Love Bites ${b.city}" loading="lazy" decoding="async" width="1200" height="900">
        <figcaption><strong>${sh.cap}</strong><span>${sh.sub}</span></figcaption>
      </figure>`).join('')}
    </div>
  </div>
</section>

<section class="band band--paper2 mapband">
  <div class="wrap">
    <p class="act">Getting there</p>
    <h2 class="h-md">Find the door in ${b.city}</h2>
    <div class="mapwrap">
      <div class="mapframe mapframe--lazy" data-map data-map-src="${embedUrl(b)}" data-map-title="Map showing Love Bites ${b.city}, ${b.street}">
        <button class="mapframe__load" type="button" data-map-load>
          ${I.pin}
          <strong>Load the map</strong>
          <small>Google Maps loads only when you tap this — that keeps Google out of your visit until you ask. The “Open in Google Maps” button works without it.</small>
        </button>
      </div>
      <div class="mapcard">
        <p class="mapcard__k">Love Bites ${b.city}</p>
        <p class="mapcard__a">${b.street}</p>
        <p class="mapcard__l">${b.landmark}</p>
        <a class="btn btn--sm btn--hot" href="${dirUrl(b)}" target="_blank" rel="noopener">${I.pin} Open in Google Maps</a>
        <p class="mapcard__note">Pin verified against ${b.geoSrc} — each branch links to its own location.</p>
      </div>
    </div>
  </div>
</section>

<section class="band band--ink" style="padding:clamp(2.2rem,6vw,4rem) 0">
  <div class="wrap">
    <p class="act">What people order here</p>
    <h2 class="h-md">${b.city} classics</h2>
    <div class="items" style="margin-top:1.6rem">
      ${stars.map(it => `<article class="item item--star">
        <h3 class="item__n">${it.name}</h3>
        <p class="item__cat">${it.cat}</p>
        <div class="item__v">${it.variants.map(v => `<span class="vpill"><i>${v.size}</i><b>Rs ${nf(v.price)}</b></span>`).join('')}</div>
      </article>`).join('')}
    </div>
    <div style="margin-top:1.6rem"><a class="btn btn--cheese" href="/menu/#${b.slug}">Full ${b.city} menu</a></div>
  </div>
</section>

<section class="band band--cheese reviews" style="padding:clamp(2.2rem,6vw,4rem) 0"
  data-reviews="${b.slug}" data-place-id="">
  <div class="wrap">
    <p class="act">In their words</p>
    <h2 class="h-md">What people are saying in ${b.city}</h2>
    <p class="reviews__meta">
      <span class="reviews__score">★ ${b.rating}</span>
      <span>from <strong>${b.reviewsLabel}</strong> public reviews on ${b.ratingSrc}, checked ${DATA_ASOF}</span>
      <a class="reviews__src" href="${mapUrl(b)}" target="_blank" rel="noopener">See them all</a>
    </p>
    <div class="quotes" data-reviews-list>
      ${b.quotes.map(q => {
        const n = Number((q.a.match(/(\d)★/) || [0, 0])[1]);
        return `<blockquote class="quote"><div class="stars" role="img" aria-label="${n} out of 5 stars">${'★'.repeat(n)}<span class="stars__off">${'★'.repeat(5 - n)}</span></div><p>“${q.t}”</p><cite>${q.a.replace(/ · \d★/, '')}</cite></blockquote>`;
      }).join('')}
    </div>
    <p class="reviews__note">Quoted from public ${b.ratingSrc} reviews for this branch, shortened only for length —
      wording, names and star counts are unchanged. Nothing here is written by us.</p>
  </div>
</section>

<section class="band band--tomato" style="padding:clamp(2.2rem,6vw,3.6rem) 0">
  <div class="wrap" style="text-align:center">
    <h2 class="h-md">See you in ${b.city}.</h2>
    <div style="display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;margin-top:1.3rem">
      <a class="btn btn--cheese" href="${dirUrl(b)}" target="_blank" rel="noopener">${I.pin} Take me there</a>
      <a class="btn btn--ink" href="tel:${b.tel}">${I.phone} Call the branch</a>
    </div>
  </div>
</section>
</main>` + tail('', b);
}

/* ---------- STORY ---------- */
/* ---------- POSTER WALL — the dedicated room ----------
   The posters are the loud part of this brand, so the page holding them is
   deliberately quiet: one featured print, one carousel, one disciplined grid.
   Everything hangs straight. No rotation, no overlap, no scatter. */
function wallPage() {
  const [feature, ...rest] = POSTERS;
  const schema = [{
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'The Poster Wall — Love Bites', url: `${SITE}/wall/`,
    description: 'The full collection of Love Bites printed posters.',
    isPartOf: { '@type': 'WebSite', name: 'Love Bites', url: SITE }
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'The Wall', item: `${SITE}/wall/` }
    ]
  }];

  return head({
    title: 'The Poster Wall — Love Bites',
    desc: 'Every Love Bites poster in one room. Retro food advertising, screen-printed colour and a bit of attitude, printed for the shop walls in Chiniot, Sargodha and Faisalabad.',
    url: '/wall/', schema
  }) + nav('/wall/') + `
<main id="main">

<section class="whero">
  <div class="wrap whero__in">
    <div class="whero__txt">
      <p class="act">The Wall</p>
      <h1 class="h-xl">Every print<br>we ever<br><span class="outline">hung up</span></h1>
      <p class="whero__lede">We put on a wall only what we would actually stand behind — no stock
        smiles, no discount starbursts. ${POSTERS.length} posters, one visual universe, made for the
        Love Bites rooms between Chiniot and Faisalabad.</p>
    </div>
    <figure class="whero__poster">
      <img src="${feature.img}" alt="${feature.alt}" width="760" height="1140" fetchpriority="high" decoding="async">
    </figure>
  </div>
</section>

<section class="band band--ink wcar" aria-labelledby="wcar-h">
  <div class="wrap wcar__head">
    <div>
      <p class="act">The run</p>
      <h2 class="h-lg" id="wcar-h">Take one<br><span class="outline">off the wall</span></h2>
    </div>
    <p class="wcar__lede">Drag, swipe or use the arrow keys. Every poster links to the thing
      it is actually about.</p>
  </div>

  <div class="wall__rail" data-rail tabindex="0" role="region" aria-label="Full poster collection — scroll sideways to explore">
    <ul class="wall__track" data-rail-track>
      ${POSTERS.map((p, i) => `
      <li class="pw" style="--pw-bg:${p.bg}">
        <a class="pw__a" href="${p.href}">
          <span class="pw__frame">
            <img class="pw__img" src="${p.img}" alt="${p.alt}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async" width="760" height="1140">
          </span>
          <span class="pw__meta">
            <span class="pw__kick">${String(i + 1).padStart(2, '0')} — ${p.kicker}</span>
            <span class="pw__t">${p.t}</span>
            <span class="pw__d">${p.d}</span>
            <span class="pw__go">${p.cta}</span>
          </span>
        </a>
      </li>`).join('')}
    </ul>
  </div>

  <div class="wrap">
    <div class="wall__prog" aria-hidden="true"><span class="wall__bar" data-rail-bar></span></div>
  </div>
</section>

<section class="band band--paper wgrid" aria-labelledby="wgrid-h">
  <div class="wrap">
    <p class="act">The full collection</p>
    <h2 class="h-lg" id="wgrid-h">The whole wall</h2>
    <p class="wgrid__lede">${POSTERS.length} prints, hung straight. Tap any one of them to go where it points.</p>

    <ul class="wgrid__list">
      ${POSTERS.map((p, i) => `
      <li class="wcard">
        <a class="wcard__a" href="${p.href}">
          <span class="wcard__frame" style="--pw-bg:${p.bg}">
            <img src="${p.img}" alt="${p.alt}" loading="lazy" decoding="async" width="760" height="1140">
          </span>
          <span class="wcard__meta">
            <span class="wcard__kick">${String(i + 1).padStart(2, '0')} — ${p.kicker}</span>
            <span class="wcard__t">${p.t}</span>
            <span class="wcard__go">${p.cta}</span>
          </span>
        </a>
      </li>`).join('')}
    </ul>

    <p class="wgrid__note">Posters are printed in-house for the shop walls. They are not for sale —
      if you want one, come and look at it properly. Or print your own, just below.</p>
  </div>
</section>

<!-- THE PRINT SHOP — anyone can take one home -->
<section class="band band--ink wmake" id="make" aria-labelledby="wmake-h">
  <div class="wrap">
    <div class="wmake__head">
      <div>
        <p class="act">The print shop</p>
        <h2 class="h-lg" id="wmake-h">Make one<br><span class="outline">for you</span></h2>
      </div>
      <p class="wmake__lede">Six prints from this wall, redrawn as a tiny machine. Pick a design,
        put your words on it, take it home as a picture. Free, like the napkins — and drawn on your
        device, not ours.</p>
    </div>

    <div class="mk" data-make>
      <div class="mk__panel">
        <div class="mk__group" role="group" aria-label="Poster design">
          <p class="mk__lab" id="mk-style-lab">1 — Pick the print</p>
          <div class="mk__chips">
            <button class="chip" type="button" data-mk-style="love" aria-pressed="true">Love</button>
            <button class="chip" type="button" data-mk-style="hotline" aria-pressed="false">Hotline</button>
            <button class="chip" type="button" data-mk-style="crave" aria-pressed="false">Crave</button>
            <button class="chip" type="button" data-mk-style="eat" aria-pressed="false">Eat</button>
            <button class="chip" type="button" data-mk-style="pizza" aria-pressed="false">Pizza</button>
            <button class="chip" type="button" data-mk-style="bite" aria-pressed="false">Bite</button>
          </div>
        </div>
        <div class="mk__group">
          <p class="mk__lab"><label for="mk-words">2 — Your words (optional)</label></p>
          <input class="mk__in" id="mk-words" data-mk-words type="text" maxlength="24"
            autocomplete="off" placeholder="A NAME, A MOOD, A CRAVING…" aria-describedby="mk-hint">
          <p class="mk__hint" id="mk-hint">Short and loud works best — up to 24 letters.</p>
        </div>
        <div class="mk__group">
          <p class="mk__lab">3 — Take it home</p>
          <div class="mk__row">
            <button class="btn btn--cheese" type="button" data-mk-png>Download PNG</button>
            <button class="btn" type="button" data-mk-jpg>Download JPG</button>
            <button class="btn btn--cyan" type="button" data-mk-shuffle>Surprise me</button>
          </div>
        </div>
      </div>
      <figure class="mk__stage" data-mk-stage>
        <span class="mk__frame">
          <canvas width="760" height="1140" role="img" aria-label="Poster preview — the Love print"></canvas>
        </span>
        <figcaption>Exactly what downloads — 760 × 1140, poster-shaped.</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="band band--cheese wend">
  <div class="wrap wend__in">
    <h2 class="h-lg">Posters are loud.<br><span class="outline">The food is louder.</span></h2>
    <a class="btn btn--ink" href="/menu/">Read the menu</a>
  </div>
</section>

</main>` + tail('<script src="/js/make.js" defer></script>');
}

function storyPage() {
  const T = [
    [2018, 'A counter in Chiniot', 'Simple counter service on Sargodha Road. Big flavours, small room, guests who kept coming back. Everything since is a version of this.'],
    [2021, 'A full restaurant', 'We outgrew the setup and rebuilt the premises into a proper Love Bites — room for the whole crew, same recipes.'],
    [2022, 'Sargodha, Railway Road', 'We crossed city lines. Same menu, same energy — and it became our highest-rated kitchen.'],
    [2026, 'Faisalabad flagship', 'Green Avenue off Canal Road. The biggest expression of Love Bites so far, open till 2 a.m.']
  ];
  return head({
    title: 'Our Story — Love Bites | From one counter in Chiniot to three restaurants',
    desc: 'Love Bites isn’t a brand — it’s people working for people. The story from a 2018 counter in Chiniot to the Faisalabad flagship.',
    url: '/story/', schema: [{
      '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Our Story — Love Bites',
      about: { '@type': 'Organization', name: 'Love Bites', foundingDate: '2018', foundingLocation: 'Chiniot, Punjab, Pakistan' }
    }]
  }) + nav('/story/') + `
<main id="main">
<header class="phead band--orange">
  <div class="wrap">
    <p class="act">The story</p>
    <h1>You don't find<br>good food.<br><span class="outline">It finds you.</span></h1>
  </div>
</header>

<section class="band band--paper" style="padding:clamp(2.4rem,6vw,4.4rem) 0">
  <div class="wrap" style="display:grid;grid-template-columns:1.2fr .8fr;gap:clamp(1.6rem,4vw,3rem);align-items:center">
    <div>
      <h2 class="h-md">Love Bites<br>isn't a brand</h2>
      <p class="lede" style="margin-top:1.1rem">Usually it's the other way round: brands ask people to believe in them.
        We've always played it in reverse. We believe in people.</p>
      <p class="lede" style="margin-top:.9rem">The heart you see is ours — the love and the patience we cook with.
        The bite taken out of it? That's you. Food tastes better shared.</p>
      <p class="lede" style="margin-top:.9rem"><strong>So Love Bites isn't a brand. We're just people working for people.</strong></p>
    </div>
    <img src="/brand/heart.png" alt="The Love Bites heart-burger mark with a bite taken out" width="500" height="440"
      style="border:var(--rule-thick) solid var(--ink);border-radius:var(--r-lg);background:var(--white);padding:1.5rem;box-shadow:10px 10px 0 var(--ink)">
  </div>
</section>

<section class="band band--cyan" style="padding:clamp(2.4rem,6vw,4.4rem) 0">
  <div class="wrap">
    <p class="act">Eight years, three rooms</p>
    <h2 class="h-lg">The timeline</h2>
    <div class="tl">
      ${T.map(([y, h, d]) => `<div class="tl__row rv"><span class="tl__y">${y}</span>
        <div><h3 class="tl__h">${h}</h3><p style="margin:0;font-weight:700">${d}</p></div></div>`).join('')}
    </div>
  </div>
</section>

<section class="band band--paper" style="padding:clamp(2.4rem,6vw,4.4rem) 0">
  <div class="wrap">
    <h2 class="h-md">What stays the same</h2>
    <ul class="creed">
      <li>Honest food and consistent quality — Chiniot, Sargodha or Faisalabad.</li>
      <li>Guests and team treated like people, not tickets. Hospitality before hype.</li>
      <li>Every new door is a promise to keep improving, not coasting.</li>
      <li>No cart on this website. The food is better where it's made.</li>
    </ul>
  </div>
</section>
</main>` + tail();
}

/* ============================================================
   CONTACT — every real profile and every real number in one room.
   Sources: the pages themselves (checked Aug 2026). No TikTok exists,
   and we say so instead of linking a stranger. */
function contactPage() {
  const schema = [{
    '@context': 'https://schema.org', '@type': 'ContactPage',
    name: 'Contact — Love Bites', url: `${SITE}/contact/`,
    description: 'Phone, WhatsApp and social profiles for Love Bites Chiniot, Sargodha and Faisalabad.',
    about: {
      '@type': 'Organization', name: 'Love Bites', url: SITE, email: EMAIL,
      contactPoint: BRANCHES.map(b => ({
        '@type': 'ContactPoint', telephone: b.tel, contactType: 'customer service', areaServed: b.city
      })),
      sameAs: SOCIALS.filter(s => s.name !== 'foodpanda').map(s => s.url)
    }
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE}/contact/` }
    ]
  }];

  return head({
    title: 'Contact — Love Bites | Phones, WhatsApp & profiles for all three branches',
    desc: 'Every way to reach Love Bites: branch phones and WhatsApp for Chiniot, Sargodha and Faisalabad, plus Instagram, Facebook and foodpanda. No TikTok — that one is not us.',
    url: '/contact/', schema
  }) + nav('/contact/') + `
<main id="main">

<header class="phead band--cyan">
  <div class="wrap">
    <p class="act">Contact</p>
    <h1>Say it to<br><span class="outline">our face.</span></h1>
    <p>Fastest answer: walk into any room and talk to the humans. Second fastest: the numbers below —
      each branch picks up its own phone, so call the city you are standing in.</p>
  </div>
</header>

<section class="band band--paper">
  <div class="wrap">
    <p class="act">The switchboard</p>
    <h2 class="h-md">Three cities, three phones</h2>
    <ul class="cgrid">
      ${BRANCHES.map(b => `
      <li class="ccard">
        <div class="ccard__top">
          <img class="ccard__art" src="${b.art}" alt="" aria-hidden="true" width="120" height="120" loading="lazy" decoding="async">
          <div>
            <h3 class="ccard__city">${b.city}</h3>
            <p class="ccard__sub">${b.street.split(',').slice(0, 1)}<br>${b.hours}</p>
          </div>
        </div>
        <div class="cacts${b.fp ? '' : ' cacts--solo'}">
          <a class="cact cact--call" href="tel:${b.tel}">
            <span class="cact__ic" aria-hidden="true">${I.phone}</span>
            <span class="cact__tx"><small>Call the shop</small><strong>${b.phone}</strong></span>
          </a>
          <a class="cact cact--wa" href="https://wa.me/${b.wa}" rel="noopener">WhatsApp</a>
          ${b.fp
            ? `<a class="cact cact--fp" href="${b.fp}" rel="noopener">foodpanda</a>`
            : `<p class="cacts__na">No foodpanda in Chiniot — the counter is faster anyway.</p>`}
          <a class="cacts__dir" href="${mapUrl(b)}" rel="noopener">Directions</a>
        </div>
      </li>`).join('')}
    </ul>
    <p class="cnote">Numbers are the shop lines, taken from each branch's own listing. If one is busy,
      it is busy because the shop is full — try WhatsApp.</p>
  </div>
</section>

<section class="band band--ink soc" aria-labelledby="soc-h">
  <div class="wrap">
    <p class="act">The profiles</p>
    <h2 class="h-lg" id="soc-h">Where we<br><span class="outline">actually post</span></h2>
    <ul class="soc__list">
      ${SOCIALS.map(s => `
      <li>
        <a class="soc__a" href="${s.url}" rel="noopener">
          <span class="soc__ic soc__ic--${s.name === 'Instagram' ? 'ig' : s.name === 'Facebook' ? 'fb' : 'fp'}" aria-hidden="true">${SOCIAL_ICONS[s.name]}</span>
          <span class="soc__n">${s.name}<small>${s.handle}</small></span>
          <span class="soc__d">${s.note}</span>
          <span class="soc__ft">Open profile</span>
        </a>
      </li>`).join('')}
      <li class="soc__na" aria-label="No TikTok account">
        <span class="soc__ic" aria-hidden="true">${I.tt}</span>
        <span class="soc__n">TikTok<small>not us, yet</small></span>
        <span class="soc__d">Searched for it, could not find an official one. If a Love Bites TikTok
          finds you in Chiniot, it belongs to somebody else.</span>
        <span class="soc__ft soc__ft--off">Not linked</span>
      </li>
    </ul>
  </div>
</section>

<section class="band band--cheese office">
  <div class="wrap office__in">
    <div>
      <p class="act">The office</p>
      <h2 class="h-md">Slow questions</h2>
      <p style="font-weight:700;max-width:44ch">Catering, bigger tables, things a phone call cannot
        sort out — write to the office and a human replies.</p>
    </div>
    <div class="office__card">
      <a class="btn btn--ink" href="mailto:${EMAIL}">${EMAIL}</a>
      <p><strong>Love Bites Office</strong><br>Sargodha Road, Chiniot<br>Mon–Thu, 11 a.m.–6 p.m.</p>
    </div>
  </div>
</section>

</main>` + tail();
}

/* ============================================================
   WRITE
   ============================================================ */
const write = (p, html) => {
  const f = path.join(OUT, p, 'index.html');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  console.log('  ✓', p || '/', (html.length / 1024).toFixed(1) + 'kb');
};

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync('public', OUT, { recursive: true });

console.log('Building Love Bites…');
write('', home());
write('menu', menuPage());
write('spots', spotsPage());
BRANCHES.forEach(b => write(`spots/${b.slug}`, branchPage(b)));
write('story', storyPage());
write('wall', wallPage());
write('contact', contactPage());

/* 404 — served by Vercel for unknown routes */
fs.writeFileSync(path.join(OUT, '404.html'),
  head({ title: '404 — Wrong door · Love Bites', desc: 'That page is not on the wall. Walk back to the shop.', url: '/' }) +
  nav('') + `
<main id="main">
<section class="band band--paper">
  <div class="wrap" style="text-align:center;padding:4.5rem 0 5.5rem">
    <p style="color:var(--tomato);width:84px;margin:0 auto 1.2rem">${I.heart.replace('viewBox', 'style="width:84px;height:74px" viewBox')}</p>
    <p class="act">404</p>
    <h1 style="font-size:clamp(2.2rem,6vw,3.6rem);margin:0">Wrong door.</h1>
    <p style="font-weight:700;max-width:38ch;margin:1rem auto 2.2rem">This page is not on the wall. The pizza, luckily, is still exactly where you left it.</p>
    <div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap">
      <a class="btn btn--hot" href="/">Back to the shop</a>
      <a class="btn" href="/menu/">See the menu</a>
      <a class="btn" href="/spots/">Find a branch</a>
      <a class="btn" href="/contact/">Contact us</a>
    </div>
  </div>
</section>
</main>` + tail());

/* ============================================================
   LEGAL PAGES — plain, honest, and marked where the client
   still owes us facts. Never fabricate policy terms.
   ============================================================ */
const CONFIRM = s => `<strong class="legal__confirm">[CLIENT TO CONFIRM: ${s}]</strong>`;
const legalHead = (title, desc, url) => head({ title, desc, url });

write('privacy', legalHead(
  'Privacy Policy — Love Bites',
  'How the Love Bites website handles your data: what we collect (almost nothing), what we do not, and how to reach us about privacy.',
  '/privacy/') + nav('') + `
<main id="main">
<header class="phead band--cheese">
  <div class="wrap">
    <p class="act">The small print</p>
    <h1>Privacy<br><span class="outline">policy.</span></h1>
    <p>Short version: this website collects almost nothing about you, and we intend to keep it that way.</p>
  </div>
</header>
<section class="band band--paper">
  <div class="wrap legal">
    <p class="legal__upd">Last updated ${DATA_ASOF}. Applies to this website only — not to orders placed through delivery platforms, which follow their own policies.</p>

    <h2>1. Who we are</h2>
    <p>Love Bites is a restaurant business operating three rooms in Chiniot, Sargodha and Faisalabad, Punjab, Pakistan.
    ${CONFIRM('the registered legal entity name and registered address, if different from the office below')}.</p>
    <p>Privacy questions go to <a href="mailto:${EMAIL}" style="text-decoration:underline">${EMAIL}</a> — the same inbox humans read for everything else.</p>

    <h2>2. What this website collects</h2>
    <ul>
      <li><strong>Nothing you type is sent to us.</strong> There are no accounts, no contact forms and no checkout on this site. Contact happens by phone, WhatsApp, email or walking in — all outside this website.</li>
      <li><strong>One local preference.</strong> If you switch city on the menu page, your choice is stored in your own browser's local storage (key <code>lb-branch</code>) so the site remembers it next visit. It never leaves your device, and clearing your browser data removes it.</li>
      <li><strong>Server logs.</strong> Like every website, our host (Vercel) records standard technical logs — IP address, browser, pages requested — for security and reliability. ${CONFIRM('the hosting provider’s log retention period; see the Vercel data processing addendum')}.</li>
    </ul>

    <h2>3. What loads from other companies</h2>
    <ul>
      <li><strong>Google Maps</strong> — only after you tap “Load the map” on a branch page. Before that tap, nothing is requested from Google. Once loaded, Google's privacy policy applies to that embed.</li>
      <li><strong>External links</strong> — our phone, WhatsApp, Instagram, Facebook and foodpanda links take you to those services, whose own policies apply there.</li>
      <li><strong>Fonts and images</strong> are served from this website's own domain — no font or image CDNs, no advertising networks, no analytics, no tracking pixels.</li>
    </ul>

    <h2>4. What we do not do</h2>
    <p>No advertising cookies. No analytics. No profiling. No selling or sharing visitor data. No newsletters or marketing messages from this website.</p>

    <h2>5. Your rights</h2>
    <p>Pakistan's data-protection law is still in draft form; we nevertheless follow the principles it proposes — data minimisation, purpose limitation, and deletion when data is no longer needed.
    If you have a privacy question, complaint or request, write to <a href="mailto:${EMAIL}" style="text-decoration:underline">${EMAIL}</a> and a human will answer.
    ${CONFIRM('a response-time commitment and an escalation contact')}.</p>

    <h2>6. Children</h2>
    <p>This is a restaurant website aimed at a general audience. We do not knowingly collect data from anyone, including children.</p>

    <h2>7. Changes</h2>
    <p>If this policy changes, the date at the top changes with it. ${CONFIRM('whether material changes will be announced on this page')}</p>

    <h2>8. Contact</h2>
    <p>Love Bites Office, Sargodha Road, Chiniot, Punjab, Pakistan · Office hours: Monday–Thursday, 11 a.m.–6 p.m. ·
    <a href="mailto:${EMAIL}" style="text-decoration:underline">${EMAIL}</a> · <a href="tel:${BRANCHES[0].tel}" style="text-decoration:underline">${BRANCHES[0].phone}</a></p>
    <p class="legal__note">This page is written in plain language on purpose. It is not formal legal advice; have it reviewed by a Pakistani lawyer before the site goes fully public.</p>
  </div>
</section>
</main>` + tail());

write('cookies', legalHead(
  'Cookie Policy — Love Bites',
  'What the Love Bites website stores on your device and why. Spoiler: no advertising cookies and no analytics.',
  '/cookies/') + nav('') + `
<main id="main">
<header class="phead band--cyan">
  <div class="wrap">
    <p class="act">The small print</p>
    <h1>Cookie<br><span class="outline">policy.</span></h1>
    <p>The honest version — including why you will not see a cookie banner here.</p>
  </div>
</header>
<section class="band band--paper">
  <div class="wrap legal">
    <p class="legal__upd">Last updated ${DATA_ASOF}.</p>

    <h2>1. Cookies on this website</h2>
    <p><strong>This website sets no cookies.</strong> Not analytics cookies, not advertising cookies, not “functional” cookies dressed up as either.</p>

    <h2>2. Local storage (one item)</h2>
    <p>When you pick a city on the menu page, we save that choice in your browser's local storage under the key <code>lb-branch</code>. It is a convenience for you — the site simply remembers which prices to show. It is not shared with anyone, it is not a cookie, and clearing site data removes it.</p>

    <h2>3. Third-party content</h2>
    <p>Branch pages offer a <strong>“Load the map”</strong> button. Until you tap it, nothing at all is loaded from Google. If you tap it, the Google Maps embed may set Google's own cookies — governed by <a href="https://policies.google.com/privacy" rel="noopener" style="text-decoration:underline">Google's privacy policy</a>. Tap it, or don't — the address, directions link and phone numbers work either way.</p>

    <h2>4. Why there is no cookie banner</h2>
    <p>Cookie-consent banners exist to gate non-essential storage and tracking. This site has none to gate: one local preference, and maps that load only on request. A banner here would be theatre — and theatre is not consent. If we ever add analytics, advertising or embeds that track you, this policy changes and a real choice appears before any of it loads.</p>

    <h2>5. Managing local storage</h2>
    <p>Your browser's settings let you clear site data for this domain at any time. That resets your city preference to Chiniot — everything else is unaffected.</p>

    <h2>6. Questions</h2>
    <p><a href="mailto:${EMAIL}" style="text-decoration:underline">${EMAIL}</a></p>
    <p class="legal__note">This page is not formal legal advice; have it reviewed by a Pakistani lawyer before launch.</p>
  </div>
</section>
</main>` + tail());

write('terms', legalHead(
  'Terms & Conditions — Love Bites',
  'The rules for using the Love Bites website: prices, menus, links and what we are responsible for.',
  '/terms/') + nav('') + `
<main id="main">
<header class="phead band--orange">
  <div class="wrap">
    <p class="act">The small print</p>
    <h1>Terms &amp;<br><span class="outline">conditions.</span></h1>
    <p>Plain terms for a website that sells nothing online but tells you plenty.</p>
  </div>
</header>
<section class="band band--paper">
  <div class="wrap legal">
    <p class="legal__upd">Last updated ${DATA_ASOF}. ${CONFIRM('the registered business/legal entity name that contracts as “Love Bites”')}</p>

    <h2>1. Using this website</h2>
    <p>This website is free to browse. Use it for its intended purpose — finding our menu, our branches and ways to reach us. Do not attempt to disrupt it, scrape it into another service's storefront, or misrepresent its content as yours.</p>

    <h2>2. Menu &amp; prices</h2>
    <p>Prices shown are dine-in / takeaway prices published by Love Bites for each branch and were last checked ${DATA_ASOF}. They can change; delivery apps price separately. <strong>The counter is always right</strong> — if the website and the branch disagree, the branch price is the one that applies. All prices are exclusive of tax (GST) as printed on the branch menu.</p>

    <h2>3. Orders</h2>
    <p>This website takes no orders and no payments. Orders happen in person, by phone or WhatsApp with a branch, or through delivery platforms such as foodpanda — each governed by their own terms. ${CONFIRM('any catering or large-order terms the business wants published')}</p>

    <h2>4. Reviews &amp; ratings</h2>
    <p>Quoted reviews are real, publicly posted reviews from Google and foodpanda listings, shortened only for length and attributed to their source. Ratings are snapshots from those platforms, dated when checked. They are third-party content; we do not write it and we do not warrant its accuracy.</p>

    <h2>5. Intellectual property</h2>
    <p>The Love Bites name, heart-burger mark, poster artwork, photography and site copy belong to Love Bites ${CONFIRM('confirm the IP owner is the trading entity, and the licence status of any commissioned photography or design work')}. Third-party names (Google, WhatsApp, Instagram, Facebook, foodpanda) belong to their owners and are used only to link to their services.</p>

    <h2>6. Links to other services</h2>
    <p>Links to maps, messaging and delivery platforms are provided for convenience. Their content and policies are theirs, not ours.</p>

    <h2>7. Availability</h2>
    <p>We keep the site accurate and online, but menus, hours and branches change. The website is provided as-is; to the extent the law allows, we are not liable for decisions taken purely on the basis of stale website information. Nothing here limits rights you have under Pakistani consumer law — including the Punjab Consumer Protection Act 2005, under which our published claims must be accurate.</p>

    <h2>8. Governing law</h2>
    <p>${CONFIRM('the governing law and the courts/authority for disputes — presumably Punjab, Pakistan')}.</p>

    <h2>9. Contact</h2>
    <p><a href="mailto:${EMAIL}" style="text-decoration:underline">${EMAIL}</a> · Love Bites Office, Sargodha Road, Chiniot · Office hours: Monday–Thursday, 11 a.m.–6 p.m.</p>
    <p class="legal__note">This page is not formal legal advice; have it reviewed by a Pakistani lawyer before launch.</p>
  </div>
</section>
</main>` + tail());

write('refund-policy', legalHead(
  'Refund & Cancellation Policy — Love Bites',
  'What to do when an order goes wrong at Love Bites: dine-in, takeaway, phone orders and delivery-platform orders.',
  '/refund-policy/') + nav('') + `
<main id="main">
<header class="phead band--cheese">
  <div class="wrap">
    <p class="act">The small print</p>
    <h1>Refunds &amp;<br><span class="outline">cancellations.</span></h1>
    <p>Things go wrong sometimes. Here is how we handle it — and how to ask.</p>
  </div>
</header>
<section class="band band--paper">
  <div class="wrap legal">
    <p class="legal__upd">Last updated ${DATA_ASOF}. This website takes no online payments; every policy below concerns orders made directly with a branch or through a delivery platform.</p>

    <h2>1. Something is wrong with my order</h2>
    <p>Tell us before you leave the table, or call the branch that made your order as soon as you notice. Keep the bill and the food. We would rather fix the meal than argue about it. ${CONFIRM('confirm this goodwill framing with the owners — it sets a customer expectation the branches must honour')}</p>

    <h2>2. Dine-in &amp; takeaway</h2>
    <p>${CONFIRM('the branch-level policy: replacement vs refund, time limits, and who approves it. Suggested shape: incorrect or unsatisfactory items are replaced or refunded at the branch manager’s discretion, with proof of purchase')}.</p>

    <h2>3. Phone / WhatsApp orders</h2>
    <p>Call the branch directly and before the food leaves the kitchen if you need to cancel. ${CONFIRM('whether cancellations are accepted after preparation begins, and any cost that applies')}.</p>

    <h2>4. Delivery platform orders (foodpanda)</h2>
    <p>Orders placed on foodpanda follow foodpanda's refund and dispute process — use the order's help option in their app. Platform policies override this page for platform orders.</p>

    <h2>5. Prices &amp; billing errors</h2>
    <p>If you were charged a price that differs from the published branch price, tell the branch with your bill and it will be corrected or refunded. All published prices are exclusive of GST as printed on the branch menu.</p>

    <h2>6. How to ask</h2>
    <p>Phone or WhatsApp the branch (numbers on the <a href="/contact/" style="text-decoration:underline">contact page</a>), or write to <a href="mailto:${EMAIL}" style="text-decoration:underline">${EMAIL}</a> for anything a phone call cannot sort out.</p>
    <p class="legal__note">This page is not formal legal advice; have it reviewed by a Pakistani lawyer before launch. Refund duties that exist under Pakistani consumer law are not limited by this page.</p>
  </div>
</section>
</main>` + tail());

const urls = ['/', '/menu/', '/spots/', ...BRANCHES.map(b => `/spots/${b.slug}/`), '/wall/', '/story/', '/contact/', '/privacy/', '/cookies/', '/terms/', '/refund-policy/'];
const TODAY = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n') +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

// expose branch hours for the client-side "open now" logic
fs.writeFileSync(path.join(OUT, 'js', 'branches.json'),
  JSON.stringify(BRANCHES.map(b => ({ slug: b.slug, city: b.city, open: b.open, close: b.close, hours: b.hours }))));

console.log('  ✓ sitemap.xml, robots.txt, branches.json');
console.log('Done.');

// Single source of truth for site metadata, business info (NAP), and schema.
// Update these values once and they propagate to meta tags, JSON-LD, and the footer.

export const SITE = {
  name: 'AITS',
  legalName: 'Advanced Intelligent Technology Solutions',
  url: 'https://aits.llc',
  // Homepage <title> — keyword-rich for SEO/AEO. (OG site name is SITE.name.)
  title: 'AITS — Managed AI for Small Business, One Flat Fee',
  tagline: 'AI that still works in month three.',
  description:
    'Most AI works on day one and breaks by week three. AITS is built on 25+ years of deploying and managing technology that has to work: every automation tested regularly, monitored, and fixed — for one flat monthly fee. San Diego HQ, serving businesses nationwide.',
  // Default social share image (place a 1200x630 PNG at /public/og-default.png).
  defaultOgImage: '/og-default.png',
  // Brand logo used in Organization JSON-LD (required for Article rich results).
  logo: '/images/logo.png',
  locale: 'en_US',
} as const;

export const BUSINESS = {
  phone: '+1-858-337-2866',
  phoneDisplay: '(858) 337-2866',
  email: 'gavin@aits.llc',
  founder: 'Gavin Dreyfus',
  // Geographic service area (used in LocalBusiness schema + copy).
  // HQ is San Diego; service area is nationwide (per Nick, 2026-06-30).
  areasServed: ['San Diego', 'Southern California', 'United States'],
  region: 'CA',
  city: 'San Diego',
  // Add street address + lat/long when available to strengthen local SEO.
} as const;

// Cloudflare Worker that handles scan leads (/lead) and contact-form
// submissions (/contact). Same origin allow-list, Resend email, KV logging.
export const FORM_ENDPOINT = 'https://aits-scan.nicholasdreyfus.workers.dev';

// Google Analytics 4 Measurement ID (G-XXXXXXXXXX). Empty = analytics OFF:
// no gtag script loads and no events fire until this is set. Create a GA4
// property at analytics.google.com, then paste the ID here.
export const GA_MEASUREMENT_ID = '';

// Leadership — emitted as Person JSON-LD (E-E-A-T / entity signals for AEO).
// `sameAs` only includes profiles that actually exist; add more as they go live.
export const LEADERS = [
  { name: 'Gavin Dreyfus', jobTitle: 'Founder & Principal', sameAs: [] as string[] },
  {
    name: 'Nick Dreyfus',
    jobTitle: 'Co-Founder & Board Member',
    sameAs: ['https://www.linkedin.com/in/nicholas-dreyfus/'],
  },
  {
    name: 'Dale Stein',
    jobTitle: 'Board Member',
    sameAs: ['https://www.linkedin.com/in/steindale/'],
  },
] as const;

export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

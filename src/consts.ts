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

export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

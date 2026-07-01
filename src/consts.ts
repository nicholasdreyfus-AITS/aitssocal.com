// Single source of truth for site metadata, business info (NAP), and schema.
// Update these values once and they propagate to meta tags, JSON-LD, and the footer.

export const SITE = {
  name: 'AITS',
  legalName: 'Advanced Intelligent Technology Solutions',
  url: 'https://aits.llc',
  // Used as the default <title> suffix and OG site name.
  title: 'AITS — AI for Small & Mid-Sized Business',
  tagline: 'AI that works for your business, not just tech teams.',
  description:
    'AITS gives small and mid-sized businesses every tool they need to grow — CRM, marketing automation, AI receptionist, booking, reviews, and reporting — managed for one flat monthly fee. Headquartered in San Diego, serving businesses nationwide.',
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

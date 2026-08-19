// Single source of truth for site metadata, business info (NAP), and schema.
// Update these values once and they propagate to meta tags, JSON-LD, and the footer.

export const SITE = {
  name: 'AITS',
  // The brand is AITS; the registered entity is NGD Enterprises LLC.
  // `legalName` is the entity alone (schema.org expects the registered
  // company here). `legalEntity` is the full form for legal contexts —
  // copyright line, privacy policy, contracts. Schema `name` stays "AITS"
  // because that is what people actually search for.
  legalName: 'NGD Enterprises LLC',
  legalEntity: 'NGD Enterprises LLC DBA AITS',
  fullName: 'Advanced Intelligent Technology Solutions',
  url: 'https://aits.llc',
  // Homepage <title> — keyword-rich for SEO/AEO. (OG site name is SITE.name.)
  title: 'AITS — Managed AI for Small Business, One Flat Fee',
  tagline: 'AI that still works in month three.',
  description:
    'AITS is built on 25+ years of deploying technology that keeps working: tested, monitored, and fixed — for one flat monthly fee, nationwide.',
  // Default social share image (place a 1200x630 PNG at /public/og-default.png).
  defaultOgImage: '/og-default.png',
  locale: 'en_US',
} as const;

export const BUSINESS = {
  phone: '+1-619-837-3320',
  phoneDisplay: '(619) 837-3320',
  email: 'gavin@aits.llc',
  founder: 'Gavin Dreyfus',
  // Geographic service area (used in LocalBusiness schema + copy).
  // HQ is San Diego; service area is nationwide (per Nick, 2026-06-30).
  areasServed: ['San Diego', 'Southern California', 'United States'],
  region: 'CA',
  city: 'San Diego',
  // Add street address + lat/long when available to strengthen local SEO.
} as const;

// Blog author credentials (E-E-A-T) — AITS-terms only: no personal LinkedIn,
// no i-NETT job title tied to an individual. The i-NETT partnership is named
// at the company level elsewhere (see the CTA block on every post), never
// as a personal profile link.
export const AUTHORS = {
  'Nick Dreyfus': {
    jobTitle: 'Co-Founder & Board Member, AITS',
    bio: 'Nick Dreyfus is an AITS co-founder and board member, bringing over a decade of consulting and network architecture experience to mentoring the AITS team. AITS works in close partnership with i-NETT to bring enterprise-grade tools to small businesses at a fraction of typical support costs, with Gavin Dreyfus trained day-to-day by two mentors carrying 80+ combined years in technology — Nick Dreyfus and Dale Stein.',
    image: '/images/nick.jpg',
  },
} as const;

export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

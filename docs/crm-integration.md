# CRM Integration Runbook (internal)

> **Internal doc — never name the vendor in public-facing copy.** On the website, in decks,
> and in proposals, the stack is always "enterprise-grade solutions AITS partners with
> directly" or "the AITS platform." This doc names the vendor only so we know where to click.

The CRM/automation platform is **GoHighLevel (GHL)**. The website is already wired with
placeholder slots — this doc is the checklist for connecting the real account.

## 1. Account setup

1. Log into GHL and create (or confirm) the **AITS location** (sub-account).
2. Set up the business profile inside GHL: name AITS, email gavin@aits.llc, phone (619) 837-3320.
3. Connect the sending domain for email (use a subdomain like `mail.aits.llc` — keep the root
   domain's reputation isolated) and register the SMS/A2P brand + campaign (required before any
   SMS goes out; takes a few days to approve, start early).

## 2. Newsletter form → website

1. In GHL: **Sites → Forms → Builder** → create a form named `AITS Newsletter` with a single
   email field (plus optional first name). Style it dark to match the site (background
   transparent, text `#e8eaf2`-ish, accent `#3b6ef0`).
2. On submit: add the contact to a `Newsletter` tag/smart list, and trigger a welcome email
   workflow.
3. Grab the form's **embed link** (the iframe `src` URL).
4. Paste it into [`src/components/NewsletterSignup.astro`](../src/components/NewsletterSignup.astro)
   replacing `CRM_NEWSLETTER_FORM_EMBED_SRC_HERE`. The component automatically switches from the
   mailto fallback to the embedded form.
5. Rebuild + deploy.

## 3. Contact page (later phase)

The contact page currently uses Calendly (`https://calendly.com/gavin-aits`) — **leave it
working until the GHL calendar is fully configured**, then swap:

1. In GHL: **Calendars** → create `Free AI Assessment (30 min)` linked to the right
   availability.
2. Replace the Calendly URL in `src/pages/contact.astro` with the GHL calendar link/embed.
3. Optional: add a GHL contact form to the contact page so form fills land in the CRM with
   source attribution, not just bookings.

## 4. Chat widget (optional, later)

GHL's chat widget can be added site-wide via one script tag in
`src/layouts/BaseLayout.astro`. Weigh it against page-speed goals — test Lighthouse before and
after. Load it deferred if added.

## 5. Newsletter sending

The blog already publishes an RSS feed at `https://aits.llc/rss.xml`. Options:

- **Manual (start here):** when a post goes live, send a GHL email campaign to the
  `Newsletter` list with the post summary + link.
- **Automated (later):** GHL workflows can be triggered via webhook — a small scheduled
  worker can poll the RSS feed and fire the webhook on new items. Don't build this until the
  manual cadence is proven.

## 6. Lead source hygiene

Tag every inbound by source from day one: `newsletter`, `contact-page`, `risk-scan`,
`reddit`, `podcast`. Future reporting depends on this being clean from the start.

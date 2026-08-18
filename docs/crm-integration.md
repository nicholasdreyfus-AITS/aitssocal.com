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

## 3. Scheduling — retire Calendly, move to GHL

**Decision (Nick, this session): all scheduling moves to GHL.** Calendly is an unnecessary
extra component and an extra bill; GHL's calendar is sufficient and connects to Google
Calendar for real availability. Calendly stays live until the GHL calendar is tested — it is
the site's primary conversion path, so do not swap on faith.

### 3.1 What to create in GHL

1. **Settings → Integrations → Google Calendar** — connect Gavin's Google account with
   *two-way* sync so outside events block GHL availability and GHL bookings appear on Google.
2. **Calendars → Create calendar** named `Free AI Assessment (30 min)`:
   - Duration 30 min; add a buffer (10–15 min) so back-to-back bookings don't collide.
   - Minimum scheduling notice (a few hours minimum) and a booking window (e.g. 3 weeks out).
   - Assign Gavin as the team member; set the timezone explicitly to America/Los_Angeles.
   - Booking form fields must include **name, email, phone** — the scan funnel already
     collects these, and they need to match for contact deduplication in the CRM.
3. **Automation → Workflow** with trigger **Appointment Booked** on that calendar (see 3.3).
4. Grab the calendar's public booking link *and* the embed snippet — both are needed.

### 3.2 The three code references to swap

Calendly appears in three places, not one. All three must change together:

| File | Line | What it is |
|---|---|---|
| `src/pages/contact.astro` | ~39 | "Book a meeting" CTA link |
| `public/scan.html` | ~320 | Embedded booking iframe in the scan funnel |
| `public/scan.html` | ~923 | `calendly.event_scheduled` listener → fires `/booked` |

That third one is the trap. It listens for a Calendly-specific `postMessage` event to trigger
the booking-confirmation email. GHL's embed does not send that event, so **if only the URLs
are swapped, booking confirmation emails stop silently.**

### 3.3 Booking confirmation — the decision this forces

`/booked` rebuilds the client PDF, which needs the full `lead` + `computed` report data. That
data currently lives only in the browser at booking time. Three ways forward:

- **A. Keep client-side detection.** Replace the Calendly event listener with GHL's equivalent.
  Requires confirming GHL's actual `postMessage` event name/shape empirically with a test
  booking — do not guess it. Least change, but keeps the fragile part.
- **B. Let GHL send the confirmation (recommended).** An `Appointment Booked` workflow sends
  the confirmation email natively. Note the client *already* received their report PDF at scan
  submit, so the booking email's attachment is a duplicate — dropping it loses little. Most
  aligned with "everything through GHL," and removes the `postMessage` dependency entirely.
- **C. Server-side webhook.** Persist the report to KV at `/lead` keyed by email; GHL's
  workflow calls `/booked` by webhook, which looks the report up. Most robust and keeps the
  personalized PDF, but requires the `LEADS` KV namespace to actually be bound in production
  (the code treats it as optional — verify before relying on it).

Whichever is chosen, **test with a real booking** and confirm the email actually arrives
before removing Calendly.

### 3.4 Also worth doing

Add a GHL contact form to the contact page so form fills land in the CRM with source
attribution, not just bookings.

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

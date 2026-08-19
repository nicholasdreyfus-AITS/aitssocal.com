# GHL Calendar — configuration spec (retiring Calendly)

Build this in GHL, then send Claude the booking link and the three code swaps get done
together. Prepared 2026-08-18. Companion to [`crm-integration.md`](./crm-integration.md).

**Do not remove Calendly until this is built and test-booked.** It is the site's primary
conversion path.

---

## 1. Connect Google Calendar first

GHL → **Settings → Integrations → Google Calendar** → connect Gavin's Google account.

Set sync to **two-way**:

- **Inbound** — events already on Gavin's Google Calendar block GHL availability. Without this
  he gets double-booked by anything scheduled outside GHL.
- **Outbound** — GHL bookings appear on his Google Calendar.

Choose the *specific* calendar to sync (not "all calendars") so a shared or subscribed calendar
doesn't silently block availability.

---

## 2. Create the calendar

GHL → **Calendars → Create Calendar**.

| Setting | Value | Why |
|---|---|---|
| Name | `Free AI Assessment (30 min)` | Matches the site copy exactly |
| Type | Round Robin or Simple — Simple is fine while Gavin is the only host | |
| Team member | Gavin Dreyfus | |
| Duration | 30 minutes | Site says "30 minutes" in ~12 places |
| Slot interval | 30 minutes | |
| Buffer *after* | 15 minutes | Stops back-to-back calls colliding when one runs long |
| Minimum scheduling notice | 4 hours | Prevents a surprise booking 10 minutes out |
| Booking window | 21 days | Far enough to be useful, close enough to stay real |
| Timezone | **America/Los_Angeles** | Set explicitly. Inherited timezones are the #1 cause of "why is my 9am showing as noon" |
| Availability | Set real working hours | Do not leave 24/7 defaults on |

### Booking form fields

Use exactly these, because the scan funnel already collects the same values and contacts must
deduplicate rather than creating a second record:

- First name · Last name · Email · Phone

Do **not** add an SMS consent checkbox here — consent already lives on the scan form with a
timestamp. Adding a second, differently-worded consent creates two conflicting records of what
was agreed to.

### Redirect after booking

Set **Redirect URL** to `https://aits.llc/thank-you.html`.

This is what replaces the fragile Calendly `postMessage` listener. Rather than the browser
detecting a booking event, GHL performs the redirect itself — one setting instead of an event
name that can silently change.

---

## 3. Confirmation and reminders

Configure on the calendar (or as an **Appointment Booked** workflow):

| When | Channel | Notes |
|---|---|---|
| On booking | Email confirmation | Include the meeting link and an add-to-calendar link |
| 24 hours before | Email reminder | |
| 1 hour before | SMS reminder | **Only if `sms_consent = yes`** |
| On booking | Internal notification to Gavin | |

> ⚠️ **Every SMS step must be gated on `sms_consent = yes`.** The Worker pushes that field with
> every scan lead. The calendar's own booking form does not collect SMS consent, so a contact who
> books without ever running the scan has **no consent on file** and must not be texted. Add the
> condition explicitly — do not rely on the field being absent.

This replaces the Worker's `/booked` confirmation email (option B from
[`crm-integration.md`](./crm-integration.md) §3.3). Worth knowing: the client already received
their report PDF when they submitted the scan, so the booking email's attached copy was a
duplicate. Nothing of value is lost by letting GHL own this message.

---

## 4. Send Claude these two things

1. **The public booking link** — e.g. `https://api.leadconnectorhq.com/widget/booking/XXXXXXXX`
2. **The embed snippet** GHL provides (iframe + `form_embed.js` script)

Both are needed: the contact page uses a link, the scan funnel uses an embed.

### The three swaps Claude will make together

| File | What changes |
|---|---|
| `src/pages/contact.astro` | "Book a meeting" CTA → GHL link |
| `public/scan.html` | Booking iframe → GHL embed |
| `public/scan.html` | Delete the `calendly.event_scheduled` listener and `notifyBooked()` — the calendar's redirect setting replaces both |

---

## 5. Test before Calendly comes down

1. Book a real slot through the new calendar.
2. Confirm it lands on Gavin's Google Calendar.
3. Confirm the confirmation email arrives.
4. Confirm the redirect to `/thank-you.html` fires.
5. Put a busy block on Google Calendar and confirm that slot disappears from GHL.

Only after all five pass, remove Calendly.

# A2P / 10DLC Registration — copy-paste pack (internal)

Everything needed to register the SMS brand and campaign in GoHighLevel.
Prepared 2026-08-18. Companion to [`crm-integration.md`](./crm-integration.md).

> **Do not resubmit brand vetting repeatedly on failure.** Some vetting attempts
> carry a fee, and repeated submissions of the same data will not self-correct.
> If verification fails, fix the underlying mismatch first.

## Prerequisites (all complete as of 2026-08-18)

| Requirement | Status |
|---|---|
| Privacy policy with carrier-required sharing language | ✅ `https://aits.llc/privacy` |
| Real, screenshottable opt-in checkbox | ✅ `https://aits.llc/scan.html` (lead gate) |
| Consent captured with timestamp + exact wording | ✅ Worker `/lead`, deployed & verified |
| Business profile in GHL | ⬜ confirm before submitting |
| DBA (California Fictitious Business Name) | ⬜ optional for A2P, needed for banking/contracts |

## Brand registration

| Field | Value |
|---|---|
| Legal company name | `NGD Enterprises LLC` — **must match EIN exactly**, watch `LLC` vs `L.L.C.` |
| DBA / brand name | `AITS` |
| EIN | see `Documents\Nick\AITS\LLC Information\EIN Information.pdf` |
| Entity type | Private Company / LLC |
| Vertical | Professional Services (or Technology) |
| Website | `https://aits.llc` |
| Address | same as the GHL business profile |
| Contact | Gavin Dreyfus · gavin@aits.llc · (619) 837-3320 |

## Campaign

**Use case:** Low Volume Mixed (under ~6,000/day — faster approval, lower cost, and accurate for current volume)

**Campaign description** — paste verbatim:

> AITS sends appointment and follow-up messages to business owners who request a free AI readiness assessment on aits.llc. Contacts complete a form providing their name, company, email, and mobile number, and separately check an unchecked opt-in box explicitly consenting to text messages. Messages relate solely to the assessment they requested and any consultation they schedule — confirmations, reminders, and follow-up. Consent is not required to receive the assessment. Message volume is low, typically 2 to 5 messages per contact.

**Opt-in description** — paste verbatim:

> Web form opt-in at https://aits.llc/scan.html. After completing the AI Risk Scan, the user submits a lead form containing a separate, unchecked checkbox reading: "Text me about my results. By checking this box, I agree to receive text messages from AITS at the number provided about my AI Risk Scan results and any consultation I schedule. Message frequency varies (typically 2–5 messages). Message and data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of any purchase." Consent is stored with a timestamp and the exact wording displayed.

**Privacy policy URL:** `https://aits.llc/privacy`

### Sample messages

Every sample must carry opt-out language — a missing one is a common rejection.

1. `AITS: Hi {{first_name}}, thanks for running your AI Risk Scan. Your report is in your inbox. Want to walk through it? Book here: aits.llc/contact Reply STOP to opt out.`
2. `AITS: Reminder — your 30-minute AI readiness review is tomorrow at {{time}}. Reply R to reschedule or STOP to opt out.`
3. `AITS: Hi {{first_name}}, following up on your AI Risk Scan. Happy to answer questions — just reply. Reply STOP to opt out.`

### Required keyword replies

- **STOP** → `AITS: You are unsubscribed and will receive no further messages. Reply HELP for help.`
- **HELP** → `AITS: AITS support — gavin@aits.llc or (619) 837-3320. Msg&data rates may apply. Reply STOP to unsubscribe.`

## After approval — do not skip

The consent flag reaches the CRM as `sms_consent` (`yes`/`no`) with `sms_consent_at`, pushed by
the Worker on every scan lead. **Any SMS workflow must gate on `sms_consent = yes`.**

A contact choosing "Text" as their preferred contact method is **not** consent — only the
checkbox is. Both values are captured separately and they routinely disagree. The internal lead
email states `OK to text` or `DO NOT TEXT` outright so nobody has to infer it.

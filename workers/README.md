# AITS AI Risk Scan — Cloudflare Worker

`aits-scan-worker.js` powers the personalized **Analyst Note** on the scan funnel
(`/scan.html`). It keeps the Anthropic API key server-side.

## 2026-07-01 rework — what changed

The scan was rebuilt so the **entire report is computed in the page itself**
(score, exposure bands, compliance flags, findings with fixes). It renders
complete even if this Worker is down, unreachable, or not yet redeployed — the
Analyst Note simply falls back to a solid templated paragraph. **The blank-report
failure mode is gone regardless of Worker state.**

This Worker now does two jobs:

1. **POST /** — given the answers + computed report, writes a personalized 3–5
   sentence analyst note (`{"analystNote": "..."}`). Also still accepts the old
   `{messages}` contract, so page and Worker can deploy in either order.
2. **POST /lead** — the full-report lead gate. When a visitor unlocks the full
   report with name / company / email / cell phone, the page emails the
   complete report (PDF attached when the client generated one, HTML fallback
   otherwise) plus the lead's contact details to `NOTIFY_TO` (currently
   `gavin@aits.llc` — edit the constant to add recipients).

Model: `claude-sonnet-5`. Cheaper option for this small task: `claude-haiku-4-5`
(change the `MODEL` constant).

## Resend setup (required for lead emails)

Lead notifications send via [Resend](https://resend.com) (free tier: 100
emails/day — plenty).

1. Create a Resend account and add the domain `aits.llc` (Domains → Add).
2. Add the DNS records Resend shows (SPF + DKIM TXT records) in the Cloudflare
   DNS panel for aits.llc. This does NOT touch your MX records — receiving
   email is unaffected.
3. Create an API key (Full access → Sending).
4. Add it to the Worker: `wrangler secret put RESEND_API_KEY` (or dashboard →
   Settings → Variables → Add secret).
5. Confirm `NOTIFY_FROM` in the worker matches the verified domain
   (`scan@aits.llc` works once the domain is verified).

Until `RESEND_API_KEY` is set, `/lead` returns 503 — the visitor still gets
their full report on screen; only the internal email is skipped.

## GoHighLevel integration (optional — lead automation)

Every scan lead (`/lead`) and contact-form submission (`/contact`) is also pushed
into GoHighLevel so its workflows can run the follow-up (SMS, email sequences,
calls). This is a **no-op until the `GHL_WEBHOOK_URL` secret is set** — nothing
breaks if it's absent.

1. In GHL: **Automation → Workflows → Create Workflow → Start from scratch**.
2. Add trigger **"Inbound Webhook"** and copy the webhook URL it generates.
3. Set it on the Worker: `wrangler secret put GHL_WEBHOOK_URL` (or dashboard →
   Settings → Variables and Secrets → Add).
4. Back in the workflow, add actions: Create/Update Contact (map fields below),
   then Send SMS / Email / Add to Pipeline / Create Call Task, etc.

Fields posted (JSON) — map these in the workflow:
- **Scan lead:** `source` ("AI Risk Scan"), `name`, `email`, `phone`, `company`,
  `website`, `best_contact`, `ai_risk_score`, `risk_band`, `shadow_ai`,
  `recoverable_hours`, `compliance_flags`
- **Contact form:** `source` ("Contact Form"), `name`, `email`, `phone`,
  `company`, `message`

## Redeploy (required to light up the personalized note)

The Worker runs at `https://aits-scan.nicholasdreyfus.workers.dev`.

**Option A — Cloudflare dashboard (no tooling):**
1. dash.cloudflare.com → Workers & Pages → the `aits-scan` worker → Edit code.
2. Replace the contents with `aits-scan-worker.js` from this folder.
3. Confirm the `ANTHROPIC_API_KEY` secret is still set (Settings → Variables).
4. Save and deploy.

**Option B — Wrangler CLI:**
```bash
npm i -g wrangler
wrangler login
# from a dir containing this worker as your entry file:
wrangler deploy aits-scan-worker.js --name aits-scan
# ensure the secret exists (only needed once):
wrangler secret put ANTHROPIC_API_KEY
```

## Verify after deploy

```bash
curl -s -X POST https://aits-scan.nicholasdreyfus.workers.dev \
  -H "Origin: https://aits.llc" -H "Content-Type: application/json" \
  -d '{"answers":{"industry":"Legal","size":"11-25","leads":"They call us","missed":"It goes to voicemail","followup":"Same business day","subs":"6-10","fixes":"An outside IT partner","ai":"Yes, but no rules","data":["Legal or financial documents"],"busywork":"15-40"},"computed":{"score":58,"band":"ELEVATED","shadowLevel":"HIGH","flags":["Confidentiality — legal & financial records"],"hours":"12–30 hrs","findings":[{"tag":"SHADOW AI","headline":"Your team uses AI daily with no rules about what goes into it."}]}}'
```

Expected: `{"analystNote":"..."}` with a few sentences of plain-English analysis.
An `{"error":...}` body returns non-200; the page falls back gracefully either way.

Verify the lead endpoint (sends a real email to NOTIFY_TO):

```bash
curl -s -X POST https://aits-scan.nicholasdreyfus.workers.dev/lead \
  -H "Origin: https://aits.llc" -H "Content-Type: application/json" \
  -d '{"lead":{"name":"Test Lead","company":"Test Co","email":"test@example.com","cell":"858-555-0100"},"answers":{"industry":"Legal"},"computed":{"score":58,"band":"ELEVATED","shadowLevel":"HIGH","flags":[],"hours":"12–30 hrs","findings":[{"tag":"SHADOW AI","headline":"Test finding","detail":"Detail","fix":"Fix"}]},"analystNote":"Test note"}'
```

Expected: `{"ok":true}` and an email in the NOTIFY_TO inbox.

## End-to-end check on the live site

Complete the scan at `https://aits.llc/scan.html`. The report should show the
gauge, three stat tiles, and the top two findings with "What to do" lines, then
the locked cards + lead form. Fill the form → remaining findings and the analyst
note unlock on screen, and the PDF + lead details arrive at NOTIFY_TO. If the
Worker (or Resend) is down, the visitor still gets the full on-screen report —
only the internal email is affected. No blank reports in any failure mode.

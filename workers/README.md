# AITS AI Risk Scan — Cloudflare Worker

`aits-scan-worker.js` is the API proxy the scan funnel (`/scan.html`) calls. It
forwards the scan answers to the Anthropic API (keeping the API key server-side)
and returns the risk report.

## Why this needs redeploying (2026-06-18)

The previously deployed Worker used model `claude-sonnet-4-20250514`, which
**retired on 2026-06-15**. The Anthropic API now rejects it with a
`not_found_error`, so the scan completes but the report comes back blank
("inconclusive"). `aits-scan-worker.js` fixes this by switching to the current
`claude-sonnet-4-6`. **The fix only takes effect once this Worker is redeployed.**

## Redeploy

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
  -d '{"messages":[{"role":"user","content":"Reply with only: {\"ok\":true}"}]}'
```
A JSON body containing a `content` array means it works. An `{"error":...}`
body now returns a non-200 so the funnel shows a real "try again" message.

## Model choice

`claude-sonnet-4-6` is the like-for-like replacement for the retired Sonnet 4 —
balanced quality and speed. For a cheaper/faster option on this simple
structured task, `claude-haiku-4-5` also works; change the `model` field.

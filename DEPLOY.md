# Deploying the AITS website to Cloudflare Pages

The site is a static Astro build. Cloudflare Pages builds `npm run build` and
serves the `dist/` folder. Pick one of the two paths below.

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20+ (set `NODE_VERSION = 20` env var if the default is older) |
| Production domain | `aits.llc` |

The scan funnel (`/scan.html`) calls the separate Cloudflare **Worker** — that's
deployed independently (see `workers/README.md`); it is not part of this Pages
deploy. Make sure the Worker is redeployed (model fix) before launch.

---

## Path A — Git integration (recommended; auto-deploys on every push)

Requires the repo on GitHub/GitLab.

1. Create a remote and push:
   ```bash
   git remote add origin https://github.com/<you>/aits-website.git
   git push -u origin master
   ```
2. dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick the `aits-website` repo. Set:
   - Build command: `npm run build`
   - Output directory: `dist`
   - (If the build fails on an old Node, add env var `NODE_VERSION = 20`.)
4. **Save and Deploy.** You get a `*.pages.dev` preview URL first.
5. **Custom domain:** Pages project → **Custom domains** → add `aits.llc`
   (and `www.aits.llc`). Since the domain is already on Cloudflare, DNS records
   are created automatically. This replaces whatever currently serves aits.llc.

Every `git push` to `master` then redeploys automatically.

---

## Path B — Direct upload (no GitHub needed)

```bash
npm install
npm run build
npm i -g wrangler           # if not installed
wrangler login
wrangler pages deploy        # uses pages_build_output_dir from wrangler.toml
```
First run creates the Pages project; subsequent runs redeploy. Add the custom
domain in the dashboard as in Path A, step 5.

---

## Pre-launch checklist

- [ ] Redeploy the scan Worker (`workers/README.md`) — otherwise the report is blank
- [ ] Add a real social-share image at `public/og-default.png` (1200×630)
- [ ] Confirm `site: 'https://aits.llc'` in `astro.config.mjs` (it is)
- [ ] After go-live: submit `https://aits.llc/sitemap-index.xml` in Google Search Console
- [ ] Point `aits.llc` (and `www`) at the Pages project; verify the old site is replaced

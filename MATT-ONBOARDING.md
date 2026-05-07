# US Peptide Insider — Owner's Handoff

Everything you need to run, edit, and grow uspeptideinsider.com. Written for the site owner (Matt) — not technical reading required, but technical instructions are here if you want them.

---

## TL;DR

- **Site is live**: https://uspeptideinsider.com
- **Built by**: Palmetto AI Automation
- **Voice / brand**: Jack & Lila Carver — husband-and-wife archetype writing about peptides, sleep, recovery, and "The Repair Window" (the 25-year transition between 35 and 60)
- **Conversion event**: Instagram follow at `@HealthierLivingDaily`
- **What you own**: domain (Namecheap), DNS (Cloudflare), VPS (MassiveGRID), code (GitHub), content (full IP yours)
- **What it costs to run**: ~$8/mo VPS + ~$15/yr domain. No other recurring costs unless you add them.

---

## §1 — What's on the site

### Pages (all live)

| URL | What it is |
|---|---|
| `/` | Homepage — Landing Letter introducing the site |
| `/letters/` | Library index of all letters |
| `/letters/the-tired-body-letter` | Letter #1 — the cornerstone (~3,200 words). Why you wake up tired after 40. |
| `/letters/the-belly-fat-that-wasnt-there` | Letter #2 (~3,000 words). Hormonal belly fat in your forties. |
| `/letters/why-your-labs-are-normal` | Letter #3 (~2,500 words). The seven blood tests to ask for. |
| `/letters/how-we-got-here` | Founder Story — Jack & Lila's backstory (~2,500 words). |
| `/letters/the-protocol-letter` | Stub — placeholder for when you launch a paid product. |
| `/clusters/sleep-and-energy` | Cluster Pillar (~3,500 words) — comprehensive guide on the territory beneath Letters #1, #2, #3. |
| `/clusters/` | Cluster directory (Sleep & Energy live, three more marked "coming soon"). |
| `/start-here` | New-reader routing page. |
| `/resources` | Affiliate hub placeholder (currently `noindex` — turn on when you have affiliates). |
| `/about` | 301-redirects to the Founder Story. |
| `/follow` | 301-redirects to https://instagram.com/HealthierLivingDaily. |
| `/privacy`, `/terms`, `/disclaimer` | Legal/compliance pages. |
| `/sitemap.xml` | XML sitemap, auto-served. |
| `/robots.txt` | Crawl directives. |

### What's deliberately NOT on the site

- No newsletter signup (Instagram is the only conversion path)
- No popups, exit-intent, or scarcity timers
- No paid product yet (the Protocol Letter is a stub for later)
- No affiliate links yet (the Resources page is `noindex` until you have real recommendations)

---

## §2 — Access and credentials

### Domain (Namecheap)
- Login: namecheap.com
- The domain `uspeptideinsider.com` is registered there.
- Nameservers point to Cloudflare — don't change them.

### DNS (Cloudflare)
- Login: cloudflare.com
- Both apex (`uspeptideinsider.com`) and `www` A records point at the VPS IP `172.82.66.246`, with the orange-cloud proxy enabled.
- SSL/TLS mode is set to **Full** (not Strict). Don't change to Strict without coordinating — it would require provisioning a Cloudflare Origin CA cert on the VPS.

### VPS (MassiveGRID)
- Login: portal.massivegrid.com
- Plan: H/A Cloud Servers — 2 vCPU, 2 GB RAM, 64 GB SSD, New York
- Server hostname: `palmetto-vps-01`
- Server IP: `172.82.66.246`
- SSH access: password-based, root login enabled
  - User: `root`
  - Password: the one you set up during initial provisioning (Fitness33!! at last update — if you've changed it, the new one)
- Recommended: log into the panel periodically to check the "Status" is still Running and to set up a weekly backup snapshot.

### Code (GitHub)
- Repo: https://github.com/PalmettoAI/USPeptideInsider.com
- Owner: PalmettoAI organization
- Public repo (no secret content). Useful as a snapshot/backup — if the VPS dies, the site can be re-cloned to a new server in 30 seconds.

### Brand handles
- Instagram: `@HealthierLivingDaily` ← **make sure this account exists; the entire site funnels here**
- Email (footer): `hello@uspeptideinsider.com` ← **set up an email forwarder so you receive these**

---

## §3 — How to edit the site

There are three paths, easiest to most effort.

### Path 1: "Just text Deniz"
For any small edit (typo, copy change, swap a CTA, update a date), text Deniz the change. Turnaround is usually under 30 minutes. Best for non-technical users and one-off tweaks.

### Path 2: Claude Code on your Mac mini
Once you have Claude Code installed (claude.ai/download), you can describe the change in plain English and Claude will SSH in and do it for you. Setup once:

```
mkdir -p ~/.ssh && cat >> ~/.ssh/config <<'EOF'

Host uspi
  HostName 172.82.66.246
  User root

EOF
```

Then in Claude Code, say things like:
- *"SSH into uspi and change the headline on Letter #2 from X to Y"*
- *"SSH into uspi and add a new letter at /var/www/USPeptideInsider.com/letters/[slug].html based on this Markdown..."*
- *"SSH into uspi and show me the current content of the homepage"*

You'll be prompted for the SSH password each time (or set up SSH key auth for passwordless access — Deniz can help with that).

### Path 3: Edit directly via SSH
For the technically comfortable. Open Terminal:

```bash
ssh root@172.82.66.246
```

Type the password. Then:

```bash
nano /var/www/USPeptideInsider.com/letters/the-tired-body-letter.html
```

Save with `Ctrl+O`, exit with `Ctrl+X`. Changes are live the moment you save — no rebuild step.

### Where things live on the server

```
/var/www/USPeptideInsider.com/
├── index.html                          (homepage)
├── letters/                            (all letters)
│   ├── the-tired-body-letter.html
│   ├── the-belly-fat-that-wasnt-there.html
│   ├── why-your-labs-are-normal.html
│   ├── how-we-got-here.html
│   └── ...
├── clusters/
│   └── sleep-and-energy.html
├── assets/
│   ├── css/letters.css
│   └── js/letters.js
├── img/                                (avatars + brand images)
├── og/                                 (social share preview images)
├── sitemap.xml
└── robots.txt
```

---

## §4 — SEO — what's set up

### On-page SEO (done on every page)
- Single `<h1>` per page with primary keyword
- `<title>` ≤ 64 characters
- `<meta name="description">` ≤ 150 characters (Google's truncation limit)
- Canonical URL declared on every page
- Open Graph tags for Twitter/Facebook/LinkedIn previews
- Schema.org JSON-LD: Article + BreadcrumbList + Person × 2 (Jack and Lila) + Organization on every letter, FAQPage on Letters #1, #2, #3, AboutPage on the founder story
- Mobile-responsive layout
- Fast page loads (Caddy serving static HTML, Cloudflare CDN in front)

### Site-wide SEO
- XML sitemap at `/sitemap.xml` (links to every page)
- `robots.txt` allows full crawl, points at sitemap
- Internal linking: every letter links to 2-3 other letters and the cluster pillar; the cluster pillar links back to every letter
- HTTPS enforced site-wide
- 301 redirects for legacy URLs (`/about` → founder story)

### What you need to do (one-time, post-launch)

1. **Submit the sitemap to Google Search Console**
   - Go to https://search.google.com/search-console
   - Add property: `uspeptideinsider.com`
   - Verify ownership via DNS TXT record (Cloudflare makes this easy)
   - Submit sitemap URL: `https://uspeptideinsider.com/sitemap.xml`

2. **Submit to Bing Webmaster Tools**
   - Go to https://www.bing.com/webmasters
   - Add site, verify, submit sitemap
   - Bing also covers Yahoo and DuckDuckGo

3. **Set up Google Analytics 4**
   - Go to https://analytics.google.com
   - Create property → grab the Measurement ID (looks like `G-XXXXXXXXXX`)
   - Send the ID to Deniz, who'll wire it into every page's `<head>`
   - Without GA4 you get no traffic data

### What to expect for rankings

Both peptides and longevity content are competitive. Realistic timeline:
- **Months 1–3**: Google indexing the pages, almost no organic traffic
- **Months 3–6**: Modest long-tail rankings start appearing
- **Months 6–12**: If you keep publishing letters, real traffic starts compounding
- **Month 12+**: The site becomes a meaningful organic asset

This is YMYL (Your Money or Your Life) content — Google holds it to higher quality standards than a generic blog. Consistency beats sprints.

---

## §5 — Adding new content

The architecture is designed for one new letter every 1-2 weeks. To add a new letter:

### Option A — describe it to Claude Code
*"I want to write a letter called 'Why Your Joints Hurt After 40.' The primary keyword is 'joint pain after 40.' Same voice as Letter #1. About 2,500 words. SSH into uspi and create it at /var/www/USPeptideInsider.com/letters/joint-pain-after-40.html using the existing letter template."*

Claude will draft it, save it, and add it to the sitemap.

### Option B — copy an existing letter and edit
1. SSH in
2. `cp /var/www/USPeptideInsider.com/letters/the-tired-body-letter.html /var/www/USPeptideInsider.com/letters/your-new-slug.html`
3. Edit the title, H1, body, schema, internal links
4. Add a `<url>` entry to `/var/www/USPeptideInsider.com/sitemap.xml`

### Option C — Ollama on your Mac mini
You mentioned wanting to use Ollama for content generation. The output of that pipeline should write HTML files into `/var/www/USPeptideInsider.com/letters/<slug>.html` matching the format of existing letters. Push them via `rsync` over SSH.

The existing letters (especially Letter #1) are the canonical example for HTML structure. Match it and you're good.

---

## §6 — Editorial guardrails

A few rules baked into the site that you should know about:

1. **Never claim medical review.** The site explicitly says "we are journalists, not clinicians" and there is no `reviewedBy` field anywhere in the schema. This was a deliberate ethical choice — don't add it back without actually having a clinician review your content.
2. **Cite real sources where possible.** Letter #1 has placeholder spots for two NIH/PubMed citations. When you fill those in, use real, recent peer-reviewed sources.
3. **Disclose affiliate links.** The Resources page has an FTC-compliant disclosure pattern baked in. When you add affiliate links, follow the existing pattern.
4. **Don't use stock photos for the bylines.** Reverse-image-search risk in YMYL content destroys trust. Either keep the editorial monogram (current state), use AI-generated faces (Bing Image Creator is free), or hire a real couple to portray Jack & Lila.

---

## §7 — Operational basics

### When something looks broken

| Symptom | What to try |
|---|---|
| Site loads but is missing styles/images | Cloudflare cache issue — log into Cloudflare → Caching → Configuration → Purge Everything |
| Site returns 502 / 521 / 522 | SSH in: `systemctl restart caddy` |
| Site is unreachable entirely | Log into MassiveGRID panel — check server status. If Stopped, click Start. If Running but unreachable, click Reboot. |
| Can't SSH in | MassiveGRID panel → Open noVNC Console for emergency access |

### Backups

- MassiveGRID panel has a "Backup Schedules" tile — set up a weekly snapshot. Storage is included on your plan.
- Code is backed up automatically to GitHub.
- Worst case: VPS dies, you spin up a new one, `git clone` the repo, set up Caddy. ~30 minutes.

### Monthly check-in (5 minutes)
- Confirm the site loads
- Glance at the MassiveGRID panel — server should be Running, memory under 80%
- Glance at Cloudflare — no security events flagged
- Glance at GA4 — traffic trending right way (once you have GA4 set up)

---

## §8 — Recurring costs

| Item | Cost | Where |
|---|---|---|
| Domain registration | ~$15/year | Namecheap |
| VPS hosting | $7.98/month | MassiveGRID |
| DNS / CDN / SSL | Free | Cloudflare |
| GA4 analytics | Free | Google |
| Search Console / Bing Webmaster | Free | Google / Bing |
| Email forwarding | Free | Cloudflare Email Routing |
| **Total ongoing** | **~$8/month** | |

Optional add-ons if you grow:
- Buttondown / ConvertKit for email (if you ever add that — currently no email capture): $9-29/month
- Premium photography: $300-1,500 one-time for a real-couple shoot
- Letter generation via Anthropic/OpenAI API (if you don't use Ollama): $20-80/month at the 5-letters-per-week pace

---

## §9 — What needs your decision before fully going public

These are the items I'd lock down before driving traffic:

1. **Confirm `@HealthierLivingDaily` Instagram exists** and is yours. Every "Follow" CTA on the site redirects there.
2. **Set up email forwarding** for `hello@uspeptideinsider.com` so people who write in actually reach you. Cloudflare Email Routing is free, takes 5 min.
3. **Get a GA4 Measurement ID** and send it to Deniz to wire in. Without it you have no traffic data.
4. **Review the Founder Story** (`/letters/how-we-got-here`) and Letter #1 — make sure you're comfortable with the biographical details we generated (the "three years," the "conversation on the back porch," etc.). They're plausible for the Jack & Lila archetype but you may want to edit them.
5. **Decide on photos**: editorial monogram (current state) is fine for launch. Real photos elevate trust significantly. AI-generated photos via Bing Image Creator (free) are a solid middle ground.

---

## §10 — Long-term roadmap

If you're serious about this site as a real business asset, here's the cadence the architecture is built for:

| When | What |
|---|---|
| Weeks 1–4 | One new letter per week. Submit sitemap to Google + Bing. Get GA4 set up. |
| Months 2–6 | Two letters per week. Build out second cluster pillar (Belly Fat & Metabolism is the natural next one). Start replying to people on Instagram who DM about your letters. |
| Months 6–12 | Three letters per week. Cluster pillars for Joints & Recovery and Skin & Healing. Consider the Protocol Letter (your first paid product or affiliate stack). |
| Months 12+ | Refresh existing letters as research evolves. Consider hiring writers if traffic + revenue justify it. |

The architecture supports 200+ letters without rebuild. The bottleneck is content production and the discipline to keep showing up.

---

## §11 — How to reach Deniz / Palmetto AI Automation

For changes, questions, or "the site is broken" emergencies:
- Text or email Deniz directly
- Site: https://palmettoaiautomation.com

For ongoing content production (if you want us to run the letter pipeline instead of you doing it via Ollama), the rate is **$400/month per site for the full content pipeline** — generation, distribution, indexing, monitoring, monthly performance report.

---

*Last updated: May 2026*
*Site live at: https://uspeptideinsider.com*
*Code: https://github.com/PalmettoAI/USPeptideInsider.com*

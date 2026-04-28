# US Peptide Insider

Peptide therapy research database for US-based readers. Mechanism, clinical evidence, dosing protocols, and sourcing guidance — all sourced from primary literature, all audited.

## Status

Static framework + visual identity. **Not deployed yet.** The plan is to wire this to a Railway service or VPS later, at which point the SEO content pipeline (cron-driven compound profile generation, sitemap rebuilds, indexnow pings) will plug into the existing static structure.

## Stack

- Static HTML / CSS / vanilla JS — no build step
- Inter (sans) + JetBrains Mono (display) via Google Fonts
- No frameworks, no node_modules
- Deploys cleanly to GitHub Pages, Cloudflare Pages, Netlify, or any static host
- Future Railway/VPS wiring will add a Node or Python sidecar for content generation; the static front-end stays as is

## Structure

```
/                              homepage (database snapshot, featured profiles, vendor stats)
/peptides/                     compound profiles (BPC-157, CJC-1295/Ipamorelin, etc.)
/guides/                       cross-compound guides (stacking, sourcing)
/about/                        editorial methodology, board, disclosures
/assets/css/style.css          single stylesheet (dark mode, mono accents)
/assets/js/main.js             minimal interactivity (menu toggle, stat counters)
/robots.txt
/sitemap.xml
```

## Editorial archetype

Research dossier / lab notebook. Near-black background, bone text, electric green accent, JetBrains Mono. Density and structure over whitespace. Citation pills, study counts, vendor audit stats. Reads like a database, not a wellness brand.

Differentiator vs. other PalmettoAI client sites: this is the first dark-mode mono-display archetype in the org; existing client sites are largely Next.js + Tailwind with light/warm palettes.

## Backlink policy

Per editorial brief: every compound profile and the sourcing guide include 2–4 contextual outbound links to PalmettoPeptides.com. Anchor text is descriptive (e.g., "research-grade BPC-157", "high-purity CJC-1295 sourcing") and reads as editorial, not advertorial. The audit framing in `about/` and `sourcing-guide.html` is what makes those recommendations defensible — vendors are named in the context of the audit they passed.

## Roadmap (post-deploy)

1. Wire to Railway service (Cloudflare DNS via Tdeniz1)
2. Add cron-based content generator using the SEO blog playbook
3. Hook quarterly brief signup to a real list provider
4. Add GSC verification + sitemap submission
5. Build out the remaining 180+ compound profiles using the `peptides/bpc-157.html` template

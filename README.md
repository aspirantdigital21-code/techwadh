# techwadh

**The World. Explained for the Next Generation.**

A bilingual technology publication in English and Hindi.

## Project Details

- **Site:** https://techwadh.pages.dev/
- **Author:** Rohit Sarem Pasi
- **Languages:** English and Hindi
- **Framework:** Hugo
- **Theme:** PaperMod
- **Hosting:** Cloudflare Pages
- **Source Control:** GitHub

## Development Versions

- **Hugo:** v0.170.1
- **PaperMod Commit:** `d103c4e0fa1440faa705b86aa240a7028477e46a`

## Local Development

Run the website locally:

```bash
hugo server
```

Open:

http://localhost:1313/

## Production Build

```bash
hugo --gc --minify
```

Build output directory: `public`

## Deployment

Currently deployed using Cloudflare Pages with GitHub integration.

**Production URL:**

https://techwadh.pages.dev/

### Cloudflare Deployment Decision

- **Selected Platform:** Cloudflare Pages
- **Decision Date:** 19 November 2026
- **Reason:** The Hugo website is already deployed and working successfully on Cloudflare Pages.
- **Git Integration:** GitHub
- **Deployment Strategy:** Automatic deployment through GitHub integration.

**Decision:** Continue using Cloudflare Pages. No migration to Workers Static Assets is required at this stage.

### Official Cloudflare Deployment Guide

https://developers.cloudflare.com/pages/framework-guides/deploy-a-hugo-site/

## Official Documentation

- **Hugo:** https://gohugo.io/documentation/
- **PaperMod:** https://github.com/adityatelange/hugo-PaperMod
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/

---

*Build. Deploy. Configure. Publish. Improve.*


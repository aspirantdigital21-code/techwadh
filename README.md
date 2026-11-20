# TechWadh

**The World. Explained for the Next Generation.**

A bilingual technology publication in English and Hindi, covering practical technology guides, product buying advice, and AI tools.

## Project Details

- **Production website:** https://techwadh.in/
- **Cloudflare Pages project:** https://techwadh.pages.dev/
- **Publisher / site author:** TechWadh Editorial Team
- **Languages:** English and Hindi
- **Framework:** Hugo
- **Theme:** PaperMod
- **Hosting and deployment:** Cloudflare Pages
- **Source control:** GitHub

## Website Content

The site currently includes:

- Three articles, each available in English and Hindi:
  - Best Budget Smartphones in India
  - How to Choose a Laptop for Students
  - Grok vs ChatGPT vs Gemini vs Claude
- Four trust and information pages in both languages:
  - About
  - Contact
  - Privacy Policy
  - Disclaimer
- Search and Archives pages.

## Development Versions

- **Hugo:** v0.170.1
- **Theme:** PaperMod
- **PaperMod commit:** `d103c4e0fa1440faa705b86aa240a7028477e46a`

## Local Development

Run the website locally:

```bash
hugo server -D
```

Open:

http://localhost:1313/

## Production Build

Build the production site:

```bash
hugo --gc --minify
```

Build output directory: `public`

## Deployment

TechWadh is deployed on Cloudflare Pages with GitHub integration. Pushing changes to the `main` branch triggers an automatic production deployment.

**Production domain:** https://techwadh.in/

**Cloudflare Pages project domain:** https://techwadh.pages.dev/

### Hosting Decision

- **Platform:** Cloudflare Pages
- **Source integration:** GitHub
- **Production branch:** `main`
- **Deployment strategy:** Automatic deployment through GitHub integration
- **Decision:** Continue using Cloudflare Pages. No migration to Workers Static Assets is required at this stage.

## Contact

For questions, feedback, corrections, or collaboration:

**contact@techwadh.in**

## Official Documentation

- **Hugo:** https://gohugo.io/documentation/
- **PaperMod:** https://github.com/adityatelange/hugo-PaperMod
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **Cloudflare Pages Hugo guide:** https://developers.cloudflare.com/pages/framework-guides/deploy-a-hugo-site/

---

*Build. Deploy. Configure. Publish. Improve.*

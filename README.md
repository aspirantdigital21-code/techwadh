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

## Article comments

The bilingual post template displays comments when the same-origin Pages Function is available. The English and Hindi URLs have independent queues.

1. Create a D1 database in Cloudflare. Run `migrations/0001_comments.sql` against the database once.
2. In the Cloudflare Pages project's **Settings → Bindings**, add the production D1 binding `COMMENTS_DB`. Add a randomly generated, high-entropy `COMMENTS_ADMIN_TOKEN` as an encrypted production secret under **Variables and Secrets**. Keep the token out of Git.
3. Redeploy Pages. Open `/moderation/` and unlock it with the token. Submit a test comment from an article, confirm it is pending, and then approve it. Production and preview should use separate databases and tokens if comments are enabled on both.

Only approved comments and editorial replies are public. Optional email and phone fields are visible in the moderation dashboard. Changing a comment’s moderation status preserves these fields in the private dashboard. Removing an item deletes its record.

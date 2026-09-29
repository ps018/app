# 🌐 Domain & Hosting Guide — Publish the Website

The site is 100% static — only these files need hosting:

```text
index.html      ← the entire website
script.js       ← interactions, slider, form + EmailJS
styles.css      ← custom styles (loaded by index.html)
favicon.svg     ← logo / browser tab icon
```

No build step. Works on any static host. Two steps: **(A) buy a domain**, **(B) deploy the files**, then **(C) connect the two**.

---

## Step A — Buy a domain (~5 minutes)

1. Pick a registrar:
   - **GoDaddy India** (godaddy.com/in) or **BigRock** — popular in India, ~₹500–1,200/year for `.com` / `.in`
   - **Namecheap** or **Cloudflare Registrar** — international, at-cost pricing
2. Search for a short, professional name, e.g. `draditideshmukh.com`, `perioimplant.clinic`.
3. Add to cart → create an account → pay.
   - Tip: enable **auto-renew** and **domain privacy/WHOIS protection** (usually free).
4. The domain now appears in your registrar dashboard under **My Domains**. Don't change
   nameservers yet — you'll point DNS after deploying (Step C).

## Step B — Deploy the files (free)

### Option 1: Netlify (easiest — drag & drop)

1. Go to **https://app.netlify.com** → sign up free.
2. On the dashboard, find **"Add new site" → "Deploy manually"**.
3. **Drag the folder** containing `index.html` in. Netlify gives you an instant URL
   like `random-name-123.netlify.app`.
4. To update the site later: drag & drop the folder again.

### Option 2: Vercel (also free)

1. Go to **https://vercel.com** → sign up.
2. **Add New → Project**. Either:
   - import a GitHub repo containing the 4 files (Framework Preset: **Other**, build command: *empty*, output dir: `.`), or
   - run `npx vercel` inside the folder from your terminal and follow the prompts.
3. You get a `your-site.vercel.app` URL.

### Option 3: GitHub Pages

1. Create a GitHub repo → upload the 4 files.
2. Repo **Settings → Pages** → Source: *Deploy from a branch* → `main / (root)`.
3. Site goes live at `username.github.io/repo-name`.

## Step C — Connect your domain

### On Netlify

1. Site settings → **Domain management → Add a domain** → enter `yourdomain.com`.
2. Netlify shows DNS records. Two choices:
   - **Easy:** in your registrar's DNS panel, replace the nameservers with Netlify's
     (`dns1.p0plesns.com`-style values shown by Netlify), then add the domain in Netlify. Done.
   - **Manual:** keep registrar DNS and add:
     - `A` record, host `@`, value `75.2.60.5`
     - `CNAME` record, host `www`, value `your-site.netlify.app`
3. Wait for DNS propagation (15 min – 4 h). HTTPS is issued **automatically** (Let's Encrypt).

### On Vercel

1. Project → **Settings → Domains** → enter `yourdomain.com` → **Add**.
2. Vercel instructs exactly what to add at your registrar — usually:
   - `A` record, host `@`, value `76.76.76.76`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com`
3. HTTPS is automatic once DNS verifies (usually minutes).

## Step D — After going live (important)

1. **EmailJS allowlist:** in the EmailJS dashboard, add your new domain
   (and the temporary `.netlify.app` / `.vercel.app` URL) so form submissions are accepted
   from your live site.
2. **Update the 3 EmailJS keys** in `script.js` if you haven't yet (see EMAILJS-SETUP.md).
3. Replace placeholder content (doctor name, phone `+91 98XXX XXXXX`, email
   `hello@drname.com`, addresses, credentials, statistics) with the real details.
4. Visit `https://yourdomain.com` in an incognito window and submit a test inquiry.

### Updating content later

Edit `index.html` in any text editor, then re-upload:
- **Netlify:** drag & drop again
- **Vercel:** `npx vercel --prod` (or push to GitHub if connected)
- **GitHub Pages:** commit & push

## Cost summary

| Item | Typical cost |
|---|---|
| Domain (.com / .in) | ₹500–1,200 / year |
| Hosting (Netlify / Vercel / GitHub Pages) | Free |
| HTTPS certificate | Free, automatic |
| EmailJS free tier | Free up to 200 emails/month |

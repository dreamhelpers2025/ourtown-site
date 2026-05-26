# ourtown-site

Modernized rebuild of [ourtown.store](https://www.ourtown.store/), built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com).

## What changed vs the live site

The original site is a Next.js app that lands every visitor on the same generic discovery view, regardless of why they came. This rebuild restructures the IA around the three audiences the platform actually serves:

- **Shoppers** — `/shoppers`: a focused path to browse stores, products, baskets, and causes
- **Businesses** — `/businesses`: clear pitch, free signup CTA, transparent revenue split
- **Causes** — `/causes`: list/nominate a nonprofit, see contribution model

The home page makes the three doors immediately visible and shows the 80–90 / 5–15 / 5 split up front so the value model is legible in seconds.

## Local development

```bash
npm install
npm run dev
```

Then visit `http://localhost:4321/`.

## Production build

```bash
npm run build      # outputs to ./dist
npm run preview    # preview the production build locally
```

## Structure

```
src/
  components/   # Header, Footer
  layouts/      # BaseLayout
  pages/        # index, shoppers, businesses, causes, about, contact
  styles/       # global Tailwind entry
public/
  images/       # leadership photos pulled from ourtown.store
  favicon.ico
```

## Before going live

- Replace the Formspree placeholder URLs in `causes.astro` and `contact.astro` with real endpoints.
- Swap the gradient hero tiles for real storefront/product photography once available.
- Replace placeholder support email addresses (`hello@ / business@ / causes@`) with the real ones.

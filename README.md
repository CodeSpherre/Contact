# Code Spherre — Links (Astro + Cloudflare Pages)

Link-in-bio page with the main Website's Hero backdrop (letter-glyph canvas,
glow orbs, dot grid) plus a hidden **`/area51`** dashboard that commits edits
to GitHub — Cloudflare Pages redeploys automatically.

## Edit links

**Option A — dashboard (recommended):** open `https://yourdomain.com/area51`,
paste a GitHub token (`contents:write` on this repo), Load → edit → Save to GitHub.
Token stays in that tab's `sessionStorage` only; nothing secret is ever committed.
Lock `/area51*` to your Gmail first — see [`docs/CLOUDFLARE-ACCESS.md`](./docs/CLOUDFLARE-ACCESS.md).

**Option B — by hand:** edit [`src/data/links.json`](./src/data/links.json),
push to `main`. Per link: `title`, `subtitle`, `url`, `icon` (SVGL search term,
resolved live via `api.svgl.app` with `iconUrl` fallback), `accent` (brand color).

## Develop

```bash
npm install
npm run dev      # local playground
npm run build    # outputs dist/
npm run preview  # serve the build
```

## Deploy (Cloudflare Pages)

Dashboard → Pages → Connect repo `CodeSpherre/Contact` → build command
`npm run build`, output directory `dist/`. Attach your domain,
then set up Access per the doc above. `public/_headers` already tunes caching
(assets immutable, `/links.json` 5 min); `public/robots.txt` disallows `/area51`.

## Security model (read this)

- Real gates: **Cloudflare Access (Gmail)** on `/area51*` + **GitHub token**
  (runtime-only) required to save. No credentials exist in code or the repo.
- Obscurity only: unlisted path, `noindex`, `robots.txt`, neutral hashed asset
  names. These hide the dashboard; they don't protect it.
- Never put an email/password check in frontend code — anyone can View Source.
  If someone proposes that, it's theater, not security.

## Structure

| Path | What |
|---|---|
| `src/pages/index.astro` | Public link page |
| `src/pages/area51.astro` | Hidden dashboard (noindex, unlisted) |
| `src/pages/links.json.ts` | Machine-readable feed of the same data |
| `src/data/links.json` | Source of truth |
| `src/components/` | `HeroBackground`, `Profile`, `LinkCard`, `ShareButtons`, `Footer` |
| `src/layouts/Base.astro` | Head, SEO, fonts |
| `src/styles/global.css` | Tokens + page styles (shape lock: cards 18 / tiles 14 / pills 999) |
| `src/lib/svgl.ts` | SVGL API resolver (cached per SVGL guidance) |
| `src/lib/github.ts` | GitHub Contents API read/write (dashboard only) |
| `src/lib/types.ts` | `Profile`, `LinkItem`, `LinksDoc` |

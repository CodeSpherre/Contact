# Locking /area51 to your Gmail with Cloudflare Access (no code)

This is the real security for the hidden admin. Obscurity (unlisted URL, `noindex`,
`robots.txt` disallow) only hides it — Access enforces a Google login at the edge
before Cloudflare ever serves the page. Free plan covers up to 50 users.

## One-time setup (~5 min)

1. **Deploy first.** Connect repo `CodeSpherre/Contact` to Cloudflare Pages
   (build `npm run build`, output `dist/`), attach your custom domain,
   confirm the public page loads.
2. Open **Cloudflare Dashboard → Zero Trust** (same account as your domain).
3. Go to **Access → Applications → Add an application → Self-hosted**.
4. Configure:
   - **Application name**: `codespherre-links-admin`
   - **Session duration**: e.g. 24 hours
   - **Subdomain + domain**: your links domain (e.g. `links` + `yourdomain.com`)
   - **Path**: `/area51*` (covers `/area51` and `/area51/`)
5. **Add a policy**:
   - **Policy name**: `owners-only`
   - **Action**: Allow
   - **Rules**: Include → **Emails** → your Gmail address(es).
     (Or Login Methods → Google, then filter by email — same effect.)
6. Save. Open `https://yourdomain.com/area51` in an incognito window:
   you should hit a Cloudflare + Google login before seeing anything.
   The public `/` page must load with **no** login prompt.

## Notes

- The token you paste inside `/area51` is a **GitHub** personal access token
  (classic with `repo → contents:write`, or fine-grained limited to this repo).
  It lives only in that tab's `sessionStorage` — closing the tab forgets it.
  Rotate/revoke it in GitHub settings any time; nothing in this repo changes.
- If you ever rename the admin path, update **both** `src/pages/area51.astro`
  (file name = URL) **and** the Access application path above.
- `robots.txt` already disallows `/area51`, and the page sends
  `noindex, nofollow`. That keeps it out of search, not out of reach —
  Access is what keeps people out.

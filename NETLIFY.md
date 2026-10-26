# Netlify deployment (`netlify-production` branch)

Live site: **https://zubair-ali.netlify.app/**

This repo uses a dedicated branch for production deploys so `master` can stay for day-to-day work.

## One-time Netlify setup

1. [Sign in to Netlify](https://app.netlify.com/) and **Add new project → Import an existing project**.
2. Choose **GitHub** → authorize → select **`zubair-ali90/freelance-portfolio`**.
3. Netlify reads **`netlify.toml`** at the repo root. Confirm:
   - **Base directory:** `web` (from `netlify.toml`)
   - **Build command:** `npm ci && npm run netlify-build`
   - **Publish directory:** leave empty / auto (Next.js adapter)
4. **Site configuration → Build & deploy → Continuous deployment → Branches:**
   - Set **Production branch** to **`netlify-production`** (not `master`).
5. **Environment variables** (if media is missing after deploy):
   - `GIT_LFS_ENABLED` = `true` (also set in `netlify.toml`)
6. **Deploy site**.

Reference: [Deploy from a repository](https://docs.netlify.com/start/quickstarts/deploy-from-repository/)

## What the build does

1. Clone repo (with **Git LFS** for videos).
2. `cd web` → `npm ci`
3. `npm run netlify-build` → copies `../Assets` into `web/public/assets`, then `next build`
4. Netlify **OpenNext** adapter serves the App Router app (no manual `publish = ".next"`).

## Updating production

```bash
# After changes on master:
git checkout netlify-production
git merge master
git push origin netlify-production
```

Or open a PR **master → netlify-production** and merge on GitHub.

## Local parity with Netlify

```bash
cd web
npm ci
npm run netlify-build
npm run start
```

On Windows, keep using the `Assets` junction at `web/public/assets` for `npm run dev`; Netlify uses `prepare-assets` instead.

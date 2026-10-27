# Branch rules

This repository uses two long-lived branches only.

## Branches

| Branch | Purpose |
|--------|---------|
| **production** | Live site. Must stay deployable. Only merge tested work from `development` (or hotfixes agreed with the owner). |
| **development** | Day-to-day work. Feature fixes, admin changes, and experiments land here first. |

There are no other permanent branches. Delete short-lived branches after merge.

## Workflow

1. Do daily work on **`development`** (checkout `development`, commit, push).
2. Open a PR **`development` → `production`** when ready to go live (or merge locally if you are the sole maintainer).
3. Deploy **Vercel** from the **`production`** branch only (root directory: `web`, build: `npm run vercel-build`).
4. Never force-push **`production`** unless you intentionally recover from a bad deploy and know the impact.

## Naming

- Production branch name: `production` (not `master` or `main`).
- Integration branch name: `development`.

## Remotes

- `origin/production` — source of truth for production deploys.
- `origin/development` — integration branch for ongoing work.

## History note

`master`, `netlify-production`, and Netlify hosting were retired. Use `production` and `development` with Vercel only.

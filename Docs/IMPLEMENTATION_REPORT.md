# IMPLEMENTATION REPORT — Admin / Work / Case Study redesign

## Summary

Extended the existing admin CMS (not a parallel system) so My Work ranking, page copy, project category assignment, and published case-study enrichment are controllable without code edits. Preserved theme, homepage, footer, routes, and the full **51-project** inventory.

## Highest priorities delivered

1. **Admin usability** — clearer Projects Manager (filters, cover thumb, category help), My Work configuration with content + ranking panel, Save Draft / Publish / Rollback / Preview.
2. **Independent ranking**
   - Main categories: `workGroups` order (existing, retained)
   - Subcategories: `workSections` order (existing, retained)
   - Projects inside subcategory: new `workPage.projectOrder[leaf]`
3. **Category editing in Projects Manager** — already present; verified persistence via `project-overrides.json`; UX clarified that category change does not delete media/URL.
4. **Configurable My Work page** — editorial hero copy, group intros, filters, lead project, ordered cards, CTA — all from published `workPage` config.
5. **Media-first case studies** — breadcrumb, hero media first, closer-look gallery, source story blocks when mapped, verified reviews, related work, hire CTA. Aspect-ratio contain in hero/lightbox CSS.
6. **Editable layouts** — Work page + category meta + project order via admin; project detail story from reconciled source enrichment (not fabricated).
7. **Draft / preview / publish / rollback** — site-config draft file, publish API, previous snapshot rollback. Project visibility/category saves remain immediate (documented limitation).
8. **Persistence** — JSON files under `web/data/` + revalidation after publish.

## Data reconciliation

- Source package copied to `web/data/work_portfolio_source_data.json` (32 projects / 26 reviews).
- Dry-run: **16 matched** to live slugs, **13** media/review-only, **3** candidate drafts.
- Fox Girl: remains mapped to `unity-unity-character` (no duplicate).
- No live projects deleted or replaced by the 32-record set.

See `MIGRATION_DRY_RUN.md` and `IMPLEMENTATION_AUDIT.md`.

## Key files

- `web/lib/cms/work-page-defaults.ts`, `web/lib/site-config.ts`, `web/lib/work-source-enrichment.ts`
- `web/components/WorkGallery.tsx`, `web/components/CaseStudySections.tsx`
- `web/components/admin/WorkPageConfigPanel.tsx`, `ProjectManager.tsx`, `SiteConfigManager.tsx`
- `web/app/work/page.tsx`, `web/app/work/[slug]/page.tsx`
- `web/app/api/admin/site-config/publish/route.ts` (rollback)

## Remaining limitations

- Project category/visibility overrides still publish immediately (not draft-isolated like site-config).
- Proposed taxonomy leaves (`web-interactive`, `3d-modeling`, XR staging) not added as new enum IDs yet — character label updated in place; Web configurators still use existing `explainer` / mapped slugs.
- Full per-project block builder / secondary placements / GLB hero picker UI not fully built; enrichment + gallery cover existing media.
- Filesystem persistence may not survive immutable serverless deploys without durable storage.
- Playwright multi-viewport screenshot suite not executed in this pass; production build + TypeScript were.

## Acceptance tests (executed vs deferred)

| Area | Result |
|---|---|
| Category edit + save path | Verified in code; save persists overrides |
| Independent project rank | Implemented + wired to `/work` |
| Draft/publish/rollback config | Implemented |
| Migration dry-run | Generated |
| Lint/typecheck/build | **`npm run build` passed** (TypeScript clean, 81 routes) |
| Full E2E browser matrix | Deferred (manual/local recommended) |

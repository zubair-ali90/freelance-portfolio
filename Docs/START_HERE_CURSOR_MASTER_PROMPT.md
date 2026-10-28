# CURSOR MASTER PROMPT — ZUBAIR PORTFOLIO WORK + ADMIN CMS, V2

**Paste this entire prompt into Cursor Agent mode with this folder available in the existing portfolio repository.**

Act as a principal full-stack architect, senior React/Next.js developer, creative UI designer, CMS engineer, and accessibility/performance specialist. Your task is to audit and upgrade the **real existing implementation** of Zubair Ali's portfolio, with special focus on:

- `https://zubarirali.3dverse.io/admin/configuration`
- `https://zubarirali.3dverse.io/admin/projects`
- `https://zubarirali.3dverse.io/work`
- Existing individual `/work/...` project pages.

## FIRST: Read ALL of these supplied files

1. `ADMIN_CONFIG_AND_PROJECTS_DEEP_SPEC.md` — new, precise admin dashboard/configuration architecture, category editor, project editor, media controls, draft/preview/publish, security, and integration details.
2. `CURSOR_WORK_AND_CASE_STUDY_REDESIGN.md` — approved earlier Work page, category, individual case-study, image/video/3D-viewer, copy and review instructions. **These remain in force.**
3. `work_portfolio_source_data.json` — 32 unique document-derived project records with actual supplied case-study text/links, plus 26 client review records.
4. `PROJECT_CATEGORY_MAPPING.csv` and `PROJECT_INTEGRATION_TRIAGE.csv` — **proposed, not verified** taxonomy mappings.
5. `CURRENT_ADMIN_AUDIT_LIMITATIONS_AND_CHECKLIST.md` — what could and could not be confirmed externally, and the exact audit you must complete locally.
6. `IMPLEMENTATION_ACCEPTANCE_TESTS.md` — detailed release criteria and end-to-end interaction tests.
7. `README_START_HERE.md` — original package notes and source reference data.

The three source DOCX files and original screenshot reference images are also included, but **you do not need to re-extract their text**. The JSON already contains the structured source data. The screenshot files are evidence/reference only, not production-resolution hero assets.

## Non-negotiable rules

- **Do not redesign the public site's theme.** Preserve existing colors, fonts, logo, homepage storytelling/scroll animations, gradient footer, all published project URLs, media and project identifiers.
- **Do not create a parallel CMS.** Inspect the existing `/admin/configuration` and `/admin/projects`; extend and unify them in their current architecture.
- **Do not assume you know what the admin currently supports.** Independently inspect UI, database, code, network requests, and persistence for both pages; record facts in `IMPLEMENTATION_AUDIT.md`.
- **Do not include credentials in repository files.** Use an authorized existing admin session or environment-provided credentials without logging or committing secrets. Never weaken the login/authentication layer.
- **Do not overwrite the published collection with 32 records.** These 32 source records are supplemental; previous public viewing showed a larger inventory, but current counts require actual database verification.
- Preserve existing data, perform an **idempotent dry-run reconciliation**, avoid duplicates, preserve slugs and review source associations. Merge the overlapping Fox Girl/VRM content into one project.
- Implement the hierarchy of **3D, Renders, Architectural, Development** and user-specified subcategories; stage any proposed additional categories for admin approval rather than silently publishing them.
- Main category **rank**, subcategory **rank** and per-category **project rank** must be **three independent, editable values**, saved persistently and reflected on `/work` after publishing.
- The administrator must be able to change any project's primary category and secondary placements and see updates in draft preview and after publish. Changing category must not delete the project, change its URL or destroy its media.
- Each individual project must have configurable image/video/3D viewer hero, sequenced media+text content blocks, genuine associated client review (if available), related work, and correct CTA.
- Fully preserve image/video aspect ratios, prioritize real work over decorative effects, ensure responsive galleries and uncropped lightboxes, and avoid slow simultaneous video loads.
- Dummy data permitted only as **clearly labeled unpublished admin drafts** and editor previews. Never fabricate verified facts, project results, quotes or client names on public pages.
- Security, server-side authorization, durable storage and a real draft/preview/publish model are mandatory for production.

## Execution order — DO NOT STOP AT AN OUTLINE

**Phase 0 — Safety snapshot**: Create a working branch, inspect deployment environment, back up existing data/config if practical, verify no destructive migrations.

**Phase 1 — Audit**: Launch the local application; authenticate using existing secure mechanism; visually review admin Configuration, Projects, `/work` and 4+ different case-study types at desktop/tablet/mobile. Map existing entities/DB/data sources and current category editor. Document exact issues and functioning features.

**Phase 2 — Data foundation**: Stable category tree; canonical project entities; category placements with separate ranks; media references; project page blocks; review references; draft/published revision model. Prefer adapting current store over swapping infrastructure needlessly.

**Phase 3 — Admin UI**: Unified professional admin shell; Overview, Page Configuration (`Homepage`, `My Work`, `Project Detail Defaults`, `Services`, `About`, `Contact`, `Global`), Projects, Media, Reviews. Top section tabs on configuration, with clear Save Draft, Preview and Publish controls.

**Phase 4 — Work configuration**: Drag-and-drop with keyboard fallbacks for root categories, nested subcategories, project rankings; category visibility, editable descriptions, hero/featured projects, default sorting, card/media variants, search/display settings. Persist and preview each layer.

**Phase 5 — Projects manager**: Create/edit/draft/publish, primary and secondary category assignment, gallery/video/GLB selection, project-specific page sections and their order, review association, related projects, SEO, URL handling and verification warnings.

**Phase 6 — Public UI**: Implement the approved media-first Work gallery and template-specific cases from the previous design specification, connected to *published* CMS state. Preserve actual site theme and non-work pages.

**Phase 7 — Import**: Dry-run match 32 supplemental source records and 26 review records to the real existing CMS; expose ambiguous matches and missing-media items in admin. Only apply safe changes and publish after validation. Do not create clone projects.

**Phase 8 — QA**: Run the detailed acceptance test suite, including authorization, reorder persistence, draft isolation, preview parity, production data persistence, mobile alignment, media player, large image lightbox, 3D viewer and accessibility. Run lint/typecheck/build. Produce clear changed-file list and remaining blockers.

## Deliverable requirements

The finished result must let me, in my current admin interface, control these workflows without code edits:

1. Change order of `3D`, `Renders`, `Architectural`, `Development`.
2. Change subcategory order inside each category.
3. Change project order inside any subcategory.
4. Change a project's main/secondary category and its visibility.
5. Choose a project hero image or video, adjust thumbnail/cover separately, manage gallery blocks and add a real 3D viewer where assets exist.
6. Attach and reorder genuine client reviews on the project's detail page.
7. Configure Work page headline, category intros, layouts, and category lead visuals.
8. Draft, preview, publish, and revert changes reliably.
9. Keep old project links working and preserve all homepage/media integrations.

After implementing, write `IMPLEMENTATION_AUDIT.md`, `MIGRATION_DRY_RUN.md`, and `IMPLEMENTATION_REPORT.md` with findings, tests, and any actual blockers. **Proceed with code and verification, not just a plan.**

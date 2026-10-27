# CURSOR AGENT TASK — Integrate Zubair Ali's Verified Source Projects and Reviews

## Objective

You are a senior Next.js/React engineer, UI/UX designer, and content architect working in my existing freelancer portfolio repository.

Website: https://zubarirali.3dverse.io/
Upwork: https://www.upwork.com/freelancers/zubaira27

I have provided the FULL extracted source data from `Project with reviews.docx` at the end of this prompt and in a machine-readable file named `portfolio_projects_reviews.json`.

**DO NOT ask Cursor to parse the Word document. The extraction has already been done. Use the text and JSON provided.** The source includes project descriptions, official sites, store listings, demos, Drive links, and reviews transcribed from screenshots. Preserve its meaning and distinctions.

**Implement**, rather than just planning, these upgrades:

1. Enrich the existing portfolio projects with factual copy and external reference links.
2. Add missing legitimate projects to `/work` and corresponding details if the repository has enough genuine project media for publication.
3. Associate each client review with the matching project, using the supplied mapping.
4. Build an elegant, scrollable **client review carousel** on the homepage's existing Client Trust section.
5. Provide access to all usable written reviews in a review listing/page or the existing trust/review interface, AND show relevant reviews on the appropriate project detail pages.
6. Keep current styling, theme, navigation, homepage scrollytelling, media pipeline, existing sections, and footer.

## Non-negotiable protections

- Do not change fonts, established colors, site theme, logo, header, footer gradient design, or overall visual personality.
- Do not delete the recent homepage narrative design or change section order.
- Do not overwrite any of the existing published project media or descriptions without first comparing the records.
- Do not modify unrelated routes, admin workflows, auth, deployment configuration, or backend services.
- Do not fabricate achievements, client identities, timelines, awards, statistics, review quotes, or star ratings.
- Do not treat the 25 embedded Upwork screenshots as project artwork; they are evidence for review transcription.
- Do not create fake image, video, or thumbnail placeholders. Use genuine existing project media or verified retrieved assets with permission, or leave a project in draft/needs-media state.
- Do not treat Google Drive `open?id=...` or `drive/folders/...` sharing-page URLs as direct media URLs for `<img>` or `<video>`. They may be displayed as external source links, or their actual files may be exported/uploaded through the project's existing CDN pipeline after verification.
- Do not invent a publicly accessible Upwork review permalink; the provided screenshots do not include review-specific URLs.
- Project-to-review association must use `projectId`, not proximity in the Word document. Mark uncertain or standalone evidence accordingly.
- Respect `prefers-reduced-motion`; keep keyboard and touch accessibility.

## Repository inspection / reconciliation (perform before coding)

1. Read the current project schema, route rules, source-of-truth data, homepage sections, components, and asset pipeline.
2. Find all existing projects that match `projects[].id`, name, client, URL, or current equivalent slug. Examples likely already present include MNSTR, Artscapes, Adam AI, Engo Planet, and Blue Bird. **UPDATE existing records; never create duplicate cases or overwrite their established slugs.**
3. Inspect actual existing preview media and deep project galleries. Account for the media pipeline including locally published items and large CDN-only videos. Do not change storage strategy.
4. Read the existing testimonial/review UI and check whether any current quotes overlap the supplied data. De-duplicate matching reviews using a stable ID + contract title + exact/normalized quote match.
5. Inspect current theme tokens and the recent client-trust visual language before styling the review carousel.
6. Determine which new project entries can be safely published today from available genuine assets. Do NOT publicly publish a visually empty or misleading project page.

## Project content integration

Use `projects[]` from the JSON or the project appendix below as approved source content.

For each documented project, preserve the following where available:
- Public display title, concise marketing summary, discipline/category.
- Details about the actual work and technical scope.
- Client website, live demo, product page, app-store links, and external resources.
- Existing authentic project photos/videos and gallery assets.
- Connected reviews and rating information exactly as supplied.

Review-only records (`status: review_evidence_only`) are **not sufficient evidence of complete standalone project case studies**; store their feedback and only create a public project page if supplementary real work/media exists in the repository.

Recommended categories for filtering work:
- Product CGI & Animation
- Characters, Rigging & Motion
- Architectural & Event Visualization
- Interactive 3D & Configurators
- Unity, AR & VR
- Game Development

Map to current existing category labels to avoid breaking filters, SEO, or existing routes.

For published project detail pages, use a restrained, useful content flow:
- Hero media + clear title/category
- Project overview (2–3 sentences)
- Responsibilities / what was created
- Existing authentic media gallery
- Relevant verified links (live demo, store listing, client site, demo folder)
- **Client feedback** (only when a usable source quote is connected)
- Related projects + CTA to Upwork

Do not present a client website as work created by me unless the provided source expressly claims that. The client website can be labeled **Client website**.

## Homepage Client Trust section — NEW SCROLLABLE REVIEW CAROUSEL

Replace the current cramped/static trust-card implementation with a refined **horizontal review carousel** nested inside the existing homepage Client Trust section. Keep the section in its current position.

Approved intro copy:

Eyebrow: `CLIENT TRUST / 04`

Headline: `The work matters. So does the experience.`

Description: `From first concept to final delivery, I focus on clear communication, thoughtful execution, and results clients feel confident sharing.`

Supporting microcopy: `Feedback from real client projects.`

### Review carousel UI requirements

- Keep the existing dark/light appearance and accent colors; do not add a new review-specific palette.
- Use an editorial layout with one standout written quote per card, subtle quote mark, a restrained star-rating row, contract/project name, discipline label, and a clickable `View Project` link when a valid published route exists.
- Display the rating as **5.0/5** only when `rating` is 5.0. The Photon project has 4.9 and must never be rounded or relabeled as 5.0.
- Use **real transcribed feedback**, not invented or AI-generated testimonials.
- Never invent the reviewer/client's personal name, avatar, photo, title, or company logo.
- Use an attribution such as `Client feedback · Upwork` with the actual contract title, or a named company only when the existing content explicitly supports that attribution.
- On desktop show approximately 2 cards or 1.5 cards in view (depending on the existing visual layout); on tablet show 1–1.5; on mobile show 1 card plus a subtle glimpse of the next if layout permits.
- Use CSS `overflow-x: auto`, `scroll-snap-type: x mandatory`, and `scroll-snap-align: start` (or equivalent library behavior) so users can **horizontally scroll using trackpads and touch/swipe**.
- Add visible Previous and Next arrow buttons, with proper disabled states at the ends.
- Add discreet pagination/progress, e.g. `01 / 08` or a small progress line.
- Support keyboard arrow navigation when carousel has focus. Use semantic button roles, visible focus rings, and accessible card labeling.
- Avoid trapping or hijacking the user's ordinary VERTICAL mouse-wheel/page scrolling. The user should always be able to scroll down past the section normally.
- If optionally supporting drag-to-scroll on desktop, make it pointer-safe and do not break clicks on links or selectability of reviews.
- **Disable autoplay by default.** No forced movement while the visitor reads a quote.
- Animations should be restrained (transform/opacity) and respect reduced-motion preferences.
- Long quotes should have a well-designed `Read full review` expand/collapse, preserving the entire source quote. Do not truncate important feedback with no way to read it.
- Card height should be visually consistent without huge blank spaces; avoid layout shifts when expanded (ideally an inline panel or accessible modal).
- Show source and project association transparently, never pretend there is a verifiable direct review permalink when there isn't.

### Homepage review order (recommended)

Use IDs in `recommendedHomepageReviewIds` from JSON, initially:

`r22` Preat Dental — standout visual/technical praise.
`r24` Engo Planet — interactive configurator praise.
`r03` Full Body Rigging — delivery and communication.
`r08` Bordertown Retail — 3D viewer files and turnarounds.
`r01` Creative Group — rendering and feedback responsiveness.
`r20` Dandy Shandy — mobile-game development collaboration.
`r12` Artscapes — AR app quality/communication.
`r18` DW Spectrum — timely and responsive delivery.

You may reduce the homepage to 6 high-value reviews if it improves readability; keep the complete written set discoverable elsewhere.

**Do not include ratings-only entries in the homepage testimonial carousel:** a star rating with no readable quote is not a written testimonial. Do not feature `r25` (“we finished the project. no more need for more work”) as a positive endorsement.

## Dedicated review listing / detail associations

- If a `/reviews` or `/testimonials` route already exists, enrich that existing route.
- Otherwise choose between a lightweight `/reviews` route and a well-designed expanded client-trust section, depending on current architecture. Ensure all 20 written feedback records remain accessible in an appropriate interface.
- Offer category and project filtering only if it meaningfully improves discoverability; do not create an overbuilt UI.
- Show each project’s applicable written feedback in the project detail page with a subdued quote component. If multiple reviews are connected, show them as distinct reviews without merging client text.
- Expose missing/rating-only review records only as optional verified contract ratings, not fabricated quotes.

## Media and reference linking

- Check whether each Drive asset exists and is accessible through the existing deployment/media system. If cannot access, **do not invent that the media was imported**. Keep the source links as external reference links and mark `needsMedia`/`pendingApproval` internally.
- For filenames such as `Macrovey University 2.mp4`, `Neil-MR-Walkthrough.mp4`, `VID-20260127-WA0060.mp4`, and `3. Rachael Dental Product (Final - Correction)_Final 5.mp4`, search the repository's available local/media manifest first. A filename by itself is not a confirmed usable file.
- Preserve the previously established project's media cover choices and lazy loading behavior.
- When genuine media exists, choose curated cover media; use stable aspect ratios and useful alt text.
- Keep external project/client links grouped logically and open them appropriately.

## Data architecture

Prefer a type-safe structure, e.g.:

`PortfolioProject { id, slug, title, category, summary, details, media, links, reviewIds, publishingStatus }`

`PortfolioReview { id, projectId, contractTitle, rating, quote, hasWrittenReview, sourceType, sourceScreenshot, dateRange }`

Create a normalized reviews module sourced from `portfolio_projects_reviews.json` (or merge into the site's existing data schema if more maintainable).

Use stable IDs and ensure JSON import is valid in Next.js. Do not ship the Word document in the public directory. Source review screenshots can remain in private/reference storage, if used at all.

## Existing theme/footer/homepage protections

The homepage currently uses scroll-story sections (Hero → Selected Work → Expertise → Process → Client Trust → About → Final CTA) and a gradient footer. **Preserve all of them**. Do not create duplicate trust sections, extra CTAs, or an incompatible new footer.

Maintain the existing Upwork destination:
https://www.upwork.com/freelancers/zubaira27

Keep desktop and mobile alignment polished; avoid clipped carousel edges, body overflow, and collisions with sticky content.

## QA and acceptance criteria

After coding:
1. Run lint, type-check, and production build.
2. Confirm current routes/media/gallery logic remain functional; no duplicate projects.
3. Confirm the review data exactly matches the supplied input and that each displayed quote has source evidence.
4. Verify no screenshot-only rating has become a fake testimonial.
5. Verify carousel arrow buttons, touch swipe, trackpad horizontal movement, focus/keyboard controls, reduced motion, long-quote expansion, and normal vertical page scrolling.
6. Test desktop (1440×900 and 1280×800), tablet (768×1024), and mobile (390×844 and 360×800).
7. Verify external destinations, including Upwork, Drive resources, Play Store, App Store, and live demo URLs when network access allows; otherwise mark unverified.
8. Check visual alignment across the Trust section and adjacent Process/About sections.
9. Preserve design tokens, typography, favicon, navigation and footer.
10. Report `newProjects`, `updatedProjects`, `reviewRecordsIntegrated`, `reviewsShownOnHomepage`, `mediaStillPending`, `filesModified`, and the actual build/test status.

**Proceed with implementation now. Do not stop at a plan. All source data follows below; don't ask me to repeat or re-extract it.**

---

# APPENDIX A — ALL EXTRACTED PROJECT CONTENT

## 01. Creative Group — Event Visualization (`creative-group-events`)
- **Status:** documented | **Category:** Architectural & Event Visualization | **Document page(s):** 1
- **Approved summary:** Conceptual 3D renders for event experiences, including three alternative visual directions for a single event.
- **Scope:** Worked with Creative Group, an experience design company serving meetings, incentive programs, and brand activations. Produced event visualization options and spatial concepts to help its team present creative directions to clients. The document describes this as an ongoing collaboration.
- **External links:**
  - clientWebsite: https://creativegroupinc.com/
- **Media/source references (validate before embedding):**
  - threeConceptOptions: https://drive.google.com/open?id=1EXQrYPdS6cZcyfN5TnQJw5sYKRVCds3L&usp=drive_copy
  - eventRender01: https://drive.google.com/open?id=1jYxBTc3m3Mo3cnIUEOiY3vMKvkosfrrh&usp=drive_copy
  - eventRender02: https://drive.google.com/open?id=1ZSThwVlI0ljg60KinsSCCD7pb10RUqT3&usp=drive_copy

## 02. Stylized Fox — VRM Character & Rig (`stylized-fox-vrm`)
- **Status:** documented | **Category:** Character Modeling & Rigging | **Document page(s):** 2
- **Approved summary:** Modeled, rigged, and prepared a stylized fox character for real-time avatar use within a 50,000-polygon budget.
- **Scope:** Scope included optimized geometry and topology, skeleton creation, skin weight painting, deformation for the body, limbs, head, ears, and tail, humanoid bone mapping, fox-specific bones, VRM conversion and spring bones for secondary motion where required.
- **Media/source references (validate before embedding):**
  - finalLook: https://drive.google.com/open?id=1pkmN-UYB_N93VR-B1liILj4MjUvulFS4&usp=drive_copy
  - details: https://drive.google.com/open?id=1j73b_QMjfh0UUQE9VUnh7n8TkzvG1Kzl&usp=drive_copy
  - reference: https://drive.google.com/open?id=1L3H26OZ-KN-gozv5_KzXwFHs5tuDJz-W&usp=drive_copy
  - additionalFile: https://drive.google.com/open?id=1MS9pGp8eG3zBvbz8AgDclV5fPBj584AO&usp=drive_copy
- **Editorial caution:** The source states delivery objectives; do not assert external publication or commercial deployment without verification.

## 03. Zaffiri Precision — Automated Product Visualization (`zaffiri-precision`)
- **Status:** documented | **Category:** Product CGI & Rendering Automation | **Document page(s):** 3
- **Approved summary:** Precision 3D product modeling, animation, and a custom rendering workflow used to create more than 5,000 product renders.
- **Scope:** Created detailed visualizations of precision-machined components with accurate geometry, material surfaces, and finishes. Developed custom-built production pipelines for large-scale rendering and produced animation illustrating component details.
- **External links:**
  - clientWebsite: https://zaffiriprecision.com/
- **Media/source references (validate before embedding):**
  - componentWork: https://drive.google.com/open?id=1tfsZTOuT4ZaH2rI6PoF0W9gJLmLmNKNM&usp=drive_copy
- **Editorial caution:** Client sells firearm components. Keep coverage limited to high-level portfolio visualization and render workflow. Confirm permission before publishing client product imagery.

## 04. Adam AI — Architectural Configurator (`adam-ai-architectural-configurator`)
- **Status:** documented | **Category:** Interactive 3D / Architectural Technology | **Document page(s):** 4
- **Approved summary:** AI architectural configurator concept with an interactive demonstration and floor-plan materials.
- **Scope:** Document provides a live test website, floor plan, video demo, and configurator asset links but no detailed verified scope of individual responsibilities. Describe conservatively until the existing portfolio records establish specifics.
- **External links:**
  - liveDemo: https://adamaitest.techversoldevops.com/
- **Media/source references (validate before embedding):**
  - floorPlan: https://drive.google.com/open?id=11-nVo1nQsXh2xF9zVIfyUrWHKTH9rKV8&usp=drive_copy
  - demo: https://drive.google.com/open?id=1hbPQFiXl-utznwRtuCaU8_b4Oey2jhdR&usp=drive_copy
  - configurator: https://drive.google.com/open?id=1i8E2NQJ-HXheR4knDb2uGAHVyOsO1lP3&usp=drive_copy
- **Editorial caution:** No verified review directly linked to Adam AI; HEXANEST PRODUCTION review appears near this entry but association is unclear.

## 05. MNSTR Assoc — 360° Jewelry Animation (`mnstr-assoc`)
- **Status:** documented | **Category:** Product CGI & 3D Animation | **Document page(s):** 4, 5
- **Approved summary:** 360-degree product animations for anime-inspired jewelry, highlighting form, details, and craftsmanship from every angle.
- **Scope:** Prepared detailed meshes and rotational visualizations, preserving proportions and fine geometry to create polished product content for e-commerce and marketing.
- **External links:**
  - clientWebsite: https://mnstrassoc.com/
- **Media/source references (validate before embedding):**
  - assetsFolder: https://drive.google.com/drive/folders/1NkuzgwUCr6866CZvvdpBxUoG-ec-DMNm?usp=drive_link

## 06. Bordertown Retail — AR-Ready Displays (`bordertown-retail`)
- **Status:** documented | **Category:** Retail 3D Modeling & Web AR | **Document page(s):** 5
- **Approved summary:** Photorealistic 3D display racks and retail fixtures prepared as FBX assets for an augmented reality visualization platform.
- **Scope:** Developed 3D model libraries representing retail racks and display systems, working toward assets suitable for use in the client’s AR and online 3D viewing workflow.
- **External links:**
  - clientWebsite: https://bordertownretail.com/
- **Media/source references (validate before embedding):**
  - assetsFolder: https://drive.google.com/drive/folders/1VLxPD8gOAJAkuUjMNWVr0bngN-cxUJ7N?usp=drive_link

## 07. GooPlast — Construction Product Explainers (`gooplast`)
- **Status:** documented | **Category:** Industrial Product Animation | **Document page(s):** 5, 6
- **Approved summary:** 3D animations explaining how plastic formwork and voided-slab construction systems are assembled and used.
- **Scope:** Created sequences illustrating components, installation, reinforcement placement, concrete pouring, and structural application so engineers, contractors, and buyers can understand the workflows.
- **External links:**
  - clientWebsite: https://gooplast.com/en/
- **Media/source references (validate before embedding):**
  - video: https://drive.google.com/open?id=1T2NQzOgKuVF6qYmPxnhCzme8LvDZpc37&usp=drive_copy

## 08. Artscapes — Mobile AR Application (`artscapes-ar`)
- **Status:** documented | **Category:** Unity / AR Development | **Document page(s):** 6, 7
- **Approved summary:** Developed a cross-platform augmented reality application for Android and iOS using Unity and C#.
- **Scope:** Implemented AR scene configuration, tracking, interaction logic, and mobile optimization using Vuforia, ARCore/AR Foundation, and ARKit.
- **External links:**
  - clientWebsite: https://artscapes.co/
  - googlePlay: https://play.google.com/store/apps/details?id=com.ScanscapesTech.ArtScapesAR&hl=en_US
  - appStore: https://apps.apple.com/us/app/artscapes/id1433059246

## 09. AI Avatar — Blendshapes & Lip Sync (`ai-avatar-blendshapes`)
- **Status:** review_evidence_only | **Category:** 3D Character / Real-time Avatar | **Document page(s):** 6
- **Approved summary:** Blender avatar / GLB preparation for AI integration, facial blendshapes, and lip-sync compatibility.
- **Scope:** The document contains an Upwork review for this work but no independent detailed project brief, media link, or client brand. Do not invent additional features.

## 10. Photorealistic Character — Blendshapes & Rigging (`photorealistic-character-rigging`)
- **Status:** documented | **Category:** Character Modeling & Rigging | **Document page(s):** 7
- **Approved summary:** Photorealistic 3D character modeling and facial rigging/blendshape work for a Unity/iOS use case.
- **Scope:** The accompanying review mentions matching a reference image, rigging appropriate facial motions, and providing project updates.
- **Media/source references (validate before embedding):**
  - beforeAfter: https://drive.google.com/open?id=1RoGL62BZ01abPm63Mcu7aPxC_Da-VM3Q&usp=drive_copy
  - videoShowcase: https://drive.google.com/open?id=12hTlOHBFaMhWlL5Wv1FszRI--Y6LzsKf&usp=drive_copy
- **Editorial caution:** Review refers to character work, not necessarily Artscapes; do not merge them.

## 11. Macrovey — AR Machine Visualization (`macrovey-ar-machine`)
- **Status:** documented | **Category:** AR / 3D Machine Animation | **Document page(s):** 7
- **Approved summary:** Developed a 3D machine model and animation for an AR presentation demonstrating how the machine works.
- **Scope:** The source names a local video “Macrovey University 2.mp4” without embedding the actual video file.
- **External links:**
  - clientWebsite: https://www.macrovey.com/
- **Media/source references (validate before embedding):**
  - localMediaFilename: Macrovey University 2.mp4
- **Editorial caution:** The local video filename is not a URL and must not be treated as a loadable asset.

## 12. Ski Patrol — VR Rescue Training (`ski-patrol-vr`)
- **Status:** documented | **Category:** VR Training Simulation | **Document page(s):** 7
- **Approved summary:** VR training scenario for first responders assisting a person injured while skiing.
- **Scope:** Simulated medical checks, CPR, bandaging, placing the patient on a stretcher, and attaching the stretcher to a helicopter.
- **Media/source references (validate before embedding):**
  - demo: https://drive.google.com/open?id=1MyqRgAY_qx1XRKk0QSAzEfjXS9mym49q&usp=drive_copy

## 13. Interactive VR House Walkthrough (`vr-house-walkthrough`)
- **Status:** documented | **Category:** VR Architectural Visualization | **Document page(s):** 8
- **Approved summary:** Immersive house walkthrough with interactive materials and household elements.
- **Scope:** Users can change materials and interact with furniture and items in a virtual residential setting.
- **Media/source references (validate before embedding):**
  - localMediaFilename: Neil-MR-Walkthrough.mp4
- **Editorial caution:** The preceding URL https://drive.google.com/open?id=1OLstcnhdnInphB6CCaVGTrwfJ5ouJYNE&usp=drive_copy may belong to the preceding 3D Symbol and Logo review; association with VR house media is unclear.

## 14. DW Spectrum — Event Booth Visualization (`dw-spectrum-showcase`)
- **Status:** documented | **Category:** 3D Product / Event Visualization | **Document page(s):** 8
- **Approved summary:** Pre-rendered booth and event-environment visuals showing how products would appear in an exhibition space.
- **Scope:** Created environmental backgrounds and 3D booth presentation imagery for product showcase needs.
- **External links:**
  - clientWebsite: https://dwspectrum.com/page/dw-mobile/
- **Media/source references (validate before embedding):**
  - assetsFolder: https://drive.google.com/drive/folders/1oBzcHg92ICEtfkg_ffVbGtNp-adNAbCs?usp=drive_link

## 15. Photon VR — Remote Meeting Environment (`photon-vr-meeting`)
- **Status:** documented | **Category:** Multiplayer VR / Real-time Interaction | **Document page(s):** 8
- **Approved summary:** Shared virtual meeting environment designed to make remote participants feel present in a meeting room.
- **Scope:** The source describes a multi-user VR meeting experience with the ability to showcase material in an immersive space. A named local video is listed but not attached.
- **Media/source references (validate before embedding):**
  - localMediaFilename: VID-20260127-WA0060.mp4
- **Editorial caution:** Upwork contract title mentions Photon Engine; do not infer a specific networking implementation beyond the source.

## 16. Dandy Shandy — Mobile Game (`dandy-shandy`)
- **Status:** documented | **Category:** Unity Mobile Game Development | **Document page(s):** 9
- **Approved summary:** Mobile game developed with Unity, with a demo and Google Play listing provided in the document.
- **Scope:** The client review praises project guidance, implementation, communication, and delivery. Preserve existing project-specific feature details from the codebase rather than inventing gameplay mechanics.
- **External links:**
  - googlePlay: https://play.google.com/store/apps/details?id=com.DandyShandy.com.unity.template.mobile2D&hl=en_US
- **Media/source references (validate before embedding):**
  - demo: https://drive.google.com/open?id=1qhWmaNGUDpF9XWni3fXp137ooMXI9PHp&usp=drive_copy
  - screenshotsFolder: https://drive.google.com/drive/folders/19FMGtKXFW26HB_p6ZRqb7NmF88PEq4aN?usp=drive_link

## 17. Zebra Mascot — 3D Character (`zebra-mascot`)
- **Status:** documented | **Category:** Character Modeling | **Document page(s):** 9
- **Approved summary:** Freelance 3D zebra mascot modeling.
- **Scope:** Document contains a short project label, a work-file hyperlink, and a five-star client review. Do not add unsupported design specifications.
- **Media/source references (validate before embedding):**
  - referenceOrWork: https://drive.google.com/open?id=14M6dSqe3yEbP9Fg6rDVv1kY_ljT_sgTI&usp=drive_copy

## 18. Preat — Dental Product Visualization (`preat-dental`)
- **Status:** documented | **Category:** Medical Product CGI & Animation | **Document page(s):** 10
- **Approved summary:** 3D render and animation library for dental technology products, including a polished product-story animation.
- **Scope:** Produced technical product visuals and detailed animations for dental products; the review highlights the artistic presentation of technically accurate subject matter and collaborative production.
- **External links:**
  - clientWebsite: https://www.preat.com/
- **Media/source references (validate before embedding):**
  - localMediaFilename: 3. Rachael Dental Product (Final - Correction)_Final 5.mp4
  - additionalWork: https://drive.google.com/open?id=1SAnPqZ3TdIIxZ5JIJ-lWCzD-b2LrWOVH&usp=drive_copy

## 19. IntelliRoad — 3D Tolling Explainer (`intelliroad-explainer`)
- **Status:** documented | **Category:** 3D Explainer Animation | **Document page(s):** 10
- **Approved summary:** 3D animation explainer associated with tolling technologies.
- **Scope:** Document supplies the IntelliRoad tolling website, animation showcase, and an Upwork review praising the quality, responsiveness, and turnaround. Avoid adding unverified scene descriptions.
- **External links:**
  - clientWebsite: https://intelliroad.com/tolling/
- **Media/source references (validate before embedding):**
  - video: https://drive.google.com/open?id=1fqZJ0bah0OXDCuWz2KT9o5ifImdu6VjQ&usp=drive_copy

## 20. Engo Planet — Interactive Solar Products (`engo-bluebird`)
- **Status:** documented | **Category:** Interactive Product Configurator | **Document page(s):** 11
- **Approved summary:** 3D solar-product visualization and interactive configurator work, including a Blue Bird solar bench experience.
- **Scope:** The document shows product renders on Engo Planet, an interactive PlayCanvas Blue Bird solar bench configurator, and a five-star client review about turning a 3D model into a website presentation.
- **External links:**
  - clientWebsite: https://www.engoplanet.com/
  - productPage: https://www.engoplanet.com/engo-custom-solar-products
  - blueBirdConfigurator: https://playcanv.as/e/b/71442ed8

## 21. HEXANEST PRODUCTION — Client Review (`hexanest-production`)
- **Status:** review_evidence_only | **Category:** Unclassified 3D Work | **Document page(s):** 4
- **Approved summary:** Five-star Upwork feedback under the contract title “HEXANEST PRODUCTION”.
- **Scope:** No reliable project-specific description or media is present in the document.
- **Editorial caution:** Do not automatically associate this review with Adam AI.

## 22. 3D Symbol and Logo (`3d-symbol-logo`)
- **Status:** review_evidence_only | **Category:** 3D Logo / Symbol | **Document page(s):** 8
- **Approved summary:** Five-star Upwork contract titled “3D Symbol and Logo”.
- **Scope:** No readable testimonial text or detailed project description is shown.
- **Media/source references (validate before embedding):**
  - possibleUnassignedLink: https://drive.google.com/open?id=1OLstcnhdnInphB6CCaVGTrwfJ5ouJYNE&usp=drive_copy

## 23. Extra for Ceilings (`extra-ceilings`)
- **Status:** review_evidence_only | **Category:** Architectural 3D | **Document page(s):** 11
- **Approved summary:** Past architectural-related Upwork contract titled “extra for ceilings”.
- **Scope:** Only a minimal contract note and screenshot of rating are available.
- **Media/source references (validate before embedding):**
  - assetsFolder: https://drive.google.com/drive/folders/1lYQak5bdDtkM28vec788alzPLkT5UacJ?usp=drive_link

## 24. 3D Rendering of Container Ship (`container-ship-render`)
- **Status:** review_evidence_only | **Category:** Industrial 3D Rendering | **Document page(s):** 11
- **Approved summary:** 3D rendering project for a container ship, evidenced by a five-star Upwork contract title.
- **Scope:** The document does not contain enough scope detail or written feedback to build a full case study.
- **Media/source references (validate before embedding):**
  - assetsFolder: https://drive.google.com/drive/folders/1XBDsHltgAp29R3mwXKNJVkfte-iRwBeE?usp=drive_link

---

# APPENDIX B — ALL REVIEW SCREENSHOT TRANSCRIPTIONS

25 screenshots contain 26 review records because one screenshot contains two separate reviews. 20 written quotes and 6 rating-only reviews. Reviews were transcribed visually from the document images; preserve original meaning and confirm minor punctuation against the source when exact verbatim use is crucial. Screenshot filenames are provenance labels, not public image assets.

## r01 — Renders for ballroom
- **Associated project:** `creative-group-events`
- **Rating:** 5.0/5 | **Date range:** Sep 25, 2026 – Oct 19, 2026 | **Source screenshot:** image1.png
- **Client review text:** “I had a fabulous experience working with Zubair! He delivered high quality photo realistic renderings with a quick turn around. I really appreciate how he accepts feedback and makes changes quickly!”

## r02 — 3D Render Artist for Event Concepts
- **Associated project:** `creative-group-events`
- **Rating:** 5.0/5 | **Date range:** Dec 7, 2025 – May 29, 2026 | **Source screenshot:** image2.png
- **Client review text:** “Working with Zubair was easy, and he was able to provide timely updates and revisions - he did great!”

## r03 — Hyper Realistic Full Body Rigging
- **Associated project:** `stylized-fox-vrm`
- **Rating:** 5.0/5 | **Date range:** Sep 7, 2026 – Oct 6, 2026 | **Source screenshot:** image3.png
- **Client review text:** “Zubair did an incredible job with the full body rigging project! The quality of work was outstanding, and everything was completed successfully and on schedule. Communication was smooth throughout the entire process, making it a truly great experience. I highly recommend Zubair for any rigging needs and look forward to working together again in the future!”
- **Note:** Screenshot says 5.0 of 2 reviews but only one review is shown.

## r04 — Seeking Blender Designer to Automate e-Commerce Product Rendering Creation
- **Associated project:** `zaffiri-precision`
- **Rating:** 5.0/5 | **Date range:** Jul 30, 2026 – Sep 28, 2026 | **Source screenshot:** image4.png
- **Client review text:** “Zubair has great communication and performs his tasks thoroughly and expeditiously without too much direction required.”
- **Note:** Top review of two shown in image4.

## r05 — Seeking Blender Designer to Automate e-Commerce Product Rendering Creation
- **Associated project:** `zaffiri-precision`
- **Rating:** 5.0/5 | **Date range:** Jul 10, 2026 – Jul 29, 2026 | **Source screenshot:** image4.png
- **Client review text:** “Zubair quickly understood the project’s needs and executed efficiently.”
- **Note:** Bottom review of two shown in image4.

## r06 — HEXANEST PRODUCTION
- **Associated project:** `hexanest-production`
- **Rating:** 5.0/5 | **Date range:** Oct 2, 2025 – Jul 15, 2026 | **Source screenshot:** image5.png
- **Client review text:** “Amazing work. Did not fail to impress me”
- **Note:** Project link to Adam AI is NOT proven.

## r07 — Blender Expert Needed for Engaging Social Media Animations
- **Associated project:** `mnstr-assoc`
- **Rating:** 5.0/5 | **Date range:** May 4, 2026 – Jul 8, 2026 | **Source screenshot:** image6.png
- **Client review text:** “Zubair was great to work with!”

## r08 — Convert 3D Retail Display Designs to Photorealistic FBX Models for Web-Based AR (Ongoing Work)
- **Associated project:** `bordertown-retail`
- **Rating:** 5.0/5 | **Date range:** Nov 7, 2025 – May 1, 2026 | **Source screenshot:** image7.png
- **Client review text:** “Great work on our website viewer files, really appreciate your quick turnarounds and flexibility to work with our files to create exactly what we needed! Really appreciate the help, and will definitely reach out again if any new projects come up.”

## r09 — Convert 3D Retail Display Designs to Photorealistic FBX Models for Web-Based AR (Ongoing Work)
- **Associated project:** `bordertown-retail`
- **Rating:** 5.0/5 | **Date range:** Aug 20, 2025 – Nov 7, 2025 | **Source screenshot:** image8.png
- **Client review text:** “Great work overall, we were provided with exactly what we needed for our website 3D viewers, when we needed it!”

## r10 — New 3d Video
- **Associated project:** `gooplast`
- **Rating:** 5.0/5 | **Date range:** May 29, 2025 – Apr 13, 2026 | **Source screenshot:** image9.png
- **Client review text:** Not visible in the source. RATING ONLY — do not invent a quote.
- **Note:** Star rating only. No quote shown.

## r11 — Develo a glb with blendshapes adapted to AI integration and lipsync
- **Associated project:** `ai-avatar-blendshapes`
- **Rating:** 5.0/5 | **Date range:** Oct 26, 2025 – Jan 15, 2026 | **Source screenshot:** image10.png
- **Client review text:** “It has been amazing to work with Zubair. He is really well-prepared and he work very fast with the maximum quality possible. He fits perfectly all the need and requirements of my project. He deployed my blender avatar project at best and with all the correct criteria. Super happy to start to work with him!”
- **Note:** Transcription lightly normalized only for legibility; retain source image if exact quote punctuation is required.

## r12 — AR/App Work
- **Associated project:** `artscapes-ar`
- **Rating:** 5.0/5 | **Date range:** Dec 23, 2025 – Jan 6, 2026 | **Source screenshot:** image11.png
- **Client review text:** “Working with Zubair was a great experience. He’s knowledgeable, easy to communicate with, and genuinely invested in delivering a solid result. He was flexible with feedback and made sure everything was implemented correctly. Highly recommended!”

## r13 — 3D Photorealistic Character Artist (Unity, iOS, Blendshapes)
- **Associated project:** `photorealistic-character-rigging`
- **Rating:** 5.0/5 | **Date range:** Sep 15, 2025 – Nov 3, 2025 | **Source screenshot:** image12.png
- **Client review text:** “Zubair was a pleasure to work with and completed our 3D modeling / blendshape rigging project successfully. He was able to model characters from a reference image and rigged the character to have appropriate facial motions. Zubair communicated and provided updates in a timely manner.”

## r14 — 3D Model Animation
- **Associated project:** `macrovey-ar-machine`
- **Rating:** 5.0/5 | **Date range:** Nov 27, 2024 – Oct 6, 2025 | **Source screenshot:** image13.png
- **Client review text:** Not visible in the source. RATING ONLY — do not invent a quote.
- **Note:** Star rating only.

## r15 — Ski Patrol VR MVP App
- **Associated project:** `ski-patrol-vr`
- **Rating:** 5.0/5 | **Date range:** Feb 28, 2025 – Oct 3, 2025 | **Source screenshot:** image14.png
- **Client review text:** “Zubair did an excellent job on this project. I will use again once I had user feedback.”

## r16 — 3D Symbol and Logo
- **Associated project:** `3d-symbol-logo`
- **Rating:** 5.0/5 | **Date range:** Mar 18, 2025 – Oct 3, 2025 | **Source screenshot:** image15.png
- **Client review text:** Not visible in the source. RATING ONLY — do not invent a quote.
- **Note:** Star rating only.

## r17 — Unity Developer for Android VR/AR App
- **Associated project:** `vr-house-walkthrough`
- **Rating:** 5.0/5 | **Date range:** Mar 18, 2025 – Oct 2, 2025 | **Source screenshot:** image16.png
- **Client review text:** Not visible in the source. RATING ONLY — do not invent a quote.
- **Note:** Star rating only; linked project inferred from adjacency only.

## r18 — 3D Pre-rendered Background Artist for Product Showcase Site
- **Associated project:** `dw-spectrum-showcase`
- **Rating:** 5.0/5 | **Date range:** May 12, 2025 – Sep 19, 2025 | **Source screenshot:** image17.png
- **Client review text:** “Zubair is timely, responsive and delivered quality results.”

## r19 — VR Developer Needed with Expertise in Photon Engine
- **Associated project:** `photon-vr-meeting`
- **Rating:** 4.9/5 | **Date range:** Jul 30, 2025 – Aug 28, 2025 | **Source screenshot:** image18.png
- **Client review text:** Not visible in the source. RATING ONLY — do not invent a quote.
- **Note:** Rating only, 4.9 not 5.0.

## r20 — Mobile Game Developer Needed for Exciting Project
- **Associated project:** `dandy-shandy`
- **Rating:** 5.0/5 | **Date range:** Mar 21, 2025 – Aug 26, 2025 | **Source screenshot:** image19.png
- **Client review text:** “It was a pleasure working with Zubair on this project, he was the perfect developer for us as we had very little experience with either game development or mobile app development. He provided clear guidance throughout and he was able to implement our idea to our satisfaction. We definitely recommend him.”

## r21 — 3D Modeller Needed for Simple 3D Character
- **Associated project:** `zebra-mascot`
- **Rating:** 5.0/5 | **Date range:** Jun 11, 2025 – Aug 25, 2025 | **Source screenshot:** image20.png
- **Client review text:** “Zubair was a pleasure to work with! Communication was smooth throughout the entire project, and the work he produced was great quality and efficient. I highly recommend him as a freelance artist, and would work with him again if the opportunity arose.”

## r22 — 3D Dental Image Renderings
- **Associated project:** `preat-dental`
- **Rating:** 5.0/5 | **Date range:** May 29, 2025 – Aug 1, 2025 | **Source screenshot:** image21.png
- **Client review text:** “Working with Zubair has been an absolute pleasure. As a 3D artist, he brought an exceptional level of skill, creativity, and professionalism to our project at Preat. He produced high-quality product renders that not only showcased our products in stunning detail but also elevated the visual standard of our entire brand. Every image was polished, precise, and visually compelling—perfectly aligned with our technical and marketing goals. Even more impressive was the animation video Zubair created. From the lighting and textures to the pacing and transitions, he delivered a cinematic-quality piece that told our product story beautifully. He was receptive to feedback, collaborative throughout the process, and always met deadlines—often ahead of schedule. Zubair combines artistic talent with technical expertise, and his ability to translate complex product features into sleek, professional visuals makes him an invaluable creative partner. We’re already looking forward to working with him again!”
- **Note:** Full long review. Prefer an exact excerpt in a carousel and the entire quote on the project detail.

## r23 — 3d animation explainer video
- **Associated project:** `intelliroad-explainer`
- **Rating:** 5.0/5 | **Date range:** Jan 31, 2025 – Mar 22, 2025 | **Source screenshot:** image22.png
- **Client review text:** “Zubair took on this project when I was in a jam. He graciously stepped up and created a very nice result for my client. He completed this project quickly (which was what I needed) and still with care and high quality work. He was easy to work with, communicated in a timely manner and asked good clarifying questions along the way. I highly recommend Zubair for any animation work.”
- **Note:** Screenshot shows 5.0 of 2 reviews; only one readable review supplied.

## r24 — Designer Needed to turn 3D Model into Interactive Website Movie
- **Associated project:** `engo-bluebird`
- **Rating:** 5.0/5 | **Date range:** Sep 11, 2024 – Nov 19, 2024 | **Source screenshot:** image23.png
- **Client review text:** “Zubair went above and beyond to complete this job. Excellent communication, organization, and quality of work. His attention to detail and understanding of 3D product configurators helped him deliver a finished project beyond our expectations. Now we have a show stopping 3D interactive 3D model to present our product. Would highly recommend Zubair for any 3D modeling work. Exceptional!”

## r25 — extra for ceilings
- **Associated project:** `extra-ceilings`
- **Rating:** 5.0/5 | **Date range:** Oct 3, 2024 – Nov 1, 2024 | **Source screenshot:** image24.png
- **Client review text:** “we finished the project. no more need for more work”
- **Note:** Not an endorsement. Exclude from homepage featured review carousel.

## r26 — 3D Rendering of Container Ship
- **Associated project:** `container-ship-render`
- **Rating:** 5.0/5 | **Date range:** Sep 7, 2023 – Feb 15, 2024 | **Source screenshot:** image25.png
- **Client review text:** Not visible in the source. RATING ONLY — do not invent a quote.
- **Note:** Star rating only.

---

# APPENDIX C — SOURCE QUALITY RULES

- 19 projects have enough contextual source material to enrich or draft a case study; 5 are evidence-only.
- Do not invent reviewer names, exact review URLs, official publication claims, visual assets, or a public listing for a project that lacks authentic media.
- If the source document and existing repository disagree, reconcile with actual project media and published content; do not silently replace accurate information.
- This file is a ready-to-paste prompt: the structured JSON supplies the same content for direct code import.


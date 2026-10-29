/**
 * Maps verified source project IDs (from portfolio_projects_reviews.json)
 * to existing published portfolio slugs. Never create duplicate routes.
 * Entries with null remain review/enrichment-only until genuine media exists.
 */
export const sourceIdToSlug: Record<string, string | null> = {
  "creative-group-events": "installation-event-visualization",
  "stylized-fox-vrm": "unity-unity-character",
  "zaffiri-precision": "standalone-weapon",
  "adam-ai-architectural-configurator": "explainer-configurator",
  "mnstr-assoc": "character-anime",
  "bordertown-retail": "lifestyle-renders-furniture",
  gooplast: "product-animation-product-animation",
  "artscapes-ar": "explainer-app-animation",
  "ai-avatar-blendshapes": null,
  "photorealistic-character-rigging": null,
  "macrovey-ar-machine": "product-renders-camera",
  "ski-patrol-vr": "explainer-training-video",
  "vr-house-walkthrough": "unreal-michaela-environment",
  "dw-spectrum-showcase": "installation-industrial-visualization",
  "photon-vr-meeting": "explainer-website-animation",
  "dandy-shandy": "unity-unity-game",
  "zebra-mascot": "character-mascot",
  /** Dental product media not present as a dedicated case study yet. */
  "preat-dental": null,
  "intelliroad-explainer": "explainer-blueprint-illustrator",
  "engo-bluebird": "explainer-configurator",
  "hexanest-production": null,
  "3d-symbol-logo": null,
  "extra-ceilings": null,
  "container-ship-render": null,
};

/** Secondary slug that also shows Zaffiri enrichment (shared client work). */
export const secondarySlugBySourceId: Record<string, string[]> = {
  "zaffiri-precision": ["product-animation-ai-product"],
};

export function slugForSourceId(sourceId: string): string | null {
  return sourceIdToSlug[sourceId] ?? null;
}

export function sourceIdsForSlug(slug: string): string[] {
  const ids: string[] = [];
  for (const [sourceId, mapped] of Object.entries(sourceIdToSlug)) {
    if (mapped === slug) ids.push(sourceId);
  }
  for (const [sourceId, secondaries] of Object.entries(secondarySlugBySourceId)) {
    if (secondaries.includes(slug) && !ids.includes(sourceId)) ids.push(sourceId);
  }
  return ids;
}

export const updatedProjectSlugs = [
  ...new Set(
    Object.values(sourceIdToSlug)
      .concat(Object.values(secondarySlugBySourceId).flat())
      .filter((slug): slug is string => Boolean(slug)),
  ),
];

export const mediaStillPending = Object.entries(sourceIdToSlug)
  .filter(([, slug]) => slug === null)
  .map(([id]) => id);

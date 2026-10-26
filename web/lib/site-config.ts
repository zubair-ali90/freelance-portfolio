import { unstable_noStore as noStore } from "next/cache";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";
import { categoryGroups, type ProjectCategory } from "./content";
import {
  isModelViewerEnvironment,
  sanitizeViewerBackgroundColor,
  sanitizeViewerBackdrop,
  sanitizeViewerHdriSrc,
  sanitizeViewerModelSrc,
  type ModelViewerEnvironment,
} from "./model-viewer";
import { sanitizeViewerAnimationLoop } from "./viewer-animation";

export type OrderedToggle<T extends string = string> = {
  id: T;
  enabled: boolean;
};

export type SiteConfigStore = {
  version: 1;
  /** Order = priority for picking one project per category on the home page */
  homeFeatured: OrderedToggle<ProjectCategory>[];
  maxHomeFeatured: number;
  /** Order of main blocks on /work (3D animation, Renders, …) */
  workGroups: OrderedToggle<string>[];
  /** Order of leaf categories within /work (grouped under their parent) */
  workSections: OrderedToggle<ProjectCategory>[];
  /** Optional GLB/GLTF under /assets/… for the portfolio 3D viewer lab */
  viewerModelSrc: string;
  viewerBackgroundColor: string;
  viewerEnvironmentPreset: ModelViewerEnvironment;
  /** Custom equirectangular HDR/EXR under /assets/hdri/ — overrides preset when set */
  viewerHdriSrc: string;
  /** `solid` = flat color behind model; `environment` = show HDRI/preset as 360° sky */
  viewerBackdrop: "solid" | "environment";
  viewerAnimationLoop: import("./viewer-animation").ViewerAnimationLoop;
  viewerAutoPlayAnimation: boolean;
};

const STORE_KEY = "site-config";

export function buildDefaultSiteConfig(): SiteConfigStore {
  const workSections = categoryGroups.flatMap((group) =>
    group.sections.map((section) => ({ id: section.id, enabled: true })),
  );
  const workGroups = categoryGroups.map((group) => ({ id: group.id, enabled: true }));
  const homeFeatured: OrderedToggle<ProjectCategory>[] = [
    { id: "product-animation", enabled: true },
    { id: "character", enabled: true },
    { id: "lifestyle-renders", enabled: true },
    { id: "exterior", enabled: true },
    { id: "unreal", enabled: true },
    { id: "unity", enabled: true },
  ];
  for (const section of workSections) {
    if (!homeFeatured.some((item) => item.id === section.id)) {
      homeFeatured.push({ id: section.id, enabled: false });
    }
  }
  return {
    version: 1,
    homeFeatured,
    maxHomeFeatured: 6,
    workGroups,
    workSections,
    viewerModelSrc: "",
    viewerBackgroundColor: sanitizeViewerBackgroundColor(undefined),
    viewerEnvironmentPreset: "studio",
    viewerHdriSrc: "",
    viewerBackdrop: "solid",
    viewerAnimationLoop: "repeat",
    viewerAutoPlayAnimation: true,
  };
}

function localPath() {
  return path.join(process.cwd(), "data", "site-config.json");
}

async function readLocal(): Promise<SiteConfigStore | null> {
  try {
    const raw = await readFile(localPath(), "utf8");
    return JSON.parse(raw) as SiteConfigStore;
  } catch {
    return null;
  }
}

async function writeLocal(data: SiteConfigStore) {
  const dir = path.dirname(localPath());
  await mkdir(dir, { recursive: true });
  await writeFile(localPath(), JSON.stringify(data, null, 2), "utf8");
}

async function readBlob(): Promise<SiteConfigStore | null> {
  try {
    const store = getStore("portfolio-admin");
    const data = await store.get(STORE_KEY, { type: "json" });
    if (!data) return null;
    return data as SiteConfigStore;
  } catch {
    return null;
  }
}

async function writeBlob(data: SiteConfigStore) {
  const store = getStore("portfolio-admin");
  await store.setJSON(STORE_KEY, data);
}

export function normalizeSiteConfig(partial: SiteConfigStore | null | undefined): SiteConfigStore {
  const defaults = buildDefaultSiteConfig();
  if (!partial || partial.version !== 1) return defaults;

  return {
    version: 1,
    homeFeatured: mergeOrdered(defaults.homeFeatured, partial.homeFeatured),
    maxHomeFeatured: clamp(partial.maxHomeFeatured ?? defaults.maxHomeFeatured, 1, 12),
    workGroups: mergeOrdered(defaults.workGroups, partial.workGroups),
    workSections: mergeOrdered(defaults.workSections, partial.workSections),
    viewerModelSrc: sanitizeViewerModelSrc(partial.viewerModelSrc),
    viewerBackgroundColor: sanitizeViewerBackgroundColor(partial.viewerBackgroundColor),
    viewerEnvironmentPreset: isModelViewerEnvironment(partial.viewerEnvironmentPreset)
      ? partial.viewerEnvironmentPreset
      : defaults.viewerEnvironmentPreset,
    viewerHdriSrc: sanitizeViewerHdriSrc(partial.viewerHdriSrc),
    viewerBackdrop: sanitizeViewerBackdrop(partial.viewerBackdrop),
    viewerAnimationLoop: sanitizeViewerAnimationLoop(partial.viewerAnimationLoop),
    viewerAutoPlayAnimation: partial.viewerAutoPlayAnimation !== false,
  };
}

function mergeOrdered<T extends string>(
  defaults: OrderedToggle<T>[],
  saved: OrderedToggle<T>[] | undefined,
): OrderedToggle<T>[] {
  if (!saved?.length) return defaults;
  const allowed = new Set(defaults.map((item) => item.id));
  const result: OrderedToggle<T>[] = [];
  for (const item of saved) {
    if (!allowed.has(item.id)) continue;
    result.push({ id: item.id, enabled: Boolean(item.enabled) });
  }
  for (const item of defaults) {
    if (!result.some((entry) => entry.id === item.id)) {
      result.push(item);
    }
  }
  return result;
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export async function readSiteConfig(): Promise<SiteConfigStore> {
  noStore();
  const blob = await readBlob();
  if (blob) return normalizeSiteConfig(blob);
  const local = await readLocal();
  return normalizeSiteConfig(local);
}

export async function writeSiteConfig(data: SiteConfigStore) {
  const normalized = normalizeSiteConfig(data);
  let blobSaved = false;
  try {
    await writeBlob(normalized);
    blobSaved = true;
  } catch {
    // local dev without Netlify Blobs
  }
  try {
    await writeLocal(normalized);
  } catch {
    if (!blobSaved) throw new Error("Could not save site configuration");
  }
  return normalized;
}

export type ResolvedWorkGroup = {
  id: string;
  label: string;
  sections: {
    id: ProjectCategory;
    label: string;
    hue: string;
    accent: string;
    kind: import("./content").ProjectKind;
  }[];
};

export function resolveWorkLayout(config: SiteConfigStore): ResolvedWorkGroup[] {
  const sectionMeta = new Map(
    categoryGroups.flatMap((g) => g.sections.map((s) => [s.id, s] as const)),
  );
  const groupMeta = new Map(categoryGroups.map((g) => [g.id, g] as const));
  const enabledSections = config.workSections.filter((s) => s.enabled).map((s) => s.id);

  return config.workGroups
    .filter((g) => g.enabled)
    .map((orderedGroup) => {
      const group = groupMeta.get(orderedGroup.id);
      if (!group) return null;
      const sections = enabledSections
        .filter((id) => group.sections.some((section) => section.id === id))
        .map((id) => sectionMeta.get(id))
        .filter((section): section is NonNullable<typeof section> => Boolean(section));
      return { id: group.id, label: group.label, sections };
    })
    .filter((group): group is ResolvedWorkGroup => Boolean(group && group.sections.length));
}

export function homeFeaturedCategoryOrder(config: SiteConfigStore): ProjectCategory[] {
  return config.homeFeatured.filter((item) => item.enabled).map((item) => item.id);
}

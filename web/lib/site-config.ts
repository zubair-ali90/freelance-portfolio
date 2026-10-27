import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { categoryGroups, type ProjectCategory } from "./content";
import {
  buildDefaultGlobal,
  buildDefaultHomepage,
  buildDefaultPages,
  type GlobalSiteSettings,
  type HomepageStore,
  type PagesStore,
} from "./cms/homepage-defaults";
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
  version: 2;
  /** Legacy: category-priority home picks (still used as fallback). */
  homeFeatured: OrderedToggle<ProjectCategory>[];
  maxHomeFeatured: number;
  workGroups: OrderedToggle<string>[];
  workSections: OrderedToggle<ProjectCategory>[];
  viewerModelSrc: string;
  viewerBackgroundColor: string;
  viewerEnvironmentPreset: ModelViewerEnvironment;
  viewerHdriSrc: string;
  viewerBackdrop: "solid" | "environment";
  viewerAnimationLoop: import("./viewer-animation").ViewerAnimationLoop;
  viewerAutoPlayAnimation: boolean;
  homepage: HomepageStore;
  pages: PagesStore;
  reviews: { hiddenIds: string[] };
  global: GlobalSiteSettings;
  updatedAt?: string;
};

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
    version: 2,
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
    homepage: buildDefaultHomepage(),
    pages: buildDefaultPages(),
    reviews: { hiddenIds: [] },
    global: buildDefaultGlobal(),
  };
}

function publishedPath() {
  return path.join(process.cwd(), "data", "site-config.json");
}

function draftPath() {
  return path.join(process.cwd(), "data", "site-config.draft.json");
}

async function readJsonFile(filePath: string): Promise<unknown | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

async function writeJsonFile(filePath: string, data: unknown) {
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
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

function mergeHomepage(partial: Partial<HomepageStore> | undefined): HomepageStore {
  const defaults = buildDefaultHomepage();
  if (!partial) return defaults;
  return {
    hero: { ...defaults.hero, ...partial.hero },
    featuredProjects:
      partial.featuredProjects?.length
        ? partial.featuredProjects.map((item) => ({
            slug: String(item.slug ?? ""),
            enabled: item.enabled !== false,
            clientLabel: String(item.clientLabel ?? ""),
            headline: String(item.headline ?? ""),
            body: String(item.body ?? ""),
            cta: String(item.cta ?? "Explore Project"),
            mediaSrc: String(item.mediaSrc ?? ""),
          }))
        : defaults.featuredProjects,
    expertise: {
      ...defaults.expertise,
      ...partial.expertise,
      items: partial.expertise?.items?.length
        ? partial.expertise.items.map((item, index) => ({
            ...defaults.expertise.items[index],
            ...item,
            enabled: item.enabled !== false,
          }))
        : defaults.expertise.items,
    },
    process: {
      ...defaults.process,
      ...partial.process,
      steps: partial.process?.steps?.length
        ? partial.process.steps.map((step, index) => ({
            ...defaults.process.steps[index],
            ...step,
            enabled: step.enabled !== false,
          }))
        : defaults.process.steps,
    },
    trust: {
      ...defaults.trust,
      ...partial.trust,
      reviewIds: Array.isArray(partial.trust?.reviewIds)
        ? partial.trust!.reviewIds.map(String)
        : defaults.trust.reviewIds,
      enabled: partial.trust?.enabled !== false,
    },
    about: { ...defaults.about, ...partial.about },
    finalCta: { ...defaults.finalCta, ...partial.finalCta },
  };
}

function mergePages(partial: Partial<PagesStore> | undefined): PagesStore {
  const defaults = buildDefaultPages();
  if (!partial) return defaults;
  return {
    about: { ...defaults.about, ...partial.about },
    services: {
      ...defaults.services,
      ...partial.services,
      offers: partial.services?.offers?.length
        ? partial.services.offers.map((offer, index) => ({
            ...defaults.services.offers[index],
            ...offer,
            enabled: offer.enabled !== false,
          }))
        : defaults.services.offers,
    },
    contact: { ...defaults.contact, ...partial.contact },
  };
}

export function normalizeSiteConfig(partial: unknown): SiteConfigStore {
  const defaults = buildDefaultSiteConfig();
  if (!partial || typeof partial !== "object") return defaults;
  const raw = partial as Partial<SiteConfigStore> & { version?: number };

  return {
    version: 2,
    homeFeatured: mergeOrdered(defaults.homeFeatured, raw.homeFeatured),
    maxHomeFeatured: clamp(raw.maxHomeFeatured ?? defaults.maxHomeFeatured, 1, 12),
    workGroups: mergeOrdered(defaults.workGroups, raw.workGroups),
    workSections: mergeOrdered(defaults.workSections, raw.workSections),
    viewerModelSrc: sanitizeViewerModelSrc(raw.viewerModelSrc),
    viewerBackgroundColor: sanitizeViewerBackgroundColor(raw.viewerBackgroundColor),
    viewerEnvironmentPreset: isModelViewerEnvironment(raw.viewerEnvironmentPreset)
      ? raw.viewerEnvironmentPreset
      : defaults.viewerEnvironmentPreset,
    viewerHdriSrc: sanitizeViewerHdriSrc(raw.viewerHdriSrc),
    viewerBackdrop: sanitizeViewerBackdrop(raw.viewerBackdrop),
    viewerAnimationLoop: sanitizeViewerAnimationLoop(raw.viewerAnimationLoop),
    viewerAutoPlayAnimation: raw.viewerAutoPlayAnimation !== false,
    homepage: mergeHomepage(raw.homepage),
    pages: mergePages(raw.pages),
    reviews: {
      hiddenIds: Array.isArray(raw.reviews?.hiddenIds)
        ? raw.reviews!.hiddenIds.map(String)
        : [],
    },
    global: { ...defaults.global, ...raw.global },
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
  };
}

async function readSiteConfigImpl(): Promise<SiteConfigStore> {
  noStore();
  const local = await readJsonFile(publishedPath());
  return normalizeSiteConfig(local);
}

export const readSiteConfig = cache(readSiteConfigImpl);

export async function writeSiteConfig(data: SiteConfigStore) {
  const normalized = normalizeSiteConfig({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  await writeJsonFile(publishedPath(), normalized);
  return normalized;
}

export async function readSiteConfigDraft(): Promise<SiteConfigStore | null> {
  noStore();
  try {
    await access(draftPath());
  } catch {
    return null;
  }
  const raw = await readJsonFile(draftPath());
  return normalizeSiteConfig(raw);
}

export async function writeSiteConfigDraft(data: SiteConfigStore) {
  const normalized = normalizeSiteConfig({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  await writeJsonFile(draftPath(), normalized);
  return normalized;
}

export async function publishSiteConfigDraft() {
  const draft = await readSiteConfigDraft();
  if (!draft) {
    const published = await readSiteConfig();
    return { config: published, hadDraft: false };
  }
  const published = await writeSiteConfig(draft);
  try {
    const { unlink } = await import("node:fs/promises");
    await unlink(draftPath());
  } catch {
    /* ignore */
  }
  return { config: published, hadDraft: true };
}

export async function discardSiteConfigDraft() {
  try {
    const { unlink } = await import("node:fs/promises");
    await unlink(draftPath());
    return true;
  } catch {
    return false;
  }
}

export async function readEditableSiteConfig(): Promise<{
  config: SiteConfigStore;
  published: SiteConfigStore;
  hasDraft: boolean;
}> {
  const published = await readSiteConfig();
  const draft = await readSiteConfigDraft();
  return {
    published,
    hasDraft: Boolean(draft),
    config: draft ?? published,
  };
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

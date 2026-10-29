import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type MediaVisibilityStore = {
  version: 1;
  /** Media paths that are hidden from the public site. */
  hidden: string[];
};

const EMPTY: MediaVisibilityStore = { version: 1, hidden: [] };

function localPath() {
  return path.join(process.cwd(), "data", "media-visibility.json");
}

async function readLocal(): Promise<MediaVisibilityStore> {
  try {
    const raw = await readFile(localPath(), "utf8");
    const parsed = JSON.parse(raw) as MediaVisibilityStore;
    return {
      version: 1,
      hidden: Array.isArray(parsed.hidden) ? parsed.hidden.map(String) : [],
    };
  } catch {
    return EMPTY;
  }
}

async function writeLocal(data: MediaVisibilityStore) {
  const dir = path.dirname(localPath());
  await mkdir(dir, { recursive: true });
  await writeFile(localPath(), JSON.stringify(data, null, 2), "utf8");
}

async function readMediaVisibilityImpl(): Promise<MediaVisibilityStore> {
  noStore();
  return readLocal();
}

export const readMediaVisibility = cache(readMediaVisibilityImpl);

export async function writeMediaVisibility(data: MediaVisibilityStore) {
  const cleaned: MediaVisibilityStore = {
    version: 1,
    hidden: [...new Set((data.hidden ?? []).map(String).filter(Boolean))],
  };
  await writeLocal(cleaned);
  return cleaned;
}

export function hiddenMediaSet(store: MediaVisibilityStore) {
  return new Set(store.hidden);
}

/** Filter project media for public display. Hidden assets are removed everywhere. */
export function applyMediaVisibility<T extends { cover: string; media: string[] }>(
  project: T,
  hidden: Set<string>,
): T {
  if (!hidden.size) return project;
  const media = project.media.filter((src) => !hidden.has(src));
  if (media.length === project.media.length && !hidden.has(project.cover)) {
    return project;
  }
  const cover = media.includes(project.cover) ? project.cover : (media[0] ?? "");
  return { ...project, media, cover };
}

/** Clear homepage hero/featured overrides that point at hidden media. */
export function sanitizeHomepageMediaSrcs<
  T extends {
    hero: { mediaSrc: string };
    featuredProjects: Array<{ mediaSrc: string }>;
  },
>(homepage: T, hidden: Set<string>): T {
  if (!hidden.size) return homepage;
  return {
    ...homepage,
    hero: {
      ...homepage.hero,
      mediaSrc: hidden.has(homepage.hero.mediaSrc) ? "" : homepage.hero.mediaSrc,
    },
    featuredProjects: homepage.featuredProjects.map((item) => ({
      ...item,
      mediaSrc: item.mediaSrc && hidden.has(item.mediaSrc) ? "" : item.mediaSrc,
    })),
  };
}

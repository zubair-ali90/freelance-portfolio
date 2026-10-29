import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { ProjectCategory } from "./content";

export type ProjectOverride = {
  active: boolean;
  category?: ProjectCategory;
  /** Canonical cover/thumbnail. Must be one of the project's media paths. */
  cover?: string;
  title?: string;
  summary?: string;
  role?: string;
  /**
   * Written review IDs to show on the project page.
   * Omit for automatic source mapping. Empty array hides written reviews.
   */
  reviewIds?: string[];
};

export type ProjectOverridesStore = {
  version: 1;
  overrides: Record<string, ProjectOverride>;
};

const EMPTY: ProjectOverridesStore = { version: 1, overrides: {} };

function localPath() {
  return path.join(process.cwd(), "data", "project-overrides.json");
}

async function readLocal(): Promise<ProjectOverridesStore> {
  try {
    const raw = await readFile(localPath(), "utf8");
    return JSON.parse(raw) as ProjectOverridesStore;
  } catch {
    return EMPTY;
  }
}

async function writeLocal(data: ProjectOverridesStore) {
  const dir = path.dirname(localPath());
  await mkdir(dir, { recursive: true });
  await writeFile(localPath(), JSON.stringify(data, null, 2), "utf8");
}

async function readProjectOverridesImpl(): Promise<ProjectOverridesStore> {
  noStore();
  return readLocal();
}

export const readProjectOverrides = cache(readProjectOverridesImpl);

export async function writeProjectOverrides(data: ProjectOverridesStore) {
  await writeLocal(data);
}

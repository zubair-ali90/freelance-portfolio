import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";
import type { ProjectCategory } from "./content";
import { readBlobJsonWithTimeout } from "./blob-read";
import { isNetlifyRuntime } from "./netlify-runtime";

export type ProjectOverride = {
  active: boolean;
  category?: ProjectCategory;
};

export type ProjectOverridesStore = {
  version: 1;
  overrides: Record<string, ProjectOverride>;
};

const STORE_KEY = "project-overrides";
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

async function readBlob(): Promise<ProjectOverridesStore | null> {
  return readBlobJsonWithTimeout(async () => {
    const store = getStore("portfolio-admin");
    const data = await store.get(STORE_KEY, { type: "json" });
    if (!data) return null;
    return data as ProjectOverridesStore;
  });
}

async function writeBlob(data: ProjectOverridesStore) {
  const store = getStore("portfolio-admin");
  await store.setJSON(STORE_KEY, data);
}

async function readProjectOverridesImpl(): Promise<ProjectOverridesStore> {
  noStore();
  const blob = await readBlob();
  if (blob) return blob;
  return readLocal();
}

export const readProjectOverrides = cache(readProjectOverridesImpl);

export async function writeProjectOverrides(data: ProjectOverridesStore) {
  const onNetlify = isNetlifyRuntime();

  if (onNetlify) {
    await writeBlob(data);
    try {
      await writeLocal(data);
    } catch {
      // ephemeral on serverless; blob is source of truth
    }
    return;
  }

  let blobSaved = false;
  try {
    await writeBlob(data);
    blobSaved = true;
  } catch {
    // Netlify Blobs unavailable (local dev without netlify dev)
  }
  try {
    await writeLocal(data);
  } catch {
    if (!blobSaved) throw new Error("Could not save project settings");
  }
}

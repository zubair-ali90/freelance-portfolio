import { NextResponse } from "next/server";
import type { ProjectCategory } from "@/lib/content";
import { isAdminSession } from "@/lib/admin-auth";
import {
  isModelViewerEnvironment,
  sanitizeViewerBackgroundColor,
  sanitizeViewerBackdrop,
  sanitizeViewerHdriSrc,
  sanitizeViewerModelSrc,
} from "@/lib/model-viewer";
import { sanitizeViewerAnimationLoop } from "@/lib/viewer-animation";
import {
  buildDefaultSiteConfig,
  normalizeSiteConfig,
  readSiteConfig,
  writeSiteConfig,
  type SiteConfigStore,
} from "@/lib/site-config";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";

const VALID_SECTIONS = new Set(
  buildDefaultSiteConfig().workSections.map((item) => item.id),
);
const VALID_GROUPS = new Set(buildDefaultSiteConfig().workGroups.map((item) => item.id));

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const config = await readSiteConfig();
  return NextResponse.json({ config });
}

export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { config?: SiteConfigStore };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const incoming = body.config;
  if (!incoming) {
    return NextResponse.json({ error: "Missing config" }, { status: 400 });
  }

  const cleaned: SiteConfigStore = {
    version: 1,
    maxHomeFeatured: incoming.maxHomeFeatured,
    homeFeatured: (incoming.homeFeatured ?? []).filter((item) =>
      VALID_SECTIONS.has(item.id as ProjectCategory),
    ),
    workGroups: (incoming.workGroups ?? []).filter((item) => VALID_GROUPS.has(item.id)),
    workSections: (incoming.workSections ?? []).filter((item) =>
      VALID_SECTIONS.has(item.id as ProjectCategory),
    ),
    viewerModelSrc: sanitizeViewerModelSrc(incoming.viewerModelSrc),
    viewerBackgroundColor: sanitizeViewerBackgroundColor(incoming.viewerBackgroundColor),
    viewerEnvironmentPreset: isModelViewerEnvironment(incoming.viewerEnvironmentPreset)
      ? incoming.viewerEnvironmentPreset
      : "studio",
    viewerHdriSrc: sanitizeViewerHdriSrc(incoming.viewerHdriSrc),
    viewerBackdrop: sanitizeViewerBackdrop(incoming.viewerBackdrop),
    viewerAnimationLoop: sanitizeViewerAnimationLoop(incoming.viewerAnimationLoop),
    viewerAutoPlayAnimation: incoming.viewerAutoPlayAnimation !== false,
  };

  try {
    const saved = await writeSiteConfig(cleaned);
    revalidatePublicSite();
    return NextResponse.json({ ok: true, config: normalizeSiteConfig(saved), live: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

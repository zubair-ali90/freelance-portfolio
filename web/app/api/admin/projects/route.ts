import { NextResponse } from "next/server";
import type { ProjectCategory } from "@/lib/content";
import { isAdminSession } from "@/lib/admin-auth";
import { writeProjectOverrides, type ProjectOverride } from "@/lib/project-overrides";
import { getAdminProjectRows } from "@/lib/published-projects";
import { getWrittenReviews } from "@/lib/portfolio-reviews";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { readMediaVisibility } = await import("@/lib/media-visibility");
  const [rows, written, visibility] = await Promise.all([
    getAdminProjectRows(),
    Promise.resolve(getWrittenReviews()),
    readMediaVisibility(),
  ]);
  return NextResponse.json({
    projects: rows,
    hiddenMedia: visibility.hidden,
    reviews: written.map((review) => ({
      id: review.id,
      contractTitle: review.contractTitle,
      quote: review.quote ?? "",
      rating: review.rating,
      projectSlug: review.projectSlug,
    })),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    overrides?: Record<string, ProjectOverride>;
    projects?: Array<{
      slug: string;
      active: boolean;
      category: ProjectCategory;
      cover?: string;
      title?: string;
      summary?: string;
      role?: string;
      reviewIds?: string[] | null;
    }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const validCategories = new Set([
    "product-animation",
    "character",
    "installation",
    "explainer",
    "product-renders",
    "hero-renders",
    "lifestyle-renders",
    "standalone",
    "interior-exterior",
    "interior",
    "exterior",
    "arc-viz",
    "unity",
    "unreal",
  ]);
  const validReviewIds = new Set(getWrittenReviews().map((review) => review.id));

  const cleaned: Record<string, ProjectOverride> = {};

  if (body.projects?.length) {
    const { getBaseProjects } = await import("@/lib/projects-base");
    const { readMediaVisibility, hiddenMediaSet } = await import("@/lib/media-visibility");
    const baseBySlug = new Map(getBaseProjects().map((p) => [p.slug, p]));
    const hidden = hiddenMediaSet(await readMediaVisibility());
    for (const row of body.projects) {
      const base = baseBySlug.get(row.slug);
      if (!base) continue;
      if (!validCategories.has(row.category)) continue;

      const cover =
        typeof row.cover === "string" &&
        base.media.includes(row.cover) &&
        !hidden.has(row.cover)
          ? row.cover
          : undefined;
      const title = typeof row.title === "string" ? row.title.trim() : "";
      const summary = typeof row.summary === "string" ? row.summary.trim() : "";
      const role = typeof row.role === "string" ? row.role.trim() : "";
      const reviewIds = Array.isArray(row.reviewIds)
        ? row.reviewIds.map(String).filter((id) => validReviewIds.has(id))
        : null;

      const defaultActive = true;
      const categoryChanged = row.category !== base.category;
      const activeChanged = row.active !== defaultActive;
      const coverChanged = Boolean(cover && cover !== base.cover);
      const titleChanged = Boolean(title && title !== base.title);
      const summaryChanged = Boolean(summary && summary !== base.summary);
      const roleChanged = Boolean(role && role !== base.role);
      const reviewsChanged = reviewIds !== null;

      if (
        !activeChanged &&
        !categoryChanged &&
        !coverChanged &&
        !titleChanged &&
        !summaryChanged &&
        !roleChanged &&
        !reviewsChanged
      ) {
        continue;
      }

      const entry: ProjectOverride = { active: row.active };
      if (categoryChanged) entry.category = row.category;
      if (coverChanged && cover) entry.cover = cover;
      if (titleChanged) entry.title = title;
      if (summaryChanged) entry.summary = summary;
      if (roleChanged) entry.role = role;
      if (reviewsChanged) entry.reviewIds = reviewIds ?? [];
      cleaned[row.slug] = entry;
    }
  } else {
    const overrides = body.overrides ?? {};
    for (const [slug, value] of Object.entries(overrides)) {
      if (!value || typeof value !== "object") continue;
      const entry: ProjectOverride = { active: Boolean(value.active) };
      if (value.category && validCategories.has(value.category)) {
        entry.category = value.category as ProjectCategory;
      }
      if (typeof value.cover === "string" && value.cover) entry.cover = value.cover;
      if (typeof value.title === "string" && value.title.trim()) entry.title = value.title.trim();
      if (typeof value.summary === "string" && value.summary.trim()) {
        entry.summary = value.summary.trim();
      }
      if (typeof value.role === "string" && value.role.trim()) entry.role = value.role.trim();
      if (Array.isArray(value.reviewIds)) {
        entry.reviewIds = value.reviewIds.map(String).filter((id) => validReviewIds.has(id));
      }
      cleaned[slug] = entry;
    }
  }

  try {
    await writeProjectOverrides({ version: 1, overrides: cleaned });
    revalidatePublicSite();
    const rows = await getAdminProjectRows();
    return NextResponse.json({ ok: true, projects: rows, live: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

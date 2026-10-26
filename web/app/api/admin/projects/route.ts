import { NextResponse } from "next/server";
import type { ProjectCategory } from "@/lib/content";
import { isAdminSession } from "@/lib/admin-auth";
import { writeProjectOverrides, type ProjectOverride } from "@/lib/project-overrides";
import { getAdminProjectRows } from "@/lib/published-projects";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await getAdminProjectRows();
  return NextResponse.json({ projects: rows });
}

export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    overrides?: Record<string, ProjectOverride>;
    projects?: Array<{ slug: string; active: boolean; category: ProjectCategory }>;
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

  const cleaned: Record<string, ProjectOverride> = {};

  if (body.projects?.length) {
    const { getBaseProjects } = await import("@/lib/projects-base");
    const baseBySlug = new Map(getBaseProjects().map((p) => [p.slug, p]));
    for (const row of body.projects) {
      const base = baseBySlug.get(row.slug);
      if (!base) continue;
      if (!validCategories.has(row.category)) continue;
      const defaultActive = true;
      const categoryChanged = row.category !== base.category;
      const activeChanged = row.active !== defaultActive;
      if (!activeChanged && !categoryChanged) continue;
      cleaned[row.slug] = { active: row.active, category: row.category };
    }
  } else {
    const overrides = body.overrides ?? {};
    for (const [slug, value] of Object.entries(overrides)) {
      if (!value || typeof value !== "object") continue;
      const active = Boolean(value.active);
      const entry: ProjectOverride = { active };
      if (value.category && validCategories.has(value.category)) {
        entry.category = value.category as ProjectCategory;
      }
      cleaned[slug] = entry;
    }
  }

  await writeProjectOverrides({ version: 1, overrides: cleaned });
  const rows = await getAdminProjectRows();
  return NextResponse.json({ ok: true, projects: rows });
}

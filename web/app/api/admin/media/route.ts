import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { buildMediaCatalogWithVisibility } from "@/lib/cms/media-catalog";
import { readMediaVisibility, writeMediaVisibility } from "@/lib/media-visibility";
import { deactivateProjectsWithAllMediaHidden } from "@/lib/project-overrides";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [assets, store] = await Promise.all([
    buildMediaCatalogWithVisibility(),
    readMediaVisibility(),
  ]);
  return NextResponse.json({ assets, hidden: store.hidden });
}

export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { hidden?: string[]; visibility?: Record<string, boolean> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    let hidden: string[] = [];
    if (Array.isArray(body.hidden)) {
      hidden = body.hidden.map(String);
    } else if (body.visibility && typeof body.visibility === "object") {
      hidden = Object.entries(body.visibility)
        .filter(([, visible]) => !visible)
        .map(([src]) => src);
    } else {
      return NextResponse.json({ error: "Missing visibility payload" }, { status: 400 });
    }

    const saved = await writeMediaVisibility({ version: 1, hidden });
    const deactivated = await deactivateProjectsWithAllMediaHidden(saved.hidden);
    revalidatePublicSite();
    const assets = await buildMediaCatalogWithVisibility();
    const projectNote = deactivated.length
      ? ` ${deactivated.length} project${deactivated.length === 1 ? "" : "s"} turned off because all media was hidden.`
      : "";
    return NextResponse.json({
      ok: true,
      hidden: saved.hidden,
      assets,
      deactivatedProjects: deactivated,
      message: `Media visibility saved. Hidden files are removed from the public site.${projectNote}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

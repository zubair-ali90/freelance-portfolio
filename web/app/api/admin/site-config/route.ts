import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import {
  normalizeSiteConfig,
  readEditableSiteConfig,
  readSiteConfig,
  writeSiteConfigDraft,
  type SiteConfigStore,
} from "@/lib/site-config";

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");
  if (scope === "published") {
    const config = await readSiteConfig();
    return NextResponse.json({ config, hasDraft: false, scope: "published" });
  }
  const editable = await readEditableSiteConfig();
  return NextResponse.json({
    config: editable.config,
    published: editable.published,
    hasDraft: editable.hasDraft,
    scope: editable.hasDraft ? "draft" : "published",
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { config?: SiteConfigStore; publish?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.config) {
    return NextResponse.json({ error: "Missing config" }, { status: 400 });
  }

  try {
    const cleaned = normalizeSiteConfig(body.config);
    const saved = await writeSiteConfigDraft(cleaned);
    return NextResponse.json({
      ok: true,
      config: saved,
      hasDraft: true,
      live: false,
      message: "Draft saved. Publish to update the live site.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import {
  discardSiteConfigDraft,
  publishSiteConfigDraft,
  rollbackSiteConfig,
} from "@/lib/site-config";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let action = "publish";
  try {
    const body = (await request.json()) as { action?: string };
    if (body.action === "discard" || body.action === "rollback") action = body.action;
  } catch {
    /* empty body = publish */
  }

  try {
    if (action === "discard") {
      await discardSiteConfigDraft();
      const { readSiteConfig } = await import("@/lib/site-config");
      const config = await readSiteConfig();
      return NextResponse.json({ ok: true, discarded: true, config, hasDraft: false });
    }

    if (action === "rollback") {
      const restored = await rollbackSiteConfig();
      if (!restored) {
        return NextResponse.json({ error: "No previous published version available." }, { status: 404 });
      }
      revalidatePublicSite();
      return NextResponse.json({
        ok: true,
        rolledBack: true,
        config: restored,
        hasDraft: true,
        message: "Restored previous published version. Current live state was saved as draft.",
      });
    }

    const result = await publishSiteConfigDraft();
    revalidatePublicSite();
    return NextResponse.json({
      ok: true,
      published: true,
      hadDraft: result.hadDraft,
      config: result.config,
      hasDraft: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

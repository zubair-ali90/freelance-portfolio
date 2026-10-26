import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/published-projects";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}

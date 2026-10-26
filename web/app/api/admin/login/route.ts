import { NextResponse } from "next/server";
import { setAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}

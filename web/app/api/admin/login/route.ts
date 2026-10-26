import { NextResponse } from "next/server";
import { connection } from "next/server";
import {
  COOKIE,
  createSessionValue,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  await connection();
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

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  return response;
}

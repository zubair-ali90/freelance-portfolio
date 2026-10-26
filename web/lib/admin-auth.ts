import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET is not set");
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionValue() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = `admin:${exp}`;
  return `${payload}:${sign(payload)}`;
}

export function verifySessionValue(token: string | undefined | null) {
  if (!token) return false;
  const sep = token.lastIndexOf(":");
  if (sep <= 0) return false;
  const payload = token.slice(0, sep);
  const sig = token.slice(sep + 1);
  if (!payload.startsWith("admin:") || !sig) return false;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const exp = Number(payload.slice("admin:".length));
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  return true;
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;
  return username === expectedUser && password === expectedPass;
}

export async function isAdminSession() {
  const jar = await cookies();
  return verifySessionValue(jar.get(COOKIE)?.value);
}

export async function setAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export { COOKIE };

import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";

function secretsEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function authorize(request: Request) {
  const expected = process.env.DEPLOY_HOOK_SECRET ?? "";
  if (!expected) return false;
  const header = request.headers.get("authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const alt = request.headers.get("x-deploy-secret") ?? "";
  return secretsEqual(bearer, expected) || secretsEqual(alt, expected);
}

/** GitHub Actions calls this over the public Cloudflare URL to deploy on this host. */
export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const script = path.resolve(process.cwd(), "..", "scripts", "deploy-production.sh");
  const logFile = path.resolve(process.cwd(), "..", "scripts", "last-deploy.log");

  const child = spawn("bash", [script], {
    cwd: path.resolve(process.cwd(), ".."),
    detached: true,
    stdio: "ignore",
    env: process.env,
  });
  child.unref();

  return NextResponse.json({
    ok: true,
    started: true,
    pid: child.pid ?? null,
    logHint: logFile,
  });
}

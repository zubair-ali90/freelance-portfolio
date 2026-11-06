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

/**
 * GitHub Actions calls this over the public Cloudflare URL.
 * Must fully detach from this Next.js process — deploy script stops PM2,
 * which would otherwise kill the deploy mid-run and leave a 502.
 */
export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const root = path.resolve(process.cwd(), "..");
  const script = path.join(root, "scripts", "deploy-production.sh");
  const logFile = path.join(root, "scripts", "last-deploy.log");

  // setsid + nohup: new session, survive when Zubair-portfolio is stopped.
  const child = spawn(
    "bash",
    ["-c", `setsid nohup bash "${script}" >> "${logFile}" 2>&1 < /dev/null & echo $!`],
    {
      cwd: root,
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    },
  );
  child.unref();

  return NextResponse.json({
    ok: true,
    started: true,
    logHint: logFile,
  });
}

import { isNetlifyRuntime } from "./netlify-runtime";

const LOCAL_BLOB_READ_TIMEOUT_MS = 800;
const NETLIFY_BLOB_READ_TIMEOUT_MS = 6_000;

export function blobReadTimeoutMs() {
  return isNetlifyRuntime() ? NETLIFY_BLOB_READ_TIMEOUT_MS : LOCAL_BLOB_READ_TIMEOUT_MS;
}

/** Netlify Blobs can hang on SSR; cap wait and fall back to bundled JSON. */
export async function readBlobJsonWithTimeout<T>(
  read: () => Promise<T | null>,
  timeoutMs = blobReadTimeoutMs(),
): Promise<T | null> {
  try {
    return await Promise.race([
      read(),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
  } catch {
    return null;
  }
}

const BLOB_READ_TIMEOUT_MS = 3_000;

/** Netlify Blobs can hang in SSR; never block page render longer than this. */
export async function readBlobJsonWithTimeout<T>(
  read: () => Promise<T | null>,
): Promise<T | null> {
  try {
    return await Promise.race([
      read(),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), BLOB_READ_TIMEOUT_MS);
      }),
    ]);
  } catch {
    return null;
  }
}

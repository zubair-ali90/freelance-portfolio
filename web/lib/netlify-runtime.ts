/** True when running on Netlify (build or serverless/edge). */
export function isNetlifyRuntime() {
  return process.env.NETLIFY === "true";
}

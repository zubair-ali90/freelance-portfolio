import { sanitizeViewerAnimationLoop, type ViewerAnimationLoop } from "./viewer-animation";

/** File extensions the portfolio 3D viewer can load (GLB/GLTF recommended). */
export const MODEL_3D_EXTENSIONS = [".glb", ".gltf", ".usdz"] as const;

export type Model3DExtension = (typeof MODEL_3D_EXTENSIONS)[number];

export function isModel3DPath(path: string) {
  const lower = path.toLowerCase();
  return MODEL_3D_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export type ModelViewerEnvironment = "studio" | "city" | "sunset" | "warehouse" | "dawn" | "forest";

export const HDRI_EXTENSIONS = [".hdr", ".exr"] as const;

export const DEFAULT_VIEWER_BACKGROUND = "#e7e0d2";

/** Public asset path only — blocks open redirects and arbitrary URLs. */
export function sanitizeViewerModelSrc(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!trimmed.startsWith("/assets/")) return "";
  if (trimmed.includes("..")) return "";
  const lower = trimmed.toLowerCase();
  if (!lower.endsWith(".glb") && !lower.endsWith(".gltf")) return "";
  return trimmed;
}

export function sanitizeViewerHdriSrc(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!trimmed.startsWith("/assets/")) return "";
  if (trimmed.includes("..")) return "";
  const lower = trimmed.toLowerCase();
  if (!HDRI_EXTENSIONS.some((ext) => lower.endsWith(ext))) return "";
  return trimmed;
}

export function sanitizeViewerBackgroundColor(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_VIEWER_BACKGROUND;
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return DEFAULT_VIEWER_BACKGROUND;
}

export function isModelViewerEnvironment(value: unknown): value is ModelViewerEnvironment {
  return (
    value === "studio" ||
    value === "city" ||
    value === "sunset" ||
    value === "warehouse" ||
    value === "dawn" ||
    value === "forest"
  );
}

export type ViewerBackdrop = "solid" | "environment";

export function sanitizeViewerBackdrop(value: unknown): ViewerBackdrop {
  return value === "environment" ? "environment" : "solid";
}

export type ViewerDisplayOptions = {
  modelSrc?: string;
  backgroundColor: string;
  environmentPreset: ModelViewerEnvironment;
  hdriSrc?: string;
  /** Solid fill behind the model, or show the HDRI/preset as a 360° backdrop */
  backdrop: ViewerBackdrop;
  animationLoop: ViewerAnimationLoop;
  autoPlayAnimation: boolean;
};

export function resolveViewerDisplayOptions(input: {
  viewerModelSrc?: string;
  viewerBackgroundColor?: string;
  viewerEnvironmentPreset?: string;
  viewerHdriSrc?: string;
  viewerBackdrop?: string;
  viewerAnimationLoop?: string;
  viewerAutoPlayAnimation?: boolean;
}): ViewerDisplayOptions {
  const hdri = sanitizeViewerHdriSrc(input.viewerHdriSrc);
  const preset = isModelViewerEnvironment(input.viewerEnvironmentPreset)
    ? input.viewerEnvironmentPreset
    : "studio";
  const model = sanitizeViewerModelSrc(input.viewerModelSrc);
  return {
    modelSrc: model || undefined,
    backgroundColor: sanitizeViewerBackgroundColor(input.viewerBackgroundColor),
    environmentPreset: preset,
    hdriSrc: hdri || undefined,
    backdrop: sanitizeViewerBackdrop(input.viewerBackdrop),
    animationLoop: sanitizeViewerAnimationLoop(input.viewerAnimationLoop),
    autoPlayAnimation: input.viewerAutoPlayAnimation !== false,
  };
}

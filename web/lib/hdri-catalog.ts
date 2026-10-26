import {
  isModelViewerEnvironment,
  sanitizeViewerHdriSrc,
  type ModelViewerEnvironment,
} from "@/lib/model-viewer";

export const VIEWER_LIGHTING_PRESET_PREFIX = "preset:";
export const VIEWER_LIGHTING_HDRI_PREFIX = "hdri:";

/** Drop HDR/EXR files in repo `Assets/hdri/` → served as `/assets/hdri/…` */
export const HDRI_PUBLIC_FOLDER = "/assets/hdri";

/**
 * Register each file you add under Assets/hdri so it appears in admin Configuration.
 * `file` must match the public URL (case-sensitive on Linux hosts).
 */
export const HDRI_CATALOG: { id: string; label: string; file: string }[] = [
  {
    id: "wooden-studio",
    label: "Wooden studio (4K)",
    file: `${HDRI_PUBLIC_FOLDER}/wooden_studio_10_4k.hdr`,
  },
  {
    id: "studio-wizja",
    label: "Studio Wizja (4K)",
    file: `${HDRI_PUBLIC_FOLDER}/studio_wizja_03_4k.hdr`,
  },
  {
    id: "citrus-orchard",
    label: "Citrus orchard sky (4K)",
    file: `${HDRI_PUBLIC_FOLDER}/citrus_orchard_road_puresky_4k.hdr`,
  },
];

export const ENVIRONMENT_PRESET_OPTIONS: { value: ModelViewerEnvironment; label: string }[] = [
  { value: "studio", label: "Studio" },
  { value: "warehouse", label: "Warehouse" },
  { value: "city", label: "City" },
  { value: "sunset", label: "Sunset" },
  { value: "dawn", label: "Dawn" },
  { value: "forest", label: "Forest" },
];

export function viewerLightingToSelectValue(
  preset: ModelViewerEnvironment,
  hdriSrc: string,
): string {
  const hdri = sanitizeViewerHdriSrc(hdriSrc);
  if (hdri) return `${VIEWER_LIGHTING_HDRI_PREFIX}${hdri}`;
  return `${VIEWER_LIGHTING_PRESET_PREFIX}${preset}`;
}

export function viewerLightingFromSelectValue(value: string): {
  preset: ModelViewerEnvironment;
  hdriSrc: string;
} {
  if (value.startsWith(VIEWER_LIGHTING_HDRI_PREFIX)) {
    const path = value.slice(VIEWER_LIGHTING_HDRI_PREFIX.length);
    return { preset: "studio", hdriSrc: sanitizeViewerHdriSrc(path) };
  }
  if (value.startsWith(VIEWER_LIGHTING_PRESET_PREFIX)) {
    const id = value.slice(VIEWER_LIGHTING_PRESET_PREFIX.length);
    return {
      preset: isModelViewerEnvironment(id) ? id : "studio",
      hdriSrc: "",
    };
  }
  return { preset: "studio", hdriSrc: "" };
}

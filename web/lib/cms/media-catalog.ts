import { getBaseProjects } from "@/lib/projects-base";
import { isVideo } from "@/lib/media";
import { hiddenMediaSet, readMediaVisibility } from "@/lib/media-visibility";

export type MediaAsset = {
  id: string;
  src: string;
  type: "image" | "video";
  projectSlug: string;
  projectTitle: string;
  isCover: boolean;
  visible: boolean;
};

export function buildMediaCatalog(hidden: Set<string> = new Set()): MediaAsset[] {
  const assets: MediaAsset[] = [];
  const seen = new Set<string>();

  for (const project of getBaseProjects()) {
    for (const src of project.media) {
      if (seen.has(src)) continue;
      seen.add(src);
      assets.push({
        id: src,
        src,
        type: isVideo(src) ? "video" : "image",
        projectSlug: project.slug,
        projectTitle: project.title,
        isCover: src === project.cover,
        visible: !hidden.has(src),
      });
    }
  }

  return assets;
}

export async function buildMediaCatalogWithVisibility(): Promise<MediaAsset[]> {
  const store = await readMediaVisibility();
  return buildMediaCatalog(hiddenMediaSet(store));
}

export function mediaStats(assets: MediaAsset[] = buildMediaCatalog()) {
  return {
    total: assets.length,
    images: assets.filter((asset) => asset.type === "image").length,
    videos: assets.filter((asset) => asset.type === "video").length,
    visible: assets.filter((asset) => asset.visible).length,
    hidden: assets.filter((asset) => !asset.visible).length,
  };
}

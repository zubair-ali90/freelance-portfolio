/**
 * Extra media URLs merged into projects after folder sync.
 * Use for interactive embeds (PlayCanvas, etc.) that are not files under Assets/.
 */
export const projectExtraMedia: Record<string, string[]> = {
  "product-renders-packaging": ["https://playcanv.as/b/554dd2f3"],
};

/** Prefer these covers for embed-led projects (survives folder sync). */
export const projectEmbedCovers: Record<string, string> = {
  "product-renders-packaging": "https://playcanv.as/b/554dd2f3",
};

export function withExtraMedia<
  T extends { slug: string; media: string[]; cover: string },
>(project: T): T {
  const extras = projectExtraMedia[project.slug] ?? [];
  const preferredCover = projectEmbedCovers[project.slug];
  let media = project.media;
  if (extras.length) {
    media = [...project.media];
    for (const src of extras) {
      if (!media.includes(src)) media.push(src);
    }
  }
  if (preferredCover && !media.includes(preferredCover)) {
    media = [...media, preferredCover];
  }
  const cover = preferredCover ?? project.cover;
  if (media === project.media && cover === project.cover) return project;
  return { ...project, media, cover };
}

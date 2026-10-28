import type { Project, ProjectCategory } from "./content";

/** Pure helper — safe for client and server. */
export function projectsByCategoryList(
  projects: Project[],
  category: ProjectCategory,
  order?: string[],
) {
  const items = projects.filter((project) => project.category === category);
  if (!order?.length) return items;
  const rank = new Map(order.map((slug, index) => [slug, index]));
  return [...items].sort((a, b) => {
    const ra = rank.has(a.slug) ? rank.get(a.slug)! : Number.MAX_SAFE_INTEGER;
    const rb = rank.has(b.slug) ? rank.get(b.slug)! : Number.MAX_SAFE_INTEGER;
    if (ra !== rb) return ra - rb;
    return a.title.localeCompare(b.title);
  });
}

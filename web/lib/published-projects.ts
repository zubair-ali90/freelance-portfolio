import type { Project, ProjectCategory } from "./content";
import { categoryGroups } from "./content";
import { mergeProjectSummary } from "./project-client-details";
import { readProjectOverrides, type ProjectOverride } from "./project-overrides";
import { decorateProjectCategory, getBaseProjects } from "./projects-base";
import { homeFeaturedCategoryOrder, readSiteConfig } from "./site-config";
import type { AdminProjectRow } from "./admin-project-types";
import {
  applyMediaVisibility,
  hiddenMediaSet,
  readMediaVisibility,
} from "./media-visibility";
import {
  getRatingOnlyForSlug,
  getReviewsByIds,
  getReviewsForSlug,
  type PortfolioReview,
} from "./portfolio-reviews";

export type { AdminProjectRow } from "./admin-project-types";

function mergeOne(project: Project, override?: ProjectOverride): AdminProjectRow {
  const active = override?.active ?? true;
  const category = override?.category ?? project.category;
  const decorated = category === project.category ? project : decorateProjectCategory(project, category);
  const cover =
    override?.cover && project.media.includes(override.cover) ? override.cover : project.cover;
  const title = override?.title?.trim() ? override.title.trim() : decorated.title;
  const summary = override?.summary?.trim() ? override.summary.trim() : decorated.summary;
  const role = override?.role?.trim() ? override.role.trim() : decorated.role;
  const reviewIds = Array.isArray(override?.reviewIds) ? override!.reviewIds.map(String) : null;

  return {
    ...decorated,
    cover,
    title,
    summary,
    role,
    active,
    reviewIds,
  };
}

export async function getAdminProjectRows(): Promise<AdminProjectRow[]> {
  const { overrides } = await readProjectOverrides();
  return getBaseProjects().map((project) => mergeOne(project, overrides[project.slug]));
}

function publishRow(
  { active: _a, reviewIds: _r, ...project }: AdminProjectRow,
  hiddenMedia: Set<string>,
): Project {
  const visible = applyMediaVisibility(project, hiddenMedia);
  const base = getBaseProjects().find((entry) => entry.slug === visible.slug);
  // Keep admin-edited copy; only auto-enrich when summary was left as the base text.
  if (base && visible.summary === base.summary) {
    return mergeProjectSummary(visible);
  }
  return visible;
}

export async function getPublishedProjects(): Promise<Project[]> {
  const [rows, visibility] = await Promise.all([getAdminProjectRows(), readMediaVisibility()]);
  const hidden = hiddenMediaSet(visibility);
  return rows.filter((project) => project.active).map((row) => publishRow(row, hidden));
}

export async function getPublishedProject(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectPageReviews(slug: string): Promise<{
  reviews: PortfolioReview[];
  ratingOnly: PortfolioReview[];
}> {
  const { overrides } = await readProjectOverrides();
  const override = overrides[slug];
  if (Array.isArray(override?.reviewIds)) {
    return {
      reviews: getReviewsByIds(override.reviewIds),
      ratingOnly: getRatingOnlyForSlug(slug),
    };
  }
  return {
    reviews: getReviewsForSlug(slug),
    ratingOnly: getRatingOnlyForSlug(slug),
  };
}

export { projectsByCategoryList } from "./project-ordering";

export async function getFeaturedPublishedProjects(): Promise<Project[]> {
  const [published, siteConfig] = await Promise.all([getPublishedProjects(), readSiteConfig()]);
  const categoryOrder = homeFeaturedCategoryOrder(siteConfig);
  const max = siteConfig.maxHomeFeatured;
  const picked: Project[] = [];
  for (const category of categoryOrder) {
    const match = published.find((project) => project.category === category);
    if (match) picked.push(match);
  }
  if (picked.length < max) {
    for (const project of published) {
      if (picked.length >= max) break;
      if (!picked.some((p) => p.slug === project.slug)) picked.push(project);
    }
  }
  return picked.slice(0, max);
}

export async function getWorkPageLayout() {
  const { resolveWorkLayout } = await import("./site-config");
  const config = await readSiteConfig();
  return resolveWorkLayout(config);
}

export async function getDashboardStats() {
  const rows = await getAdminProjectRows();
  const active = rows.filter((r) => r.active);
  const byCategory: Record<string, number> = {};
  for (const leaf of categoryGroups.flatMap((g) => g.sections)) {
    byCategory[leaf.id] = active.filter((r) => r.category === leaf.id).length;
  }

  const { buildMediaCatalogWithVisibility, mediaStats } = await import("./cms/media-catalog");
  const { getWrittenReviews, getHomepageReviews } = await import("./portfolio-reviews");
  const { readEditableSiteConfig } = await import("./site-config");
  const media = mediaStats(await buildMediaCatalogWithVisibility());
  const editable = await readEditableSiteConfig();
  const homepage = editable.config.homepage;
  const featuredSlugs = homepage.featuredProjects.filter((item) => item.enabled).map((item) => item.slug);
  const missingCovers = active.filter((project) => !project.cover).length;
  const brokenFeatured = featuredSlugs.filter((slug) => !rows.some((row) => row.slug === slug));

  return {
    total: rows.length,
    active: active.length,
    hidden: rows.length - active.length,
    byCategory,
    mediaImages: media.images,
    mediaVideos: media.videos,
    mediaTotal: media.total,
    writtenReviews: getWrittenReviews().length,
    homepageReviews: getHomepageReviews().length,
    featuredOnHomepage: featuredSlugs.length,
    hasDraft: editable.hasDraft,
    missingHeroMedia: !homepage.hero.mediaSrc,
    missingCovers,
    brokenFeatured,
    categoryGroupCounts: {
      animation: active.filter((r) =>
        ["product-animation", "character", "installation", "explainer"].includes(r.category),
      ).length,
      renders: active.filter((r) =>
        ["product-renders", "hero-renders", "lifestyle-renders", "standalone"].includes(r.category),
      ).length,
      architectural: active.filter((r) =>
        ["interior-exterior", "interior", "exterior", "arc-viz"].includes(r.category),
      ).length,
      development: active.filter((r) => ["unity", "unreal"].includes(r.category)).length,
    },
  };
}

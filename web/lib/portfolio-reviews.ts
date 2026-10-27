import source from "../data/portfolio_projects_reviews.json";
import { slugForSourceId, sourceIdsForSlug } from "./portfolio-map";
import type { ProjectResourceLink, ProjectClientInfo } from "./project-client-details";

export type SourceProject = (typeof source.projects)[number];
export type SourceReview = (typeof source.reviews)[number];

export type PortfolioReview = SourceReview & {
  projectSlug: string | null;
  sourceProjectTitle: string;
  discipline: string;
};

const projectsById = new Map(source.projects.map((project) => [project.id, project]));

function linkLabel(key: string) {
  const labels: Record<string, string> = {
    clientWebsite: "Client website",
    liveDemo: "Live demo",
    productPage: "Product page",
    googlePlay: "Google Play",
    appStore: "App Store",
    blueBirdConfigurator: "Blue Bird configurator",
  };
  return labels[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function sourceMediaLabel(key: string) {
  if (key === "localMediaFilename") return null;
  const labels: Record<string, string> = {
    assetsFolder: "Source assets (Drive)",
    threeConceptOptions: "Concept options (Drive)",
    eventRender01: "Event render (Drive)",
    eventRender02: "Event render (Drive)",
    finalLook: "Final look (Drive)",
    details: "Details (Drive)",
    reference: "Reference (Drive)",
    additionalFile: "Additional file (Drive)",
    componentWork: "Component work (Drive)",
    floorPlan: "Floor plan (Drive)",
    demo: "Demo (Drive)",
    configurator: "Configurator (Drive)",
    video: "Video (Drive)",
    beforeAfter: "Before / after (Drive)",
    videoShowcase: "Video showcase (Drive)",
    screenshotsFolder: "Screenshots (Drive)",
    referenceOrWork: "Work file (Drive)",
    additionalWork: "Additional work (Drive)",
    possibleUnassignedLink: "Related file (Drive)",
  };
  return labels[key] ?? "Source reference (Drive)";
}

export function getSourceProject(id: string) {
  return projectsById.get(id);
}

export function getAllSourceProjects() {
  return source.projects;
}

export function getAllReviews(): PortfolioReview[] {
  return source.reviews.map((review) => {
    const project = projectsById.get(review.projectId);
    return {
      ...review,
      projectSlug: slugForSourceId(review.projectId),
      sourceProjectTitle: project?.title ?? review.contractTitle,
      discipline: project?.category ?? "Client work",
    };
  });
}

export function getWrittenReviews(): PortfolioReview[] {
  return getAllReviews().filter((review) => review.hasWrittenReview && Boolean(review.quote?.trim()));
}

export function getHomepageReviews(): PortfolioReview[] {
  const byId = new Map(getWrittenReviews().map((review) => [review.id, review]));
  const ordered: PortfolioReview[] = [];
  for (const id of source.recommendedHomepageReviewIds) {
    if (id === "r25") continue;
    const review = byId.get(id);
    if (review?.quote) ordered.push(review);
  }
  return ordered;
}

export function getReviewsForSlug(slug: string): PortfolioReview[] {
  const sourceIds = new Set(sourceIdsForSlug(slug));
  return getWrittenReviews().filter((review) => sourceIds.has(review.projectId));
}

export function getRatingOnlyForSlug(slug: string): PortfolioReview[] {
  const sourceIds = new Set(sourceIdsForSlug(slug));
  return getAllReviews().filter(
    (review) => sourceIds.has(review.projectId) && (!review.hasWrittenReview || !review.quote),
  );
}

export function formatRating(rating: number) {
  if (rating === 5) return "5.0/5";
  return `${rating.toFixed(1)}/5`;
}

export function excerptQuote(quote: string, max = 220) {
  const trimmed = quote.trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max - 1);
  const boundary = slice.lastIndexOf(" ");
  return `${(boundary > 120 ? slice.slice(0, boundary) : slice).trimEnd()}…`;
}

export function resourcesFromSourceProject(project: SourceProject): ProjectResourceLink[] {
  const links: ProjectResourceLink[] = [];
  for (const [key, href] of Object.entries(project.externalLinks ?? {})) {
    if (typeof href === "string" && href) {
      links.push({ label: linkLabel(key), href });
    }
  }
  for (const [key, href] of Object.entries(project.sourceMediaLinks ?? {})) {
    if (key === "localMediaFilename") continue;
    if (typeof href === "string" && href.startsWith("http")) {
      const label = sourceMediaLabel(key);
      if (label) links.push({ label, href });
    }
  }
  return links;
}

function displayClientName(project: SourceProject) {
  const title = project.title;
  const dash = title.indexOf("—");
  if (dash > 0) return title.slice(0, dash).trim();
  return title;
}

/** Build verified client/scope block for a published slug from source JSON. */
export function buildClientInfoForSlug(slug: string): ProjectClientInfo | undefined {
  const ids = sourceIdsForSlug(slug);
  if (!ids.length) return undefined;

  const projects = ids
    .map((id) => projectsById.get(id))
    .filter((project): project is SourceProject => Boolean(project));
  if (!projects.length) return undefined;

  const primary = projects[0];
  const scope = projects
    .map((project) => project.details || project.summary)
    .filter(Boolean)
    .join(" ");

  const resources = projects.flatMap(resourcesFromSourceProject);
  const uniqueResources = resources.filter(
    (link, index, list) => list.findIndex((entry) => entry.href === link.href) === index,
  );

  const clientUrl =
    projects.map((project) => project.externalLinks?.clientWebsite).find(Boolean) ??
    projects.map((project) => project.externalLinks?.liveDemo).find(Boolean) ??
    undefined;

  const written = getReviewsForSlug(slug);
  const review = written[0]?.quote ?? undefined;

  return {
    clientName: projects.length > 1 ? projects.map(displayClientName).join(" · ") : displayClientName(primary),
    clientUrl: clientUrl || undefined,
    scope,
    review,
    resources: uniqueResources.length ? uniqueResources : undefined,
  };
}

export function summaryFromSourceForSlug(slug: string): string | undefined {
  const ids = sourceIdsForSlug(slug);
  const project = ids.map((id) => projectsById.get(id)).find(Boolean);
  return project?.summary;
}

export const reviewStats = {
  totalReviews: source.reviews.length,
  writtenReviews: source.reviews.filter((r) => r.hasWrittenReview && r.quote).length,
  ratingOnly: source.reviews.filter((r) => !r.hasWrittenReview || !r.quote).length,
  homepageFeatured: source.recommendedHomepageReviewIds.filter((id) => id !== "r25").length,
};

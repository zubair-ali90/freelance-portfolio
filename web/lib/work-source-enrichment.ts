import source from "../data/work_portfolio_source_data.json";
import { slugForSourceId, sourceIdsForSlug } from "./portfolio-map";

export type WorkSourceProject = (typeof source.projects)[number];

export type StoryBlock = {
  id?: string;
  type?: string;
  title?: string;
  body?: string;
  heading?: string;
  content?: string;
};

export type ProjectCaseEnrichment = {
  sourceIds: string[];
  cardExcerpt?: string;
  overview?: string;
  storyBlocks: Array<{ title: string; body: string }>;
  externalLinks: Record<string, string>;
  reviewIds: string[];
  taxonomyProposal?: unknown;
  status?: string;
};

const byId = new Map(source.projects.map((project) => [project.id, project]));

function asStoryBlocks(raw: unknown): Array<{ title: string; body: string }> {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((block, index) => {
      const item = block as StoryBlock;
      const title = String(item.title || item.heading || item.type || `Section ${index + 1}`).trim();
      const body = String(item.body || item.content || "").trim();
      if (!body) return null;
      return { title, body };
    })
    .filter((entry): entry is { title: string; body: string } => Boolean(entry));
}

export function getWorkSourceProject(id: string) {
  return byId.get(id);
}

export function getAllWorkSourceProjects() {
  return source.projects;
}

/** Enrich an existing published slug from supplemental source records (no duplicates). */
export function enrichProjectFromSource(slug: string): ProjectCaseEnrichment | null {
  const sourceIds = sourceIdsForSlug(slug);
  const matched = sourceIds
    .map((id) => byId.get(id))
    .filter((project): project is WorkSourceProject => Boolean(project));

  if (!matched.length) {
    // Title/id fallback for records not yet in portfolio-map
    const soft = source.projects.find((project) => slugForSourceId(project.id) === slug);
    if (!soft) return null;
    matched.push(soft);
    sourceIds.push(soft.id);
  }

  const primary = matched[0];
  const storyBlocks = matched.flatMap((project) => asStoryBlocks(project.storyBlocks));
  const externalLinks: Record<string, string> = {};
  for (const project of matched) {
    for (const [key, href] of Object.entries(project.externalLinks ?? {})) {
      if (typeof href === "string" && href) externalLinks[key] = href;
    }
  }
  const reviewIds = [...new Set(matched.flatMap((project) => project.reviewIds ?? []))];

  return {
    sourceIds,
    cardExcerpt: primary.cardExcerpt || undefined,
    overview: primary.overview || undefined,
    storyBlocks,
    externalLinks,
    reviewIds,
    taxonomyProposal: primary.taxonomyProposal,
    status: primary.status,
  };
}

export function buildMigrationDryRun() {
  const matchedExisting: Array<{ sourceId: string; slug: string; title: string }> = [];
  const candidateNewDraft: Array<{ sourceId: string; title: string; reason: string }> = [];
  const missingMedia: Array<{ sourceId: string; title: string }> = [];

  for (const project of source.projects) {
    const slug = slugForSourceId(project.id);
    if (slug) {
      matchedExisting.push({ sourceId: project.id, slug, title: project.title });
      continue;
    }
    if (
      project.status === "review_evidence_only" ||
      String(project.status).includes("media-pending")
    ) {
      missingMedia.push({ sourceId: project.id, title: project.title });
    } else {
      candidateNewDraft.push({
        sourceId: project.id,
        title: project.title,
        reason: project.status || "unmapped-source-record",
      });
    }
  }

  return {
    sourceProjectCount: source.projects.length,
    sourceReviewCount: source.reviews.length,
    matchedExisting,
    candidateNewDraft,
    missingMedia,
    foxMergeNote:
      "stylized-fox-vrm maps to existing unity-unity-character — do not create a second Fox Girl route.",
  };
}

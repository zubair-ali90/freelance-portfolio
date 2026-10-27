import type { Project } from "./content";
import {
  buildClientInfoForSlug,
  summaryFromSourceForSlug,
} from "./portfolio-reviews";
import { updatedProjectSlugs } from "./portfolio-map";

export type ProjectResourceLink = {
  label: string;
  href: string;
};

export type ProjectClientInfo = {
  clientName: string;
  clientUrl?: string;
  /** Long-form scope and deliverables from verified source records. */
  scope: string;
  /** Verified Upwork client quote when available — never invented. */
  review?: string;
  resources?: ProjectResourceLink[];
};

export function getProjectClientInfo(slug: string): ProjectClientInfo | undefined {
  return buildClientInfoForSlug(slug);
}

export function projectClientCredit(slug: string): string | undefined {
  return getProjectClientInfo(slug)?.clientName;
}

export function mergeProjectSummary(project: Project): Project {
  const fromSource = summaryFromSourceForSlug(project.slug);
  if (fromSource) {
    return { ...project, summary: fromSource };
  }
  const info = getProjectClientInfo(project.slug);
  if (!info) return project;
  const lead = info.scope.split(/(?<=[.!?])\s+/)[0]?.trim() ?? info.scope;
  if (!lead || lead.length < 24) return project;
  const summary = lead.length > 220 ? `${lead.slice(0, 217).trimEnd()}…` : lead;
  return { ...project, summary };
}

/** Slugs enriched from the verified portfolio import (for reporting). */
export const enrichedProjectSlugs = updatedProjectSlugs;

import type { Project, ProjectCategory } from "./content";
import { categoryGroups } from "./content";
import { mergeProjectSummary } from "./project-client-details";
import { readProjectOverrides, type ProjectOverride } from "./project-overrides";
import { decorateProjectCategory, getBaseProjects } from "./projects-base";
import { homeFeaturedCategoryOrder, readSiteConfig } from "./site-config";

export type AdminProjectRow = Project & { active: boolean };

function mergeOne(project: Project, override?: ProjectOverride): AdminProjectRow {
  const active = override?.active ?? true;
  const category = override?.category ?? project.category;
  const decorated = category === project.category ? project : decorateProjectCategory(project, category);
  return { ...decorated, active };
}

export async function getAdminProjectRows(): Promise<AdminProjectRow[]> {
  const { overrides } = await readProjectOverrides();
  return getBaseProjects().map((project) => mergeOne(project, overrides[project.slug]));
}

function publishRow({ active: _a, ...project }: AdminProjectRow): Project {
  return mergeProjectSummary(project);
}

export async function getPublishedProjects(): Promise<Project[]> {
  const rows = await getAdminProjectRows();
  return rows.filter((project) => project.active).map(publishRow);
}

export async function getPublishedProject(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug);
}

export function projectsByCategoryList(projects: Project[], category: ProjectCategory) {
  return projects.filter((project) => project.category === category);
}

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
  return {
    total: rows.length,
    active: active.length,
    hidden: rows.length - active.length,
    byCategory,
  };
}

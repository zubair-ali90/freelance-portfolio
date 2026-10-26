import type { Project, ProjectCategory } from "./content";
import { categoryGroups } from "./content";
import { readProjectOverrides, type ProjectOverride } from "./project-overrides";
import { decorateProjectCategory, getBaseProjects } from "./projects-base";

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

export async function getPublishedProjects(): Promise<Project[]> {
  const rows = await getAdminProjectRows();
  return rows.filter((project) => project.active).map(({ active: _a, ...project }) => project);
}

export async function getPublishedProject(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug);
}

export function projectsByCategoryList(projects: Project[], category: ProjectCategory) {
  return projects.filter((project) => project.category === category);
}

const featuredCategoryOrder: ProjectCategory[] = [
  "product-animation",
  "character",
  "lifestyle-renders",
  "exterior",
  "unreal",
  "unity",
];

export async function getFeaturedPublishedProjects(): Promise<Project[]> {
  const published = await getPublishedProjects();
  const picked: Project[] = [];
  for (const category of featuredCategoryOrder) {
    const match = published.find((project) => project.category === category);
    if (match) picked.push(match);
  }
  if (picked.length < 6) {
    for (const project of published) {
      if (picked.length >= 6) break;
      if (!picked.some((p) => p.slug === project.slug)) picked.push(project);
    }
  }
  return picked.slice(0, 6);
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

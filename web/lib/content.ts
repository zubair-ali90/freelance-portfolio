import projectsData from "./projects.json";

export type ProjectCategory = "3d" | "unreal" | "unity";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  folder: string;
  summary: string;
  cover: string;
  media: string[];
  year: string;
  role: string;
  services: string[];
  hue: string;
  accent: string;
  kind: "product" | "character" | "space" | "motion";
};

const categoryStyle: Record<
  ProjectCategory,
  { hue: string; accent: string; kind: Project["kind"] }
> = {
  "3d": { hue: "#1c2430", accent: "#e7b15a", kind: "product" },
  unreal: { hue: "#141820", accent: "#7b9cff", kind: "space" },
  unity: { hue: "#182018", accent: "#8fbf9f", kind: "motion" },
};

const raw = projectsData as Array<{
  category: ProjectCategory;
  slug: string;
  title: string;
  folder: string;
  summary: string;
  cover: string;
  media: string[];
}>;

export const projects: Project[] = raw.map((item) => {
  const style = categoryStyle[item.category];
  return {
    ...item,
    year: "2024–2026",
    role: "3D artist · lighting · animation",
    services: [item.category === "3d" ? "3D" : item.category === "unreal" ? "Unreal" : "Unity"],
    ...style,
  };
});

export const categoryOrder: { id: ProjectCategory; label: string }[] = [
  { id: "3d", label: "3D" },
  { id: "unreal", label: "Unreal" },
  { id: "unity", label: "Unity" },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function projectsByCategory(category: ProjectCategory) {
  return projects.filter((project) => project.category === category);
}

export const featuredProjects = projects.slice(0, 6);

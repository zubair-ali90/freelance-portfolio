import projectsData from "./projects.json";

export type ProjectCategory =
  | "product-animation"
  | "character"
  | "installation"
  | "explainer"
  | "product-renders"
  | "hero-renders"
  | "lifestyle-renders"
  | "standalone"
  | "interior-exterior"
  | "interior"
  | "exterior"
  | "arc-viz"
  | "unity"
  | "unreal";

export type ProjectKind = "product" | "character" | "space" | "motion";

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
  kind: ProjectKind;
};

type Leaf = { id: ProjectCategory; label: string; hue: string; accent: string; kind: ProjectKind };

export const categoryGroups: {
  id: string;
  label: string;
  sections: Leaf[];
}[] = [
  {
    id: "animation",
    label: "3D animation",
    sections: [
      { id: "product-animation", label: "Product animation", hue: "#1c2430", accent: "#e7b15a", kind: "motion" },
      { id: "character", label: "3D character development", hue: "#241820", accent: "#e07a9a", kind: "character" },
      { id: "installation", label: "Installation animation", hue: "#1a221c", accent: "#8fbf9f", kind: "motion" },
      { id: "explainer", label: "Product explainer", hue: "#201c16", accent: "#d4a574", kind: "motion" },
    ],
  },
  {
    id: "renders",
    label: "Renders",
    sections: [
      { id: "product-renders", label: "Product renders", hue: "#1c2430", accent: "#e7b15a", kind: "product" },
      { id: "hero-renders", label: "Hero renders", hue: "#141820", accent: "#c9a227", kind: "product" },
      { id: "lifestyle-renders", label: "Lifestyle renders", hue: "#221c18", accent: "#d08a6a", kind: "space" },
      { id: "standalone", label: "Standalone", hue: "#1a1c22", accent: "#9aa4b8", kind: "product" },
    ],
  },
  {
    id: "architectural",
    label: "Architectural",
    sections: [
      { id: "interior-exterior", label: "Interior exterior", hue: "#1a201c", accent: "#7d9a86", kind: "space" },
      { id: "interior", label: "Interior", hue: "#221c18", accent: "#c4a484", kind: "space" },
      { id: "exterior", label: "Exterior", hue: "#182018", accent: "#8fbf9f", kind: "space" },
      { id: "arc-viz", label: "Arc viz", hue: "#161c22", accent: "#7aa0b8", kind: "space" },
    ],
  },
  {
    id: "development",
    label: "Development",
    sections: [
      { id: "unity", label: "Unity", hue: "#182018", accent: "#8fbf9f", kind: "motion" },
      { id: "unreal", label: "Unreal", hue: "#141820", accent: "#7b9cff", kind: "space" },
    ],
  },
];

export const categoryOrder: Leaf[] = categoryGroups.flatMap((group) => group.sections);

const leafById = Object.fromEntries(categoryOrder.map((leaf) => [leaf.id, leaf])) as Record<
  ProjectCategory,
  Leaf
>;

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
  const leaf = leafById[item.category];
  const group = categoryGroups.find((entry) => entry.sections.some((section) => section.id === item.category));
  return {
    ...item,
    year: "2024–2026",
    role: "3D artist · lighting · animation",
    services: [group?.label ?? "Work", leaf?.label ?? item.category],
    hue: leaf?.hue ?? "#1c2430",
    accent: leaf?.accent ?? "#e7b15a",
    kind: leaf?.kind ?? "product",
  };
});

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function projectsByCategory(category: ProjectCategory) {
  return projects.filter((project) => project.category === category);
}

export function categoryLabel(category: ProjectCategory) {
  return leafById[category]?.label ?? category;
}

const featuredIds: ProjectCategory[] = [
  "product-animation",
  "character",
  "lifestyle-renders",
  "exterior",
  "unreal",
  "unity",
];

export const featuredProjects = featuredIds
  .map((id) => projects.find((project) => project.category === id))
  .filter((project): project is Project => Boolean(project));

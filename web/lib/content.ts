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
    label: "3D",
    sections: [
      { id: "product-animation", label: "Product Animation", hue: "#1c2430", accent: "#e7b15a", kind: "motion" },
      { id: "character", label: "Character Art & Game Assets", hue: "#241820", accent: "#e07a9a", kind: "character" },
      { id: "installation", label: "Installation Animation", hue: "#1a221c", accent: "#8fbf9f", kind: "motion" },
      { id: "explainer", label: "Product Explainer", hue: "#201c16", accent: "#d4a574", kind: "motion" },
    ],
  },
  {
    id: "renders",
    label: "Renders",
    sections: [
      { id: "product-renders", label: "Product Renders", hue: "#1c2430", accent: "#e7b15a", kind: "product" },
      { id: "hero-renders", label: "Hero Renders", hue: "#141820", accent: "#c9a227", kind: "product" },
      { id: "lifestyle-renders", label: "Lifestyle Renders", hue: "#221c18", accent: "#d08a6a", kind: "space" },
      { id: "standalone", label: "Standalone", hue: "#1a1c22", accent: "#9aa4b8", kind: "product" },
    ],
  },
  {
    id: "architectural",
    label: "Architectural",
    sections: [
      { id: "interior-exterior", label: "Interior & Exterior", hue: "#1a201c", accent: "#7d9a86", kind: "space" },
      { id: "interior", label: "Interior", hue: "#221c18", accent: "#c4a484", kind: "space" },
      { id: "exterior", label: "Exterior", hue: "#182018", accent: "#8fbf9f", kind: "space" },
      { id: "arc-viz", label: "Arch Viz", hue: "#161c22", accent: "#7aa0b8", kind: "space" },
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

/** Display parent for leaf categories (stable IDs unchanged). */
export function categoryGroupFor(category: ProjectCategory) {
  return categoryGroups.find((group) => group.sections.some((section) => section.id === category));
}

export const categoryOrder: Leaf[] = categoryGroups.flatMap((group) => group.sections);

export function categoryLabel(category: ProjectCategory) {
  return categoryOrder.find((leaf) => leaf.id === category)?.label ?? category;
}

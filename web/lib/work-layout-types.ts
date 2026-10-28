import type { ProjectCategory, ProjectKind } from "./content";

/** Client-safe layout type (no Node/fs imports). */
export type ResolvedWorkGroup = {
  id: string;
  label: string;
  sections: {
    id: ProjectCategory;
    label: string;
    hue: string;
    accent: string;
    kind: ProjectKind;
  }[];
};

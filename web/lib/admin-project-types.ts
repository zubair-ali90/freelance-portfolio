import type { Project } from "./content";

export type AdminProjectRow = Project & {
  active: boolean;
  /** null = automatic review mapping; string[] = explicit selection (may be empty). */
  reviewIds: string[] | null;
};

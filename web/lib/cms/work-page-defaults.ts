import { UPWORK_PROFILE_URL } from "@/lib/site-links";
import type { ProjectCategory } from "@/lib/content";

export type WorkCategoryMeta = {
  description: string;
  leadProjectSlug: string;
};

export type WorkPageStore = {
  eyebrow: string;
  headline: string;
  introduction: string;
  exploreLabel: string;
  searchPlaceholder: string;
  emptyText: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  showLeadProject: boolean;
  /** Independent project rank per leaf category (slug order). */
  projectOrder: Partial<Record<ProjectCategory, string[]>>;
  /** Per root-group intro copy (animation | renders | architectural | development). */
  groupIntros: Record<string, string>;
  /** Per leaf category lead + description. */
  categoryMeta: Partial<Record<ProjectCategory, WorkCategoryMeta>>;
};

export function buildDefaultWorkPage(): WorkPageStore {
  return {
    eyebrow: "SELECTED & COMPLETE WORK",
    headline: "Work, made to be experienced.",
    introduction:
      "Explore 3D animation, product imagery, architectural visualization, and interactive development. Every project is a different way of making an idea clearer, more engaging, or easier to explore.",
    exploreLabel: "EXPLORE BY DISCIPLINE",
    searchPlaceholder: "Search projects, clients, or skills",
    emptyText: "No projects match these filters. Try a different category or search.",
    ctaHeading: "Have something similar in mind?",
    ctaDescription:
      "From a product visualization to an interactive experience, I can help turn your brief into a project worth exploring.",
    ctaPrimaryLabel: "Hire Me on Upwork",
    ctaPrimaryHref: UPWORK_PROFILE_URL,
    ctaSecondaryLabel: "Back to All Work",
    showLeadProject: true,
    projectOrder: {},
    groupIntros: {
      animation: "From the first shape to the final frame. Character work, product animation, technical storytelling, and game-ready assets built with attention to form and motion.",
      renders:
        "Every surface has a story. Carefully composed CGI images for products, campaigns, and visual presentations, where lighting and material detail matter.",
      architectural:
        "Spaces before they exist. Interior, exterior, and spatial visualizations that help people understand a place, explore options, and imagine the result.",
      development:
        "Beyond looking. Into interacting. Unity, Unreal, AR/VR, and browser-based experiences that let users play, explore, configure, and learn.",
    },
    categoryMeta: {},
  };
}

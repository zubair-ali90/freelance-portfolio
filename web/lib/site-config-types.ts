import type { ProjectCategory } from "./content";
import type { GlobalSiteSettings, HomepageStore, PagesStore } from "./cms/homepage-defaults";
import type { WorkPageStore } from "./cms/work-page-defaults";
import type { ModelViewerEnvironment } from "./model-viewer";
import type { ViewerAnimationLoop } from "./viewer-animation";

export type OrderedToggle<T extends string = string> = {
  id: T;
  enabled: boolean;
};

export type SiteConfigStore = {
  version: 2;
  homeFeatured: OrderedToggle<ProjectCategory>[];
  maxHomeFeatured: number;
  workGroups: OrderedToggle<string>[];
  workSections: OrderedToggle<ProjectCategory>[];
  viewerModelSrc: string;
  viewerBackgroundColor: string;
  viewerEnvironmentPreset: ModelViewerEnvironment;
  viewerHdriSrc: string;
  viewerBackdrop: "solid" | "environment";
  viewerAnimationLoop: ViewerAnimationLoop;
  viewerAutoPlayAnimation: boolean;
  homepage: HomepageStore;
  pages: PagesStore;
  workPage: WorkPageStore;
  reviews: { hiddenIds: string[] };
  global: GlobalSiteSettings;
  updatedAt?: string;
};

export type { ResolvedWorkGroup } from "./work-layout-types";

"use client";

import type { Project } from "@/lib/content";
import {
  featuredChaptersCopy,
  expertiseItems,
  HERO_FALLBACK_MEDIA,
} from "@/lib/homepage-content";
import { getHomepageReviews } from "@/lib/portfolio-reviews";
import { AboutTeaser } from "./AboutTeaser";
import { ExpertiseSection } from "./ExpertiseSection";
import { FeaturedWorkStage, type FeaturedChapter } from "./FeaturedWorkStage";
import { FinalCta } from "./FinalCta";
import { HomeHero } from "./HomeHero";
import { ProcessSection } from "./ProcessSection";
import { TrustSection } from "./TrustSection";

export function HomeExperience({ projects }: { projects: Project[] }) {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));

  const chapters: FeaturedChapter[] = featuredChaptersCopy
    .map((copy) => {
      const project = bySlug.get(copy.slug);
      if (!project) return null;
      return { ...copy, project };
    })
    .filter((entry): entry is FeaturedChapter => Boolean(entry));

  const heroSrc =
    bySlug.get("product-animation-cars")?.cover ??
    bySlug.get("hero-renders-cgi")?.cover ??
    chapters[0]?.project.cover ??
    HERO_FALLBACK_MEDIA;

  const mediaBySlug: Record<string, Project | undefined> = {};
  for (const item of expertiseItems) {
    mediaBySlug[item.mediaSlug] = bySlug.get(item.mediaSlug);
  }

  const homepageReviews = getHomepageReviews();

  return (
    <div className="home-xp">
      <HomeHero mediaSrc={heroSrc} />
      <FeaturedWorkStage chapters={chapters} />
      <ExpertiseSection mediaBySlug={mediaBySlug} />
      <ProcessSection />
      <TrustSection reviews={homepageReviews} />
      <FinalCta />
      <AboutTeaser />
    </div>
  );
}

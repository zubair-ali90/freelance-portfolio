"use client";

import type { Project } from "@/lib/content";
import type { HomepageStore } from "@/lib/cms/homepage-defaults";
import type { PortfolioReview } from "@/lib/portfolio-reviews";
import { HERO_FALLBACK_MEDIA } from "@/lib/homepage-content";
import { AboutTeaser } from "./AboutTeaser";
import { ExpertiseSection } from "./ExpertiseSection";
import { FeaturedWorkStage, type FeaturedChapter } from "./FeaturedWorkStage";
import { FinalCta } from "./FinalCta";
import { HomeHero } from "./HomeHero";
import { ProcessSection } from "./ProcessSection";
import { TrustSection } from "./TrustSection";

export function HomeExperience({
  projects,
  homepage,
  reviews,
}: {
  projects: Project[];
  homepage: HomepageStore;
  reviews: PortfolioReview[];
}) {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));

  const chapters: FeaturedChapter[] = [];
  for (const copy of homepage.featuredProjects) {
    if (!copy.enabled) continue;
    const project = bySlug.get(copy.slug);
    if (!project) continue;
    chapters.push({
      slug: copy.slug,
      clientLabel: copy.clientLabel,
      headline: copy.headline,
      body: copy.body,
      cta: copy.cta,
      mediaSrc: copy.mediaSrc || undefined,
      project,
    });
  }

  const heroSrc =
    homepage.hero.mediaSrc ||
    bySlug.get("product-animation-cars")?.cover ||
    bySlug.get("hero-renders-cgi")?.cover ||
    chapters[0]?.project.cover ||
    HERO_FALLBACK_MEDIA;

  const expertiseItems = homepage.expertise.items.filter((item) => item.enabled);
  const mediaBySlug: Record<string, Project | undefined> = {};
  for (const item of expertiseItems) {
    mediaBySlug[item.mediaSlug] = bySlug.get(item.mediaSlug);
  }

  return (
    <div className="home-xp">
      <HomeHero mediaSrc={heroSrc} content={homepage.hero} />
      <FeaturedWorkStage chapters={chapters} />
      <ExpertiseSection
        mediaBySlug={mediaBySlug}
        eyebrow={homepage.expertise.eyebrow}
        title={homepage.expertise.title}
        description={homepage.expertise.description}
        items={expertiseItems}
      />
      <ProcessSection
        eyebrow={homepage.process.eyebrow}
        title={homepage.process.title}
        description={homepage.process.description}
        steps={homepage.process.steps.filter((step) => step.enabled)}
      />
      {homepage.trust.enabled && (
        <TrustSection
          reviews={reviews}
          eyebrow={homepage.trust.eyebrow}
          title={homepage.trust.title}
          description={homepage.trust.description}
          support={homepage.trust.support}
        />
      )}
      <FinalCta content={homepage.finalCta} />
      <AboutTeaser content={homepage.about} />
    </div>
  );
}

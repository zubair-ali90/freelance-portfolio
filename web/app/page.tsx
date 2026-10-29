import type { Metadata } from "next";
import { HomeExperience } from "@/components/home/HomeExperience";
import {
  hiddenMediaSet,
  readMediaVisibility,
  sanitizeHomepageMediaSrcs,
} from "@/lib/media-visibility";
import { getHomepageReviews } from "@/lib/portfolio-reviews";
import { getPublishedProjects } from "@/lib/published-projects";
import { readSiteConfig } from "@/lib/site-config";
import "./home-experience.css";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const config = await readSiteConfig();
  return {
    title: config.global.siteTitle || "Zubair Ali | 3D Artist & Interactive Developer",
    description:
      "Freelance 3D artist and interactive developer — product CGI, character animation, immersive spaces, configurators, and AR. Hire on Upwork.",
  };
}

export default async function HomePage() {
  const [projects, config, visibility] = await Promise.all([
    getPublishedProjects(),
    readSiteConfig(),
    readMediaVisibility(),
  ]);
  const reviews = getHomepageReviews(config.homepage.trust.reviewIds, config.reviews.hiddenIds);
  const homepage = sanitizeHomepageMediaSrcs(config.homepage, hiddenMediaSet(visibility));

  return (
    <main>
      <HomeExperience projects={projects} homepage={homepage} reviews={reviews} />
    </main>
  );
}

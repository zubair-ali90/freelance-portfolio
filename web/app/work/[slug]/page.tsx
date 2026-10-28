import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CaseStudyLinks,
  CaseStudyStory,
  RelatedProjects,
} from "@/components/CaseStudySections";
import { ProjectClientBlock } from "@/components/ProjectClientBlock";
import { ProjectDetailView } from "@/components/ProjectDetailView";
import { ProjectReviews } from "@/components/ProjectReviews";
import { UpworkHireLink } from "@/components/UpworkHireLink";
import { categoryGroupFor, categoryLabel } from "@/lib/content";
import { getProjectClientInfo } from "@/lib/project-client-details";
import { getRatingOnlyForSlug, getReviewsForSlug } from "@/lib/portfolio-reviews";
import { getPublishedProject, getPublishedProjects } from "@/lib/published-projects";
import { projectsByCategoryList } from "@/lib/project-ordering";
import { enrichProjectFromSource } from "@/lib/work-source-enrichment";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  return { title: project ? `${project.title} | Zubair` : "Work" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, allProjects, config] = await Promise.all([
    getPublishedProject(slug),
    getPublishedProjects(),
    readSiteConfig(),
  ]);
  if (!project) notFound();

  const sectionLabel = categoryLabel(project.category);
  const group = categoryGroupFor(project.category);
  const clientInfo = getProjectClientInfo(slug);
  const reviews = getReviewsForSlug(slug);
  const ratingOnly = getRatingOnlyForSlug(slug);
  const enrichment = enrichProjectFromSource(slug);
  const summary = enrichment?.cardExcerpt || enrichment?.overview || project.summary;
  const related = projectsByCategoryList(
    allProjects,
    project.category,
    config.workPage.projectOrder[project.category],
  );

  return (
    <main>
      <section className="section cream case-study-top">
        <div className="wrap wrap-wide">
          <nav className="case-study-breadcrumb" aria-label="Breadcrumb">
            <Link href="/work">Work</Link>
            <span aria-hidden>/</span>
            {group && (
              <>
                <Link href={`/work#${group.id}`}>{group.label}</Link>
                <span aria-hidden>/</span>
              </>
            )}
            <Link href={`/work#${project.category}`}>{sectionLabel}</Link>
            <span aria-hidden>/</span>
            <span>{project.title}</span>
          </nav>
        </div>

        <ProjectDetailView
          project={project}
          sidebar={
            <div className="project-copy">
              <p className="kicker">
                {group?.label ?? "Work"} / {sectionLabel}
              </p>
              <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", marginTop: 12 }}>{project.title}</h1>
              <p style={{ marginTop: 16 }}>{summary}</p>
              <p className="meta">MY ROLE · {project.role}</p>
              <div className="chips">
                {project.services.map((service) => (
                  <span key={service} className="chip">
                    {service}
                  </span>
                ))}
              </div>
              <CaseStudyLinks enrichment={enrichment} />
              <div className="hero-actions" style={{ justifyContent: "flex-start" }}>
                <UpworkHireLink className="pill solid">Hire Me on Upwork</UpworkHireLink>
                <Link className="pill" href={`/work#${project.category}`}>
                  Back to {sectionLabel}
                </Link>
              </div>
            </div>
          }
          galleryLabel="A CLOSER LOOK"
        />
      </section>

      <CaseStudyStory enrichment={enrichment} />

      {clientInfo && (
        <section className="section paper">
          <div className="wrap wrap-wide">
            <ProjectClientBlock info={clientInfo} />
          </div>
        </section>
      )}

      {(reviews.length > 0 || ratingOnly.length > 0) && (
        <section className="section cream">
          <div className="wrap wrap-wide">
            <p className="kicker">WORDS FROM THE CLIENT</p>
            <ProjectReviews reviews={reviews} ratingOnly={ratingOnly} />
          </div>
        </section>
      )}

      <RelatedProjects current={project} related={related} />

      <section className="section paper">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
            Have a project like this in mind?
          </h2>
          <p style={{ maxWidth: 520, margin: "12px auto 24px" }}>
            Let&apos;s discuss how to bring it to life.
          </p>
          <UpworkHireLink className="pill solid">Hire Me on Upwork</UpworkHireLink>
        </div>
      </section>
    </main>
  );
}

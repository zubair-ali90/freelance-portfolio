import Link from "next/link";
import type { Project } from "@/lib/content";
import type { ProjectCaseEnrichment } from "@/lib/work-source-enrichment";
import { ProjectMedia } from "@/components/ProjectMedia";
import { isVideo } from "@/lib/media";

export function CaseStudyStory({
  enrichment,
}: {
  enrichment: ProjectCaseEnrichment | null;
}) {
  if (!enrichment) return null;
  const overview = enrichment.overview?.trim();
  const blocks = enrichment.storyBlocks.filter((block) => block.body.trim());
  if (!overview && !blocks.length) return null;

  return (
    <section className="section paper">
      <div className="wrap wrap-wide case-study-story">
        <p className="kicker">BEHIND THE WORK</p>
        {overview && <p className="case-study-overview">{overview}</p>}
        {blocks.length > 0 && (
          <div className="case-study-blocks">
            {blocks.map((block) => (
              <article key={`${block.title}-${block.body.slice(0, 24)}`}>
                <h3>{block.title}</h3>
                <p>{block.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function CaseStudyLinks({ enrichment }: { enrichment: ProjectCaseEnrichment | null }) {
  if (!enrichment) return null;
  const links = Object.entries(enrichment.externalLinks).filter(([, href]) => Boolean(href));
  if (!links.length) return null;

  const labels: Record<string, string> = {
    clientWebsite: "Client website",
    liveDemo: "Open live demo",
    productPage: "Product page",
    googlePlay: "Google Play",
    appStore: "App Store",
    blueBirdConfigurator: "Blue Bird configurator",
  };

  return (
    <div className="case-study-links">
      {links.map(([key, href]) => (
        <a key={key} className="pill" href={href} target="_blank" rel="noopener noreferrer">
          {labels[key] ?? key}
        </a>
      ))}
    </div>
  );
}

export function RelatedProjects({
  current,
  related,
}: {
  current: Project;
  related: Project[];
}) {
  const items = related.filter((project) => project.slug !== current.slug).slice(0, 4);
  if (!items.length) return null;

  return (
    <section className="section cream">
      <div className="wrap wrap-wide">
        <p className="kicker">EXPLORE MORE WORK</p>
        <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 40px)", marginBottom: 24 }}>
          Related projects
        </h2>
        <div className="card-grid">
          {items.map((project) => (
            <Link key={project.slug} href={`/work/${project.slug}`} className="project-card">
              <div className="poster media-cover">
                <div className="media-frame media-frame-card">
                  <ProjectMedia
                    src={project.cover}
                    title={project.title}
                    variant="preview"
                    className="card-media"
                  />
                </div>
                {isVideo(project.cover) && <span className="media-badge">video</span>}
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

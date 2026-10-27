import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectClientBlock } from "@/components/ProjectClientBlock";
import { ProjectDetailView } from "@/components/ProjectDetailView";
import { UpworkHireLink } from "@/components/UpworkHireLink";
import { categoryLabel } from "@/lib/content";
import { getProjectClientInfo } from "@/lib/project-client-details";
import { getPublishedProject } from "@/lib/published-projects";

export const instant = false;

export async function generateStaticParams() {
  const { getPublishedProjects } = await import("@/lib/published-projects");
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
  const project = await getPublishedProject(slug);
  if (!project) notFound();

  const sectionLabel = categoryLabel(project.category);
  const clientInfo = getProjectClientInfo(slug);

  return (
    <main>
      <section className="section cream">
        <ProjectDetailView
          project={project}
          sidebar={
            <div className="project-copy">
              <p className="kicker">
                {sectionLabel} · {project.folder}
              </p>
              <h1 style={{ fontSize: "clamp(42px, 6vw, 72px)", marginTop: 12 }}>{project.title}</h1>
              <p style={{ marginTop: 16 }}>{project.summary}</p>
              <p className="meta">Role: {project.role}</p>
              <div className="chips">
                {project.services.map((service) => (
                  <span key={service} className="chip">
                    {service}
                  </span>
                ))}
              </div>
              <div className="hero-actions" style={{ justifyContent: "flex-start" }}>
                <UpworkHireLink className="pill solid">hire for similar work</UpworkHireLink>
                <Link className="pill" href={`/work#${project.category}`}>
                  back to {sectionLabel}
                </Link>
              </div>
            </div>
          }
        />
      </section>
      {clientInfo && (
        <section className="section paper">
          <div className="wrap wrap-wide">
            <ProjectClientBlock info={clientInfo} />
          </div>
        </section>
      )}
    </main>
  );
}

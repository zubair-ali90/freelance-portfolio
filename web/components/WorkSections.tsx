import Link from "next/link";
import { categoryOrder, projectsByCategory } from "@/lib/content";
import { ProjectCover } from "@/components/ProjectMedia";

export function WorkSections({ compact = false }: { compact?: boolean }) {
  return (
    <>
      {categoryOrder.map((section) => {
        const items = projectsByCategory(section.id);
        if (!items.length) return null;

        return (
          <section key={section.id} className="section paper" id={section.id}>
            <div className="wrap">
              <p className="kicker">[ {section.label} ]</p>
              <h2 className="manifesto">{section.label} projects.</h2>
              <div className="card-grid">
                {items.map((project) => (
                  <Link key={project.slug} href={`/work/${project.slug}`} className="project-card">
                    <ProjectCover project={project} />
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <p className="meta">{project.media.length} files</p>
                  </Link>
                ))}
              </div>
              {!compact && (
                <p className="meta" style={{ marginTop: 20 }}>
                  {items.length} folders in Assets/{section.id === "unity" ? "Untiy" : section.id === "3d" ? "3D" : "Unreal"}
                </p>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

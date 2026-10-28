import Link from "next/link";
import type { Project, ProjectCategory } from "@/lib/content";
import type { ResolvedWorkGroup } from "@/lib/work-layout-types";
import { ProjectCover } from "@/components/ProjectMedia";
import { projectsByCategoryList } from "@/lib/project-ordering";

export function WorkSections({
  projects,
  layout,
  clientCredits = {},
}: {
  projects: Project[];
  layout: ResolvedWorkGroup[];
  clientCredits?: Record<string, string>;
}) {
  return (
    <>
      {layout.map((group) => (
        <section key={group.id} className="section paper" id={group.id}>
          <div className="wrap wrap-wide">
            <p className="kicker">[ {group.label} ]</p>
            {group.sections.map((section) => {
              const items = projectsByCategoryList(projects, section.id as ProjectCategory);
              if (!items.length) return null;
              return (
                <div key={section.id} id={section.id} className="category-leaf">
                  <h2 className="category-title">
                    {section.label}
                    <span>{items.length}</span>
                  </h2>
                  <div className="card-grid">
                    {items.map((project) => (
                      <Link key={project.slug} href={`/work/${project.slug}`} className="project-card">
                        <ProjectCover project={project} />
                        <h3>{project.title}</h3>
                        {clientCredits[project.slug] && (
                          <p className="meta">{clientCredits[project.slug]}</p>
                        )}
                        <p>{project.summary}</p>
                        <p className="meta">{project.media.length} files</p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

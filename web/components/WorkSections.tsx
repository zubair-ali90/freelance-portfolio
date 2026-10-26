import Link from "next/link";
import type { Project, ProjectCategory } from "@/lib/content";
import { categoryGroups } from "@/lib/content";
import { ProjectCover } from "@/components/ProjectMedia";
import { projectsByCategoryList } from "@/lib/published-projects";

export function WorkSections({ projects }: { projects: Project[] }) {
  return (
    <>
      {categoryGroups.map((group) => {
        const sections = group.sections
          .map((section) => ({
            section,
            items: projectsByCategoryList(projects, section.id as ProjectCategory),
          }))
          .filter((entry) => entry.items.length > 0);
        if (!sections.length) return null;

        return (
          <section key={group.id} className="section paper" id={group.id}>
            <div className="wrap wrap-wide">
              <p className="kicker">[ {group.label} ]</p>
              {sections.map(({ section, items }) => (
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
                        <p>{project.summary}</p>
                        <p className="meta">{project.media.length} files</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

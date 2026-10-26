import Link from "next/link";
import { projectsByCategoryList, getPublishedProjects, getWorkPageLayout } from "@/lib/published-projects";
import { WorkSections } from "@/components/WorkSections";

export const instant = false;

export const metadata = { title: "Work | Zubair" };

export default async function WorkPage() {
  const [projects, layout] = await Promise.all([getPublishedProjects(), getWorkPageLayout()]);

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">selected work</p>
          <h1>projects.</h1>
          <p>{projects.length} projects across 3D animation, renders, architectural, and development.</p>
          <div className="chips" style={{ marginTop: 18 }}>
            {layout.map((group) => {
              const count = group.sections.reduce(
                (total, section) => total + projectsByCategoryList(projects, section.id).length,
                0,
              );
              if (!count) return null;
              return (
                <Link key={group.id} className="chip" href={`#${group.id}`}>
                  {group.label} ({count})
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <WorkSections projects={projects} layout={layout} />
    </main>
  );
}

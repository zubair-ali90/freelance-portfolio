import Link from "next/link";
import { categoryGroups, projects, projectsByCategory } from "@/lib/content";
import { WorkSections } from "@/components/WorkSections";

export const metadata = { title: "Work | Zubair" };

export default function WorkPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">selected work</p>
          <h1>projects.</h1>
          <p>
            {projects.length} projects across 3D animation, renders, architectural, and development.
          </p>
          <div className="chips" style={{ marginTop: 18 }}>
            {categoryGroups.map((group) => {
              const count = group.sections.reduce(
                (total, section) => total + projectsByCategory(section.id).length,
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
      <WorkSections />
    </main>
  );
}

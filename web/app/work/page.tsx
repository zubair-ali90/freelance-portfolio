import Link from "next/link";
import { categoryOrder, projects, projectsByCategory } from "@/lib/content";
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
            Pulled from your <code>Assets</code> folder — {projects.length} projects across 3D, Unreal, and Unity.
          </p>
          <div className="chips" style={{ marginTop: 18 }}>
            {categoryOrder.map((section) => (
              <Link key={section.id} className="chip" href={`#${section.id}`}>
                {section.label} ({projectsByCategory(section.id).length})
              </Link>
            ))}
          </div>
        </div>
      </section>
      <WorkSections />
    </main>
  );
}

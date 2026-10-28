import { WorkGallery } from "@/components/WorkGallery";
import { projectClientCredit } from "@/lib/project-client-details";
import { getPublishedProjects, getWorkPageLayout } from "@/lib/published-projects";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Work | Zubair" };

export default async function WorkPage() {
  const [projects, layout, config] = await Promise.all([
    getPublishedProjects(),
    getWorkPageLayout(),
    readSiteConfig(),
  ]);

  const clientCredits: Record<string, string> = {};
  for (const project of projects) {
    const credit = projectClientCredit(project.slug);
    if (credit) clientCredits[project.slug] = credit;
  }

  return (
    <main>
      <WorkGallery
        projects={projects}
        layout={layout}
        workPage={config.workPage}
        clientCredits={clientCredits}
      />
    </main>
  );
}

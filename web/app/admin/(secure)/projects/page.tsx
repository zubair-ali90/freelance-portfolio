import { ProjectManager } from "@/components/admin/ProjectManager";
import { readMediaVisibility } from "@/lib/media-visibility";
import { getAdminProjectRows } from "@/lib/published-projects";
import { getWrittenReviews } from "@/lib/portfolio-reviews";

export const instant = false;

export const metadata = { title: "Projects | Admin" };

export default async function AdminProjectsPage() {
  const [projects, written, visibility] = await Promise.all([
    getAdminProjectRows(),
    Promise.resolve(getWrittenReviews()),
    readMediaVisibility(),
  ]);
  const reviews = written.map((review) => ({
    id: review.id,
    contractTitle: review.contractTitle,
    quote: review.quote ?? "",
    rating: review.rating,
    projectSlug: review.projectSlug,
  }));

  return (
    <ProjectManager
      initialProjects={projects}
      initialReviews={reviews}
      initialHiddenMedia={visibility.hidden}
    />
  );
}

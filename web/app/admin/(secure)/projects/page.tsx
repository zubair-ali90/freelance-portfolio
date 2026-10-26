import { ProjectManager } from "@/components/admin/ProjectManager";
import { getAdminProjectRows } from "@/lib/published-projects";

export const metadata = { title: "Projects | Admin" };

export default async function AdminProjectsPage() {
  const projects = await getAdminProjectRows();

  return <ProjectManager initialProjects={projects} />;
}

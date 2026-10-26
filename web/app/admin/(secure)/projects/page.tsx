import { ProjectManager } from "@/components/admin/ProjectManager";

export const instant = false;

export const metadata = { title: "Projects | Admin" };

export default function AdminProjectsPage() {
  return <ProjectManager />;
}

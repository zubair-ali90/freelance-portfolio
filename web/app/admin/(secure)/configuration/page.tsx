import { SiteConfigManager } from "@/components/admin/SiteConfigManager";
import { getAdminProjectRows } from "@/lib/published-projects";
import { readEditableSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "My Work Configuration | Admin" };

export default async function AdminConfigurationPage() {
  const [{ config }, rows] = await Promise.all([readEditableSiteConfig(), getAdminProjectRows()]);
  const projects = rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    category: row.category,
    active: row.active,
  }));

  return <SiteConfigManager initialConfig={config} projects={projects} />;
}

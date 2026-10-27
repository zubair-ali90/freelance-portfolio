import { HomepageConfigManager } from "@/components/admin/HomepageConfigManager";
import { getAdminProjectRows } from "@/lib/published-projects";
import { readEditableSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Homepage | Admin" };

export default async function AdminHomepagePage() {
  const [{ config }, rows] = await Promise.all([readEditableSiteConfig(), getAdminProjectRows()]);
  const projects = rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    cover: row.cover,
    active: row.active,
  }));

  return <HomepageConfigManager initialConfig={config} projects={projects} />;
}

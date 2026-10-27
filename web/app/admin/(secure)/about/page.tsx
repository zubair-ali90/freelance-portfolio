import { PageConfigManager } from "@/components/admin/PageConfigManager";
import { readEditableSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "About | Admin" };

export default async function AdminAboutPage() {
  const { config } = await readEditableSiteConfig();
  return (
    <PageConfigManager
      page="about"
      title="About page"
      description="Edit biography and positioning copy for /about. Placeholder wording is flagged for editorial review."
      initialConfig={config}
    />
  );
}

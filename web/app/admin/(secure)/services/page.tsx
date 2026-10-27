import { PageConfigManager } from "@/components/admin/PageConfigManager";
import { readEditableSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Services | Admin" };

export default async function AdminServicesPage() {
  const { config } = await readEditableSiteConfig();
  return (
    <PageConfigManager
      page="services"
      title="Services page"
      description="Manage service offers shown on /services without changing public visual design."
      initialConfig={config}
    />
  );
}

import { SiteConfigManager } from "@/components/admin/SiteConfigManager";
import { readSiteConfig } from "@/lib/site-config";

export const metadata = { title: "Configuration | Admin" };

export default async function AdminConfigurationPage() {
  const config = await readSiteConfig();

  return <SiteConfigManager initialConfig={config} />;
}

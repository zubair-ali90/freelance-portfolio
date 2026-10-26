import { AdminShell } from "@/components/admin/AdminShell";
import { SiteConfigManager } from "@/components/admin/SiteConfigManager";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Configuration | Admin" };

export default async function AdminConfigurationPage() {
  const config = await readSiteConfig();

  return (
    <AdminShell>
      <SiteConfigManager initialConfig={config} />
    </AdminShell>
  );
}

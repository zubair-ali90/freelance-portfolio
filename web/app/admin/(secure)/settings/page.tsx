import { GlobalSettingsManager } from "@/components/admin/GlobalSettingsManager";
import { readEditableSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Global Settings | Admin" };

export default async function AdminSettingsPage() {
  const { config } = await readEditableSiteConfig();
  return <GlobalSettingsManager initialConfig={config} />;
}

import { SiteConfigManager } from "@/components/admin/SiteConfigManager";

export const instant = false;

export const metadata = { title: "Configuration | Admin" };

export default function AdminConfigurationPage() {
  return <SiteConfigManager />;
}

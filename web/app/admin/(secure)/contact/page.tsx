import { PageConfigManager } from "@/components/admin/PageConfigManager";
import { readEditableSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = { title: "Contact | Admin" };

export default async function AdminContactPage() {
  const { config } = await readEditableSiteConfig();
  return (
    <PageConfigManager
      page="contact"
      title="Contact page"
      description="Edit contact copy and form messaging. The public note must stay truthful until email delivery exists."
      initialConfig={config}
    />
  );
}

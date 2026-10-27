import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { isAdminSession } from "@/lib/admin-auth";
import { readSiteConfigDraft } from "@/lib/site-config";

export const instant = false;

export default async function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminSession())) {
    redirect("/admin");
  }
  const draft = await readSiteConfigDraft();
  return <AdminShell hasDraft={Boolean(draft)}>{children}</AdminShell>;
}

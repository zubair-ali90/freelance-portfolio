import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";

export const instant = false;

export default async function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminSession())) {
    redirect("/admin");
  }
  return children;
}

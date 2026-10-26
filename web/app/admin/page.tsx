import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminSession } from "@/lib/admin-auth";

export const instant = false;

export const metadata = { title: "Admin | Zubair" };

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="admin-login-page">
      <Suspense fallback={<p className="meta">Loading…</p>}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}

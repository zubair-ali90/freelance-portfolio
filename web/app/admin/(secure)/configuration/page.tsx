import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Configuration | Admin" };

export default function AdminConfigurationPage() {
  return (
    <AdminShell>
      <div className="admin-panel">
        <h1>Configuration</h1>
        <p className="meta">Site-wide settings will live here in a future update.</p>
      </div>
    </AdminShell>
  );
}

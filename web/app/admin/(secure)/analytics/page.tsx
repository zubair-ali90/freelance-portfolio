import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Analytics | Admin" };

export default function AdminAnalyticsPage() {
  return (
    <AdminShell>
      <div className="admin-panel">
        <h1>Analytics</h1>
        <p className="meta">Traffic and engagement metrics will be added here later.</p>
      </div>
    </AdminShell>
  );
}

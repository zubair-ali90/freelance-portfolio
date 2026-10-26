import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryOverviewGrid } from "@/components/admin/CategoryOverviewGrid";
import { getDashboardStats } from "@/lib/published-projects";

export const metadata = { title: "Dashboard | Admin" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <AdminShell>
      <div className="admin-panel">
        <h1>Dashboard</h1>
        <p className="meta">Overview of what visitors see on the public portfolio.</p>

        <div className="admin-stat-grid">
          <article className="admin-stat">
            <p className="kicker">Total projects</p>
            <p className="admin-stat-value">{stats.total}</p>
          </article>
          <article className="admin-stat">
            <p className="kicker">Visible</p>
            <p className="admin-stat-value">{stats.active}</p>
          </article>
          <article className="admin-stat">
            <p className="kicker">Hidden</p>
            <p className="admin-stat-value">{stats.hidden}</p>
          </article>
        </div>

        <h2 className="admin-subtitle">Visible by category</h2>
        <p className="meta" style={{ marginBottom: 16 }}>
          Matches the public <Link href="/work">work page</Link> sections. Click a category to preview on the site.
        </p>

        <CategoryOverviewGrid byCategory={stats.byCategory} />

        <p style={{ marginTop: 28 }}>
          <Link className="pill solid" href="/admin/projects">Manage projects</Link>
        </p>
      </div>
    </AdminShell>
  );
}

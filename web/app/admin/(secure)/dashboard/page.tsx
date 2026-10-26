import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { categoryGroups } from "@/lib/content";
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
        <ul className="admin-category-stats">
          {categoryGroups.flatMap((group) =>
            group.sections.map((section) => (
              <li key={section.id}>
                <span>{group.label} · {section.label}</span>
                <strong>{stats.byCategory[section.id] ?? 0}</strong>
              </li>
            )),
          )}
        </ul>

        <p style={{ marginTop: 28 }}>
          <Link className="pill solid" href="/admin/projects">Manage projects</Link>
        </p>
      </div>
    </AdminShell>
  );
}

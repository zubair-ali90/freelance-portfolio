"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryOverviewGrid } from "@/components/admin/CategoryOverviewGrid";

type DashboardStats = {
  total: number;
  active: number;
  hidden: number;
  byCategory: Record<string, number>;
};

export function AdminDashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) {
        if (!cancelled) setError("Could not load dashboard.");
        return;
      }
      const data = (await response.json()) as DashboardStats;
      if (!cancelled) setStats(data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="admin-panel">
        <p className="admin-error">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-panel" aria-busy="true">
        <p className="meta">Loading dashboard…</p>
      </div>
    );
  }

  return (
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
  );
}

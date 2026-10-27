"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryOverviewGrid } from "@/components/admin/CategoryOverviewGrid";

type DashboardStats = {
  total: number;
  active: number;
  hidden: number;
  byCategory: Record<string, number>;
  mediaImages: number;
  mediaVideos: number;
  mediaTotal: number;
  writtenReviews: number;
  homepageReviews: number;
  featuredOnHomepage: number;
  hasDraft: boolean;
  missingHeroMedia: boolean;
  missingCovers: number;
  brokenFeatured: string[];
  categoryGroupCounts: {
    animation: number;
    renders: number;
    architectural: number;
    development: number;
  };
};

export function AdminDashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [publishMessage, setPublishMessage] = useState("");

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

  async function publish() {
    setPublishMessage("");
    const response = await fetch("/api/admin/site-config/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    });
    const data = (await response.json()) as { error?: string; ok?: boolean };
    if (!response.ok) {
      setPublishMessage(data.error ?? "Publish failed");
      return;
    }
    setPublishMessage("Draft published to the live site.");
    const refresh = await fetch("/api/admin/dashboard");
    if (refresh.ok) setStats((await refresh.json()) as DashboardStats);
  }

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

  const warnings: string[] = [];
  if (stats.missingHeroMedia) warnings.push("Homepage hero media is missing.");
  if (stats.brokenFeatured.length) {
    warnings.push(`Broken featured project references: ${stats.brokenFeatured.join(", ")}`);
  }
  if (stats.missingCovers) warnings.push(`${stats.missingCovers} published projects are missing covers.`);
  if (stats.hasDraft) warnings.push("There are unpublished draft configuration changes.");

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Portfolio Overview</h1>
          <p className="meta">Manage your projects, page content, media, and publishing from one place.</p>
        </div>
        {stats.hasDraft && (
          <button type="button" className="pill solid" onClick={publish}>
            Publish changes
          </button>
        )}
      </div>

      {publishMessage && <p className="admin-message">{publishMessage}</p>}

      <div className="admin-stat-grid">
        <article className="admin-stat">
          <p className="kicker">Total projects</p>
          <p className="admin-stat-value">{stats.total}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Published</p>
          <p className="admin-stat-value">{stats.active}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Hidden / draft</p>
          <p className="admin-stat-value">{stats.hidden}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Homepage featured</p>
          <p className="admin-stat-value">{stats.featuredOnHomepage}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Images</p>
          <p className="admin-stat-value">{stats.mediaImages}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Videos</p>
          <p className="admin-stat-value">{stats.mediaVideos}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Written reviews</p>
          <p className="admin-stat-value">{stats.writtenReviews}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Draft status</p>
          <p className="admin-stat-value" style={{ fontSize: 22 }}>
            {stats.hasDraft ? "Pending" : "Live"}
          </p>
        </article>
      </div>

      <h2 className="admin-subtitle">Work page groups</h2>
      <div className="admin-stat-grid">
        <article className="admin-stat">
          <p className="kicker">3D Animation</p>
          <p className="admin-stat-value">{stats.categoryGroupCounts.animation}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Renders</p>
          <p className="admin-stat-value">{stats.categoryGroupCounts.renders}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Architectural</p>
          <p className="admin-stat-value">{stats.categoryGroupCounts.architectural}</p>
        </article>
        <article className="admin-stat">
          <p className="kicker">Development</p>
          <p className="admin-stat-value">{stats.categoryGroupCounts.development}</p>
        </article>
      </div>

      <h2 className="admin-subtitle">Quick actions</h2>
      <div className="admin-quick-actions">
        <Link className="pill solid" href="/admin/projects">
          Manage projects
        </Link>
        <Link className="pill" href="/admin/homepage">
          Configure homepage
        </Link>
        <Link className="pill" href="/admin/media">
          Open media library
        </Link>
        <Link className="pill" href="/admin/reviews">
          Manage reviews
        </Link>
        <Link className="pill" href="/admin/configuration">
          My Work layout
        </Link>
      </div>

      {warnings.length > 0 && (
        <>
          <h2 className="admin-subtitle">Website health</h2>
          <ul className="admin-health-list">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </>
      )}

      <h2 className="admin-subtitle">Visible by category</h2>
      <p className="meta" style={{ marginBottom: 16 }}>
        Matches the public <Link href="/work">work page</Link> sections.
      </p>
      <CategoryOverviewGrid byCategory={stats.byCategory} />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProjectCategory } from "@/lib/content";
import { categoryGroups } from "@/lib/content";
import type { AdminProjectRow } from "@/lib/admin-project-types";
import { CategoryOverviewGrid } from "@/components/admin/CategoryOverviewGrid";

const categories = categoryGroups.flatMap((group) =>
  group.sections.map((section) => ({ id: section.id, label: section.label, group: group.label })),
);

type Props = {
  initialProjects?: AdminProjectRow[];
};

export function ProjectManager({ initialProjects }: Props = {} as Props) {
  const router = useRouter();
  const [rows, setRows] = useState<AdminProjectRow[]>(initialProjects ?? []);
  const [ready, setReady] = useState(Boolean(initialProjects));
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    if (initialProjects) return;
    let cancelled = false;
    (async () => {
      const response = await fetch("/api/admin/projects");
      if (!response.ok) {
        if (!cancelled) setLoadError("Could not load projects.");
        return;
      }
      const data = (await response.json()) as { projects: AdminProjectRow[] };
      if (!cancelled) {
        setRows(data.projects);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialProjects]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "hidden">("all");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return rows.filter((row) => {
      if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
      if (statusFilter === "published" && !row.active) return false;
      if (statusFilter === "hidden" && row.active) return false;
      if (!q) return true;
      return (
        row.title.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.folder.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, categoryFilter, statusFilter]);

  const visibleByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of rows) {
      if (!row.active) continue;
      map[row.category] = (map[row.category] ?? 0) + 1;
    }
    return map;
  }, [rows]);

  if (loadError) {
    return (
      <div className="admin-panel">
        <p className="admin-error">{loadError}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="admin-panel" aria-busy="true">
        <p className="meta">Loading projects…</p>
      </div>
    );
  }

  function updateRow(slug: string, patch: Partial<Pick<AdminProjectRow, "active" | "category">>) {
    setRows((current) => current.map((row) => (row.slug === slug ? { ...row, ...patch } : row)));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projects: rows.map((row) => ({
          slug: row.slug,
          active: row.active,
          category: row.category,
        })),
      }),
    });
    setSaving(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(body?.error ?? "Save failed. Try again.");
      return;
    }
    const data = (await response.json()) as { projects: AdminProjectRow[] };
    setRows(data.projects);
    router.refresh();
    setMessage(
      "Saved. Category and visibility updates are live on /work. Project rank inside a subcategory is controlled under My Work configuration (draft → publish).",
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel-head">
        <div>
          <h1>Projects</h1>
          <p className="meta">
            Change primary category and Work visibility without changing project URLs or deleting media.
            Ranking within a category is managed in{" "}
            <Link href="/admin/configuration">My Work configuration</Link>.
          </p>
        </div>
        <button type="button" className="pill solid" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save project changes"}
        </button>
      </header>

      <h2 className="admin-subtitle" style={{ marginTop: 8 }}>
        Visible by category
      </h2>
      <p className="meta" style={{ marginBottom: 12 }}>
        {rows.length} total · {rows.filter((row) => row.active).length} published ·{" "}
        {rows.filter((row) => !row.active).length} hidden
      </p>
      <CategoryOverviewGrid byCategory={visibleByCategory} compact />

      <div className="admin-media-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search by title, slug, or folder…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.group} · {cat.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Show</th>
              <th>Cover</th>
              <th>Project</th>
              <th>Primary category</th>
              <th>Media</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.slug} className={row.active ? "" : "admin-row-hidden"}>
                <td>
                  <input
                    type="checkbox"
                    checked={row.active}
                    onChange={(e) => updateRow(row.slug, { active: e.target.checked })}
                    aria-label={`Show ${row.title}`}
                  />
                </td>
                <td>
                  {/\.(mp4|webm|mov)(\?|$)/i.test(row.cover) ? (
                    <video className="admin-project-thumb" src={row.cover} muted playsInline preload="metadata" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.cover} alt="" className="admin-project-thumb" loading="lazy" />
                  )}
                </td>
                <td>
                  <strong>{row.title}</strong>
                  <span className="admin-slug">{row.slug}</span>
                  <span className="meta" style={{ display: "block" }}>
                    {row.folder}
                  </span>
                </td>
                <td>
                  <select
                    value={row.category}
                    onChange={(e) =>
                      updateRow(row.slug, { category: e.target.value as ProjectCategory })
                    }
                    aria-label={`Category for ${row.title}`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.group} · {cat.label}
                      </option>
                    ))}
                  </select>
                  <p className="meta" style={{ marginTop: 6, maxWidth: 220 }}>
                    Changing category does not delete media or change the URL.
                  </p>
                </td>
                <td>{row.media.length}</td>
                <td>
                  <Link className="pill" href={`/work/${row.slug}`} target="_blank">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

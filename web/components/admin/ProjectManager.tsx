"use client";

import { useMemo, useState } from "react";
import type { ProjectCategory } from "@/lib/content";
import { categoryGroups } from "@/lib/content";
import type { AdminProjectRow } from "@/lib/published-projects";

const categories = categoryGroups.flatMap((group) =>
  group.sections.map((section) => ({ id: section.id, label: section.label, group: group.label })),
);

type Props = {
  initialProjects: AdminProjectRow[];
};

export function ProjectManager({ initialProjects }: Props) {
  const [rows, setRows] = useState(initialProjects);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.folder.toLowerCase().includes(q),
    );
  }, [rows, filter]);

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
      setMessage("Save failed. Try again.");
      return;
    }
    const data = await response.json();
    setRows(data.projects);
    setMessage("Saved. Public site updated.");
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel-head">
        <div>
          <h1>Project management</h1>
          <p className="meta">Toggle visibility and assign categories. Hidden projects are removed from /work.</p>
        </div>
        <button type="button" className="pill solid" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </header>

      <input
        className="admin-search"
        type="search"
        placeholder="Search by title, slug, or folder…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Show</th>
              <th>Project</th>
              <th>Category</th>
              <th>Folder</th>
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
                  <strong>{row.title}</strong>
                  <span className="admin-slug">{row.slug}</span>
                </td>
                <td>
                  <select
                    value={row.category}
                    onChange={(e) => updateRow(row.slug, { category: e.target.value as ProjectCategory })}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.group} · {cat.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="admin-folder">{row.folder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

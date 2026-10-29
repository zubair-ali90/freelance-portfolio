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

type ReviewOption = {
  id: string;
  contractTitle: string;
  quote: string;
  rating: number;
  projectSlug: string | null;
};

function isVideoSrc(src: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(src);
}

function MediaThumb({ src, className }: { src: string; className?: string }) {
  if (isVideoSrc(src)) {
    return <video className={className} src={src} muted playsInline preload="metadata" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={className} loading="lazy" />;
}

type Props = {
  initialProjects?: AdminProjectRow[];
  initialReviews?: ReviewOption[];
  initialHiddenMedia?: string[];
};

export function ProjectManager({
  initialProjects,
  initialReviews = [],
  initialHiddenMedia = [],
}: Props = {} as Props) {
  const router = useRouter();
  const [rows, setRows] = useState<AdminProjectRow[]>(initialProjects ?? []);
  const [reviews, setReviews] = useState<ReviewOption[]>(initialReviews);
  const [hiddenMedia, setHiddenMedia] = useState<Set<string>>(
    () => new Set(initialHiddenMedia),
  );
  const [ready, setReady] = useState(Boolean(initialProjects));
  const [loadError, setLoadError] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "hidden">("all");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setHiddenMedia(new Set(initialHiddenMedia));
  }, [initialHiddenMedia]);

  useEffect(() => {
    if (initialProjects) {
      if (initialReviews.length) setReviews(initialReviews);
      return;
    }
    let cancelled = false;
    (async () => {
      const response = await fetch("/api/admin/projects");
      if (!response.ok) {
        if (!cancelled) setLoadError("Could not load projects.");
        return;
      }
      const data = (await response.json()) as {
        projects: AdminProjectRow[];
        reviews?: ReviewOption[];
        hiddenMedia?: string[];
      };
      if (!cancelled) {
        setRows(data.projects);
        if (data.reviews) setReviews(data.reviews);
        setHiddenMedia(new Set(data.hiddenMedia ?? []));
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialProjects, initialReviews]);

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
        row.folder.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q)
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

  const suggestedBySlug = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const review of reviews) {
      if (!review.projectSlug) continue;
      if (!map[review.projectSlug]) map[review.projectSlug] = [];
      map[review.projectSlug].push(review.id);
    }
    return map;
  }, [reviews]);

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

  function updateRow(slug: string, patch: Partial<AdminProjectRow>) {
    setRows((current) => current.map((row) => (row.slug === slug ? { ...row, ...patch } : row)));
  }

  function toggleReview(slug: string, reviewId: string) {
    setRows((current) =>
      current.map((row) => {
        if (row.slug !== slug) return row;
        const existing = row.reviewIds ?? suggestedBySlug[slug] ?? [];
        const next = existing.includes(reviewId)
          ? existing.filter((id) => id !== reviewId)
          : [...existing, reviewId];
        return { ...row, reviewIds: next };
      }),
    );
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
          cover: row.cover,
          title: row.title,
          summary: row.summary,
          role: row.role,
          reviewIds: row.reviewIds,
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
    setMessage("Saved. Title, details, thumbnail, and review selections are live.");
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel-head">
        <div>
          <h1>Projects</h1>
          <p className="meta">
            Edit title, project details, thumbnail, category, visibility, and which client reviews
            appear on each project page. Open a row with <strong>Edit</strong> to change content.
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
          placeholder="Search by title, slug, folder, or details…"
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

      <div className="admin-project-list" role="list">
        <div className="admin-project-list-head" aria-hidden="true">
          <span>Show</span>
          <span>Thumbnail</span>
          <span>Project</span>
          <span>Category</span>
          <span>Reviews</span>
          <span>Actions</span>
        </div>

        {filtered.map((row) => {
          const open = expandedSlug === row.slug;
          const reviewCount =
            row.reviewIds === null
              ? (suggestedBySlug[row.slug]?.length ?? 0)
              : row.reviewIds.length;
          const reviewMode = row.reviewIds === null ? "Auto" : "Custom";

          return (
            <article
              key={row.slug}
              className={[
                "admin-project-card",
                row.active ? "" : "is-hidden",
                open ? "is-open" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="listitem"
            >
              <div className="admin-project-card-main">
                <label className="admin-project-card-field admin-project-card-show">
                  <span className="admin-project-card-label">Show on site</span>
                  <input
                    type="checkbox"
                    checked={row.active}
                    onChange={(e) => updateRow(row.slug, { active: e.target.checked })}
                    aria-label={`Show ${row.title}`}
                  />
                </label>

                <div className="admin-project-card-field admin-project-card-thumb">
                  <span className="admin-project-card-label">Thumbnail</span>
                  <MediaThumb
                    src={row.cover}
                    className={
                      hiddenMedia.has(row.cover)
                        ? "admin-project-thumb is-hidden-media"
                        : "admin-project-thumb"
                    }
                  />
                  {hiddenMedia.has(row.cover) && (
                    <span className="meta">Hidden media</span>
                  )}
                </div>

                <div className="admin-project-card-field admin-project-card-info">
                  <span className="admin-project-card-label">Project</span>
                  <strong>{row.title}</strong>
                  <span className="admin-slug">{row.slug}</span>
                  <span className="meta admin-project-card-summary">
                    {row.summary.length > 120 ? `${row.summary.slice(0, 120)}…` : row.summary}
                  </span>
                </div>

                <label className="admin-project-card-field admin-project-card-category">
                  <span className="admin-project-card-label">Category</span>
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
                </label>

                <div className="admin-project-card-field admin-project-card-reviews">
                  <span className="admin-project-card-label">Reviews</span>
                  <span className="meta">
                    {reviewMode} · {reviewCount}
                  </span>
                </div>

                <div className="admin-project-card-field admin-project-card-actions">
                  <span className="admin-project-card-label">Actions</span>
                  <div className="admin-quick-actions">
                    <button
                      type="button"
                      className={open ? "pill solid" : "pill"}
                      onClick={() => setExpandedSlug(open ? null : row.slug)}
                      aria-expanded={open}
                    >
                      {open ? "Close" : "Edit"}
                    </button>
                    <Link className="pill" href={`/work/${row.slug}`} target="_blank">
                      View
                    </Link>
                  </div>
                </div>
              </div>

              {open && (
                <div className="admin-project-editor">
                  <div className="admin-form-stack admin-form-stack-split">
                    <label>
                      Project title
                      <input
                        value={row.title}
                        onChange={(e) => updateRow(row.slug, { title: e.target.value })}
                      />
                    </label>
                    <label>
                      Role
                      <input
                        value={row.role}
                        onChange={(e) => updateRow(row.slug, { role: e.target.value })}
                      />
                    </label>
                    <label className="admin-form-span-2">
                      Project details / summary
                      <textarea
                        rows={4}
                        value={row.summary}
                        onChange={(e) => updateRow(row.slug, { summary: e.target.value })}
                      />
                    </label>
                  </div>

                  {row.media.length > 0 && (
                    <div className="admin-cover-picker">
                      <h3 className="admin-config-kicker">Thumbnail</h3>
                      <p className="meta">
                        Shown on Work cards and anywhere this project cover is used. Media marked
                        Hidden in Media Library stay visible here so you can see them, but cannot be
                        chosen as the public thumbnail.
                      </p>
                      {hiddenMedia.has(row.cover) && (
                        <p className="admin-message">
                          Current thumbnail is hidden in Media Library. Pick a visible option below,
                          or turn that file back on in Media Library.
                        </p>
                      )}
                      <div className="admin-cover-grid">
                        {row.media.map((src, index) => {
                          const selected = src === row.cover;
                          const isHidden = hiddenMedia.has(src);
                          return (
                            <button
                              key={`${row.slug}-cover-${index}`}
                              type="button"
                              className={[
                                "admin-cover-option",
                                selected ? "is-selected" : "",
                                isHidden ? "is-hidden-media" : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              onClick={() => {
                                if (isHidden) return;
                                updateRow(row.slug, { cover: src });
                              }}
                              disabled={isHidden}
                              aria-pressed={selected}
                              title={
                                isHidden
                                  ? "Hidden in Media Library — turn Visible on to use as thumbnail"
                                  : undefined
                              }
                            >
                              <MediaThumb src={src} className="admin-cover-option-media" />
                              <span className="meta">
                                {isHidden
                                  ? "Hidden"
                                  : selected
                                    ? "Current"
                                    : `Option ${index + 1}`}
                                {isVideoSrc(src) ? " · video" : " · image"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="admin-cover-picker">
                    <h3 className="admin-config-kicker">Client reviews on this project</h3>
                    <p className="meta">
                      Auto uses reviews linked to this project from source records. Custom lets you
                      choose exactly which verified written reviews appear.
                    </p>
                    <div className="admin-quick-actions" style={{ marginBottom: 12 }}>
                      <button
                        type="button"
                        className={row.reviewIds === null ? "pill solid" : "pill"}
                        onClick={() => updateRow(row.slug, { reviewIds: null })}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        className={row.reviewIds !== null ? "pill solid" : "pill"}
                        onClick={() =>
                          updateRow(row.slug, {
                            reviewIds: [...(suggestedBySlug[row.slug] ?? [])],
                          })
                        }
                      >
                        Custom selection
                      </button>
                      {row.reviewIds !== null && (
                        <button
                          type="button"
                          className="pill"
                          onClick={() => updateRow(row.slug, { reviewIds: [] })}
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {row.reviewIds === null ? (
                      <p className="meta">
                        Using automatic mapping
                        {(suggestedBySlug[row.slug]?.length ?? 0) > 0
                          ? ` (${suggestedBySlug[row.slug].length} linked written review${
                              suggestedBySlug[row.slug].length === 1 ? "" : "s"
                            })`
                          : " (no linked written reviews yet)"}
                        .
                      </p>
                    ) : (
                      <ul className="admin-review-pick-list">
                        {reviews.map((review) => {
                          const checked = row.reviewIds?.includes(review.id) ?? false;
                          const suggested = suggestedBySlug[row.slug]?.includes(review.id);
                          return (
                            <li key={review.id}>
                              <label className="admin-inline-check">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleReview(row.slug, review.id)}
                                />
                                <span>
                                  <strong>{review.contractTitle}</strong>
                                  <span className="meta" style={{ display: "block" }}>
                                    {review.id}
                                    {suggested ? " · suggested for this project" : ""}
                                    {review.projectSlug
                                      ? ` · linked slug: ${review.projectSlug}`
                                      : ""}
                                    {` · ${review.rating.toFixed(1)}★`}
                                  </span>
                                  <span className="meta" style={{ display: "block" }}>
                                    {review.quote.length > 160
                                      ? `${review.quote.slice(0, 160)}…`
                                      : review.quote}
                                  </span>
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

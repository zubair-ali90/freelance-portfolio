"use client";

import { useMemo, useState } from "react";
import type { SiteConfigStore } from "@/lib/site-config-types";

type ReviewRow = {
  id: string;
  quote: string;
  rating: number;
  contractTitle: string;
  projectSlug: string | null;
  hasWrittenReview: boolean;
  dates?: string | null;
};

export function ReviewsManager({
  initialConfig,
  reviews,
}: {
  initialConfig: SiteConfigStore;
  reviews: ReviewRow[];
}) {
  const [config, setConfig] = useState(initialConfig);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const homepageIds = config.homepage.trust.reviewIds;
  const hidden = new Set(config.reviews.hiddenIds);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((review) => {
      if (!q) return true;
      return (
        review.id.toLowerCase().includes(q) ||
        review.contractTitle.toLowerCase().includes(q) ||
        (review.quote || "").toLowerCase().includes(q) ||
        (review.projectSlug || "").toLowerCase().includes(q)
      );
    });
  }, [reviews, query]);

  function toggleHidden(id: string) {
    setConfig((current) => {
      const set = new Set(current.reviews.hiddenIds);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...current, reviews: { hiddenIds: [...set] } };
    });
  }

  function toggleHomepage(id: string) {
    setConfig((current) => {
      const ids = current.homepage.trust.reviewIds;
      const next = ids.includes(id) ? ids.filter((entry) => entry !== id) : [...ids, id];
      return {
        ...current,
        homepage: {
          ...current.homepage,
          trust: { ...current.homepage.trust, reviewIds: next },
        },
      };
    });
  }

  function moveHomepage(id: string, direction: -1 | 1) {
    setConfig((current) => {
      const ids = [...current.homepage.trust.reviewIds];
      const index = ids.indexOf(id);
      if (index < 0) return current;
      const next = index + direction;
      if (next < 0 || next >= ids.length) return current;
      [ids[index], ids[next]] = [ids[next], ids[index]];
      return {
        ...current,
        homepage: {
          ...current.homepage,
          trust: { ...current.homepage.trust, reviewIds: ids },
        },
      };
    });
  }

  async function saveDraft() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    const data = (await response.json()) as { error?: string; config?: SiteConfigStore; message?: string };
    setSaving(false);
    if (!response.ok) {
      setMessage(data.error ?? "Save failed");
      return;
    }
    if (data.config) setConfig(data.config);
    setMessage(data.message ?? "Draft saved.");
  }

  async function publish() {
    setSaving(true);
    setMessage("");
    const save = await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    if (!save.ok) {
      setSaving(false);
      setMessage("Could not save draft before publish.");
      return;
    }
    const response = await fetch("/api/admin/site-config/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    });
    setSaving(false);
    if (!response.ok) {
      setMessage("Publish failed");
      return;
    }
    setMessage("Published. Review visibility is live.");
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Reviews</h1>
          <p className="meta">
            Manage verified written feedback. Hiding a review removes it from public listings without
            deleting source records.
          </p>
        </div>
        <div className="admin-quick-actions">
          <button type="button" className="pill" disabled={saving} onClick={saveDraft}>
            Save draft
          </button>
          <button type="button" className="pill solid" disabled={saving} onClick={publish}>
            Publish
          </button>
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <input
        className="admin-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search reviews, contracts, or project slugs…"
      />

      <h2 className="admin-subtitle">Homepage carousel order</h2>
      <ul className="admin-order-list">
        {homepageIds.map((id, index) => {
          const review = reviews.find((item) => item.id === id);
          return (
            <li key={id}>
              <span className="admin-order-rank">{index + 1}</span>
              <span>
                <strong>{id}</strong>
                <span className="meta" style={{ display: "block" }}>
                  {review?.contractTitle ?? "Missing review"}
                </span>
              </span>
              <div className="admin-order-actions">
                <button type="button" className="admin-order-btn" onClick={() => moveHomepage(id, -1)}>
                  ↑
                </button>
                <button type="button" className="admin-order-btn" onClick={() => moveHomepage(id, 1)}>
                  ↓
                </button>
                <button type="button" className="admin-order-btn" onClick={() => toggleHomepage(id)}>
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <h2 className="admin-subtitle">All written reviews</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Contract</th>
              <th>Quote</th>
              <th>Rating</th>
              <th>Homepage</th>
              <th>Hidden</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((review) => (
              <tr key={review.id} className={hidden.has(review.id) ? "admin-row-hidden" : undefined}>
                <td className="admin-slug">{review.id}</td>
                <td>
                  <strong>{review.contractTitle}</strong>
                  <span className="meta" style={{ display: "block" }}>
                    {review.projectSlug ?? "No published project"}
                  </span>
                </td>
                <td style={{ maxWidth: 360 }}>
                  {review.quote ? (
                    <span title={review.quote}>
                      {review.quote.length > 140 ? `${review.quote.slice(0, 140)}…` : review.quote}
                    </span>
                  ) : (
                    <span className="meta">Rating only</span>
                  )}
                </td>
                <td>{review.rating.toFixed(1)}</td>
                <td>
                  <button
                    type="button"
                    className="pill"
                    disabled={!review.quote}
                    onClick={() => toggleHomepage(review.id)}
                  >
                    {homepageIds.includes(review.id) ? "On homepage" : "Add"}
                  </button>
                </td>
                <td>
                  <button type="button" className="pill" onClick={() => toggleHidden(review.id)}>
                    {hidden.has(review.id) ? "Hidden" : "Visible"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

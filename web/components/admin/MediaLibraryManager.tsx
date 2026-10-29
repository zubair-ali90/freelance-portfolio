"use client";

import { useMemo, useState } from "react";
import type { MediaAsset } from "@/lib/cms/media-catalog";

export function MediaLibraryManager({ assets: initialAssets }: { assets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "image" | "video" | "embed">("all");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "visible" | "hidden">("all");
  const [copied, setCopied] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((asset) => {
      if (type !== "all" && asset.type !== type) return false;
      if (visibilityFilter === "visible" && !asset.visible) return false;
      if (visibilityFilter === "hidden" && asset.visible) return false;
      if (!q) return true;
      return (
        asset.src.toLowerCase().includes(q) ||
        asset.projectTitle.toLowerCase().includes(q) ||
        asset.projectSlug.toLowerCase().includes(q)
      );
    });
  }, [assets, query, type, visibilityFilter]);

  const visibleCount = assets.filter((asset) => asset.visible).length;
  const hiddenCount = assets.length - visibleCount;

  function setVisible(src: string, visible: boolean) {
    setAssets((current) =>
      current.map((asset) => (asset.src === src ? { ...asset, visible } : asset)),
    );
    setDirty(true);
    setMessage("");
  }

  async function copyUrl(src: string) {
    try {
      await navigator.clipboard.writeText(src);
      setCopied(src);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const visibility: Record<string, boolean> = {};
    for (const asset of assets) {
      visibility[asset.src] = asset.visible;
    }
    const response = await fetch("/api/admin/media", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility }),
    });
    const data = (await response.json()) as {
      error?: string;
      assets?: MediaAsset[];
      message?: string;
    };
    setSaving(false);
    if (!response.ok) {
      setMessage(data.error ?? "Save failed");
      return;
    }
    if (data.assets) setAssets(data.assets);
    setDirty(false);
    setMessage(data.message ?? "Saved.");
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Media Library</h1>
          <p className="meta">
            Toggle <strong>Visible</strong> for each file. Visible media can appear in project
            galleries, covers, and public pages. Unticked media is hidden everywhere on the public
            site (not deleted).
          </p>
        </div>
        <div className="admin-quick-actions">
          <p className="meta" style={{ margin: 0 }}>
            {assets.length} assets · {visibleCount} visible · {hiddenCount} hidden
            {dirty ? " · unsaved" : ""}
          </p>
          <button type="button" className="pill solid" disabled={saving || !dirty} onClick={save}>
            {saving ? "Saving…" : "Save visibility"}
          </button>
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-media-toolbar">
        <input
          className="admin-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search filename, project, or slug…"
        />
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          <option value="all">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="embed">Embeds</option>
        </select>
        <select
          value={visibilityFilter}
          onChange={(e) => setVisibilityFilter(e.target.value as typeof visibilityFilter)}
        >
          <option value="all">All visibility</option>
          <option value="visible">Visible only</option>
          <option value="hidden">Hidden only</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="meta">No media matches this filter.</p>
      ) : (
        <div className="admin-media-grid">
          {filtered.map((asset) => (
            <article
              key={asset.id}
              className={asset.visible ? "admin-media-card" : "admin-media-card is-hidden-media"}
            >
              <div className="admin-media-thumb">
                {asset.type === "video" ? (
                  <video src={asset.src} muted playsInline preload="metadata" />
                ) : asset.type === "embed" ? (
                  <div className="embed-thumb">
                    <span className="embed-thumb-label">Interactive 3D</span>
                    <span className="embed-thumb-host">embed</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.src} alt={asset.projectTitle} loading="lazy" />
                )}
              </div>
              <div className="admin-media-meta">
                <label className="admin-inline-check admin-media-visibility">
                  <input
                    type="checkbox"
                    checked={asset.visible}
                    onChange={(e) => setVisible(asset.src, e.target.checked)}
                  />
                  Visible everywhere
                </label>
                <p className="admin-media-type">
                  {asset.type}
                  {asset.isCover ? " · default cover" : ""}
                  {asset.src.startsWith("http") ? " · external" : " · local"}
                  {asset.visible ? "" : " · hidden"}
                </p>
                <p className="admin-media-title">{asset.projectTitle}</p>
                <p className="admin-slug" title={asset.src}>
                  {asset.src.length > 48 ? `${asset.src.slice(0, 48)}…` : asset.src}
                </p>
                <div className="admin-quick-actions">
                  <button type="button" className="pill" onClick={() => copyUrl(asset.src)}>
                    {copied === asset.src ? "Copied" : "Copy URL"}
                  </button>
                  <a
                    className="pill"
                    href={`/work/${asset.projectSlug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Project
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

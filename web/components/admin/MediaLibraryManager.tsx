"use client";

import { useMemo, useState } from "react";
import type { MediaAsset } from "@/lib/cms/media-catalog";

export function MediaLibraryManager({ assets }: { assets: MediaAsset[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "image" | "video">("all");
  const [copied, setCopied] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((asset) => {
      if (type !== "all" && asset.type !== type) return false;
      if (!q) return true;
      return (
        asset.src.toLowerCase().includes(q) ||
        asset.projectTitle.toLowerCase().includes(q) ||
        asset.projectSlug.toLowerCase().includes(q)
      );
    });
  }, [assets, query, type]);

  async function copyUrl(src: string) {
    try {
      await navigator.clipboard.writeText(src);
      setCopied(src);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Media Library</h1>
          <p className="meta">
            Central catalog of project media. Select these paths in Homepage and Projects without
            re-uploading existing files. Large CDN videos remain external references.
          </p>
        </div>
        <p className="meta">
          {assets.length} assets · {filtered.length} shown
        </p>
      </div>

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
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="meta">No media matches this filter.</p>
      ) : (
        <div className="admin-media-grid">
          {filtered.map((asset) => (
            <article key={asset.id} className="admin-media-card">
              <div className="admin-media-thumb">
                {asset.type === "video" ? (
                  <video src={asset.src} muted playsInline preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.src} alt={asset.projectTitle} loading="lazy" />
                )}
              </div>
              <div className="admin-media-meta">
                <p className="admin-media-type">
                  {asset.type}
                  {asset.isCover ? " · cover" : ""}
                  {asset.src.startsWith("http") ? " · external" : " · local"}
                </p>
                <p className="admin-media-title">{asset.projectTitle}</p>
                <p className="admin-slug" title={asset.src}>
                  {asset.src.length > 48 ? `${asset.src.slice(0, 48)}…` : asset.src}
                </p>
                <div className="admin-quick-actions">
                  <button type="button" className="pill" onClick={() => copyUrl(asset.src)}>
                    {copied === asset.src ? "Copied" : "Copy URL"}
                  </button>
                  <a className="pill" href={`/work/${asset.projectSlug}`} target="_blank" rel="noreferrer">
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

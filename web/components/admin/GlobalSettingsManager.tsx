"use client";

import { useState } from "react";
import type { SiteConfigStore } from "@/lib/site-config";

export function GlobalSettingsManager({ initialConfig }: { initialConfig: SiteConfigStore }) {
  const [config, setConfig] = useState(initialConfig);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateGlobal<K extends keyof SiteConfigStore["global"]>(
    key: K,
    value: SiteConfigStore["global"][K],
  ) {
    setConfig((current) => ({
      ...current,
      global: { ...current.global, [key]: value },
    }));
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
    setMessage("Published. Footer and global settings are live.");
  }

  const global = config.global;

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Global Settings</h1>
          <p className="meta">Shared site title, Upwork destination, and footer copy.</p>
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

      <div className="admin-form-stack" style={{ maxWidth: 720 }}>
        <label>
          Site title
          <input value={global.siteTitle} onChange={(e) => updateGlobal("siteTitle", e.target.value)} />
        </label>
        <label>
          Upwork profile URL
          <input value={global.upworkUrl} onChange={(e) => updateGlobal("upworkUrl", e.target.value)} />
        </label>
        <h2 className="admin-subtitle">Footer</h2>
        <label>
          Footer label
          <input
            value={global.footerLabel}
            onChange={(e) => updateGlobal("footerLabel", e.target.value)}
          />
        </label>
        <label>
          Footer headline
          <input
            value={global.footerHeadline}
            onChange={(e) => updateGlobal("footerHeadline", e.target.value)}
          />
        </label>
        <label>
          Footer description
          <textarea
            rows={3}
            value={global.footerDescription}
            onChange={(e) => updateGlobal("footerDescription", e.target.value)}
          />
        </label>
        <label>
          Closing line
          <input
            value={global.footerTagline}
            onChange={(e) => updateGlobal("footerTagline", e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

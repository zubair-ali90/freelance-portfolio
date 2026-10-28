"use client";

import { useState } from "react";
import type { SiteConfigStore } from "@/lib/site-config-types";

type PageKey = "about" | "services" | "contact";

export function PageConfigManager({
  page,
  title,
  description,
  initialConfig,
}: {
  page: PageKey;
  title: string;
  description: string;
  initialConfig: SiteConfigStore;
}) {
  const [config, setConfig] = useState(initialConfig);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

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
    setMessage("Published.");
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>{title}</h1>
          <p className="meta">{description}</p>
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

      {page === "about" && (
        <div className="admin-form-stack" style={{ maxWidth: 720 }}>
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["headline", "Headline"],
              ["intro", "Introduction"],
              ["startTitle", "Start card title"],
              ["startBody", "Start card body"],
              ["finishTitle", "Finish card title"],
              ["finishBody", "Finish card body"],
              ["hireTitle", "Hire card title"],
              ["hireBody", "Hire card body"],
              ["editorialFlag", "Editorial flag (optional)"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              {key === "intro" || key.endsWith("Body") || key === "editorialFlag" ? (
                <textarea
                  rows={key === "intro" ? 4 : 3}
                  value={config.pages.about[key]}
                  onChange={(e) =>
                    setConfig((current) => ({
                      ...current,
                      pages: {
                        ...current.pages,
                        about: { ...current.pages.about, [key]: e.target.value },
                      },
                    }))
                  }
                />
              ) : (
                <input
                  value={config.pages.about[key]}
                  onChange={(e) =>
                    setConfig((current) => ({
                      ...current,
                      pages: {
                        ...current.pages,
                        about: { ...current.pages.about, [key]: e.target.value },
                      },
                    }))
                  }
                />
              )}
            </label>
          ))}
        </div>
      )}

      {page === "services" && (
        <div className="admin-form-stack" style={{ maxWidth: 720 }}>
          <label>
            Eyebrow
            <input
              value={config.pages.services.eyebrow}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  pages: {
                    ...current.pages,
                    services: { ...current.pages.services, eyebrow: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Headline
            <input
              value={config.pages.services.headline}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  pages: {
                    ...current.pages,
                    services: { ...current.pages.services, headline: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Introduction
            <textarea
              rows={3}
              value={config.pages.services.intro}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  pages: {
                    ...current.pages,
                    services: { ...current.pages.services, intro: e.target.value },
                  },
                }))
              }
            />
          </label>
          {config.pages.services.offers.map((offer, index) => (
            <article key={index} className="admin-featured-card">
              <label className="admin-inline-check">
                <input
                  type="checkbox"
                  checked={offer.enabled}
                  onChange={(e) =>
                    setConfig((current) => {
                      const offers = current.pages.services.offers.map((item, i) =>
                        i === index ? { ...item, enabled: e.target.checked } : item,
                      );
                      return {
                        ...current,
                        pages: {
                          ...current.pages,
                          services: { ...current.pages.services, offers },
                        },
                      };
                    })
                  }
                />
                Visible
              </label>
              <label>
                Service title
                <input
                  value={offer.title}
                  onChange={(e) =>
                    setConfig((current) => {
                      const offers = current.pages.services.offers.map((item, i) =>
                        i === index ? { ...item, title: e.target.value } : item,
                      );
                      return {
                        ...current,
                        pages: {
                          ...current.pages,
                          services: { ...current.pages.services, offers },
                        },
                      };
                    })
                  }
                />
              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  value={offer.detail}
                  onChange={(e) =>
                    setConfig((current) => {
                      const offers = current.pages.services.offers.map((item, i) =>
                        i === index ? { ...item, detail: e.target.value } : item,
                      );
                      return {
                        ...current,
                        pages: {
                          ...current.pages,
                          services: { ...current.pages.services, offers },
                        },
                      };
                    })
                  }
                />
              </label>
            </article>
          ))}
        </div>
      )}

      {page === "contact" && (
        <div className="admin-form-stack" style={{ maxWidth: 720 }}>
          <label className="admin-inline-check">
            <input
              type="checkbox"
              checked={config.pages.contact.formVisible}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  pages: {
                    ...current.pages,
                    contact: { ...current.pages.contact, formVisible: e.target.checked },
                  },
                }))
              }
            />
            Show contact form
          </label>
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["headline", "Headline"],
              ["intro", "Introduction"],
              ["formNote", "Integration note (shown publicly)"],
              ["successMessage", "Success message"],
              ["errorMessage", "Error message"],
              ["upworkLabel", "Upwork CTA label"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              {key.includes("essage") || key === "intro" || key === "formNote" ? (
                <textarea
                  rows={3}
                  value={config.pages.contact[key]}
                  onChange={(e) =>
                    setConfig((current) => ({
                      ...current,
                      pages: {
                        ...current.pages,
                        contact: { ...current.pages.contact, [key]: e.target.value },
                      },
                    }))
                  }
                />
              ) : (
                <input
                  value={config.pages.contact[key]}
                  onChange={(e) =>
                    setConfig((current) => ({
                      ...current,
                      pages: {
                        ...current.pages,
                        contact: { ...current.pages.contact, [key]: e.target.value },
                      },
                    }))
                  }
                />
              )}
            </label>
          ))}
          <p className="meta">
            Contact status: messages are not emailed. Keep the public note honest until a real inbox
            backend is connected.
          </p>
        </div>
      )}
    </div>
  );
}

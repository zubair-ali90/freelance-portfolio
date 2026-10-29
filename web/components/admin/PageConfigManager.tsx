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
        <div className="admin-panel-head-copy">
          <h1>{title}</h1>
          <p className="meta">{description}</p>
        </div>
        <div className="admin-quick-actions admin-panel-actions">
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
        <div className="admin-config-surface">
          <div className="admin-form-stack admin-form-stack-split">
            {(
              [
                ["eyebrow", "Eyebrow", "short"],
                ["headline", "Headline", "short"],
                ["intro", "Introduction", "long"],
                ["startTitle", "Start card title", "short"],
                ["startBody", "Start card body", "long"],
                ["finishTitle", "Finish card title", "short"],
                ["finishBody", "Finish card body", "long"],
                ["hireTitle", "Hire card title", "short"],
                ["hireBody", "Hire card body", "long"],
                ["editorialFlag", "Editorial flag (optional)", "long"],
              ] as const
            ).map(([key, label, size]) => (
              <label key={key} className={size === "long" ? "admin-form-span-2" : undefined}>
                {label}
                {size === "long" ? (
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
        </div>
      )}

      {page === "services" && (
        <div className="admin-config-surface">
          <div className="admin-form-stack admin-form-stack-split">
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
            <label className="admin-form-span-2">
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
          </div>

          <div className="admin-offer-grid">
            {config.pages.services.offers.map((offer, index) => (
              <article key={index} className="admin-featured-card">
                <div className="admin-offer-card-head">
                  <span className="admin-offer-card-index">Offer {index + 1}</span>
                  <label className="admin-switch">
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
                    <span className="admin-switch-track" aria-hidden />
                    <span>{offer.enabled ? "Visible" : "Hidden"}</span>
                  </label>
                </div>
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
        </div>
      )}

      {page === "contact" && (
        <div className="admin-config-surface">
          <div className="admin-form-stack admin-form-stack-split">
            <div className="admin-toggle-row admin-form-span-2">
              <div className="admin-toggle-row-copy">
                <strong>Contact form</strong>
                <span>When off, the public contact page hides the form fields.</span>
              </div>
              <label className="admin-switch">
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
                <span className="admin-switch-track" aria-hidden />
                <span>{config.pages.contact.formVisible ? "Shown" : "Hidden"}</span>
              </label>
            </div>
            {(
              [
                ["eyebrow", "Eyebrow", "short"],
                ["headline", "Headline", "short"],
                ["intro", "Introduction", "long"],
                ["formNote", "Integration note (shown publicly)", "long"],
                ["successMessage", "Success message", "long"],
                ["errorMessage", "Error message", "long"],
                ["upworkLabel", "Upwork CTA label", "short"],
              ] as const
            ).map(([key, label, size]) => (
              <label key={key} className={size === "long" ? "admin-form-span-2" : undefined}>
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
            <p className="meta admin-form-span-2">
              Contact status: messages are not emailed. Keep the public note honest until a real inbox
              backend is connected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

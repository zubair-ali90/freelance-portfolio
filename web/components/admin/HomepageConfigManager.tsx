"use client";

import { useMemo, useState } from "react";
import type { SiteConfigStore } from "@/lib/site-config-types";
import type { FeaturedProjectPlacement } from "@/lib/cms/homepage-defaults";

type ProjectOption = { slug: string; title: string; cover: string; active: boolean };
type SectionId = "hero" | "featured" | "expertise" | "process" | "trust" | "about" | "cta";

export function HomepageConfigManager({
  initialConfig,
  projects,
}: {
  initialConfig: SiteConfigStore;
  projects: ProjectOption[];
}) {
  const [config, setConfig] = useState(initialConfig);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState<SectionId>("hero");

  const publishedProjects = useMemo(
    () => projects.filter((project) => project.active),
    [projects],
  );

  function updateHero<K extends keyof SiteConfigStore["homepage"]["hero"]>(
    key: K,
    value: SiteConfigStore["homepage"]["hero"][K],
  ) {
    setConfig((current) => ({
      ...current,
      homepage: {
        ...current.homepage,
        hero: { ...current.homepage.hero, [key]: value },
      },
    }));
  }

  function moveFeatured(index: number, direction: -1 | 1) {
    setConfig((current) => {
      const list = [...current.homepage.featuredProjects];
      const next = index + direction;
      if (next < 0 || next >= list.length) return current;
      [list[index], list[next]] = [list[next], list[index]];
      return {
        ...current,
        homepage: { ...current.homepage, featuredProjects: list },
      };
    });
  }

  function updateFeatured(index: number, patch: Partial<FeaturedProjectPlacement>) {
    setConfig((current) => {
      const list = current.homepage.featuredProjects.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      );
      return { ...current, homepage: { ...current.homepage, featuredProjects: list } };
    });
  }

  function addFeatured(slug: string) {
    const project = publishedProjects.find((item) => item.slug === slug);
    if (!project) return;
    setConfig((current) => {
      if (current.homepage.featuredProjects.some((item) => item.slug === slug)) return current;
      const next: FeaturedProjectPlacement = {
        slug,
        enabled: true,
        clientLabel: project.title,
        headline: project.title,
        body: "",
        cta: "Explore Project",
        mediaSrc: "",
      };
      return {
        ...current,
        homepage: {
          ...current.homepage,
          featuredProjects: [...current.homepage.featuredProjects, next],
        },
      };
    });
  }

  function removeFeatured(index: number) {
    setConfig((current) => ({
      ...current,
      homepage: {
        ...current.homepage,
        featuredProjects: current.homepage.featuredProjects.filter((_, i) => i !== index),
      },
    }));
  }

  async function persistDraft() {
    const response = await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    const data = (await response.json()) as { error?: string; config?: SiteConfigStore; message?: string };
    if (!response.ok) throw new Error(data.error ?? "Save failed");
    if (data.config) setConfig(data.config);
    return data.message ?? "Draft saved.";
  }

  async function saveDraft() {
    setSaving(true);
    setMessage("");
    try {
      setMessage(await persistDraft());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setSaving(true);
    setMessage("");
    try {
      await persistDraft();
      const response = await fetch("/api/admin/site-config/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Publish failed");
      setMessage("Published. Public homepage will use this configuration.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  const hero = config.homepage.hero;
  const featured = config.homepage.featuredProjects;
  const trust = config.homepage.trust;
  const expertise = config.homepage.expertise;
  const process = config.homepage.process;
  const about = config.homepage.about;
  const finalCta = config.homepage.finalCta;

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h1>Homepage</h1>
          <p className="meta">
            Configure hero media, featured work chapters, expertise, process, trust, about teaser, and
            final CTA.
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

      <div className="admin-subtabs">
        {(
          [
            ["hero", "Hero"],
            ["featured", "Selected Work"],
            ["expertise", "Expertise"],
            ["process", "Process"],
            ["trust", "Client Trust"],
            ["about", "About"],
            ["cta", "Final CTA"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={section === id ? "admin-tab active" : "admin-tab"}
            onClick={() => setSection(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {section === "hero" && (
        <div className="admin-config-grid">
          <div className="admin-form-stack">
            <label>
              Eyebrow
              <input value={hero.eyebrow} onChange={(e) => updateHero("eyebrow", e.target.value)} />
            </label>
            <label>
              Headline
              <input value={hero.headline} onChange={(e) => updateHero("headline", e.target.value)} />
            </label>
            <label>
              Description
              <textarea
                rows={4}
                value={hero.description}
                onChange={(e) => updateHero("description", e.target.value)}
              />
            </label>
            <label>
              Primary CTA label
              <input
                value={hero.primaryCtaLabel}
                onChange={(e) => updateHero("primaryCtaLabel", e.target.value)}
              />
            </label>
            <label>
              Primary CTA href
              <input
                value={hero.primaryCtaHref}
                onChange={(e) => updateHero("primaryCtaHref", e.target.value)}
              />
            </label>
            <label>
              Secondary CTA label
              <input
                value={hero.secondaryCtaLabel}
                onChange={(e) => updateHero("secondaryCtaLabel", e.target.value)}
              />
            </label>
            <label>
              Secondary CTA href
              <input
                value={hero.secondaryCtaHref}
                onChange={(e) => updateHero("secondaryCtaHref", e.target.value)}
              />
            </label>
            <label>
              Scroll indicator
              <input value={hero.scrollLabel} onChange={(e) => updateHero("scrollLabel", e.target.value)} />
            </label>
            <label>
              Hero media path
              <input value={hero.mediaSrc} onChange={(e) => updateHero("mediaSrc", e.target.value)} />
            </label>
            <label>
              Pick from project covers
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) updateHero("mediaSrc", e.target.value);
                }}
              >
                <option value="">Select cover media…</option>
                {publishedProjects.map((project) => (
                  <option key={project.slug} value={project.cover}>
                    {project.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="admin-preview-card">
            <p className="kicker">Hero preview</p>
            <div className="admin-media-preview">
              {hero.mediaSrc ? (
                hero.mediaSrc.match(/\.(mp4|webm|mov)(\?|$)/i) ? (
                  <video src={hero.mediaSrc} muted playsInline loop autoPlay />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hero.mediaSrc} alt="Hero preview" />
                )
              ) : (
                <p className="meta">No media selected</p>
              )}
            </div>
            <p className="admin-preview-eyebrow">{hero.eyebrow}</p>
            <h2>{hero.headline}</h2>
            <p>{hero.description}</p>
          </div>
        </div>
      )}

      {section === "featured" && (
        <div className="admin-form-stack">
          <p className="meta">
            Featured chapters drive the homepage Selected Work sticky showcase. Removing a project here does
            not delete it from the Work page.
          </p>
          <label>
            Add project to featured
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) addFeatured(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="">Choose a published project…</option>
              {publishedProjects.map((project) => (
                <option key={project.slug} value={project.slug}>
                  {project.title}
                </option>
              ))}
            </select>
          </label>

          {featured.map((item, index) => (
            <article key={`${item.slug}-${index}`} className="admin-featured-card">
              <div className="admin-featured-card-head">
                <strong>
                  {String(index + 1).padStart(2, "0")} · {item.slug}
                </strong>
                <div className="admin-quick-actions">
                  <button type="button" className="pill" onClick={() => moveFeatured(index, -1)}>
                    ↑
                  </button>
                  <button type="button" className="pill" onClick={() => moveFeatured(index, 1)}>
                    ↓
                  </button>
                  <button type="button" className="pill" onClick={() => removeFeatured(index)}>
                    Remove
                  </button>
                </div>
              </div>
              <label className="admin-inline-check">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) => updateFeatured(index, { enabled: e.target.checked })}
                />
                Enabled on homepage
              </label>
              <label>
                Client / chapter label
                <input
                  value={item.clientLabel}
                  onChange={(e) => updateFeatured(index, { clientLabel: e.target.value })}
                />
              </label>
              <label>
                Headline
                <input
                  value={item.headline}
                  onChange={(e) => updateFeatured(index, { headline: e.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  value={item.body}
                  onChange={(e) => updateFeatured(index, { body: e.target.value })}
                />
              </label>
              <label>
                CTA label
                <input value={item.cta} onChange={(e) => updateFeatured(index, { cta: e.target.value })} />
              </label>
              <label>
                Media override (optional)
                <input
                  value={item.mediaSrc}
                  onChange={(e) => updateFeatured(index, { mediaSrc: e.target.value })}
                  placeholder="Leave empty to use project cover"
                />
              </label>
              <label>
                Use project cover
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) updateFeatured(index, { mediaSrc: e.target.value });
                  }}
                >
                  <option value="">Pick cover…</option>
                  {publishedProjects.map((project) => (
                    <option key={project.slug} value={project.cover}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          ))}
        </div>
      )}

      {section === "expertise" && (
        <div className="admin-form-stack">
          <label>
            Eyebrow
            <input
              value={expertise.eyebrow}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    expertise: { ...current.homepage.expertise, eyebrow: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Title
            <input
              value={expertise.title}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    expertise: { ...current.homepage.expertise, title: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={expertise.description}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    expertise: { ...current.homepage.expertise, description: e.target.value },
                  },
                }))
              }
            />
          </label>
          {expertise.items.map((item, index) => (
            <article key={item.id} className="admin-featured-card">
              <label className="admin-inline-check">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) =>
                    setConfig((current) => {
                      const items = current.homepage.expertise.items.map((entry, i) =>
                        i === index ? { ...entry, enabled: e.target.checked } : entry,
                      );
                      return {
                        ...current,
                        homepage: {
                          ...current.homepage,
                          expertise: { ...current.homepage.expertise, items },
                        },
                      };
                    })
                  }
                />
                Visible
              </label>
              <label>
                Title
                <input
                  value={item.title}
                  onChange={(e) =>
                    setConfig((current) => {
                      const items = current.homepage.expertise.items.map((entry, i) =>
                        i === index ? { ...entry, title: e.target.value } : entry,
                      );
                      return {
                        ...current,
                        homepage: {
                          ...current.homepage,
                          expertise: { ...current.homepage.expertise, items },
                        },
                      };
                    })
                  }
                />
              </label>
              <label>
                Body
                <textarea
                  rows={3}
                  value={item.body}
                  onChange={(e) =>
                    setConfig((current) => {
                      const items = current.homepage.expertise.items.map((entry, i) =>
                        i === index ? { ...entry, body: e.target.value } : entry,
                      );
                      return {
                        ...current,
                        homepage: {
                          ...current.homepage,
                          expertise: { ...current.homepage.expertise, items },
                        },
                      };
                    })
                  }
                />
              </label>
              <label>
                Related media project slug
                <select
                  value={item.mediaSlug}
                  onChange={(e) =>
                    setConfig((current) => {
                      const items = current.homepage.expertise.items.map((entry, i) =>
                        i === index ? { ...entry, mediaSlug: e.target.value } : entry,
                      );
                      return {
                        ...current,
                        homepage: {
                          ...current.homepage,
                          expertise: { ...current.homepage.expertise, items },
                        },
                      };
                    })
                  }
                >
                  {publishedProjects.map((project) => (
                    <option key={project.slug} value={project.slug}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          ))}
        </div>
      )}

      {section === "process" && (
        <div className="admin-form-stack">
          <label>
            Eyebrow
            <input
              value={process.eyebrow}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    process: { ...current.homepage.process, eyebrow: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Title
            <input
              value={process.title}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    process: { ...current.homepage.process, title: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={process.description}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    process: { ...current.homepage.process, description: e.target.value },
                  },
                }))
              }
            />
          </label>
          {process.steps.map((step, index) => (
            <article key={`${step.index}-${index}`} className="admin-featured-card">
              <label className="admin-inline-check">
                <input
                  type="checkbox"
                  checked={step.enabled}
                  onChange={(e) =>
                    setConfig((current) => {
                      const steps = current.homepage.process.steps.map((entry, i) =>
                        i === index ? { ...entry, enabled: e.target.checked } : entry,
                      );
                      return {
                        ...current,
                        homepage: {
                          ...current.homepage,
                          process: { ...current.homepage.process, steps },
                        },
                      };
                    })
                  }
                />
                Visible
              </label>
              <label>
                Stage title
                <input
                  value={step.title}
                  onChange={(e) =>
                    setConfig((current) => {
                      const steps = current.homepage.process.steps.map((entry, i) =>
                        i === index ? { ...entry, title: e.target.value } : entry,
                      );
                      return {
                        ...current,
                        homepage: {
                          ...current.homepage,
                          process: { ...current.homepage.process, steps },
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
                  value={step.body}
                  onChange={(e) =>
                    setConfig((current) => {
                      const steps = current.homepage.process.steps.map((entry, i) =>
                        i === index ? { ...entry, body: e.target.value } : entry,
                      );
                      return {
                        ...current,
                        homepage: {
                          ...current.homepage,
                          process: { ...current.homepage.process, steps },
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

      {section === "trust" && (
        <div className="admin-form-stack">
          <label className="admin-inline-check">
            <input
              type="checkbox"
              checked={trust.enabled}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    trust: { ...current.homepage.trust, enabled: e.target.checked },
                  },
                }))
              }
            />
            Show client trust carousel
          </label>
          <label>
            Eyebrow
            <input
              value={trust.eyebrow}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    trust: { ...current.homepage.trust, eyebrow: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Headline
            <input
              value={trust.title}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    trust: { ...current.homepage.trust, title: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={trust.description}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    trust: { ...current.homepage.trust, description: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Review IDs (comma-separated, homepage carousel order)
            <textarea
              rows={3}
              value={trust.reviewIds.join(", ")}
              onChange={(e) =>
                setConfig((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    trust: {
                      ...current.homepage.trust,
                      reviewIds: e.target.value
                        .split(",")
                        .map((id) => id.trim())
                        .filter(Boolean),
                    },
                  },
                }))
              }
            />
          </label>
          <p className="meta">
            Manage full review text and verification on the{" "}
            <a href="/admin/reviews">Reviews</a> tab. Only written reviews should be listed here.
          </p>
        </div>
      )}

      {section === "about" && (
        <div className="admin-form-stack">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["title", "Headline"],
              ["paragraph1", "Biography paragraph 1"],
              ["paragraph2", "Biography paragraph 2"],
              ["ctaLabel", "Button label"],
              ["ctaHref", "Button destination"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              {key.startsWith("paragraph") ? (
                <textarea
                  rows={3}
                  value={about[key]}
                  onChange={(e) =>
                    setConfig((current) => ({
                      ...current,
                      homepage: {
                        ...current.homepage,
                        about: { ...current.homepage.about, [key]: e.target.value },
                      },
                    }))
                  }
                />
              ) : (
                <input
                  value={about[key]}
                  onChange={(e) =>
                    setConfig((current) => ({
                      ...current,
                      homepage: {
                        ...current.homepage,
                        about: { ...current.homepage.about, [key]: e.target.value },
                      },
                    }))
                  }
                />
              )}
            </label>
          ))}
        </div>
      )}

      {section === "cta" && (
        <div className="admin-form-stack">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["title", "Heading"],
              ["description", "Description"],
              ["closing", "Closing line"],
              ["primaryLabel", "Primary button label"],
              ["primaryHref", "Primary button URL"],
              ["secondaryLabel", "Secondary button label"],
              ["secondaryHref", "Secondary button URL"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              {key === "description" || key === "closing" ? (
                <textarea
                  rows={3}
                  value={finalCta[key]}
                  onChange={(e) =>
                    setConfig((current) => ({
                      ...current,
                      homepage: {
                        ...current.homepage,
                        finalCta: { ...current.homepage.finalCta, [key]: e.target.value },
                      },
                    }))
                  }
                />
              ) : (
                <input
                  value={finalCta[key]}
                  onChange={(e) =>
                    setConfig((current) => ({
                      ...current,
                      homepage: {
                        ...current.homepage,
                        finalCta: { ...current.homepage.finalCta, [key]: e.target.value },
                      },
                    }))
                  }
                />
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

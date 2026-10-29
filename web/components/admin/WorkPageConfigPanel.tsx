"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import type { ProjectCategory } from "@/lib/content";
import { categoryGroups, categoryLabel } from "@/lib/content";
import type { SiteConfigStore } from "@/lib/site-config-types";

type ProjectOption = { slug: string; title: string; category: ProjectCategory; active: boolean };

function moveSlug(list: string[], slug: string, direction: -1 | 1) {
  const index = list.indexOf(slug);
  if (index < 0) return list;
  const next = index + direction;
  if (next < 0 || next >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[next]] = [copy[next], copy[index]];
  return copy;
}

export function WorkPageConfigPanel({
  config,
  setConfig,
  projects,
}: {
  config: SiteConfigStore;
  setConfig: Dispatch<SetStateAction<SiteConfigStore | null>>;
  projects: ProjectOption[];
}) {
  const work = config.workPage;
  const [selectedLeaf, setSelectedLeaf] = useState<ProjectCategory>("product-animation");

  const leafProjects = projects
    .filter((project) => project.active && project.category === selectedLeaf)
    .map((project) => project.slug);

  const orderedSlugs = (() => {
    const saved = work.projectOrder[selectedLeaf] ?? [];
    const result = saved.filter((slug) => leafProjects.includes(slug));
    for (const slug of leafProjects) {
      if (!result.includes(slug)) result.push(slug);
    }
    return result;
  })();

  function patchWork(patch: Partial<SiteConfigStore["workPage"]>) {
    setConfig((current) =>
      current
        ? {
            ...current,
            workPage: { ...current.workPage, ...patch },
          }
        : null,
    );
  }

  function setOrder(next: string[]) {
    patchWork({
      projectOrder: {
        ...work.projectOrder,
        [selectedLeaf]: next,
      },
    });
  }

  return (
    <section className="admin-config-block admin-config-block-panel admin-config-block-wide">
      <h2 className="admin-subtitle">My Work page content</h2>
      <p className="meta">
        Editable intro copy and independent project ranking per subcategory. Main category and
        subcategory order are controlled in the layout panels below. Changes stay in draft until
        published.
      </p>

      <div className="admin-form-stack admin-form-stack-split" style={{ marginBottom: 24 }}>
        <label>
          Eyebrow
          <input value={work.eyebrow} onChange={(e) => patchWork({ eyebrow: e.target.value })} />
        </label>
        <label>
          Headline
          <input value={work.headline} onChange={(e) => patchWork({ headline: e.target.value })} />
        </label>
        <label>
          Introduction
          <textarea
            rows={3}
            value={work.introduction}
            onChange={(e) => patchWork({ introduction: e.target.value })}
          />
        </label>
        <label>
          Explore label
          <input
            value={work.exploreLabel}
            onChange={(e) => patchWork({ exploreLabel: e.target.value })}
          />
        </label>
        <label>
          Search placeholder
          <input
            value={work.searchPlaceholder}
            onChange={(e) => patchWork({ searchPlaceholder: e.target.value })}
          />
        </label>
        <label>
          Empty results text
          <input value={work.emptyText} onChange={(e) => patchWork({ emptyText: e.target.value })} />
        </label>
        <label className="admin-inline-check">
          <input
            type="checkbox"
            checked={work.showLeadProject}
            onChange={(e) => patchWork({ showLeadProject: e.target.checked })}
          />
          Show lead project in active category
        </label>
        <label>
          CTA heading
          <input
            value={work.ctaHeading}
            onChange={(e) => patchWork({ ctaHeading: e.target.value })}
          />
        </label>
        <label>
          CTA description
          <textarea
            rows={2}
            value={work.ctaDescription}
            onChange={(e) => patchWork({ ctaDescription: e.target.value })}
          />
        </label>
      </div>

      <h3 className="admin-config-kicker">Group introductions</h3>
      <div className="admin-form-stack admin-form-stack-split" style={{ marginBottom: 24 }}>
        {categoryGroups.map((group) => (
          <label key={group.id}>
            {group.label}
            <textarea
              rows={2}
              value={work.groupIntros[group.id] ?? ""}
              onChange={(e) =>
                patchWork({
                  groupIntros: { ...work.groupIntros, [group.id]: e.target.value },
                })
              }
            />
          </label>
        ))}
      </div>

      <h3 className="admin-config-kicker">Project rank inside subcategory</h3>
      <p className="meta admin-config-hint">
        Independent of main-category order and subcategory order. ↑/↓ reorder projects for the
        selected leaf only.
      </p>
      <label className="admin-inline-field" style={{ marginBottom: 12 }}>
        <span>Subcategory</span>
        <select
          value={selectedLeaf}
          onChange={(e) => setSelectedLeaf(e.target.value as ProjectCategory)}
        >
          {categoryGroups.map((group) => (
            <optgroup key={group.id} label={group.label}>
              {group.sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <div className="admin-form-stack admin-form-stack-split" style={{ marginBottom: 16 }}>
        <label>
          Lead project for {categoryLabel(selectedLeaf)}
          <select
            value={work.categoryMeta[selectedLeaf]?.leadProjectSlug ?? ""}
            onChange={(e) =>
              patchWork({
                categoryMeta: {
                  ...work.categoryMeta,
                  [selectedLeaf]: {
                    description: work.categoryMeta[selectedLeaf]?.description ?? "",
                    leadProjectSlug: e.target.value,
                  },
                },
              })
            }
          >
            <option value="">None</option>
            {orderedSlugs.map((slug) => {
              const project = projects.find((item) => item.slug === slug);
              return (
                <option key={slug} value={slug}>
                  {project?.title ?? slug}
                </option>
              );
            })}
          </select>
        </label>
        <label>
          Subcategory description
          <textarea
            rows={2}
            value={work.categoryMeta[selectedLeaf]?.description ?? ""}
            onChange={(e) =>
              patchWork({
                categoryMeta: {
                  ...work.categoryMeta,
                  [selectedLeaf]: {
                    leadProjectSlug: work.categoryMeta[selectedLeaf]?.leadProjectSlug ?? "",
                    description: e.target.value,
                  },
                },
              })
            }
          />
        </label>
      </div>

      <ul className="admin-order-list">
        {orderedSlugs.map((slug, index) => {
          const project = projects.find((item) => item.slug === slug);
          return (
            <li key={slug}>
              <span className="admin-order-rank">{index + 1}</span>
              <span>
                <strong>{project?.title ?? slug}</strong>
                <span className="meta" style={{ display: "block" }}>
                  {slug}
                </span>
              </span>
              <div className="admin-order-actions">
                <button
                  type="button"
                  className="admin-order-btn"
                  disabled={index === 0}
                  onClick={() => setOrder(moveSlug(orderedSlugs, slug, -1))}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-order-btn"
                  disabled={index === orderedSlugs.length - 1}
                  onClick={() => setOrder(moveSlug(orderedSlugs, slug, 1))}
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {!orderedSlugs.length && (
        <p className="meta">No published projects in this subcategory yet.</p>
      )}
    </section>
  );
}

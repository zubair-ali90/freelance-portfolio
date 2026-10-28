"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/lib/content";
import type { WorkPageStore } from "@/lib/cms/work-page-defaults";
import type { ResolvedWorkGroup } from "@/lib/work-layout-types";
import { ProjectCover } from "@/components/ProjectMedia";
import { UpworkHireLink } from "@/components/UpworkHireLink";
import { projectsByCategoryList } from "@/lib/project-ordering";

export function WorkGallery({
  projects,
  layout,
  workPage,
  clientCredits = {},
}: {
  projects: Project[];
  layout: ResolvedWorkGroup[];
  workPage: WorkPageStore;
  clientCredits?: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [activeLeaf, setActiveLeaf] = useState<ProjectCategory | "all">("all");

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const group of layout) {
      counts[group.id] = group.sections.reduce(
        (total, section) =>
          total +
          projectsByCategoryList(projects, section.id, workPage.projectOrder[section.id]).length,
        0,
      );
    }
    return counts;
  }, [layout, projects, workPage.projectOrder]);

  const visibleGroups = useMemo(() => {
    if (activeGroup === "all") return layout;
    return layout.filter((group) => group.id === activeGroup);
  }, [layout, activeGroup]);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visibleGroups
      .map((group) => {
        const sections = group.sections
          .filter((section) => activeLeaf === "all" || section.id === activeLeaf)
          .map((section) => {
            let items = projectsByCategoryList(
              projects,
              section.id,
              workPage.projectOrder[section.id],
            );
            if (q) {
              items = items.filter(
                (project) =>
                  project.title.toLowerCase().includes(q) ||
                  project.summary.toLowerCase().includes(q) ||
                  project.slug.toLowerCase().includes(q) ||
                  project.services.some((service) => service.toLowerCase().includes(q)) ||
                  (clientCredits[project.slug] || "").toLowerCase().includes(q),
              );
            }
            return { section, items };
          })
          .filter((entry) => entry.items.length > 0);
        return { group, sections };
      })
      .filter((entry) => entry.sections.length > 0);
  }, [visibleGroups, activeLeaf, projects, workPage.projectOrder, query, clientCredits]);

  const leafOptions = useMemo(() => {
    const group = layout.find((entry) => entry.id === activeGroup);
    return group?.sections ?? [];
  }, [layout, activeGroup]);

  return (
    <>
      <section className="page-hero work-hero">
        <div className="wrap">
          <p className="kicker">{workPage.eyebrow}</p>
          <h1>{workPage.headline}</h1>
          <p>{workPage.introduction}</p>
          <p className="meta" style={{ marginTop: 12 }}>
            {projects.length} published projects
          </p>
        </div>
      </section>

      <section className="section paper work-filters-section">
        <div className="wrap wrap-wide">
          <p className="kicker">{workPage.exploreLabel}</p>
          <div className="work-filter-bar">
            <div className="chips work-group-chips" role="tablist" aria-label="Main categories">
              <button
                type="button"
                className={activeGroup === "all" ? "chip chip-active" : "chip"}
                onClick={() => {
                  setActiveGroup("all");
                  setActiveLeaf("all");
                }}
              >
                All Work ({projects.length})
              </button>
              {layout.map((group) => {
                const count = groupCounts[group.id] ?? 0;
                if (!count) return null;
                return (
                  <button
                    key={group.id}
                    type="button"
                    className={activeGroup === group.id ? "chip chip-active" : "chip"}
                    onClick={() => {
                      setActiveGroup(group.id);
                      setActiveLeaf("all");
                    }}
                  >
                    {group.label} ({count})
                  </button>
                );
              })}
            </div>
            {activeGroup !== "all" && leafOptions.length > 0 && (
              <div className="chips work-leaf-chips" aria-label="Subcategories">
                <button
                  type="button"
                  className={activeLeaf === "all" ? "chip chip-active" : "chip"}
                  onClick={() => setActiveLeaf("all")}
                >
                  All in {layout.find((g) => g.id === activeGroup)?.label}
                </button>
                {leafOptions.map((section) => {
                  const count = projectsByCategoryList(
                    projects,
                    section.id,
                    workPage.projectOrder[section.id],
                  ).length;
                  if (!count) return null;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      className={activeLeaf === section.id ? "chip chip-active" : "chip"}
                      onClick={() => setActiveLeaf(section.id)}
                    >
                      {section.label} ({count})
                    </button>
                  );
                })}
              </div>
            )}
            <label className="work-search">
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={workPage.searchPlaceholder}
              />
            </label>
          </div>
        </div>
      </section>

      {filteredSections.length === 0 ? (
        <section className="section cream">
          <div className="wrap">
            <p>{workPage.emptyText}</p>
          </div>
        </section>
      ) : (
        filteredSections.map(({ group, sections }) => (
          <section key={group.id} className="section paper" id={group.id}>
            <div className="wrap wrap-wide">
              <p className="kicker">[ {group.label} ]</p>
              {workPage.groupIntros[group.id] && (
                <p className="work-group-intro">{workPage.groupIntros[group.id]}</p>
              )}

              {sections.map(({ section, items }) => {
                const meta = workPage.categoryMeta[section.id];
                const leadSlug = workPage.showLeadProject ? meta?.leadProjectSlug : "";
                const lead = leadSlug ? items.find((item) => item.slug === leadSlug) : undefined;
                const rest = lead ? items.filter((item) => item.slug !== lead.slug) : items;

                return (
                  <div key={section.id} id={section.id} className="category-leaf">
                    <h2 className="category-title">
                      {section.label}
                      <span>{items.length}</span>
                    </h2>
                    {meta?.description && <p className="work-leaf-desc">{meta.description}</p>}

                    {lead && (
                      <Link href={`/work/${lead.slug}`} className="work-lead-card">
                        <div className="work-lead-media">
                          <ProjectCover project={lead} />
                        </div>
                        <div className="work-lead-copy">
                          <p className="kicker">Featured</p>
                          <h3>{lead.title}</h3>
                          {clientCredits[lead.slug] && (
                            <p className="meta">{clientCredits[lead.slug]}</p>
                          )}
                          <p>{lead.summary}</p>
                          <span className="pill">Explore Project</span>
                        </div>
                      </Link>
                    )}

                    <div className="card-grid">
                      {rest.map((project) => (
                        <Link
                          key={project.slug}
                          href={`/work/${project.slug}`}
                          className="project-card"
                        >
                          <ProjectCover project={project} />
                          <h3>{project.title}</h3>
                          {clientCredits[project.slug] && (
                            <p className="meta">{clientCredits[project.slug]}</p>
                          )}
                          <p>{project.summary}</p>
                          <p className="meta">Explore Project</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}

      <section className="section cream">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
            {workPage.ctaHeading}
          </h2>
          <p style={{ maxWidth: 560, margin: "12px auto 24px" }}>{workPage.ctaDescription}</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <UpworkHireLink className="pill solid" href={workPage.ctaPrimaryHref}>
              {workPage.ctaPrimaryLabel}
            </UpworkHireLink>
            <button
              type="button"
              className="pill"
              onClick={() => {
                setActiveGroup("all");
                setActiveLeaf("all");
                setQuery("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {workPage.ctaSecondaryLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

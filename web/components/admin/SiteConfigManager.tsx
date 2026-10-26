"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { categoryGroups, categoryLabel } from "@/lib/content";
import type { OrderedToggle, SiteConfigStore } from "@/lib/site-config";
import type { ProjectCategory } from "@/lib/content";
import { ModelViewer } from "@/components/viewer/ModelViewer";
import {
  isModel3DPath,
  sanitizeViewerBackgroundColor,
  sanitizeViewerHdriSrc,
} from "@/lib/model-viewer";
import {
  ENVIRONMENT_PRESET_OPTIONS,
  HDRI_CATALOG,
  VIEWER_LIGHTING_HDRI_PREFIX,
  VIEWER_LIGHTING_PRESET_PREFIX,
  viewerLightingFromSelectValue,
  viewerLightingToSelectValue,
} from "@/lib/hdri-catalog";
import { ANIMATION_LOOP_OPTIONS } from "@/lib/viewer-animation";

type Props = {
  initialConfig?: SiteConfigStore;
};

function moveItem<T extends string>(list: OrderedToggle<T>[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= list.length) return list;
  const copy = [...list];
  const [removed] = copy.splice(index, 1);
  copy.splice(next, 0, removed);
  return copy;
}

function toggleItem<T extends string>(list: OrderedToggle<T>[], id: T, enabled: boolean) {
  return list.map((item) => (item.id === id ? { ...item, enabled } : item));
}

function moveSectionInGroup(
  workSections: OrderedToggle<ProjectCategory>[],
  groupId: string,
  sectionId: ProjectCategory,
  direction: -1 | 1,
) {
  const group = categoryGroups.find((entry) => entry.id === groupId);
  if (!group) return workSections;
  const groupIds = new Set(group.sections.map((section) => section.id));
  const slots = workSections
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => groupIds.has(item.id));
  const localIndex = slots.findIndex(({ item }) => item.id === sectionId);
  const swapWith = localIndex + direction;
  if (localIndex < 0 || swapWith < 0 || swapWith >= slots.length) return workSections;
  const copy = [...workSections];
  const indexA = slots[localIndex].index;
  const indexB = slots[swapWith].index;
  [copy[indexA], copy[indexB]] = [copy[indexB], copy[indexA]];
  return copy;
}

function OrderList<T extends string>({
  items,
  labelFor,
  onChange,
  nested = false,
  showRank = false,
  onMove,
  grid = false,
}: {
  items: OrderedToggle<T>[];
  labelFor: (id: T) => string;
  onChange: (items: OrderedToggle<T>[]) => void;
  nested?: boolean;
  showRank?: boolean;
  onMove?: (id: T, direction: -1 | 1) => void;
  grid?: boolean;
}) {
  const listClass = [
    "admin-order-list",
    nested && "admin-order-list-nested",
    grid && "admin-order-list-grid",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ul className={listClass}>
      {items.map((item, index) => (
        <li key={item.id} className={item.enabled ? "" : "admin-order-disabled"}>
          {showRank && <span className="admin-order-rank" aria-hidden>{index + 1}</span>}
          <label className="admin-order-check">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => onChange(toggleItem(items, item.id, e.target.checked))}
            />
            <span>{labelFor(item.id)}</span>
          </label>
          <div className="admin-order-actions">
            <button
              type="button"
              className="admin-order-btn"
              disabled={index === 0}
              onClick={() =>
                onMove ? onMove(item.id, -1) : onChange(moveItem(items, index, -1))
              }
              aria-label="Move up"
            >
              ↑
            </button>
            <button
              type="button"
              className="admin-order-btn"
              disabled={index === items.length - 1}
              onClick={() =>
                onMove ? onMove(item.id, 1) : onChange(moveItem(items, index, 1))
              }
              aria-label="Move down"
            >
              ↓
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SiteConfigManager({ initialConfig }: Props = {} as Props) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfigStore | null>(initialConfig ?? null);
  const [ready, setReady] = useState(Boolean(initialConfig));
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      setReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      const response = await fetch("/api/admin/site-config");
      if (!response.ok) {
        if (!cancelled) setLoadError("Could not load configuration.");
        return;
      }
      const data = (await response.json()) as { config: SiteConfigStore };
      if (!cancelled) {
        setConfig(data.config);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialConfig]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const sectionIdsByGroup = useMemo(
    () =>
      new Map(
        categoryGroups.map((group) => [
          group.id,
          new Set(group.sections.map((section) => section.id)),
        ]),
      ),
    [],
  );

  if (loadError) {
    return (
      <div className="admin-panel">
        <p className="admin-error">{loadError}</p>
      </div>
    );
  }

  if (!ready || !config) {
    return (
      <div className="admin-panel" aria-busy="true">
        <p className="meta">Loading configuration…</p>
      </div>
    );
  }

  const activeConfig = config;
  const groupLabels = new Map(categoryGroups.map((g) => [g.id, g.label]));

  const workGroupsInOrder = activeConfig.workGroups;

  function sectionsForGroup(groupId: string) {
    const allowed = sectionIdsByGroup.get(groupId);
    if (!allowed) return [];
    return activeConfig.workSections.filter((section) => allowed.has(section.id));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: activeConfig }),
    });
    setSaving(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(body?.error ?? "Save failed. On Netlify, Blobs must be enabled for live updates.");
      return;
    }
    const data = await response.json();
    setConfig(data.config);
    router.refresh();
    setMessage("Saved. Public site and /viewer updated on the live deploy.");
  }

  const previewModelSrc =
    config.viewerModelSrc.trim() && isModel3DPath(config.viewerModelSrc)
      ? config.viewerModelSrc.trim()
      : undefined;
  const previewHdriSrc = sanitizeViewerHdriSrc(config.viewerHdriSrc) || undefined;
  const previewBackground = sanitizeViewerBackgroundColor(config.viewerBackgroundColor);
  const lightingSelectValue = viewerLightingToSelectValue(
    config.viewerEnvironmentPreset,
    config.viewerHdriSrc,
  );
  const hdriInCatalog = previewHdriSrc
    ? HDRI_CATALOG.some((entry) => entry.file === previewHdriSrc)
    : true;

  return (
    <div className="admin-panel">
      <header className="admin-panel-head">
        <div>
          <h1>Configuration</h1>
          <p className="meta">
            Control categories, work page order, and the shared 3D model viewer on{" "}
            <a href="/work">/work</a> and <a href="/viewer">/viewer</a>.
          </p>
        </div>
        <button type="button" className="pill solid" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </header>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-config-layout">
        <section className="admin-config-block admin-config-block-panel">
          <h2 className="admin-subtitle">Home page featured projects</h2>
          <p className="meta">
            Enabled categories are used in order: one visible project per category, up to the limit below.
            Remaining slots fill from other visible projects.
          </p>
          <label className="admin-inline-field">
            <span>Max projects on home</span>
            <input
              type="number"
              min={1}
              max={12}
              value={config.maxHomeFeatured}
              onChange={(e) =>
                setConfig((current) =>
                  current ? { ...current, maxHomeFeatured: Number(e.target.value) || 6 } : null,
                )
              }
            />
          </label>
          <OrderList
            items={config.homeFeatured}
            labelFor={(id) => categoryLabel(id as ProjectCategory)}
            onChange={(homeFeatured) =>
              setConfig((current) => (current ? { ...current, homeFeatured } : null))}
            showRank
            grid
          />
        </section>

        <section className="admin-config-block admin-config-block-panel admin-config-block-wide">
          <h2 className="admin-subtitle">Work page layout</h2>
          <p className="meta">
            Set the order of main blocks on <a href="/work">/work</a>, then fine-tune categories inside each block.
            Unchecked items are hidden on the public site.
          </p>

          <div className="admin-work-layout">
            <div className="admin-work-layout-groups">
              <h3 className="admin-config-kicker">Main groups</h3>
              <p className="meta admin-config-hint">Top to bottom on the work page.</p>
              <OrderList
                items={config.workGroups}
                labelFor={(id) => groupLabels.get(id) ?? id}
                onChange={(workGroups) =>
                  setConfig((current) => (current ? { ...current, workGroups } : null))}
                showRank
              />
            </div>

            <div className="admin-work-layout-sections">
              <h3 className="admin-config-kicker">Categories by group</h3>
              <p className="meta admin-config-hint">
                Order within each card matches top to bottom inside that block on /work.
              </p>
              <div className="admin-work-sections-grid">
                {workGroupsInOrder.map((orderedGroup) => {
                  const label = groupLabels.get(orderedGroup.id) ?? orderedGroup.id;
                  const items = sectionsForGroup(orderedGroup.id);
                  return (
                    <article
                      key={orderedGroup.id}
                      className={
                        orderedGroup.enabled
                          ? "admin-work-section-group"
                          : "admin-work-section-group admin-work-section-group-muted"
                      }
                    >
                      <header className="admin-work-section-group-head">
                        <h4>{label}</h4>
                        {!orderedGroup.enabled && <span className="admin-work-group-off">Group hidden</span>}
                      </header>
                      <OrderList
                        nested
                        items={items}
                        labelFor={(id) => categoryLabel(id as ProjectCategory)}
                        onChange={(nextForGroup) => {
                          const allowed = sectionIdsByGroup.get(orderedGroup.id)!;
                          setConfig((current) =>
                            current
                              ? {
                                  ...current,
                                  workSections: current.workSections.map((section) => {
                                    if (!allowed.has(section.id)) return section;
                                    return nextForGroup.find((entry) => entry.id === section.id) ?? section;
                                  }),
                                }
                              : null,
                          );
                        }}
                        onMove={(sectionId, direction) =>
                          setConfig((current) =>
                            current
                              ? {
                                  ...current,
                                  workSections: moveSectionInGroup(
                                    current.workSections,
                                    orderedGroup.id,
                                    sectionId as ProjectCategory,
                                    direction,
                                  ),
                                }
                              : null,
                          )
                        }
                      />
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="admin-config-block admin-config-block-panel admin-config-viewer">
        <h2 className="admin-subtitle">3D model viewer</h2>
        <p className="meta">
          Model: <code>.glb</code> / <code>.gltf</code> under <code>Assets/</code>. HDRI lighting:{" "}
          <code>.hdr</code> / <code>.exr</code> in <code>Assets/hdri/</code> (register in{" "}
          <code>web/lib/hdri-catalog.ts</code>). Save to apply on <a href="/viewer">/viewer</a>.
        </p>

        <div className="admin-viewer-options">
          <label className="admin-viewer-field">
            <span>Model path</span>
            <input
              type="text"
              placeholder="/assets/3D/your-folder/model.glb"
              value={config.viewerModelSrc}
              onChange={(e) =>
                setConfig((current) =>
                  current ? { ...current, viewerModelSrc: e.target.value } : null,
                )
              }
              spellCheck={false}
            />
          </label>

          <fieldset className="admin-viewer-field admin-viewer-backdrop">
            <span>Backdrop (what you see behind the model)</span>
            <div className="admin-viewer-backdrop-options">
              <label>
                <input
                  type="radio"
                  name="viewerBackdrop"
                  checked={config.viewerBackdrop === "solid"}
                  onChange={() =>
                    setConfig((current) =>
                      current ? { ...current, viewerBackdrop: "solid" } : null,
                    )
                  }
                />
                Solid color
              </label>
              <label>
                <input
                  type="radio"
                  name="viewerBackdrop"
                  checked={config.viewerBackdrop === "environment"}
                  onChange={() =>
                    setConfig((current) =>
                      current ? { ...current, viewerBackdrop: "environment" } : null,
                    )
                  }
                />
                HDRI / preset sky
              </label>
            </div>
            <small className="admin-viewer-field-note">
              Lighting always comes from your custom HDRI or built-in preset. With solid backdrop, the HDRI
              still lights the model but is not visible as the sky.
            </small>
          </fieldset>

          <label
            className="admin-viewer-field admin-viewer-field-color"
            style={config.viewerBackdrop === "environment" ? { opacity: 0.5 } : undefined}
          >
            <span>Background color (solid backdrop only)</span>
            <div className="admin-viewer-color-row">
              <input
                type="color"
                value={previewBackground}
                disabled={config.viewerBackdrop === "environment"}
                onChange={(e) =>
                  setConfig((current) =>
                    current ? { ...current, viewerBackgroundColor: e.target.value } : null,
                  )
                }
                aria-label="Viewer background color"
              />
              <input
                type="text"
                value={config.viewerBackgroundColor}
                disabled={config.viewerBackdrop === "environment"}
                onChange={(e) =>
                  setConfig((current) =>
                    current ? { ...current, viewerBackgroundColor: e.target.value } : null,
                  )
                }
                spellCheck={false}
              />
            </div>
          </label>

          <label className="admin-viewer-field admin-viewer-field-wide">
            <span>Environment &amp; lighting</span>
            <select
              value={hdriInCatalog ? lightingSelectValue : `${VIEWER_LIGHTING_HDRI_PREFIX}${config.viewerHdriSrc}`}
              onChange={(e) => {
                const next = viewerLightingFromSelectValue(e.target.value);
                setConfig((current) =>
                  current
                    ? {
                        ...current,
                        viewerEnvironmentPreset: next.preset,
                        viewerHdriSrc: next.hdriSrc,
                      }
                    : null,
                );
              }}
            >
              <optgroup label="Built-in">
                {ENVIRONMENT_PRESET_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={`${VIEWER_LIGHTING_PRESET_PREFIX}${option.value}`}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
              {HDRI_CATALOG.length > 0 && (
                <optgroup label="Your HDRIs (Assets/hdri)">
                  {HDRI_CATALOG.map((entry) => (
                    <option
                      key={entry.id}
                      value={`${VIEWER_LIGHTING_HDRI_PREFIX}${entry.file}`}
                    >
                      {entry.label}
                    </option>
                  ))}
                </optgroup>
              )}
              {previewHdriSrc && !hdriInCatalog && (
                <optgroup label="Other">
                  <option value={`${VIEWER_LIGHTING_HDRI_PREFIX}${previewHdriSrc}`}>
                    Custom: {previewHdriSrc}
                  </option>
                </optgroup>
              )}
            </select>
            <small className="admin-viewer-field-note">
              One environment for lighting and (if backdrop is “HDRI / preset sky”) the visible sky.
            </small>
          </label>

          <label className="admin-viewer-field">
            <span>Default animation loop</span>
            <select
              value={config.viewerAnimationLoop}
              onChange={(e) =>
                setConfig((current) =>
                  current
                    ? {
                        ...current,
                        viewerAnimationLoop: e.target.value as typeof config.viewerAnimationLoop,
                      }
                    : null,
                )
              }
            >
              {ANIMATION_LOOP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-viewer-field admin-viewer-check">
            <input
              type="checkbox"
              checked={config.viewerAutoPlayAnimation}
              onChange={(e) =>
                setConfig((current) =>
                  current ? { ...current, viewerAutoPlayAnimation: e.target.checked } : null,
                )
              }
            />
            Auto-play animations when model loads
          </label>

        </div>

        {config.viewerModelSrc.trim() && !previewModelSrc && (
          <p className="admin-viewer-url-error meta">
            Model path must look like <code>/assets/3D/…/model.glb</code>.
          </p>
        )}
        {config.viewerHdriSrc.trim() && !previewHdriSrc && (
          <p className="admin-viewer-url-error meta">
            HDRI path must be <code>/assets/hdri/….hdr</code> or <code>.exr</code>.
          </p>
        )}

        <p className="meta" style={{ marginTop: 8 }}>
          Viewer controls are the icons at the bottom-right of the 3D view (like Sketchfab) on{" "}
          <a href="/viewer">/viewer</a>.
        </p>

        <div className="admin-config-viewer-stage">
          <ModelViewer
            src={previewModelSrc}
            hdriSrc={previewHdriSrc}
            backgroundColor={previewBackground}
            backdrop={config.viewerBackdrop}
            environment={config.viewerEnvironmentPreset}
            defaultAnimationLoop={config.viewerAnimationLoop}
            autoPlayAnimation={config.viewerAutoPlayAnimation}
            alt="Configured portfolio 3D model"
            height={440}
            placeholderLabel="Enter a model path above or leave empty for the default preview shape"
          />
        </div>
      </section>
    </div>
  );
}

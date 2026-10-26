"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  ANIMATION_LOOP_OPTIONS,
  type ViewerAnimationLoop,
} from "@/lib/viewer-animation";
import type { ViewerDisplayMode } from "@/components/viewer/display-mode";
import type { ViewerBackdrop } from "@/lib/model-viewer";
import {
  ENVIRONMENT_PRESET_OPTIONS,
  HDRI_CATALOG,
  VIEWER_LIGHTING_HDRI_PREFIX,
  VIEWER_LIGHTING_PRESET_PREFIX,
} from "@/lib/hdri-catalog";

export type DockPanel = "help" | "settings" | "view" | "animation" | null;

const DISPLAY_OPTIONS: { value: ViewerDisplayMode; label: string }[] = [
  { value: "lit", label: "Lit" },
  { value: "unlit", label: "Unlit" },
  { value: "wireframe", label: "Wireframe" },
];

type Props = {
  containerRef: React.RefObject<HTMLElement | null>;
  openPanel: DockPanel;
  onOpenPanel: (panel: DockPanel) => void;
  hasModel: boolean;
  lightingValue: string;
  onLightingChange: (value: string) => void;
  backdrop: ViewerBackdrop;
  onBackdropChange: (value: ViewerBackdrop) => void;
  backgroundColor: string;
  onBackgroundColorChange: (value: string) => void;
  clipNames: string[];
  activeClip: string;
  onActiveClipChange: (name: string) => void;
  loopMode: ViewerAnimationLoop;
  onLoopModeChange: (mode: ViewerAnimationLoop) => void;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  displayMode: ViewerDisplayMode;
  onDisplayModeChange: (mode: ViewerDisplayMode) => void;
};

function IconHelp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 18h.01M9.5 9a3 3 0 1 1 5.2 2.1c-.9.8-1.7 1.2-1.7 2.4V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 13a7.7 7.7 0 0 0 .1-2l2-1.2-2-3.5-2.3 1a7.9 7.9 0 0 0-1.7-1L15 3h-4l-.5 2.3a7.9 7.9 0 0 0-1.7 1l-2.3-1-2 3.5 2 1.2a7.7 7.7 0 0 0 0 2l-2 1.2 2 3.5 2.3-1a7.9 7.9 0 0 0 1.7 1L11 21h4l.5-2.3a7.9 7.9 0 0 0 1.7-1l2.3 1 2-3.5-2-1.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 4 4 8.5 12 13l8-4.5L12 4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 12.5 12 17l8-4.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 16.5 12 21l8-4.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 7v10l9-5-9-5Z" fill="currentColor" />
    </svg>
  );
}

function IconFullscreen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4H4v4M16 4h4v4M4 16v4h4M20 16v4h-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DockButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={active ? "model-viewer-dock-btn active" : "model-viewer-dock-btn"}
      aria-label={label}
      aria-expanded={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function DockPopover({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="model-viewer-dock-popover" role="dialog" aria-label={title}>
      <p className="model-viewer-dock-popover-title">{title}</p>
      {children}
    </div>
  );
}

export function ModelViewerDock(props: Props) {
  const {
    containerRef,
    openPanel,
    onOpenPanel,
    hasModel,
    lightingValue,
    onLightingChange,
    backdrop,
    onBackdropChange,
    backgroundColor,
    onBackgroundColorChange,
    clipNames,
    activeClip,
    onActiveClipChange,
    loopMode,
    onLoopModeChange,
    playing,
    onPlay,
    onPause,
    onStop,
    displayMode,
    onDisplayModeChange,
  } = props;

  const dockRef = useRef<HTMLDivElement>(null);
  const hasClips = clipNames.length > 0;
  const solidBackdrop = backdrop === "solid";

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!openPanel) return;
      const target = event.target as Node;
      if (dockRef.current?.contains(target)) return;
      onOpenPanel(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openPanel, onOpenPanel]);

  function toggle(panel: DockPanel) {
    onOpenPanel(openPanel === panel ? null : panel);
  }

  async function enterFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await el.requestFullscreen();
    }
  }

  return (
    <div className="model-viewer-dock" ref={dockRef}>
      <div className="model-viewer-dock-item">
        {openPanel === "help" && (
          <DockPopover title="Controls">
            <ul className="model-viewer-dock-help">
              <li>Drag to rotate the model</li>
              <li>Scroll or pinch to zoom</li>
              <li>Use the icons to change lighting and display</li>
            </ul>
          </DockPopover>
        )}
        <DockButton label="Help" active={openPanel === "help"} onClick={() => toggle("help")}>
          <IconHelp />
        </DockButton>
      </div>

      <div className="model-viewer-dock-item">
        {openPanel === "settings" && (
          <DockPopover title="Environment">
            <label className="model-viewer-dock-field">
              <span>Lighting</span>
              <select value={lightingValue} onChange={(e) => onLightingChange(e.target.value)}>
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
                  <optgroup label="HDRIs">
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
              </select>
            </label>
            <div className="model-viewer-dock-field">
              <span>Backdrop</span>
              <div className="model-viewer-dock-segment">
                <button
                  type="button"
                  className={solidBackdrop ? "active" : ""}
                  onClick={() => onBackdropChange("solid")}
                >
                  Solid
                </button>
                <button
                  type="button"
                  className={!solidBackdrop ? "active" : ""}
                  onClick={() => onBackdropChange("environment")}
                >
                  HDRI sky
                </button>
              </div>
            </div>
            {solidBackdrop && (
              <label className="model-viewer-dock-field model-viewer-dock-field-color">
                <span>Color</span>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                />
              </label>
            )}
          </DockPopover>
        )}
        <DockButton
          label="Environment settings"
          active={openPanel === "settings"}
          onClick={() => toggle("settings")}
        >
          <IconSettings />
        </DockButton>
      </div>

      <div className="model-viewer-dock-item">
        {openPanel === "view" && (
          <DockPopover title="Model inspector">
            <div className="model-viewer-dock-options">
              {DISPLAY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={displayMode === option.value ? "active" : ""}
                  onClick={() => onDisplayModeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </DockPopover>
        )}
        <DockButton
          label="Display mode"
          active={openPanel === "view"}
          onClick={() => toggle("view")}
        >
          <IconLayers />
        </DockButton>
      </div>

      <div className="model-viewer-dock-item">
        {openPanel === "animation" && (
          <DockPopover title="Animation">
            {!hasModel && <p className="model-viewer-dock-muted">Add a model to use animations.</p>}
            {hasModel && !hasClips && (
              <p className="model-viewer-dock-muted">This model has no animation clips.</p>
            )}
            {hasModel && hasClips && (
              <div className="model-viewer-dock-stack">
                {clipNames.length > 1 && (
                  <select value={activeClip} onChange={(e) => onActiveClipChange(e.target.value)}>
                    {clipNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                )}
                <div className="model-viewer-dock-transport">
                  <button type="button" onClick={onPlay} disabled={playing}>Play</button>
                  <button type="button" onClick={onPause} disabled={!playing}>Pause</button>
                  <button type="button" onClick={onStop}>Stop</button>
                </div>
                <select
                  value={loopMode}
                  onChange={(e) => onLoopModeChange(e.target.value as ViewerAnimationLoop)}
                >
                  {ANIMATION_LOOP_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}
          </DockPopover>
        )}
        <DockButton
          label="Animation"
          active={openPanel === "animation"}
          onClick={() => toggle("animation")}
        >
          <IconPlay />
        </DockButton>
      </div>

      <div className="model-viewer-dock-item">
        <DockButton label="Fullscreen" active={false} onClick={() => void enterFullscreen()}>
          <IconFullscreen />
        </DockButton>
      </div>
    </div>
  );
}

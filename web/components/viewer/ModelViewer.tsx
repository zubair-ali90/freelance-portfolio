"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useProgress } from "@react-three/drei";
import {
  DEFAULT_VIEWER_BACKGROUND,
  type ModelViewerEnvironment,
  type ViewerBackdrop,
  sanitizeViewerBackgroundColor,
  sanitizeViewerBackdrop,
  sanitizeViewerHdriSrc,
} from "@/lib/model-viewer";
import { sanitizeViewerAnimationLoop, type ViewerAnimationLoop } from "@/lib/viewer-animation";
import type { ViewerDisplayMode } from "@/components/viewer/display-mode";
import {
  viewerLightingFromSelectValue,
  viewerLightingToSelectValue,
} from "@/lib/hdri-catalog";
import { ModelViewerScene } from "@/components/viewer/ModelViewerScene";
import { ModelViewerDock, type DockPanel } from "@/components/viewer/ModelViewerDock";

export type ModelViewerProps = {
  src?: string;
  alt?: string;
  className?: string;
  height?: number | string;
  autoRotate?: boolean;
  environment?: ModelViewerEnvironment;
  hdriSrc?: string;
  backgroundColor?: string;
  backdrop?: ViewerBackdrop;
  placeholderLabel?: string;
  showControls?: boolean;
  defaultAnimationLoop?: ViewerAnimationLoop;
  autoPlayAnimation?: boolean;
};

type LoadState = {
  active: boolean;
  progress: number;
};

function LoadProgressReporter({ onChange }: { onChange: (state: LoadState) => void }) {
  const { active, progress } = useProgress();

  useEffect(() => {
    onChange({ active, progress });
  }, [active, progress, onChange]);

  return null;
}

export function ModelViewer({
  src,
  alt = "3D model",
  className,
  height = 480,
  autoRotate = true,
  environment = "studio",
  hdriSrc,
  backgroundColor = DEFAULT_VIEWER_BACKGROUND,
  backdrop = "solid",
  placeholderLabel = "Preview — add a .glb model to replace this shape",
  showControls = true,
  defaultAnimationLoop = "repeat",
  autoPlayAnimation = true,
}: ModelViewerProps) {
  const [webglOk, setWebglOk] = useState(true);
  const [loading, setLoading] = useState<LoadState>({ active: false, progress: 0 });
  const [clipNames, setClipNames] = useState<string[]>([]);
  const [activeClip, setActiveClip] = useState("");
  const [loopMode, setLoopMode] = useState<ViewerAnimationLoop>(
    sanitizeViewerAnimationLoop(defaultAnimationLoop),
  );
  const [playing, setPlaying] = useState(autoPlayAnimation);
  const [displayMode, setDisplayMode] = useState<ViewerDisplayMode>("lit");
  const [stopSignal, setStopSignal] = useState(0);
  const [openDockPanel, setOpenDockPanel] = useState<DockPanel>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [lightingValue, setLightingValue] = useState(() =>
    viewerLightingToSelectValue(environment, hdriSrc ?? ""),
  );
  const [localBackdrop, setLocalBackdrop] = useState<ViewerBackdrop>(() =>
    sanitizeViewerBackdrop(backdrop),
  );
  const [localBg, setLocalBg] = useState(() => sanitizeViewerBackgroundColor(backgroundColor));

  const lighting = viewerLightingFromSelectValue(lightingValue);
  const sceneHdri = sanitizeViewerHdriSrc(lighting.hdriSrc) || undefined;
  const scenePreset = lighting.preset;
  const solidBackdrop = localBackdrop === "solid";
  const bg = sanitizeViewerBackgroundColor(localBg);

  const onLoadChange = useCallback((state: LoadState) => {
    setLoading(state);
  }, []);

  const onClipsReady = useCallback(
    (names: string[]) => {
      setClipNames(names);
      setActiveClip((current) => {
        if (!names.length) return "";
        if (current && names.includes(current)) return current;
        return names[0];
      });
      if (names.length) setPlaying(autoPlayAnimation);
    },
    [autoPlayAnimation],
  );

  useEffect(() => {
    if (src) useGLTF.preload(src);
  }, [src]);

  useEffect(() => {
    setLocalBg(sanitizeViewerBackgroundColor(backgroundColor));
    setLocalBackdrop(sanitizeViewerBackdrop(backdrop));
    setLightingValue(viewerLightingToSelectValue(environment, hdriSrc ?? ""));
  }, [environment, hdriSrc, backdrop, backgroundColor]);

  useEffect(() => {
    setClipNames([]);
    setActiveClip("");
    setPlaying(autoPlayAnimation);
    setLoopMode(sanitizeViewerAnimationLoop(defaultAnimationLoop));
    setDisplayMode("lit");
    setStopSignal(0);
    if (src) {
      setLoading({ active: true, progress: 0 });
    } else {
      setLoading({ active: false, progress: 0 });
    }
  }, [src, autoPlayAnimation, defaultAnimationLoop]);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      setWebglOk(Boolean(gl));
    } catch {
      setWebglOk(false);
    }
  }, []);

  const sceneControls = useMemo(
    () => ({
      displayMode,
      loopMode,
      playing,
      activeClip,
      stopSignal,
      onClipsReady: src ? onClipsReady : undefined,
    }),
    [src, displayMode, loopMode, playing, activeClip, stopSignal, onClipsReady],
  );

  const rootClass = ["model-viewer", className].filter(Boolean).join(" ");
  const showLoader = Boolean(src) && loading.active;
  const hasModel = Boolean(src);

  if (!webglOk) {
    return (
      <div className={rootClass} style={{ minHeight: height }}>
        <p className="model-viewer-fallback">3D preview is not available in this browser.</p>
      </div>
    );
  }

  return (
    <div
      className={rootClass}
      style={{
        ["--model-viewer-height" as string]: typeof height === "number" ? `${height}px` : height,
        ["--model-viewer-bg" as string]: solidBackdrop ? bg : "transparent",
      }}
    >
      <div className="model-viewer-canvas-wrap" ref={wrapRef} role="img" aria-label={alt}>
        {showLoader && (
          <div className="model-viewer-overlay model-viewer-overlay-dom" aria-live="polite">
            <span className="model-viewer-loader-bar">
              <span style={{ width: `${Math.round(loading.progress)}%` }} />
            </span>
            <span className="meta">Loading model… {Math.round(loading.progress)}%</span>
          </div>
        )}
        <Canvas
          className="model-viewer-canvas"
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.4, 3.2], fov: 42 }}
          gl={{ antialias: true, alpha: !solidBackdrop }}
          onCreated={({ gl }) => {
            gl.setClearColor(bg, solidBackdrop ? 1 : 0);
          }}
        >
          <LoadProgressReporter onChange={onLoadChange} />
          <Suspense fallback={null}>
            <ModelViewerScene
              key={`${scenePreset}-${sceneHdri ?? ""}-${localBackdrop}`}
              src={src}
              autoRotate={autoRotate}
              environment={scenePreset}
              hdriSrc={sceneHdri}
              backgroundColor={bg}
              backdrop={localBackdrop}
              controls={sceneControls}
            />
          </Suspense>
        </Canvas>

        {showControls && (
          <ModelViewerDock
            containerRef={wrapRef}
            openPanel={openDockPanel}
            onOpenPanel={setOpenDockPanel}
            hasModel={hasModel}
            lightingValue={lightingValue}
            onLightingChange={setLightingValue}
            backdrop={localBackdrop}
            onBackdropChange={setLocalBackdrop}
            backgroundColor={bg}
            onBackgroundColorChange={setLocalBg}
            clipNames={clipNames}
            activeClip={activeClip}
            onActiveClipChange={(name) => {
              setActiveClip(name);
              setPlaying(autoPlayAnimation);
            }}
            loopMode={loopMode}
            onLoopModeChange={setLoopMode}
            playing={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onStop={() => {
              setPlaying(false);
              setStopSignal((count) => count + 1);
            }}
            displayMode={displayMode}
            onDisplayModeChange={setDisplayMode}
          />
        )}

        {!src && <p className="model-viewer-placeholder-label meta">{placeholderLabel}</p>}
      </div>
    </div>
  );
}

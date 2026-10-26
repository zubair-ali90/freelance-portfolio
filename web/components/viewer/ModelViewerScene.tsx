"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Center, ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import type { ModelViewerEnvironment } from "@/lib/model-viewer";
import type { ViewerAnimationLoop } from "@/lib/viewer-animation";
import { AnimatedGltfModel } from "@/components/viewer/AnimatedGltfModel";
import { applyDisplayMode, type ViewerDisplayMode } from "@/components/viewer/display-mode";

function ClearColor({ color }: { color: string }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor(color);
  }, [gl, color]);
  return null;
}

function SceneLighting({
  preset,
  hdriSrc,
  showEnvironmentBackground,
}: {
  preset: ModelViewerEnvironment;
  hdriSrc?: string;
  showEnvironmentBackground: boolean;
}) {
  if (hdriSrc) {
    return (
      <Environment
        key={hdriSrc}
        files={hdriSrc}
        background={showEnvironmentBackground}
      />
    );
  }
  return (
    <Environment
      key={preset}
      preset={preset}
      background={showEnvironmentBackground}
    />
  );
}

function PlaceholderMesh({
  autoRotate,
  displayMode,
}: {
  autoRotate: boolean;
  displayMode: ViewerDisplayMode;
}) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!autoRotate || !group.current) return;
    group.current.rotation.y += delta * 0.35;
  });

  useEffect(() => {
    if (group.current) applyDisplayMode(group.current, displayMode);
  }, [displayMode]);

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.55, 0.18, 200, 32]} />
        <meshStandardMaterial color="#d6456a" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.4, 48]} />
        <meshStandardMaterial color="#e7e0d2" roughness={0.9} />
      </mesh>
    </group>
  );
}

export type ModelViewerSceneControls = {
  displayMode: ViewerDisplayMode;
  loopMode?: ViewerAnimationLoop;
  playing?: boolean;
  activeClip?: string;
  stopSignal?: number;
  onClipsReady?: (names: string[]) => void;
};

export function ModelViewerScene({
  src,
  autoRotate,
  environment,
  hdriSrc,
  backgroundColor,
  backdrop,
  controls,
}: {
  src?: string;
  autoRotate: boolean;
  environment: ModelViewerEnvironment;
  hdriSrc?: string;
  backgroundColor: string;
  backdrop: "solid" | "environment";
  controls?: ModelViewerSceneControls;
}) {
  const solidBackdrop = backdrop === "solid";
  const displayMode = controls?.displayMode ?? "lit";

  return (
    <>
      {solidBackdrop && <ClearColor color={backgroundColor} />}
      <ambientLight intensity={solidBackdrop ? 0.45 : 0.25} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <SceneLighting
        preset={environment}
        hdriSrc={hdriSrc}
        showEnvironmentBackground={!solidBackdrop}
      />
      {src && controls?.onClipsReady ? (
        <Center>
          <AnimatedGltfModel
            url={src}
            displayMode={displayMode}
            loopMode={controls.loopMode ?? "repeat"}
            playing={controls.playing ?? false}
            activeClip={controls.activeClip ?? ""}
            stopSignal={controls.stopSignal ?? 0}
            onClipsReady={controls.onClipsReady}
          />
        </Center>
      ) : (
        <PlaceholderMesh autoRotate={autoRotate} displayMode={displayMode} />
      )}
      <ContactShadows position={[0, -0.82, 0]} opacity={0.35} scale={8} blur={2.5} far={4} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1.2}
        maxDistance={12}
        autoRotate={autoRotate}
        autoRotateSpeed={0.65}
      />
    </>
  );
}

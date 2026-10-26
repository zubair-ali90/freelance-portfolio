"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { LoopOnce, LoopPingPong, LoopRepeat, type AnimationAction, type Group } from "three";
import { SkeletonUtils } from "three-stdlib";
import type { ViewerAnimationLoop } from "@/lib/viewer-animation";
import { applyDisplayMode, type ViewerDisplayMode } from "@/components/viewer/display-mode";

type Props = {
  url: string;
  displayMode: ViewerDisplayMode;
  loopMode: ViewerAnimationLoop;
  playing: boolean;
  activeClip: string;
  stopSignal: number;
  onClipsReady: (names: string[]) => void;
};

function configureLoop(action: AnimationAction, loopMode: ViewerAnimationLoop) {
  action.clampWhenFinished = loopMode === "once";
  if (loopMode === "once") {
    action.setLoop(LoopOnce, 1);
  } else if (loopMode === "pingpong") {
    action.setLoop(LoopPingPong, Infinity);
  } else {
    action.setLoop(LoopRepeat, Infinity);
  }
}

export function AnimatedGltfModel({
  url,
  displayMode,
  loopMode,
  playing,
  activeClip,
  stopSignal,
  onClipsReady,
}: Props) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const model = useMemo(() => SkeletonUtils.clone(scene) as Group, [scene]);
  const { actions, names } = useAnimations(animations, group);
  const reportedClips = useRef<string>("");

  useEffect(() => {
    const key = names.join("\0");
    if (key === reportedClips.current) return;
    reportedClips.current = key;
    onClipsReady(names);
  }, [names, onClipsReady]);

  useEffect(() => {
    applyDisplayMode(model, displayMode);
  }, [model, displayMode]);

  useEffect(() => {
    if (!activeClip || !actions[activeClip]) return;

    for (const name of names) {
      actions[name]?.stop();
    }

    const action = actions[activeClip];
    if (!action) return;

    action.reset();
    configureLoop(action, loopMode);
    action.paused = !playing;
    if (playing) action.play();
  }, [actions, activeClip, loopMode, names]);

  useEffect(() => {
    const action = activeClip ? actions[activeClip] : undefined;
    if (!action) return;
    action.paused = !playing;
    if (playing) {
      if (!action.isRunning()) {
        configureLoop(action, loopMode);
        action.play();
      }
    }
  }, [playing, actions, activeClip, loopMode]);

  useEffect(() => {
    if (!activeClip || !actions[activeClip]) return;
    const action = actions[activeClip];
    action.stop();
    action.reset();
  }, [stopSignal, actions, activeClip]);

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

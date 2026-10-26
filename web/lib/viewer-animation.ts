export type ViewerAnimationLoop = "repeat" | "once" | "pingpong";

export const ANIMATION_LOOP_OPTIONS: { value: ViewerAnimationLoop; label: string }[] = [
  { value: "repeat", label: "Loop" },
  { value: "once", label: "Play once" },
  { value: "pingpong", label: "Ping-pong" },
];

export function sanitizeViewerAnimationLoop(value: unknown): ViewerAnimationLoop {
  if (value === "once" || value === "pingpong") return value;
  return "repeat";
}

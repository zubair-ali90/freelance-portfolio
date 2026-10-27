"use client";

import { isVideo } from "@/lib/media";

export function HomeMedia({
  src,
  title,
  className,
  priority = false,
  active = true,
}: {
  src: string;
  title: string;
  className?: string;
  priority?: boolean;
  /** Pause inactive videos for performance. */
  active?: boolean;
}) {
  if (isVideo(src)) {
    return (
      <video
        className={className}
        src={src}
        muted
        playsInline
        loop
        autoPlay={active}
        preload={priority ? "auto" : "metadata"}
        aria-hidden
        ref={(node) => {
          if (!node) return;
          if (active) {
            void node.play().catch(() => undefined);
          } else {
            node.pause();
          }
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      alt={title}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
    />
  );
}

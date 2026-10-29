"use client";

import { memo } from "react";
import type { Project } from "@/lib/content";
import { isEmbed, isVideo } from "@/lib/media";

export type MediaVariant = "preview" | "player";

export function ProjectMedia({
  src,
  title,
  className,
  variant = "player",
}: {
  src: string;
  title: string;
  className?: string;
  variant?: MediaVariant;
}) {
  if (isEmbed(src)) {
    // Gallery thumbnails stay lightweight; covers/player load the live scene.
    if (variant === "preview") {
      return (
        <div className={`embed-thumb ${className ?? ""}`.trim()} aria-hidden>
          <span className="embed-thumb-label">Interactive 3D</span>
          <span className="embed-thumb-host">{hostLabel(src)}</span>
        </div>
      );
    }

    return <EmbedFrame src={src} title={title} className={className} />;
  }

  if (isVideo(src)) {
    if (variant === "preview") {
      return (
        <video
          className={className}
          src={src}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          aria-hidden
        />
      );
    }

    return (
      <video
        className={className}
        src={src}
        muted
        playsInline
        controls
        preload="metadata"
      />
    );
  }

  return <img className={className} src={src} alt={title} loading="lazy" />;
}

const EmbedFrame = memo(function EmbedFrame({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <iframe
      className={`embed-frame ${className ?? ""}`.trim()}
      src={src}
      title={`${title} — interactive viewer`}
      loading="lazy"
      allow="fullscreen; xr-spatial-tracking; gamepad; autoplay"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
});

function hostLabel(src: string) {
  try {
    return new URL(src).hostname.replace(/^www\./, "");
  } catch {
    return "embed";
  }
}

export function ProjectCover({ project }: { project: Project }) {
  const coverIsEmbed = isEmbed(project.cover);

  return (
    <div className={coverIsEmbed ? "poster media-cover media-cover-embed" : "poster media-cover"}>
      <div className="media-frame media-frame-card">
        <ProjectMedia
          src={project.cover}
          title={project.title}
          variant={coverIsEmbed ? "player" : "preview"}
          className="card-media"
        />
      </div>
      {isVideo(project.cover) && <span className="media-badge">video</span>}
      {coverIsEmbed && <span className="media-badge">3D</span>}
    </div>
  );
}

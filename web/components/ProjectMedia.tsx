import type { Project } from "@/lib/content";
import { isVideo } from "@/lib/media";

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

export function ProjectCover({ project }: { project: Project }) {
  return (
    <div className="poster media-cover">
      <div className="media-frame media-frame-card">
        <ProjectMedia src={project.cover} title={project.title} variant="preview" className="card-media" />
      </div>
      {isVideo(project.cover) && <span className="media-badge">video</span>}
    </div>
  );
}

"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Project } from "@/lib/content";
import { isEmbed, isVideo } from "@/lib/media";
import { MediaLightbox } from "@/components/MediaLightbox";
import { ProjectMedia } from "@/components/ProjectMedia";

export function ProjectDetailView({
  project,
  sidebar,
  galleryLabel = "gallery",
}: {
  project: Project;
  sidebar: ReactNode;
  galleryLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const coverIndex = useMemo(() => {
    const index = project.media.indexOf(project.cover);
    return index >= 0 ? index : 0;
  }, [project.cover, project.media]);

  const [selectedIndex, setSelectedIndex] = useState(coverIndex);
  const mainSrc = project.media[selectedIndex] ?? project.cover;
  const mainIsEmbed = isEmbed(mainSrc);

  return (
    <>
      <div className="wrap wrap-wide project-layout">
        <div
          className={
            mainIsEmbed
              ? "media-stage media-stage-hero media-stage-embed"
              : "media-stage media-stage-hero media-stage-click"
          }
          role={mainIsEmbed ? undefined : "button"}
          tabIndex={mainIsEmbed ? undefined : 0}
          onClick={mainIsEmbed ? undefined : () => setActiveIndex(selectedIndex)}
          onKeyDown={
            mainIsEmbed
              ? undefined
              : (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveIndex(selectedIndex);
                  }
                }
          }
          aria-label={mainIsEmbed ? undefined : `Open viewer for ${project.title}`}
        >
          <div
            className={
              mainIsEmbed
                ? "media-frame media-frame-hero media-frame-embed"
                : "media-frame media-frame-hero"
            }
          >
            <ProjectMedia
              key={mainSrc}
              src={mainSrc}
              title={project.title}
              variant={mainIsEmbed ? "player" : "preview"}
              className={mainIsEmbed ? "stage-embed" : "stage-media"}
            />
          </div>
          {mainIsEmbed ? (
            <span className="media-badge">interactive</span>
          ) : (
            <span className="gallery-expand">{isVideo(mainSrc) ? "open player" : "view full"}</span>
          )}
          {isVideo(mainSrc) && <span className="media-badge">loop</span>}
        </div>
        {sidebar}
      </div>

      <div className="wrap wrap-wide">
        <p className="kicker" style={{ marginTop: 48 }}>
          {galleryLabel}
        </p>
        <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 42px)", marginTop: 8 }}>
          Media
        </h2>
        <p className="meta gallery-note">
          Click a thumbnail to show it in the main view. Interactive embeds play in place. Videos use
          posters and metadata preload; open the player for sound and controls.
        </p>
        <div className="gallery">
          {project.media.map((src, index) => (
            <button
              key={src}
              type="button"
              className={selectedIndex === index ? "gallery-item gallery-item-active" : "gallery-item"}
              onClick={() => {
                if (isEmbed(src)) {
                  if (selectedIndex !== index) setSelectedIndex(index);
                  if (activeIndex !== null) setActiveIndex(null);
                  return;
                }
                setSelectedIndex(index);
                setActiveIndex(index);
              }}
              aria-label={`Open ${project.title} item ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : undefined}
            >
              <div className="media-frame media-frame-thumb">
                <ProjectMedia src={src} title={project.title} variant="preview" className="gallery-media" />
              </div>
              <span className="gallery-expand">
                {isEmbed(src) ? "show embed" : isVideo(src) ? "open player" : "view full"}
              </span>
              {isVideo(src) && <span className="media-badge">loop</span>}
              {isEmbed(src) && <span className="media-badge">3D</span>}
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <MediaLightbox
          items={project.media}
          index={activeIndex}
          title={project.title}
          onClose={() => setActiveIndex(null)}
          onChange={(index) => {
            setSelectedIndex(index);
            setActiveIndex(isEmbed(project.media[index] ?? "") ? null : index);
          }}
        />
      )}
    </>
  );
}

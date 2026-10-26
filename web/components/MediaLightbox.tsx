"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { VideoPlayer } from "@/components/VideoPlayer";
import { isVideo } from "@/lib/media";

type Props = {
  items: string[];
  index: number;
  title: string;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function MediaLightbox({ items, index, title, onClose, onChange }: Props) {
  const src = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;
  const scrollYRef = useRef(0);

  const goPrev = useCallback(() => {
    if (hasPrev) onChange(index - 1);
  }, [hasPrev, index, onChange]);

  const goNext = useCallback(() => {
    if (hasNext) onChange(index + 1);
  }, [hasNext, index, onChange]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  // Freeze the page under the overlay without jumping to the top.
  useEffect(() => {
    scrollYRef.current = window.scrollY;
    const { body, documentElement } = document;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      htmlOverflow: documentElement.style.overflow,
    };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    documentElement.style.overflow = "hidden";
    body.dataset.lightboxOpen = "true";

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      documentElement.style.overflow = previous.htmlOverflow;
      delete body.dataset.lightboxOpen;
      window.scrollTo(0, scrollYRef.current);
    };
  }, []);

  const overlay = (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Viewing ${title}`}>
      <button type="button" className="lightbox-backdrop" aria-label="Close" onClick={onClose} />
      <div className="lightbox-panel">
        <div className="lightbox-toolbar">
          <span className="lightbox-count">
            {index + 1} / {items.length}
            {isVideo(src) ? " · video" : ""}
          </span>
          <button type="button" className="pill" onClick={onClose}>
            close
          </button>
        </div>
        <div className="lightbox-stage lightbox-stage-player">
          <VideoPlayer src={src} title={title} />
        </div>
        <div className="lightbox-nav">
          <button type="button" className="pill" disabled={!hasPrev} onClick={goPrev}>
            previous
          </button>
          <button type="button" className="pill" disabled={!hasNext} onClick={goNext}>
            next
          </button>
        </div>
        <p className="lightbox-hint">
          Use the bar below the video for play, sound, and scrubbing · Arrow keys: prev/next
        </p>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}

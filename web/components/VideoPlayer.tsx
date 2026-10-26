"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { formatTime, isVideo } from "@/lib/media";

export function VideoPlayer({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setPlaying(false);
    setMuted(true);
    setCurrent(0);
    setReady(false);
    video.load();
  }, [src]);

  const syncTime = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrent(video.currentTime);
    setDuration(video.duration || 0);
  }, []);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const seek = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(value)) return;
    video.currentTime = value;
    setCurrent(value);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await video.requestFullscreen?.();
  }, []);

  if (!isVideo(src)) {
    return <img className="lightbox-media" src={src} alt={title} />;
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        className="video-player-screen"
        src={src}
        playsInline
        preload="metadata"
        muted={muted}
        onLoadedMetadata={() => {
          syncTime();
          setReady(true);
        }}
        onTimeUpdate={syncTime}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={togglePlay}
      />
      <div className="video-player-bar">
        <button
          type="button"
          className="video-btn"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="video-track">
          <input
            type="range"
            className="video-range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            disabled={!ready}
            onChange={(event) => seek(Number(event.target.value))}
            aria-label="Seek"
            style={{ "--progress": `${progress}%` } as CSSProperties}
          />
          <span className="video-time">
            {formatTime(current)} / {formatTime(duration)}
          </span>
        </div>
        <button
          type="button"
          className={`video-btn ${muted ? "" : "video-btn-active"}`}
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Turn sound on" : "Mute"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
        <button type="button" className="video-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
          ⛶
        </button>
      </div>
      {muted && (
        <p className="video-player-tip">Sound is off — tap the speaker to enable audio.</p>
      )}
    </div>
  );
}

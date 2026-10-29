export function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

/** External interactive embeds (PlayCanvas, etc.) stored as https media entries. */
export function isEmbed(url: string) {
  if (!/^https?:\/\//i.test(url)) return false;
  if (isVideo(url)) return false;
  if (/\.(gif|png|jpe?g|webp|jfif|avif|svg)(\?|$)/i.test(url)) return false;
  return true;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

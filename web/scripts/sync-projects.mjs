import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../Assets");
const out = path.resolve(__dirname, "../lib/projects.json");
const mediaExt = new Set([".mp4", ".webm", ".mov", ".gif", ".png", ".jpg", ".jpeg", ".webp", ".jfif"]);

function relUrl(absPath) {
  const rel = path.relative(root, absPath).split(path.sep).join("/");
  return `/assets/${rel.split("/").map((part) => encodeURIComponent(part)).join("/")}`;
}

function listMedia(folder) {
  const files = [];
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) files.push(...listMedia(full));
    else if (mediaExt.has(path.extname(entry.name).toLowerCase())) files.push(relUrl(full));
  }
  return files;
}

function pickThumb(media) {
  const score = (url) => {
    const ext = path.extname(url).toLowerCase();
    const pri = { ".mp4": 0, ".webm": 1, ".mov": 2, ".gif": 3, ".webp": 4, ".png": 5, ".jpg": 6, ".jpeg": 7, ".jfif": 8 };
    return pri[ext] ?? 9;
  };
  return [...media].sort((a, b) => score(a) - score(b))[0];
}

function slugify(cat, name) {
  return `${cat}-${name
    .toLowerCase()
    .replace(/_/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

function add(cat, title, folderRel) {
  const folder = path.join(root, folderRel);
  if (!fs.existsSync(folder)) return null;
  const media = listMedia(folder);
  if (!media.length) return null;
  return {
    category: cat,
    slug: slugify(cat, title),
    title: title.replace(/_$/g, "").trim(),
    folder: folderRel.replace(/\\/g, "/"),
    summary: `Work from ${folderRel.replace(/\\/g, "/")}.`,
    cover: pickThumb(media),
    media,
  };
}

const projects = [];

for (const name of fs.readdirSync(path.join(root, "3D")).sort()) {
  const item = add("3d", name, path.join("3D", name));
  if (item) projects.push(item);
}

const unrealEnv = path.join(root, "Unreal", "enviornment");
if (fs.existsSync(unrealEnv)) {
  for (const name of fs.readdirSync(unrealEnv).sort()) {
    const full = path.join(unrealEnv, name);
    if (fs.statSync(full).isDirectory()) {
      const item = add("unreal", name, path.join("Unreal", "enviornment", name));
      if (item) projects.push(item);
    }
  }
}

for (const name of fs.readdirSync(path.join(root, "Untiy")).sort()) {
  const item = add("unity", name, path.join("Untiy", name));
  if (item) projects.push(item);
}

fs.writeFileSync(out, JSON.stringify(projects, null, 2));
console.log(`Synced ${projects.length} projects to lib/projects.json`);

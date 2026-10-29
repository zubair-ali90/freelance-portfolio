import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../Assets");
const out = path.resolve(__dirname, "../lib/projects.json");
const mediaExt = new Set([".mp4", ".webm", ".mov", ".gif", ".png", ".jpg", ".jpeg", ".webp", ".jfif"]);

/**
 * Leaf categories from the portfolio tree:
 * product-animation | character | installation | explainer
 * product-renders | hero-renders | lifestyle-renders | standalone
 * interior-exterior | interior | exterior | arc-viz
 * unity | unreal
 *
 * Note: 3D/Product is expanded into one project per direct subfolder (not listed here).
 */
const assignments = [
  // Product animation
  ["product-animation", "3D product GIF", "3D/3D product GIF"],
  ["product-animation", "Cars", "3D/Cars"],
  ["product-animation", "Product animation", "3D/Product animation"],
  ["product-animation", "Organic", "3D/organic"],
  ["product-animation", "AI product", "AI/Product"],

  // 3D character development
  ["character", "Anime", "3D/Anime_"],
  ["character", "Character animation", "3D/character animation"],
  ["character", "Robert creatures", "3D/Robert creatures"],
  ["character", "Ryan character", "3D/Ryan character Animation"],
  ["character", "Thomas bee", "3D/Thomas bee"],
  ["character", "Trey anime character", "3D/Trey Anime character"],
  ["character", "Bird", "3D/Bird"],
  ["character", "Mascot", "Mascot"],
  ["character", "Horseman", "horseman-horse"],
  ["character", "Low poly", "Low poly"],

  // Installation animation
  ["installation", "Event visualization", "event visualization"],
  ["installation", "Industrial visualization", "Industrial visualization"],

  // Product explainer
  ["explainer", "Blueprint illustrator", "2d/Blueprint Illustrator"],
  ["explainer", "Process explainer", "2d/explainer"],
  ["explainer", "App animation", "3D/App Animation"],
  ["explainer", "Training video", "3D/training video"],
  ["explainer", "Website animation", "3D/website animation"],
  ["explainer", "AI website animation", "AI/Website animation"],
  ["explainer", "Configurator", "Configurator"],
  ["explainer", "Jon", "Jon"],
  ["explainer", "SaaS films", "SaaS apple style video"],

  // Product renders (3D/Product subfolders are expanded below)
  ["product-renders", "Packaging", "3D/Packaging"],
  ["product-renders", "Sports", "Sports"],

  // Hero renders
  ["hero-renders", "CGI", "3D/CGI"],
  ["hero-renders", "Jets", "3D/jets"],
  ["hero-renders", "Lighting showcase", "3D/Lighting Showcase"],

  // Lifestyle renders
  ["lifestyle-renders", "Furniture", "3D/Furniture"],
  ["lifestyle-renders", "Luxury bridal boutique", "3D/Luxury-Bridal-Boutique"],

  // Standalone
  ["standalone", "2D environments", "2d/environment"],
  ["standalone", "Art pieces", "3D/art pieces"],
  ["standalone", "Sculpture", "3D/Sculpture"],
  ["standalone", "Weapon", "3D/Weapon"],

  // Architectural
  ["interior-exterior", "Interior + exterior", "3D/Exterior-Interior/Ex+In"],
  ["interior", "Interior", "3D/Exterior-Interior/Interior"],
  ["interior", "Game room", "3D/Exterior-Interior/Game room"],
  ["exterior", "Exterior", "3D/Exterior-Interior/Exterior"],
  ["arc-viz", "Oil refinery vessel", "3D/Oil Refinery Vessel"],

  // Development — Unity
  ["unity", "Unity character", "Untiy/character"],
  ["unity", "Nature", "Untiy/Nature"],
  ["unity", "Unity environment", "Untiy/Unity environment"],
  ["unity", "Unity game", "Untiy/Unity Game"],
  ["unity", "Viva Play", "Untiy/Viva Play"],

  // Development — Unreal
  ["unreal", "Castle interior", "Unreal/enviornment/Castle interior"],
  ["unreal", "Fantasy castle", "Unreal/enviornment/Fantasy Castle Environment"],
  ["unreal", "Michaela environment", "Unreal/enviornment/Michaela Enviornment"],
];

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
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

/** One project per direct child folder of 3D/Product that contains media. */
function expandProductRenderFolders() {
  const parentRel = "3D/Product";
  const parent = path.join(root, ...parentRel.split("/"));
  const next = [];
  const missing = [];
  if (!fs.existsSync(parent)) {
    return { assignments: next, missing: [parentRel] };
  }
  for (const entry of fs.readdirSync(parent, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folderRel = `${parentRel}/${entry.name}`;
    const media = listMedia(path.join(parent, entry.name));
    if (!media.length) {
      missing.push(`${folderRel} (no media)`);
      continue;
    }
    next.push(["product-renders", entry.name, folderRel]);
  }
  // Keep Packaging / Sports after Product children in category order.
  next.sort((a, b) => a[1].localeCompare(b[1]));
  return { assignments: next, missing };
}

const expandedProduct = expandProductRenderFolders();
const packagingIndex = assignments.findIndex(
  (row) => row[0] === "product-renders" && row[2] === "3D/Packaging",
);
const allAssignments = [
  ...assignments.slice(0, packagingIndex),
  ...expandedProduct.assignments,
  ...assignments.slice(packagingIndex),
];

const projects = [];
const missing = [...expandedProduct.missing];

for (const [category, title, folderRel] of allAssignments) {
  const folder = path.join(root, ...folderRel.split("/"));
  if (!fs.existsSync(folder)) {
    missing.push(folderRel);
    continue;
  }
  const media = listMedia(folder);
  if (!media.length) {
    missing.push(`${folderRel} (no media)`);
    continue;
  }
  projects.push({
    category,
    slug: slugify(category, title),
    title,
    folder: folderRel,
    summary: `${title} — ${folderRel}.`,
    cover: pickThumb(media),
    media,
  });
}

fs.writeFileSync(out, JSON.stringify(projects, null, 2));
console.log(`Synced ${projects.length} projects to lib/projects.json`);
console.log(
  `Product subfolder projects: ${expandedProduct.assignments.map((row) => row[1]).join(", ") || "(none)"}`,
);
if (missing.length) console.log("Missing:\n" + missing.join("\n"));

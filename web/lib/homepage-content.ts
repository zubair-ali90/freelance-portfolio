/** Homepage narrative copy and featured-chapter config (homepage only). */

export type FeaturedChapterCopy = {
  slug: string;
  clientLabel: string;
  headline: string;
  body: string;
  cta: string;
};

export const featuredChaptersCopy: FeaturedChapterCopy[] = [
  {
    slug: "character-anime",
    clientLabel: "MNSTR Assoc — 360° Product Animation",
    headline: "Every detail. Every angle.",
    body: "360-degree product animation for anime-inspired jewelry, created to showcase design, materials, and craftsmanship from every perspective.",
    cta: "Explore Project",
  },
  {
    slug: "explainer-configurator",
    clientLabel: "Interactive Configurators — Adam AI, Engo Planet & Blue Bird",
    headline: "Don't just show it. Let people explore it.",
    body: "Interactive 3D experiences that transform static product presentations into customizable, engaging experiences that users can explore directly in their browser.",
    cta: "Explore Project",
  },
  {
    slug: "explainer-app-animation",
    clientLabel: "Artscapes — Augmented Reality",
    headline: "Beyond the screen. Into the real world.",
    body: "An interactive AR experience developed with Unity for iOS and Android, bringing digital content into real-world environments.",
    cta: "Explore Project",
  },
];

export const expertiseItems = [
  {
    id: "product",
    index: "01",
    title: "Product CGI & Animation",
    body: "Photorealistic product renders, detailed 3D models, and animations that make every angle count.",
    href: "/work#animation",
    mediaSlug: "product-animation-product-animation",
  },
  {
    id: "character",
    index: "02",
    title: "Characters & Motion",
    body: "Expressive characters, stylized animations, and carefully crafted 3D assets for stories, games, and digital experiences.",
    href: "/work#animation",
    mediaSlug: "character-mascot",
  },
  {
    id: "spaces",
    index: "03",
    title: "Spaces & Environments",
    body: "Architectural visualization, interiors, exteriors, and immersive environments that bring spaces to life before they're built.",
    href: "/work#architectural",
    mediaSlug: "interior-interior",
  },
  {
    id: "interactive",
    index: "04",
    title: "Interactive 3D & AR",
    body: "Real-time 3D experiences, interactive configurators, and augmented reality applications that turn viewers into participants.",
    href: "/work#development",
    mediaSlug: "explainer-configurator",
  },
] as const;

export const processSteps = [
  {
    index: "01",
    title: "Discover",
    body: "We define your vision, goals, visual references, and project requirements.",
  },
  {
    index: "02",
    title: "Create",
    body: "I bring your idea to life through design, development, and carefully reviewed iterations.",
  },
  {
    index: "03",
    title: "Deliver",
    body: "You receive organized, production-ready assets prepared for their intended platform and purpose.",
  },
] as const;

/** Prefer named collaborations with project links; quotes flagged as unverified. */
export const trustEvidenceSlugs = [
  "character-anime",
  "standalone-weapon",
  "explainer-app-animation",
] as const;

export const HERO_FALLBACK_MEDIA = "/assets/3D/Cars/Porsche%20911%20Turbo%20CGI%20Animation.mp4";

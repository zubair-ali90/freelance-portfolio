import { MediaLibraryManager } from "@/components/admin/MediaLibraryManager";
import { buildMediaCatalogWithVisibility } from "@/lib/cms/media-catalog";

export const instant = false;

export const metadata = { title: "Media Library | Admin" };

export default async function AdminMediaPage() {
  const assets = await buildMediaCatalogWithVisibility();
  return <MediaLibraryManager assets={assets} />;
}

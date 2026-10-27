import { MediaLibraryManager } from "@/components/admin/MediaLibraryManager";
import { buildMediaCatalog } from "@/lib/cms/media-catalog";

export const instant = false;

export const metadata = { title: "Media Library | Admin" };

export default function AdminMediaPage() {
  const assets = buildMediaCatalog();
  return <MediaLibraryManager assets={assets} />;
}

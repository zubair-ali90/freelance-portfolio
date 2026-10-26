import { ViewerLab } from "@/components/viewer/ViewerLab";
import { MODEL_3D_EXTENSIONS, resolveViewerDisplayOptions } from "@/lib/model-viewer";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = {
  title: "3D viewer | Zubair",
  robots: { index: false, follow: false },
};

export default async function ViewerLabPage() {
  const formats = MODEL_3D_EXTENSIONS.join(", ");
  const config = await readSiteConfig();
  const display = resolveViewerDisplayOptions(config);

  return (
    <main>
      <section className="section cream">
        <div className="wrap wrap-wide">
          <p className="kicker">lab</p>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", marginTop: 8 }}>3D model viewer</h1>
          <p style={{ maxWidth: 640, marginTop: 12 }}>
            General-purpose viewer for characters and product models. Settings (model, background, HDRI) are
            managed in Admin → Configuration.
          </p>
          <ViewerLab formats={formats} display={display} />
        </div>
      </section>
    </main>
  );
}

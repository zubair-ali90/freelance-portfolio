"use client";

import Link from "next/link";
import { ModelViewer } from "@/components/viewer/ModelViewer";
import type { ViewerDisplayOptions } from "@/lib/model-viewer";

type Props = {
  formats: string;
  display: ViewerDisplayOptions;
};

export function ViewerLab({ formats, display }: Props) {
  return (
    <>
      <p className="meta" style={{ marginTop: 8 }}>
        Models: {formats}. HDR/EXR lighting files go in <code>Assets/hdri/</code> (see README there).
      </p>

      <div style={{ marginTop: 32 }}>
        <ModelViewer
          src={display.modelSrc}
          hdriSrc={display.hdriSrc}
          backgroundColor={display.backgroundColor}
          backdrop={display.backdrop}
          environment={display.environmentPreset}
          defaultAnimationLoop={display.animationLoop}
          autoPlayAnimation={display.autoPlayAnimation}
          alt="Portfolio 3D viewer preview"
          height={520}
          placeholderLabel="No model yet — configure one in Admin → Configuration"
        />
      </div>

      <div className="hero-actions" style={{ marginTop: 28 }}>
        <Link className="pill solid" href="/work">Back to work</Link>
      </div>
    </>
  );
}

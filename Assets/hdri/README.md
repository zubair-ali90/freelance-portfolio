# HDRI environment maps (3D viewer)

Put **equirectangular** environment files here for the portfolio 3D viewer lighting.

## Supported formats (Three.js / react-three-drei)

| Format | Extension | Notes |
|--------|-----------|--------|
| **HDR (RGBE)** | `.hdr` | **Recommended.** Most common for web IBL. |
| **OpenEXR** | `.exr` | Supported; use for high-dynamic-range EXR panoramas. |

Not used for image-based lighting in this viewer:

- `.jpg` / `.png` panoramas (use HDR/EXR instead for proper lighting)
- `.hdz` / compressed variants (convert to `.hdr` first)

## File layout

```text
Assets/hdri/
  wooden_studio_10_4k.hdr
  studio_wizja_03_4k.hdr
  citrus_orchard_road_puresky_4k.hdr
```

Public URLs: `/assets/hdri/<filename>.hdr` (also registered in `web/lib/hdri-catalog.ts`).

## Enable in admin

1. Copy files into this folder.
2. In `web/lib/hdri-catalog.ts`, add an entry for each file (label + path).
3. Open **Admin → Configuration → 3D model viewer**, pick the HDRI or paste the path, then **Save**.

If no custom HDRI is set, the viewer uses a built-in preset (Studio, City, …).

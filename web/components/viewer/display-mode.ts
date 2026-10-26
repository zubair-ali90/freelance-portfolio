import {
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type Material,
  type Object3D,
} from "three";

export type ViewerDisplayMode = "lit" | "unlit" | "wireframe";

const originalMaterials = new WeakMap<Mesh, Material | Material[]>();

function stashOriginal(mesh: Mesh) {
  if (!originalMaterials.has(mesh)) {
    originalMaterials.set(mesh, mesh.material);
  }
}

function getOriginal(mesh: Mesh) {
  return originalMaterials.get(mesh) ?? mesh.material;
}

function toUnlitMaterial(source: Material): MeshBasicMaterial {
  const basic = new MeshBasicMaterial();
  if (source instanceof MeshStandardMaterial) {
    basic.map = source.map;
    basic.color.copy(source.color);
    basic.alphaMap = source.alphaMap;
    basic.transparent = source.transparent;
    basic.opacity = source.opacity;
  } else if (source instanceof MeshBasicMaterial) {
    basic.copy(source);
  } else if ("color" in source && source.color) {
    basic.color.copy(source.color as MeshStandardMaterial["color"]);
  }
  return basic;
}

export function applyDisplayMode(root: Object3D, mode: ViewerDisplayMode) {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    stashOriginal(child);
    const original = getOriginal(child);
    const list = Array.isArray(original) ? original : [original];

    if (mode === "lit") {
      child.material = original;
      const applied = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of applied) {
        if (material && "wireframe" in material) {
          material.wireframe = false;
          material.needsUpdate = true;
        }
      }
      return;
    }

    if (mode === "wireframe") {
      child.material = original;
      const applied = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of applied) {
        if (material && "wireframe" in material) {
          material.wireframe = true;
          material.needsUpdate = true;
        } else if (material instanceof MeshBasicMaterial) {
          material.wireframe = true;
          material.needsUpdate = true;
        }
      }
      return;
    }

    const unlit = list.map((material) => toUnlitMaterial(material));
    child.material = unlit.length === 1 ? unlit[0] : unlit;
  });
}

import * as THREE from "three";

export type Materials = ReturnType<typeof createMaterials>;

export function createMaterials() {
  return {
    hit: new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }),
  };
}

export function hitProxy(geometry: THREE.BufferGeometry, materials: Materials, selectId: string) {
  const mesh = new THREE.Mesh(geometry, materials.hit);
  mesh.userData.selectId = selectId;
  mesh.renderOrder = -1;
  return mesh;
}

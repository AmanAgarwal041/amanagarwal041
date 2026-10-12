import type * as THREE from "three";
import type { Materials } from "./materials";

export type FrameState = {
  time: number;
  delta: number;
  reduced: boolean;
  hover: string | null;
  near: string | null;
};

export type Collider = { x: number; z: number; r: number };

export interface WorldObject {
  group: THREE.Group;
  /** Meshes the raycaster tests; each carries `userData.selectId`. */
  hits: THREE.Object3D[];
  colliders: Collider[];
  update?(state: FrameState): void;
}

export type BuildContext = {
  materials: Materials;
  quality: "high" | "medium";
};

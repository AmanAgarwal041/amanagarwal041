import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** One stud pitch in world units. Brick and plate heights follow real LEGO ratios. */
export const STUD = 0.4;
export const PLATE = 0.16;
export const BRICK = 0.48;
const GAP = 0.014;
const STUD_RADIUS = STUD * 0.3;
const STUD_HEIGHT = 0.085;

export const lego = {
  red: 0xe3000b,
  yellow: 0xffcd03,
  blue: 0x0a5bd6,
  azure: 0x3fb4f0,
  green: 0x00a650,
  lime: 0xa6d61b,
  darkGreen: 0x1f7a3d,
  orange: 0xff8a00,
  purple: 0xb05cff,
  pink: 0xff6fb5,
  white: 0xf5f3ee,
  lightGray: 0xb4b8bb,
  darkGray: 0x5d6266,
  black: 0x24262a,
  tan: 0xe6cf9c,
  darkTan: 0xb08e5f,
  brown: 0x7a4a26,
  reddishBrown: 0x8c3f24,
  navy: 0x16285a,
} as const;

type Finish = { trans?: boolean; glow?: number };

const materials = new Map<string, THREE.MeshStandardMaterial>();

/** Shared glossy ABS-style material per color and finish. */
export function plastic(color: number, finish: Finish = {}) {
  const key = `${color}:${finish.trans ? 1 : 0}:${finish.glow ?? 0}`;
  let material = materials.get(key);
  if (!material) {
    material = new THREE.MeshStandardMaterial({
      color,
      roughness: finish.trans ? 0.12 : 0.34,
      metalness: 0,
      transparent: Boolean(finish.trans),
      opacity: finish.trans ? 0.62 : 1,
      depthWrite: !finish.trans,
      emissive: finish.glow ? color : 0x000000,
      emissiveIntensity: finish.glow ?? 0,
    });
    materials.set(key, material);
  }
  return material;
}

let studGeometry: THREE.BufferGeometry | null = null;
function stud() {
  if (!studGeometry) {
    studGeometry = new THREE.CylinderGeometry(STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 12);
    studGeometry.translate(0, STUD_HEIGHT / 2, 0);
  }
  return studGeometry;
}

type Options = Finish & { studs?: boolean };

/**
 * Collects bricks in local space and builds one merged mesh per color plus one
 * instanced mesh of studs per color, so a whole model costs a handful of draw calls.
 */
export class Kit {
  private bodies = new Map<string, { finish: Finish; color: number; parts: THREE.BufferGeometry[] }>();
  private studs = new Map<string, { finish: Finish; color: number; points: THREE.Vector3[] }>();

  private bucket(color: number, finish: Finish) {
    const key = `${color}:${finish.trans ? 1 : 0}:${finish.glow ?? 0}`;
    let body = this.bodies.get(key);
    if (!body) {
      body = { finish, color, parts: [] };
      this.bodies.set(key, body);
    }
    let studs = this.studs.get(key);
    if (!studs) {
      studs = { finish, color, points: [] };
      this.studs.set(key, studs);
    }
    return { body, studs };
  }

  /** Axis-aligned brick. `x`/`z` are the center, `y` the bottom; `w`/`d` in studs, `h` in world units. */
  brick(x: number, y: number, z: number, w: number, d: number, h: number, color: number, options: Options = {}) {
    const { body, studs } = this.bucket(color, options);
    const geometry = new THREE.BoxGeometry(w * STUD - GAP, h - GAP / 2, d * STUD - GAP);
    geometry.translate(x, y + h / 2, z);
    body.parts.push(geometry);
    if (options.studs !== false) {
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < d; j++) {
          studs.points.push(
            new THREE.Vector3(x - (w * STUD) / 2 + (i + 0.5) * STUD, y + h, z - (d * STUD) / 2 + (j + 0.5) * STUD),
          );
        }
      }
    }
    return this;
  }

  /** Round brick or plate with `diameter` in studs. */
  round(x: number, y: number, z: number, diameter: number, h: number, color: number, options: Options = {}) {
    const { body, studs } = this.bucket(color, options);
    const r = (diameter * STUD) / 2 - GAP / 2;
    const geometry = new THREE.CylinderGeometry(r, r, h - GAP / 2, 10 + diameter * 4);
    geometry.translate(x, y + h / 2, z);
    body.parts.push(geometry);
    if (options.studs !== false) {
      if (diameter <= 1) studs.points.push(new THREE.Vector3(x, y + h, z));
      else {
        const half = (diameter - 1) / 2;
        for (let i = 0; i < diameter; i++) {
          for (let j = 0; j < diameter; j++) {
            const sx = (i - half) * STUD;
            const sz = (j - half) * STUD;
            if (Math.hypot(sx, sz) <= r - STUD_RADIUS) studs.points.push(new THREE.Vector3(x + sx, y + h, z + sz));
          }
        }
      }
    }
    return this;
  }

  /** Any pre-positioned geometry, merged with the rest of its color. */
  part(geometry: THREE.BufferGeometry, color: number, finish: Finish = {}) {
    this.bucket(color, finish).body.parts.push(geometry);
    return this;
  }

  build({ castShadow = true, studShadows = false }: { castShadow?: boolean; studShadows?: boolean } = {}) {
    const group = new THREE.Group();
    for (const { finish, color, parts } of this.bodies.values()) {
      if (!parts.length) continue;
      const merged = mergeGeometries(parts.map(normalize), false);
      parts.forEach((part) => part.dispose());
      if (!merged) continue;
      const mesh = new THREE.Mesh(merged, plastic(color, finish));
      mesh.castShadow = castShadow && !finish.trans;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    const matrix = new THREE.Matrix4();
    for (const { finish, color, points } of this.studs.values()) {
      if (!points.length) continue;
      const mesh = new THREE.InstancedMesh(stud(), plastic(color, finish), points.length);
      points.forEach((point, index) => {
        matrix.makeTranslation(point.x, point.y, point.z);
        mesh.setMatrixAt(index, matrix);
      });
      mesh.castShadow = studShadows;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    return group;
  }
}

function normalize(geometry: THREE.BufferGeometry) {
  for (const name of Object.keys(geometry.attributes)) {
    if (!["position", "normal", "uv"].includes(name)) geometry.deleteAttribute(name);
  }
  return geometry.index ? geometry.toNonIndexed() : geometry;
}

/** A box rotated around Y, for parts that follow curves (roads, rings). */
export function orientedBox(x: number, y: number, z: number, w: number, h: number, d: number, angle: number) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  geometry.rotateY(angle);
  geometry.translate(x, y + h / 2, z);
  return geometry;
}

import * as THREE from "three";
import { BRICK, Kit, lego, PLATE, plastic, STUD } from "./bricks";
import { captionTexture, glowTexture } from "./textures";
import type { BuildContext, Collider, FrameState } from "./types";
import { SPAWN, stations } from "@/content/world";

export const ISLAND_RADIUS = 15;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Lays a stepped disc of bricks, one row per two studs, so the edge reads as LEGO steps. */
function disc(kit: Kit, radius: number, y: number, h: number, color: number, studs: boolean) {
  const cell = STUD * 2;
  const rows = Math.floor(radius / cell);
  for (let r = -rows; r < rows; r++) {
    const zc = (r + 0.5) * cell;
    const half = Math.sqrt(Math.max(0, radius * radius - zc * zc));
    const cells = Math.floor(half / cell);
    if (cells < 1) continue;
    kit.brick(0, y, zc, cells * 4, 2, h, color, { studs });
  }
}

export function buildIsland(ctx: BuildContext) {
  const group = new THREE.Group();
  const rand = seeded(7);

  const top = new Kit();
  disc(top, ISLAND_RADIUS, -BRICK, BRICK, lego.green, true);
  group.add(top.build({ castShadow: false }));

  const earth = new Kit();
  const tiers = [lego.darkTan, lego.brown, lego.reddishBrown, lego.darkGray, lego.brown, lego.darkGray];
  tiers.forEach((color, index) => {
    const radius = ISLAND_RADIUS - 0.8 - index * 1.9;
    disc(earth, radius, -BRICK - (index + 1) * BRICK * 2, BRICK * 2, color, false);
  });
  for (const [x, z] of [
    [-6.4, 12.4],
    [7.2, 11.8],
    [13.1, 3.4],
  ]) {
    for (let i = 0; i < 6; i++) {
      earth.brick(x, -BRICK * (2 + i * 1.6), z, 2, 1, BRICK * 1.6, lego.azure, { trans: true, studs: false });
    }
  }
  group.add(earth.build({ castShadow: false }));

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(ISLAND_RADIUS, 48),
    ctx.materials.hit,
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.09;
  ground.userData.ground = true;
  group.add(ground);

  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(64, 64),
    new THREE.MeshBasicMaterial({
      map: glowTexture("rgba(63,180,240,0.4)"),
      transparent: true,
      depthWrite: false,
      fog: false,
    }),
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = -12;
  group.add(halo);

  group.add(buildPaths());

  const colliders: Collider[] = [];
  const decor = buildDecor(rand, colliders);
  group.add(decor.group);

  return { group, ground, colliders, update: decor.update };
}

function buildPaths() {
  const kit = new Kit();
  const start = new THREE.Vector2(SPAWN[0], SPAWN[1]);
  let index = 0;
  for (const station of stations) {
    const end = new THREE.Vector2(station.approach[0], station.approach[1]);
    const mid = start.clone().lerp(end, 0.5);
    const normal = new THREE.Vector2(-(end.y - start.y), end.x - start.x).normalize();
    mid.addScaledVector(normal, 0.9);
    const count = Math.floor(start.distanceTo(end) / 1.0);
    for (let i = 2; i < count; i++) {
      const t = i / count;
      const point = start.clone().lerp(mid, t).lerp(mid.clone().lerp(end, t), t);
      const color = index % 7 === 3 ? lego.yellow : index % 2 ? lego.tan : lego.white;
      kit.round(point.x, 0, point.y, 2, 0.1, color, { studs: false });
      index++;
    }
  }
  return kit.build({ castShadow: false });
}

function tree(kit: Kit, x: number, z: number, size: number, leaf: number) {
  const trunk = Math.round(1 + size);
  for (let i = 0; i < trunk; i++) kit.round(x, i * BRICK, z, 1, BRICK, lego.brown, { studs: false });
  let y = trunk * BRICK;
  const widths = size > 1 ? [5, 4, 3, 2, 1] : [4, 3, 2, 1];
  for (const w of widths) {
    if (w === 1) kit.round(x, y, z, 1, BRICK, leaf);
    else kit.brick(x, y, z, w, w, BRICK, leaf);
    y += BRICK;
  }
}

function bush(kit: Kit, x: number, z: number) {
  kit.round(x, 0, z, 2, BRICK, lego.darkGreen);
  kit.round(x + 0.5, 0, z + 0.3, 1, PLATE * 2, lego.lime);
}

function flowers(kit: Kit, x: number, z: number, rand: () => number) {
  const colors = [lego.red, lego.yellow, lego.white, lego.pink, lego.purple];
  for (let i = 0; i < 4; i++) {
    const fx = x + (rand() - 0.5) * 1.2;
    const fz = z + (rand() - 0.5) * 1.2;
    kit.round(fx, 0, fz, 1, PLATE * 2, lego.green, { studs: false });
    kit.round(fx, PLATE * 2, fz, 1, PLATE, colors[Math.floor(rand() * colors.length)]);
  }
}

function rock(kit: Kit, x: number, z: number, size: number) {
  kit.brick(x, 0, z, 3, 2, BRICK, lego.lightGray);
  if (size > 0.7) kit.brick(x + 0.2, BRICK, z - 0.1, 2, 2, BRICK, lego.darkGray);
}

function buildDecor(rand: () => number, colliders: Collider[]) {
  const group = new THREE.Group();
  const kit = new Kit();

  const trees: [number, number, number, number][] = [
    [-12.6, -3.6, 1.4, lego.green],
    [-11.8, -5.2, 0.8, lego.lime],
    [-3.6, -12.8, 1.4, lego.darkGreen],
    [3.8, -12.4, 0.9, lego.lime],
    [5.2, -11.6, 1.3, lego.green],
    [12.6, -2.2, 1.0, lego.darkGreen],
    [11.2, 7.6, 1.3, lego.green],
    [-11.4, 4.2, 1.0, lego.lime],
    [-3.6, 11.8, 0.9, lego.darkGreen],
    [3.4, 12.6, 1.2, lego.green],
    [-12.8, 1.2, 0.8, lego.darkGreen],
    [13.2, -5.6, 0.9, lego.lime],
  ];
  for (const [x, z, s, color] of trees) {
    tree(kit, x, z, s, color);
    colliders.push({ x, z, r: 0.5 + s * 0.3 });
  }

  for (const [x, z] of [
    [-10.2, 9.0],
    [6.0, 10.6],
    [-1.6, -13.4],
    [12.8, 1.6],
  ]) {
    bush(kit, x, z);
    colliders.push({ x, z, r: 0.45 });
  }

  for (const [x, z] of [
    [-4.6, 9.6],
    [4.8, 8.6],
    [-10.4, -10.6],
    [11.8, -9.4],
    [-2.2, -5.8],
    [3.6, -1.6],
  ]) {
    flowers(kit, x, z, rand);
  }

  for (const [x, z, s] of [
    [-4.4, -11.4, 0.9],
    [6.8, -10.6, 0.7],
    [-12.4, -1.2, 0.6],
    [-9.6, 9.6, 1],
    [1.8, 13.4, 0.7],
    [7.4, 10.8, 0.85],
  ] as [number, number, number][]) {
    rock(kit, x, z, s);
    colliders.push({ x, z, r: 0.6 });
  }

  group.add(kit.build());

  const floaters: THREE.Group[] = [];
  const floaterSpecs: [number, number, number, number, number][] = [
    [-22, -6, 1.6, 2.4, lego.green],
    [21, -14, 0.4, 2.0, lego.lime],
    [18, 9, -1.4, 1.6, lego.green],
    [-16, -20, 2.4, 1.4, lego.lime],
  ];
  floaterSpecs.forEach(([x, z, y, r, color], index) => {
    const mini = new Kit();
    disc(mini, r, -BRICK, BRICK, color, true);
    disc(mini, r - 0.6, -BRICK * 3, BRICK * 2, lego.darkTan, false);
    disc(mini, r - 1.2, -BRICK * 5, BRICK * 2, lego.brown, false);
    if (index % 2 === 0) tree(mini, 0, 0, 0.8, index ? lego.darkGreen : lego.green);
    else mini.brick(0, 0, 0, 2, 2, BRICK, [lego.red, lego.yellow, lego.blue][index % 3]).brick(0, BRICK, 0, 2, 2, BRICK, lego.white);
    const floater = mini.build();
    floater.position.set(x, y, z);
    floater.userData.baseY = y;
    floaters.push(floater);
    group.add(floater);
  });

  const update = ({ time, reduced }: FrameState) => {
    if (reduced) return;
    floaters.forEach((floater, index) => {
      floater.position.y = floater.userData.baseY + Math.sin(time * 0.5 + index * 1.3) * 0.35;
      floater.rotation.y = time * 0.04 * (index % 2 ? 1 : -1);
    });
  };

  return { group, update };
}

/** 5×5 pixel glyphs, row 0 farthest from the camera. */
const GLYPHS: Record<string, string[]> = {
  A: [".###.", "#...#", "#####", "#...#", "#...#"],
  M: ["#...#", "##.##", "#.#.#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#"],
  G: [".####", "#....", "#.###", "#...#", ".###."],
  R: ["####.", "#...#", "####.", "#..#.", "#...#"],
  W: ["#...#", "#...#", "#.#.#", "##.##", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#####"],
};

const LETTER_COLORS = [lego.red, lego.yellow, lego.azure, lego.pink, lego.orange, lego.purple, lego.red, lego.yellow, lego.blue, lego.white, lego.orange];

/** The name as a brick mosaic laid on the baseplate, one plate high, each letter its own color. */
export function buildName() {
  const group = new THREE.Group();
  const lines = ["AMAN", "AGARWAL"];
  const scale = 0.62;
  const letters: THREE.Object3D[] = [];
  let colorIndex = 0;

  lines.forEach((line, lineIndex) => {
    const width = line.length * 6 - 1;
    line.split("").forEach((char, charIndex) => {
      const kit = new Kit();
      GLYPHS[char].forEach((row, rowIndex) => {
        row.split("").forEach((cell, colIndex) => {
          if (cell !== "#") return;
          kit.brick((colIndex - 2) * STUD, 0, (rowIndex - 2) * STUD, 1, 1, PLATE * 2, LETTER_COLORS[colorIndex % LETTER_COLORS.length]);
        });
      });
      colorIndex++;
      const letter = kit.build({ castShadow: false, studShadows: false });
      const holder = new THREE.Group();
      holder.position.set(
        (charIndex * 6 + 2 - (width - 1) / 2) * STUD * scale,
        0.0,
        (lineIndex * 6.5 - 3.25) * STUD * scale,
      );
      holder.add(letter);
      holder.userData.scale = scale;
      group.add(holder);
      letters.push(holder);
    });
  });

  const caption = captionTexture("code · AI · imagination");
  const captionHeight = 0.42;
  const captionWidth = captionHeight * caption.aspect;
  const tile = new THREE.Mesh(
    new THREE.BoxGeometry(captionWidth + 0.5, PLATE * 0.8, captionHeight + 0.3),
    plastic(lego.white),
  );
  tile.position.set(0, PLATE * 0.4, 2.1);
  tile.receiveShadow = true;
  const captionMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(captionWidth, captionHeight),
    new THREE.MeshBasicMaterial({ map: caption.texture, transparent: true, depthWrite: false, toneMapped: false }),
  );
  captionMesh.rotation.x = -Math.PI / 2;
  captionMesh.position.set(0, PLATE * 0.8 + 0.004, 2.1);
  const captionGroup = new THREE.Group();
  captionGroup.add(tile, captionMesh);
  group.add(captionGroup);

  group.position.set(0, 0.0, 5.6);

  const reveal = (progress: number) => {
    letters.forEach((letter, index) => {
      const local = THREE.MathUtils.clamp(progress * (letters.length + 4) - index, 0, 1);
      const eased = local === 0 ? 0 : 1 + 2.2 * Math.pow(local - 1, 3) + 1.2 * Math.pow(local - 1, 2);
      const s = Math.max(0.0001, eased) * letter.userData.scale;
      letter.scale.set(s, Math.max(0.0001, eased) * letter.userData.scale, s);
      letter.position.y = (1 - Math.min(1, local)) * 1.2;
    });
    const captionLocal = THREE.MathUtils.clamp(progress * 1.4 - 0.4, 0, 1);
    captionGroup.scale.setScalar(Math.max(0.0001, captionLocal));
  };

  return { group, reveal };
}

export function buildPads() {
  const pads = new Map<string, THREE.Mesh>();
  const group = new THREE.Group();
  for (const station of stations) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(station.reach - 0.12, station.reach, 48),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(station.color), transparent: true, opacity: 0, depthWrite: false }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(station.approach[0], 0.11, station.approach[1]);
    group.add(ring);
    pads.set(station.id, ring);
  }
  return { group, pads };
}

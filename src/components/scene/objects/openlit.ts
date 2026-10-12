import * as THREE from "three";
import { BRICK, Kit, lego, orientedBox, PLATE, plastic, STUD } from "../bricks";
import { hitProxy } from "../materials";
import { holoTexture } from "../textures";
import type { BuildContext, WorldObject } from "../types";
import { stationById } from "@/content/world";

const CORE_Y = 2.15;

export function buildOpenlit({ materials }: BuildContext): WorldObject {
  const station = stationById.openlit;
  const group = new THREE.Group();
  const kit = new Kit();

  kit.round(0, 0, 0, 15, BRICK * 0.5, lego.darkGray, { studs: false });
  kit.round(0, BRICK * 0.5, 0, 14, PLATE, lego.lightGray);
  const deck = BRICK * 0.5 + PLATE;
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    kit.part(
      orientedBox(Math.sin(angle) * 2.92, deck - PLATE, Math.cos(angle) * 2.92, STUD * 0.9, PLATE * 1.4, STUD * 0.5, angle),
      i % 2 ? lego.orange : lego.yellow,
    );
  }
  kit.round(0, deck, 0, 8, PLATE, lego.white);
  kit.round(0, deck + PLATE, 0, 3, BRICK, lego.orange, { studs: false });
  kit.round(0, deck + PLATE + BRICK, 0, 2, BRICK, lego.darkGray, { studs: false });
  kit.round(0, deck + PLATE + BRICK * 2, 0, 3, PLATE, lego.orange, { studs: false });

  for (const side of [-1, 1]) {
    const cx = side * 1.45;
    const cz = 1.3;
    kit.brick(cx, deck, cz, 2, 2, BRICK * 1.2, lego.blue, { studs: false });
    kit.part(slope(cx, deck + BRICK * 1.2, cz, STUD * 2, STUD * 2), lego.azure, { glow: 0.35 });
  }

  const standAngles = [-0.85, 0, 0.85];
  for (const angle of standAngles) {
    const x = Math.sin(angle) * 2.15;
    const z = -Math.cos(angle) * 2.15;
    kit.round(x, deck, z, 1, BRICK * 2.5, lego.black, { studs: false });
  }

  group.add(kit.build());

  const core = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), plastic(lego.orange, { trans: true, glow: 0.9 }));
  core.position.y = CORE_Y;
  const heart = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), plastic(lego.yellow, { glow: 1.4 }));
  core.add(heart);
  group.add(core);

  const orbit = new THREE.Group();
  orbit.position.y = CORE_Y;
  const orbitColors = [lego.yellow, lego.azure, lego.red, lego.green, lego.purple, lego.white];
  const pieceGeometry = new THREE.BoxGeometry(STUD * 0.9, BRICK * 0.6, STUD * 0.9);
  orbitColors.forEach((color, index) => {
    const angle = (index / orbitColors.length) * Math.PI * 2;
    const piece = new THREE.Mesh(pieceGeometry, plastic(color));
    piece.position.set(Math.cos(angle) * 1.05, Math.sin(index * 1.7) * 0.18, Math.sin(angle) * 1.05);
    piece.castShadow = true;
    orbit.add(piece);
  });
  group.add(orbit);

  const panels: THREE.Mesh[] = [];
  (["latency", "traces", "evals"] as const).forEach((kind, index) => {
    const angle = standAngles[index];
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.94),
      new THREE.MeshBasicMaterial({
        map: holoTexture(kind),
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    panel.position.set(Math.sin(angle) * 2.15, deck + BRICK * 2.5 + 0.6, -Math.cos(angle) * 2.15);
    panel.rotation.y = -angle;
    panel.userData.baseY = panel.position.y;
    panels.push(panel);
    group.add(panel);
  });

  const hit = hitProxy(new THREE.CylinderGeometry(3.1, 3.1, 3.4, 12), materials, "openlit");
  hit.position.y = 1.7;
  group.add(hit);

  group.position.set(station.position[0], 0, station.position[1]);

  return {
    group,
    hits: [hit],
    colliders: [{ x: station.position[0], z: station.position[1], r: 3.1 }],
    update: ({ time, delta, reduced, hover, near }) => {
      const active = hover === "openlit" || near === "openlit";
      const speed = reduced ? 0 : active ? 2.2 : 1;
      core.rotation.y += delta * 0.8 * speed;
      core.rotation.x += delta * 0.4 * speed;
      orbit.rotation.y += delta * 0.6 * speed;
      orbit.children.forEach((piece, index) => {
        piece.rotation.y += delta * (1 + index * 0.2) * speed;
      });
      if (!reduced) {
        core.position.y = CORE_Y + Math.sin(time * 1.4) * 0.06;
        panels.forEach((panel, index) => {
          panel.position.y = panel.userData.baseY + Math.sin(time * 1.1 + index * 1.4) * 0.05;
        });
      }
    },
  };
}

/** A sloped console brick: a wedge rising toward -z. */
function slope(x: number, y: number, z: number, w: number, d: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-d / 2, 0);
  shape.lineTo(d / 2, 0);
  shape.lineTo(-d / 2, BRICK * 0.7);
  shape.lineTo(-d / 2, 0);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: w - 0.014, bevelEnabled: false });
  geometry.rotateY(-Math.PI / 2);
  geometry.translate(x + w / 2, y, z);
  return geometry;
}

export const OPENLIT_CORE = new THREE.Vector3(stationById.openlit.position[0], CORE_Y, stationById.openlit.position[1]);

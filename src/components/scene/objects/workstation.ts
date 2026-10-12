import * as THREE from "three";
import { BRICK, Kit, lego, PLATE } from "../bricks";
import { hitProxy } from "../materials";
import { codeTexture } from "../textures";
import type { BuildContext, WorldObject } from "../types";
import { stationById } from "@/content/world";

export function buildWorkstation({ materials }: BuildContext): WorldObject {
  const station = stationById.about;
  const group = new THREE.Group();
  const kit = new Kit();

  kit.brick(0, 0, 0.2, 10, 8, PLATE, lego.azure);

  for (const [x, z] of [
    [-1.2, -0.4],
    [1.2, -0.4],
    [-1.2, 0.4],
    [1.2, 0.4],
  ]) {
    kit.brick(x, PLATE, z, 1, 1, BRICK * 2, lego.reddishBrown, { studs: false });
  }
  kit.brick(0, PLATE + BRICK * 2, 0, 7, 3, PLATE, lego.tan, { studs: false });
  const deskTop = PLATE * 2 + BRICK * 2;

  kit.round(0, deskTop, -0.3, 1, BRICK * 0.8, lego.black, { studs: false });
  kit.brick(0, deskTop, -0.3, 2, 1, PLATE, lego.black, { studs: false });
  kit.brick(0, deskTop + 0.3, -0.3, 5, 1, BRICK * 2, lego.black, { studs: true });
  kit.brick(0, deskTop, 0.22, 3, 1, PLATE * 0.6, lego.darkGray, { studs: false });
  kit.brick(0.78, deskTop, 0.24, 1, 1, PLATE * 0.6, lego.lightGray, { studs: false });
  kit.round(-0.95, deskTop, 0.2, 1, BRICK, lego.red);
  kit.round(-0.95, deskTop + BRICK, 0.2, 1, PLATE * 0.4, lego.brown, { studs: false });

  const chairX = 0.1;
  const chairZ = 1.05;
  kit.round(chairX, PLATE, chairZ, 2, PLATE, lego.black, { studs: false });
  kit.round(chairX, PLATE * 2, chairZ, 1, BRICK, lego.darkGray, { studs: false });
  kit.brick(chairX, PLATE * 2 + BRICK, chairZ, 2, 2, PLATE, lego.red);
  kit.brick(chairX, PLATE * 3 + BRICK, chairZ + 0.2, 2, 1, BRICK * 1.6, lego.red);

  kit.round(-1.75, PLATE, -0.55, 2, BRICK, lego.orange, { studs: false });
  kit.round(-1.75, PLATE + BRICK, -0.55, 1, BRICK, lego.green);
  kit.brick(-1.75, PLATE + BRICK * 2, -0.55, 2, 2, BRICK, lego.lime);
  kit.round(-1.75, PLATE + BRICK * 3, -0.55, 1, PLATE * 2, lego.green);

  group.add(kit.build());

  const screenY = deskTop + 0.3 + BRICK;
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.82),
    new THREE.MeshBasicMaterial({ map: codeTexture(), toneMapped: false }),
  );
  screen.position.set(0, screenY, -0.3 + 0.21);
  const caret = new THREE.Mesh(
    new THREE.PlaneGeometry(0.03, 0.05),
    new THREE.MeshBasicMaterial({ color: lego.yellow, toneMapped: false }),
  );
  caret.position.set(-0.46, screenY - 0.29, -0.3 + 0.212);
  group.add(screen, caret);

  const hit = hitProxy(new THREE.CylinderGeometry(1.9, 1.9, 2.6, 12), materials, "about");
  hit.position.y = 1.3;
  group.add(hit);

  group.position.set(station.position[0], 0, station.position[1]);
  group.rotation.y = Math.atan2(station.approach[0] - station.position[0], station.approach[1] - station.position[1]);

  return {
    group,
    hits: [hit],
    colliders: [{ x: station.position[0], z: station.position[1], r: 1.6 }],
    update: ({ time, reduced }) => {
      caret.visible = reduced || Math.floor(time * 2) % 2 === 0;
    },
  };
}

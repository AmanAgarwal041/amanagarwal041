import * as THREE from "three";
import { BRICK, Kit, lego, PLATE, plastic } from "../bricks";
import { hitProxy } from "../materials";
import { signTexture } from "../textures";
import type { BuildContext, WorldObject } from "../types";
import { stationById } from "@/content/world";

export function buildMailbox({ materials }: BuildContext): WorldObject {
  const station = stationById.contact;
  const group = new THREE.Group();
  const kit = new Kit();

  kit.brick(0, 0, 0, 3, 3, PLATE, lego.purple);
  kit.brick(0, PLATE, 0, 1, 1, BRICK * 2, lego.black, { studs: false });
  const boxY = PLATE + BRICK * 2;
  kit.brick(0, boxY, 0, 2, 3, BRICK, lego.red, { studs: false });
  const roof = new THREE.CylinderGeometry(0.4, 0.4, 1.19, 16, 1, false, Math.PI / 2, Math.PI);
  roof.rotateX(Math.PI / 2);
  roof.translate(0, boxY + BRICK, 0);
  kit.part(roof, lego.red);
  kit.brick(0, boxY + 0.06, 0.6, 2, 0.08, BRICK * 0.8, lego.white, { studs: false });

  kit.brick(1.0, 0, 0.5, 1, 1, PLATE, lego.white);
  kit.brick(1.0, PLATE, 0.5, 1, 1, BRICK * 1.3, lego.black, { studs: false });
  group.add(kit.build());

  const flagPivot = new THREE.Group();
  flagPivot.position.set(0.42, boxY, -0.15);
  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.55, 0.05), plastic(lego.black));
  pole.position.y = 0.27;
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.28), plastic(lego.yellow));
  flag.position.set(0, 0.46, 0.13);
  flagPivot.add(pole, flag);
  group.add(flagPivot);

  const envelope = new THREE.Group();
  const paper = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.04), plastic(lego.white));
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 14), plastic(lego.red));
  seal.rotation.x = Math.PI / 2;
  seal.position.z = 0.03;
  envelope.add(paper, seal);
  envelope.position.set(0, 2.2, 0);
  envelope.scale.setScalar(0.001);
  group.add(envelope);

  const sign = new THREE.Group();
  const backing = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.08), plastic(lego.black));
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(0.84, 0.35),
    new THREE.MeshBasicMaterial({ map: signTexture("Say hi →"), toneMapped: false }),
  );
  board.position.z = 0.045;
  sign.add(backing, board);
  sign.position.set(1.0, PLATE + BRICK * 1.3 + 0.2, 0.5);
  sign.rotation.y = -0.4;
  group.add(sign);

  const hit = hitProxy(new THREE.CylinderGeometry(1.2, 1.2, 2.6, 10), materials, "contact");
  hit.position.set(0.3, 1.3, 0.2);
  group.add(hit);

  group.position.set(station.position[0], 0, station.position[1]);
  group.rotation.y = Math.atan2(station.approach[0] - station.position[0], station.approach[1] - station.position[1]);

  let open = 0;
  return {
    group,
    hits: [hit],
    colliders: [{ x: station.position[0], z: station.position[1], r: 0.7 }],
    update: ({ time, delta, reduced, hover, near }) => {
      const active = hover === "contact" || near === "contact";
      open = THREE.MathUtils.lerp(open, active ? 1 : 0, 1 - Math.exp(-delta * (reduced ? 30 : 8)));
      flagPivot.rotation.z = -open * (Math.PI / 2);
      envelope.scale.setScalar(Math.max(0.001, open));
      envelope.position.y = 2.3 + (reduced ? 0 : Math.sin(time * 2) * 0.08);
      if (!reduced) envelope.rotation.y = time * 0.8;
    },
  };
}

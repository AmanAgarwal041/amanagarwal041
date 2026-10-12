import * as THREE from "three";
import { BRICK, Kit, lego, PLATE, plastic, STUD } from "../bricks";
import { hitProxy } from "../materials";
import type { BuildContext, WorldObject } from "../types";
import { stationById } from "@/content/world";

const CORE_Y = 2.1;

export function buildAiCore({ materials }: BuildContext): WorldObject {
  const station = stationById.engineering;
  const group = new THREE.Group();
  const kit = new Kit();

  kit.round(0, 0, 0, 6, PLATE, lego.white, { studs: false });
  kit.round(0, PLATE, 0, 5, BRICK, lego.green, { studs: false });
  kit.round(0, PLATE + BRICK, 0, 6, PLATE, lego.lime);
  kit.round(0, PLATE * 2 + BRICK, 0, 1, BRICK * 1.3, lego.lightGray, { studs: false });
  group.add(kit.build());

  const core = new THREE.Group();
  core.position.y = CORE_Y;
  const brain = new Kit();
  const voxel = STUD;
  for (let x = -2; x <= 2; x++) {
    for (let y = -2; y <= 2; y++) {
      for (let z = -2; z <= 2; z++) {
        const d = Math.hypot(x, y * 1.1, z);
        if (d > 2.35 || d < 1.4) continue;
        const color = (x + y + z) % 3 === 0 ? lego.lime : x < 0 ? lego.azure : lego.green;
        brain.brick(x * voxel, y * voxel - voxel / 2, z * voxel, 1, 1, voxel, color, {
          trans: true,
          glow: 0.25,
          studs: false,
        });
      }
    }
  }
  const shell = brain.build({ castShadow: false });
  const heart = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), plastic(lego.yellow, { glow: 1.2 }));
  core.add(shell, heart);
  group.add(core);

  const satellites = new THREE.Group();
  satellites.position.y = CORE_Y;
  const satGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.12, 12);
  const satColors = [lego.red, lego.yellow, lego.blue, lego.orange, lego.purple, lego.pink, lego.white];
  satColors.forEach((color, i) => {
    const pivot = new THREE.Group();
    pivot.rotation.set(i * 0.9, i * 1.3, 0);
    const sat = new THREE.Mesh(satGeometry, plastic(color));
    sat.position.x = 1.35 + (i % 2) * 0.2;
    pivot.add(sat);
    pivot.userData.speed = 0.4 + (i % 4) * 0.15;
    satellites.add(pivot);
  });
  group.add(satellites);

  const graph = new THREE.Group();
  const nodes: [number, number][] = [
    [0, 0.5],
    [0, 1.1],
    [0.55, 1.45],
    [0, 1.75],
    [0.55, 2.0],
    [0, 2.45],
    [-0.5, 2.05],
    [0, 2.9],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 3],
    [3, 5],
    [5, 7],
    [1, 2],
    [2, 4],
    [4, 5],
    [3, 6],
    [6, 7],
  ];
  const nodeGeometry = new THREE.CylinderGeometry(0.13, 0.13, 0.12, 14);
  nodeGeometry.rotateX(Math.PI / 2);
  nodes.forEach(([x, y]) => {
    const node = new THREE.Mesh(nodeGeometry, plastic(x > 0 ? lego.orange : x < 0 ? lego.purple : lego.blue));
    node.position.set(x, y, 0);
    node.castShadow = true;
    graph.add(node);
  });
  const up = new THREE.Vector3(0, 1, 0);
  const stickMaterial = plastic(lego.black);
  for (const [a, b] of edges) {
    const start = new THREE.Vector3(nodes[a][0], nodes[a][1], 0);
    const end = new THREE.Vector3(nodes[b][0], nodes[b][1], 0);
    const length = start.distanceTo(end);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, length, 6), stickMaterial);
    stick.position.copy(start).lerp(end, 0.5);
    stick.quaternion.setFromUnitVectors(up, end.clone().sub(start).normalize());
    graph.add(stick);
  }
  const graphBase = new Kit();
  graphBase.brick(0, 0, 0, 3, 2, BRICK * 0.8, lego.blue);
  graph.add(graphBase.build());
  graph.position.set(1.9, 0, 0.3);
  group.add(graph);

  const hit = hitProxy(new THREE.CylinderGeometry(2.4, 2.4, 3.4, 12), materials, "engineering");
  hit.position.set(0.7, 1.7, 0);
  group.add(hit);

  group.position.set(station.position[0], 0, station.position[1]);
  group.rotation.y = Math.atan2(station.approach[0] - station.position[0], station.approach[1] - station.position[1]);

  const world = new THREE.Vector3();
  group.updateMatrixWorld(true);
  graph.getWorldPosition(world);

  return {
    group,
    hits: [hit],
    colliders: [
      { x: station.position[0], z: station.position[1], r: 1.3 },
      { x: world.x, z: world.z, r: 0.6 },
    ],
    update: ({ time, delta, reduced, hover, near }) => {
      if (reduced) return;
      const active = hover === "engineering" || near === "engineering";
      core.rotation.y += delta * (active ? 0.9 : 0.35);
      core.rotation.x = Math.sin(time * 0.4) * 0.15;
      core.position.y = CORE_Y + Math.sin(time * 1.2) * 0.08;
      heart.rotation.y -= delta * 1.2;
      satellites.children.forEach((pivot) => {
        pivot.rotation.y += delta * pivot.userData.speed * (active ? 2 : 1);
      });
    },
  };
}

import * as THREE from "three";
import { BRICK, Kit, lego, orientedBox, PLATE } from "../bricks";
import { hitProxy } from "../materials";
import { flagTexture } from "../textures";
import type { BuildContext, Collider, WorldObject } from "../types";
import { timeline } from "@/content/world";

const FLAG_COLORS = [lego.red, lego.blue, lego.green, lego.orange, lego.purple, lego.azure];

export function buildTimeline({ materials }: BuildContext): WorldObject {
  const group = new THREE.Group();
  const kit = new Kit();
  const hits: THREE.Object3D[] = [];
  const colliders: Collider[] = [];
  const flags: THREE.Mesh[] = [];

  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(6.2, 0, 7.6),
    new THREE.Vector3(10.8, 0, 6.2),
    new THREE.Vector3(12.2, 0, 0.2),
  );

  const segments = Math.ceil(curve.getLength() / 0.42);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const angle = Math.atan2(tangent.x, tangent.z);
    kit.part(orientedBox(point.x, 0.02, point.z, 1.2, PLATE * 0.5, 0.42, angle), lego.darkGray);
    if (i % 2 === 0) kit.part(orientedBox(point.x, 0.02 + PLATE * 0.5, point.z, 0.1, 0.02, 0.24, angle), lego.yellow);
  }

  const flagGeometry = new THREE.PlaneGeometry(0.96, 0.54);
  flagGeometry.translate(0.5, 0, 0);

  timeline.forEach((entry, index) => {
    const t = index / (timeline.length - 1);
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t);
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const pos = point.clone().addScaledVector(side, index % 2 === 0 ? 0.95 : -0.95);
    const color = FLAG_COLORS[index % FLAG_COLORS.length];

    kit.brick(pos.x, 0, pos.z, 2, 2, PLATE, lego.white);
    kit.round(pos.x, PLATE, pos.z, 1, BRICK * 3.4, lego.white, { studs: false });
    kit.round(pos.x, PLATE + BRICK * 3.4, pos.z, 1, PLATE, color);

    const flag = new THREE.Mesh(
      flagGeometry,
      new THREE.MeshStandardMaterial({
        map: flagTexture(entry.year, entry.company, `#${color.toString(16).padStart(6, "0")}`),
        side: THREE.DoubleSide,
        roughness: 0.45,
      }),
    );
    flag.position.set(pos.x, 1.4, pos.z);
    flag.rotation.y = -0.35 + index * 0.05;
    flag.userData.baseRotation = flag.rotation.y;
    flag.castShadow = true;
    flags.push(flag);
    group.add(flag);

    const hit = hitProxy(new THREE.CylinderGeometry(0.6, 0.6, 2.0, 8), materials, "experience");
    hit.position.set(pos.x + 0.3, 1, pos.z);
    group.add(hit);
    hits.push(hit);
    colliders.push({ x: pos.x, z: pos.z, r: 0.3 });
  });

  group.add(kit.build());

  return {
    group,
    hits,
    colliders,
    update: ({ time, reduced }) => {
      if (reduced) return;
      flags.forEach((flag, index) => {
        flag.rotation.y = flag.userData.baseRotation + Math.sin(time * 1.6 + index) * 0.08;
      });
    },
  };
}

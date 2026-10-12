import * as THREE from "three";
import { lego } from "./bricks";
import type { FrameState } from "./types";
import { OPENLIT_CORE } from "./objects/openlit";
import { stationById } from "@/content/world";

const sources = [
  { x: stationById.about.position[0], z: stationById.about.position[1], y: 1.8 },
  { x: stationById.engineering.position[0], z: stationById.engineering.position[1], y: 2.0 },
  { x: stationById.projects.position[0], z: stationById.projects.position[1], y: 1.8 },
];

const PER_CURVE = 4;

export function buildFlows() {
  const group = new THREE.Group();
  const curves = sources.map(({ x, y, z }) => {
    const start = new THREE.Vector3(x, y, z);
    const mid = start.clone().lerp(OPENLIT_CORE, 0.5);
    mid.y += 2.4;
    return new THREE.QuadraticBezierCurve3(start, mid, OPENLIT_CORE.clone());
  });

  const lineMaterial = new THREE.LineDashedMaterial({
    color: lego.white,
    dashSize: 0.18,
    gapSize: 0.14,
    transparent: true,
    opacity: 0.8,
  });
  for (const curve of curves) {
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), lineMaterial);
    line.computeLineDistances();
    group.add(line);
  }

  const packets = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.075, 8, 6),
    new THREE.MeshBasicMaterial({ color: lego.yellow, toneMapped: false }),
    curves.length * PER_CURVE,
  );
  packets.frustumCulled = false;
  group.add(packets);

  const matrix = new THREE.Matrix4();
  const point = new THREE.Vector3();
  const update = ({ time, reduced }: FrameState) => {
    packets.visible = !reduced;
    if (reduced) return;
    curves.forEach((curve, c) => {
      for (let k = 0; k < PER_CURVE; k++) {
        const t = (time * 0.18 + k / PER_CURVE + c * 0.13) % 1;
        curve.getPoint(t, point);
        const s = Math.sin(t * Math.PI);
        matrix.makeScale(s, s, s).setPosition(point);
        packets.setMatrixAt(c * PER_CURVE + k, matrix);
      }
    });
    packets.instanceMatrix.needsUpdate = true;
  };

  return { group, update };
}

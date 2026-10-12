import * as THREE from "three";
import { lego, plastic } from "./bricks";
import { faceTexture, torsoTexture } from "./textures";
import type { BuildContext } from "./types";
import { minifig } from "@/content/world";

/** Box whose top face is narrower than its bottom: the minifig torso. */
function trapezoid(bottom: number, top: number, height: number, depth: number) {
  const geometry = new THREE.BoxGeometry(bottom, height, depth);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    if (position.getY(i) > 0) position.setX(i, position.getX(i) * (top / bottom));
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function buildCharacter(_ctx: BuildContext) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  root.scale.setScalar(1.25);

  const jeans = plastic(lego.blue);
  const shirt = plastic(lego.white);
  const skin = plastic(minifig.skin);
  const hairMaterial = plastic(minifig.hair);

  const legGeometry = new THREE.BoxGeometry(0.2, 0.46, 0.24);
  legGeometry.translate(0, -0.23, 0);
  const shoeGeometry = new THREE.BoxGeometry(0.2, 0.08, 0.3);
  shoeGeometry.translate(0, -0.46, 0.03);
  const legs = [-0.11, 0.11].map((x) => {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(legGeometry, jeans);
    const shoe = new THREE.Mesh(shoeGeometry, plastic(lego.red));
    leg.add(thigh, shoe);
    leg.position.set(x, 0.54, 0);
    root.add(leg);
    return leg;
  });

  const hips = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.1, 0.24), jeans);
  hips.position.y = 0.59;
  body.add(hips);

  const torsoGeometry = trapezoid(0.46, 0.36, 0.5, 0.24);
  const print = new THREE.MeshStandardMaterial({ map: torsoTexture(), roughness: 0.34 });
  const torso = new THREE.Mesh(torsoGeometry, [shirt, shirt, shirt, shirt, print, shirt]);
  torso.position.y = 0.89;
  body.add(torso);

  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.38, 0.14), plastic(lego.yellow));
  pack.position.set(0, 0.9, -0.19);
  const flap = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.16), plastic(lego.orange));
  flap.position.set(0, 1.05, -0.19);
  body.add(pack, flap);

  const armGeometry = new THREE.CylinderGeometry(0.065, 0.075, 0.36, 10);
  armGeometry.translate(0, -0.18, 0);
  const handGeometry = new THREE.TorusGeometry(0.055, 0.03, 8, 12, Math.PI * 1.5);
  const arms = [-1, 1].map((side) => {
    const arm = new THREE.Group();
    const sleeve = new THREE.Mesh(armGeometry, shirt);
    const hand = new THREE.Mesh(handGeometry, skin);
    hand.position.set(0, -0.42, 0.02);
    hand.rotation.set(Math.PI / 2, 0, side * 0.6);
    arm.add(sleeve, hand);
    arm.position.set(side * 0.24, 1.08, 0);
    arm.rotation.z = side * 0.12;
    body.add(arm);
    return arm;
  });

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 12), skin);
  neck.position.y = 1.165;
  body.add(neck);

  const head = new THREE.Group();
  head.position.y = 1.19;
  body.add(head);

  const hex = (value: number) => `#${value.toString(16).padStart(6, "0")}`;
  const faceMaterial = new THREE.MeshStandardMaterial({
    map: faceTexture(hex(minifig.skin), hex(minifig.hair)),
    roughness: 0.34,
  });
  const skull = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.34, 32, 1, false, Math.PI, Math.PI * 2),
    [faceMaterial, skin, skin],
  );
  skull.position.y = 0.17;
  head.add(skull);

  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.225, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMaterial);
  cap.scale.set(1, 0.62, 1.04);
  cap.position.set(0, 0.3, -0.01);
  const back = new THREE.Mesh(
    new THREE.CylinderGeometry(0.222, 0.222, 0.2, 24, 1, true, Math.PI * 0.62, Math.PI * 0.76),
    hairMaterial,
  );
  back.position.set(0, 0.22, 0);
  hairMaterial.side = THREE.DoubleSide;
  const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.08), hairMaterial);
  fringe.position.set(0.02, 0.31, 0.16);
  fringe.rotation.set(-0.5, 0, -0.12);
  head.add(cap, back, fringe);

  body.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  legs.forEach((leg) => leg.traverse((child) => (child.castShadow = true)));

  let phase = 0;
  const update = (time: number, delta: number, speed01: number, reduced: boolean) => {
    phase += delta * 11 * speed01;
    const swing = Math.sin(phase) * 0.7 * speed01;
    legs[0].rotation.x = swing;
    legs[1].rotation.x = -swing;
    arms[0].rotation.x = -swing * 0.9;
    arms[1].rotation.x = swing * 0.9;
    const bob = Math.abs(Math.sin(phase)) * 0.05 * speed01;
    const idle = reduced ? 0 : Math.sin(time * 2.2) * 0.01 * (1 - speed01);
    body.position.y = bob + idle;
    head.rotation.y = reduced ? 0 : Math.sin(time * 0.7) * 0.18 * (1 - speed01);
  };

  return { root, update };
}

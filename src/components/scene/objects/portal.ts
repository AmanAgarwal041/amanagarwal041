import * as THREE from "three";
import { BRICK, Kit, lego, PLATE, plastic, STUD } from "../bricks";
import { hitProxy } from "../materials";
import type { BuildContext, WorldObject } from "../types";
import { stationById } from "@/content/world";

const swirlVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const swirlFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * vec2(1.0, 1.35);
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);
    float bands = sin(a * 3.0 + r * 10.0 - uTime * 1.8) * 0.5 + 0.5;
    vec3 color = mix(uA, uB, smoothstep(0.1, 0.9, bands));
    color = mix(color, uC, smoothstep(0.55, 1.0, bands * (1.0 - r * 0.4)));
    color = mix(vec3(1.0), color, smoothstep(0.0, 0.25, r));
    gl_FragColor = vec4(color, 1.0);
  }
`;

const ARCH = [lego.red, lego.orange, lego.yellow, lego.green, lego.azure, lego.blue, lego.purple];

export function buildPortal({ materials }: BuildContext): WorldObject {
  const station = stationById.projects;
  const group = new THREE.Group();
  const kit = new Kit();

  kit.brick(0, 0, 0, 10, 3, PLATE, lego.white);
  for (let row = 0; row < 7; row++) {
    const color = ARCH[row];
    for (const side of [-1, 1]) kit.brick(side * 1.4, PLATE + row * BRICK, 0, 2, 2, BRICK, color, { studs: false });
  }
  const top = PLATE + 7 * BRICK;
  ARCH.forEach((color, index) => {
    kit.brick(-1.2 + index * 0.4, top, 0, 1, 2, BRICK, color, { studs: true });
  });
  kit.brick(-1.6, top, 0, 1, 2, BRICK, lego.red);
  kit.brick(1.6, top, 0, 1, 2, BRICK, lego.purple);

  const pedestals: { id: string; item: THREE.Object3D }[] = [];
  const hits: THREE.Object3D[] = [];
  const layout: [string, number, number, number][] = [
    ["project:autobiography", -2.1, 1.7, lego.yellow],
    ["project:travelbud", 0, 2.35, lego.azure],
    ["project:cldpm", 2.1, 1.7, lego.red],
  ];
  const itemY = 1.25;

  for (const [id, x, z, color] of layout) {
    kit.round(x, 0, z, 3, PLATE, lego.white, { studs: false });
    kit.round(x, PLATE, z, 2, BRICK, color, { studs: false });
    kit.round(x, PLATE + BRICK, z, 2, PLATE, lego.white);
    const item = id === "project:autobiography" ? book() : id === "project:travelbud" ? globe() : stack();
    item.position.set(x, itemY, z);
    group.add(item);
    pedestals.push({ id, item });
    const hit = hitProxy(new THREE.CylinderGeometry(0.62, 0.62, 1.9, 10), materials, id);
    hit.position.set(x, 0.95, z);
    group.add(hit);
    hits.push(hit);
  }

  group.add(kit.build());

  const swirl = new THREE.ShaderMaterial({
    vertexShader: swirlVertex,
    fragmentShader: swirlFragment,
    uniforms: {
      uTime: { value: 0 },
      uA: { value: new THREE.Color(lego.blue) },
      uB: { value: new THREE.Color(lego.azure) },
      uC: { value: new THREE.Color(lego.pink) },
    },
    side: THREE.DoubleSide,
  });
  const opening = new THREE.Mesh(new THREE.PlaneGeometry(2.0, top - PLATE), swirl);
  opening.position.y = PLATE + (top - PLATE) / 2;
  group.add(opening);

  const portalHit = hitProxy(new THREE.BoxGeometry(3.4, 3.8, 0.9), materials, "projects");
  portalHit.position.y = 1.9;
  group.add(portalHit);
  hits.unshift(portalHit);

  group.position.set(station.position[0], 0, station.position[1]);
  group.rotation.y = Math.atan2(station.approach[0] - station.position[0], station.approach[1] - station.position[1]);

  const colliders = [{ x: station.position[0], z: station.position[1], r: 1.8 }];
  const world = new THREE.Vector3();
  group.updateMatrixWorld(true);
  for (const { item } of pedestals) {
    item.getWorldPosition(world);
    colliders.push({ x: world.x, z: world.z, r: 0.6 });
  }

  return {
    group,
    hits,
    colliders,
    update: ({ time, delta, reduced, hover }) => {
      if (!reduced) swirl.uniforms.uTime.value = time;
      pedestals.forEach(({ id, item }, index) => {
        const active = hover === id;
        if (!reduced) {
          item.rotation.y += delta * (active ? 1.8 : 0.5);
          item.position.y = itemY + Math.sin(time * 1.4 + index) * 0.06;
        }
        const target = active ? 1.18 : 1;
        item.scale.setScalar(THREE.MathUtils.lerp(item.scale.x, target, 1 - Math.exp(-delta * 10)));
        const orbit = item.userData.orbit as THREE.Object3D | undefined;
        if (orbit && !reduced) orbit.rotation.y += delta * 1.6;
      });
    },
  };
}

function book() {
  const kit = new Kit();
  kit.brick(0, -0.1, 0, 2, 3, PLATE * 0.7, lego.blue, { studs: false });
  kit.brick(0.42, -0.1, 0, 2, 3, PLATE * 0.7, lego.blue, { studs: false });
  kit.brick(0.02, -0.1 + PLATE * 0.7, 0, 2, 3, PLATE * 0.5, lego.white, { studs: false });
  kit.brick(0.4, -0.1 + PLATE * 0.7, 0, 2, 3, PLATE * 0.5, lego.white, { studs: false });
  const group = kit.build({ castShadow: true });
  group.children.forEach((child) => child.position.x -= 0.21);
  const wrapper = new THREE.Group();
  wrapper.add(group);
  wrapper.rotation.x = 0.5;
  return wrapper;
}

function globe() {
  const group = new THREE.Group();
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), plastic(lego.azure));
  const land = new THREE.Mesh(new THREE.SphereGeometry(0.305, 8, 6, 0.4, 1.8, 0.6, 1.2), plastic(lego.green));
  sphere.castShadow = true;
  group.add(sphere, land);
  const orbit = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.02, 6, 40), plastic(lego.yellow));
  ring.rotation.x = Math.PI / 2;
  const plane = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.08), plastic(lego.red));
  plane.position.set(0.46, 0, 0);
  orbit.add(ring, plane);
  orbit.rotation.z = 0.35;
  group.add(orbit);
  group.userData.orbit = orbit;
  return group;
}

function stack() {
  const kit = new Kit();
  [lego.red, lego.yellow, lego.blue].forEach((color, index) => {
    kit.brick(0, -0.2 + index * BRICK * 0.6, 0, 2, 2, BRICK * 0.6, color, { studs: index === 2 });
  });
  kit.brick(STUD * 0.5, -0.2 + BRICK * 1.8, 0, 1, 1, BRICK * 0.6, lego.green);
  return kit.build();
}

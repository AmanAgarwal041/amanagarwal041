import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildCharacter } from "./character";
import { buildFlows } from "./flows";
import { buildIsland, buildName, buildPads, ISLAND_RADIUS } from "./island";
import { createMaterials } from "./materials";
import { lego } from "./bricks";
import { buildAiCore } from "./objects/aiCore";
import { buildMailbox } from "./objects/mailbox";
import { buildOpenlit } from "./objects/openlit";
import { buildPortal } from "./objects/portal";
import { buildTimeline } from "./objects/timeline";
import { buildWorkstation } from "./objects/workstation";
import { loadFonts } from "./textures";
import type { BuildContext, Collider, FrameState, WorldObject } from "./types";
import { SPAWN, stationById, stations, type PanelId, type StationId } from "@/content/world";

export type EngineEvents = {
  onProgress?: (label: string, done: number, total: number) => void;
  onHover?: (id: string | null) => void;
  onNear?: (id: StationId | null) => void;
  onSelect?: (id: PanelId) => void;
  onIntroDone?: () => void;
  onFirstMove?: () => void;
  onError?: () => void;
};

export type EngineOptions = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  reduced: boolean;
  coarse: boolean;
  events: EngineEvents;
};

const ANCHOR_HEIGHT: Record<StationId, number> = {
  openlit: 2.3,
  about: 2.4,
  projects: 3.1,
  engineering: 2.2,
  experience: 1.9,
  contact: 2.4,
};

const MOVE_KEYS = new Set(["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"]);
const SPEED = 4.4;

const nextFrame = () =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, 60);
    requestAnimationFrame(() => {
      clearTimeout(timer);
      resolve();
    });
  });
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function lerpAngle(a: number, b: number, t: number) {
  const diff = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return a + diff * t;
}

const SKY_TOP = 0x2f8ff0;
const SKY_BOTTOM = 0xbfe6ff;

function skyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, `#${SKY_TOP.toString(16).padStart(6, "0")}`);
    gradient.addColorStop(1, `#${SKY_BOTTOM.toString(16).padStart(6, "0")}`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 4, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export class WorldEngine {
  private readonly opts: EngineOptions;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(38, 1, 0.1, 160);
  private readonly clock = new THREE.Clock(false);
  private readonly raycaster = new THREE.Raycaster();
  private readonly materials = createMaterials();
  private readonly ctx: BuildContext;

  private objects: WorldObject[] = [];
  private updaters: ((state: FrameState) => void)[] = [];
  private hits: THREE.Object3D[] = [];
  private colliders: Collider[] = [];
  private ground: THREE.Mesh | null = null;
  private character: ReturnType<typeof buildCharacter> | null = null;
  private pads = new Map<string, THREE.Mesh>();
  private name: ReturnType<typeof buildName> | null = null;
  private marker: THREE.Mesh | null = null;
  private markerT = 1;
  private sun: THREE.DirectionalLight | null = null;

  private time = 0;
  private pos = new THREE.Vector3(SPAWN[0], 0, SPAWN[1]);
  private vel = new THREE.Vector3();
  private heading = 0;
  private target: THREE.Vector3 | null = null;
  private stuck = 0;
  private keys = new Set<string>();
  private yaw = 0;
  private yawTarget = 0;
  private parallax = new THREE.Vector2();
  private pointer = new THREE.Vector2(9, 9);
  private pointerDirty = false;
  private drag: { x: number; y: number; yaw: number; moved: boolean; id: number } | null = null;

  private hover: string | null = null;
  private near: StationId | null = null;
  private focusId: PanelId | null = null;
  private focusPoint = new THREE.Vector3();
  private camPos = new THREE.Vector3(0, 30, 40);
  private camLook = new THREE.Vector3(0, 0, -2);
  private introStartPos = new THREE.Vector3(0, 30, 40);
  private introStartLook = new THREE.Vector3(0, 0, -2);
  private introT = 0;
  private introDone = false;
  private moved = false;

  private running = false;
  private visible = true;
  private engaged = true;
  private raf = 0;
  private width = 1;
  private height = 1;
  private dpr = 1;
  private frameAccum = 0;
  private frameCount = 0;

  private labels = new Map<StationId, HTMLElement>();
  private tooltip: HTMLElement | null = null;
  private obstacles: () => HTMLElement[] = () => [];
  private cleanups: (() => void)[] = [];
  private disposed = false;

  constructor(opts: EngineOptions) {
    this.opts = opts;
    const quality = opts.coarse ? "medium" : "high";
    this.ctx = { materials: this.materials, quality };

    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.setClearColor(SKY_BOTTOM, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.dpr = Math.min(window.devicePixelRatio || 1, opts.coarse ? 1.5 : 1.75);
    this.renderer.setPixelRatio(this.dpr);

    this.scene.background = skyTexture();
    this.scene.fog = new THREE.Fog(SKY_BOTTOM, 48, 100);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.55;
    pmrem.dispose();

    if (opts.reduced) {
      this.introDone = true;
      this.introT = 1;
    }
  }

  async init() {
    const steps: [string, () => void | Promise<void>][] = [
      ["Sorting the bricks", () => loadFonts()],
      ["Snapping the baseplate", () => this.buildBase()],
      ["Building the workstation", () => this.add(buildWorkstation(this.ctx))],
      ["Powering the OpenLIT console", () => {
        this.add(buildOpenlit(this.ctx));
        this.add(buildAiCore(this.ctx));
      }],
      ["Clicking the portal together", () => {
        this.add(buildPortal(this.ctx));
        this.add(buildTimeline(this.ctx));
        this.add(buildMailbox(this.ctx));
        const flows = buildFlows();
        this.scene.add(flows.group);
        this.updaters.push(flows.update);
      }],
      ["Assembling minifig Aman", () => this.buildCharacter()],
    ];
    for (let i = 0; i < steps.length; i++) {
      if (this.disposed) return;
      this.opts.events.onProgress?.(steps[i][0], i, steps.length);
      await steps[i][1]();
      await nextFrame();
    }
    if (this.disposed) return;
    this.resize();
    this.renderer.compile(this.scene, this.camera);
    this.bind();
    this.opts.events.onProgress?.("Ready", steps.length, steps.length);
  }

  private buildBase() {
    const hemi = new THREE.HemisphereLight(0xdff1ff, 0x7a9a4a, 1.25);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff1d6, 2.6);
    sun.position.set(10, 18, 9);
    sun.castShadow = true;
    const size = this.ctx.quality === "high" ? 2048 : 1024;
    sun.shadow.mapSize.set(size, size);
    const s = sun.shadow.camera;
    s.left = -17;
    s.right = 17;
    s.top = 17;
    s.bottom = -17;
    s.near = 1;
    s.far = 50;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    this.scene.add(sun);
    this.sun = sun;

    const island = buildIsland(this.ctx);
    this.scene.add(island.group);
    this.ground = island.ground;
    this.colliders.push(...island.colliders);
    this.updaters.push(island.update);

    const name = buildName();
    this.scene.add(name.group);
    this.name = name;
    name.reveal(this.opts.reduced ? 1 : 0);

    const pads = buildPads();
    this.scene.add(pads.group);
    this.pads = pads.pads;

    const marker = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.28, 28),
      new THREE.MeshBasicMaterial({ color: lego.yellow, transparent: true, opacity: 0, depthWrite: false }),
    );
    marker.rotation.x = -Math.PI / 2;
    marker.position.y = 0.12;
    this.scene.add(marker);
    this.marker = marker;
  }

  private add(object: WorldObject) {
    this.objects.push(object);
    this.scene.add(object.group);
    this.hits.push(...object.hits);
    this.colliders.push(...object.colliders);
    if (object.update) this.updaters.push(object.update);
  }

  private buildCharacter() {
    const character = buildCharacter(this.ctx);
    character.root.position.copy(this.pos);
    this.scene.add(character.root);
    this.character = character;
  }

  start() {
    if (this.disposed || this.running) return;
    this.running = true;
    this.clock.start();
    this.raf = requestAnimationFrame(this.frame);
  }

  private pause() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private resume() {
    if (this.running || this.disposed || !this.visible || document.hidden) return;
    this.clock.getDelta();
    this.start();
  }

  setLabelObstacles(query: () => HTMLElement[]) {
    this.obstacles = query;
  }

  setLabel(id: StationId, element: HTMLElement | null) {
    if (element) this.labels.set(id, element);
    else this.labels.delete(id);
  }

  setTooltip(element: HTMLElement | null) {
    this.tooltip = element;
  }

  skipIntro() {
    if (this.introDone) return;
    this.introT = 1;
  }

  focus(id: PanelId) {
    this.focusId = id;
    this.keys.clear();
    const station = id.startsWith("project:") ? stationById.projects : stationById[id as StationId];
    const hit = this.hits.find((mesh) => mesh.userData.selectId === id);
    if (hit) hit.getWorldPosition(this.focusPoint);
    else this.focusPoint.set(station.position[0], 1.2, station.position[1]);
    this.focusPoint.y = id.startsWith("project:") ? 1.2 : 1.4;
  }

  release() {
    this.focusId = null;
  }

  interact() {
    if (this.near) this.opts.events.onSelect?.(this.near);
  }

  walkTo(id: StationId) {
    const station = stationById[id];
    this.target = new THREE.Vector3(station.approach[0], 0, station.approach[1]);
    this.stuck = 0;
  }

  private bind() {
    const { canvas, container } = this.opts;

    const onResize = () => this.resize();
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        this.engaged = entry.intersectionRatio >= 0.55;
        if (!this.engaged) this.keys.clear();
        if (this.visible) this.resume();
        else this.pause();
      },
      { threshold: [0, 0.55, 1] },
    );
    intersection.observe(container);

    const onVisibility = () => {
      if (document.hidden) this.pause();
      else this.resume();
    };

    const toNdc = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      this.pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      return rect;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      toNdc(event);
      this.drag = { x: event.clientX, y: event.clientY, yaw: this.yawTarget, moved: false, id: event.pointerId };
      if (!this.introDone) this.skipIntro();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = toNdc(event);
      this.pointerDirty = true;
      if (event.pointerType === "mouse") this.parallax.copy(this.pointer);
      if (this.tooltip) {
        const x = event.clientX - rect.left + 18;
        const y = event.clientY - rect.top + 18;
        this.tooltip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (this.drag && this.drag.id === event.pointerId) {
        const dx = event.clientX - this.drag.x;
        const dy = event.clientY - this.drag.y;
        if (!this.drag.moved && Math.abs(dx) + Math.abs(dy) > 6) {
          this.drag.moved = true;
          canvas.setPointerCapture(event.pointerId);
          canvas.style.cursor = "grabbing";
        }
        if (this.drag.moved && !this.focusId) this.yawTarget = this.drag.yaw - dx * 0.006;
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!this.drag || this.drag.id !== event.pointerId) return;
      const { moved } = this.drag;
      this.drag = null;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      canvas.style.cursor = this.hover ? "var(--cursor-pointer)" : "";
      if (!moved) {
        toNdc(event);
        this.click();
      }
    };

    const onPointerCancel = () => {
      this.drag = null;
      canvas.style.cursor = "";
    };

    const onPointerLeave = () => {
      this.pointer.set(9, 9);
      this.parallax.set(0, 0);
      this.setHover(null);
    };

    const isTyping = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

    const onKeyDown = (event: KeyboardEvent) => {
      if (!this.engaged || this.focusId || isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (MOVE_KEYS.has(key)) {
        if (key.startsWith("arrow")) event.preventDefault();
        this.keys.add(key);
        if (!this.introDone) this.skipIntro();
        return;
      }
      const onPage = event.target === document.body || event.target === canvas;
      if (key === "e" || (key === "enter" && onPage)) {
        if (this.near) {
          event.preventDefault();
          this.interact();
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => this.keys.delete(event.key.toLowerCase());
    const onBlur = () => this.keys.clear();
    const onContextLost = (event: Event) => {
      event.preventDefault();
      this.opts.events.onError?.();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("webglcontextlost", onContextLost);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    this.cleanups.push(() => {
      resizeObserver.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    });
  }

  private resize() {
    const rect = this.opts.container.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.fov = this.portrait() ? 48 : 38;
    this.camera.updateProjectionMatrix();
  }

  private portrait() {
    return this.width / this.height < 0.85;
  }

  private setHover(id: string | null) {
    if (id === this.hover) return;
    this.hover = id;
    this.opts.events.onHover?.(id);
    if (!this.drag) this.opts.canvas.style.cursor = id ? "var(--cursor-pointer)" : "";
  }

  private pick(): string | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.hits, false)[0];
    return (hit?.object.userData.selectId as string | undefined) ?? null;
  }

  private click() {
    if (this.focusId) return;
    const id = this.pick();
    if (id) {
      const stationId = (id.startsWith("project:") ? "projects" : id) as StationId;
      this.walkTo(stationId);
      this.opts.events.onSelect?.(id as PanelId);
      return;
    }
    if (!this.ground) return;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObject(this.ground, false)[0];
    if (!hit) return;
    const point = hit.point.clone().setY(0);
    const max = ISLAND_RADIUS - 1;
    if (point.length() > max) point.setLength(max);
    this.target = point;
    this.stuck = 0;
    this.markerT = 0;
    this.marker?.position.set(point.x, 0.12, point.z);
    this.firstMove();
  }

  private firstMove() {
    if (this.moved) return;
    this.moved = true;
    this.opts.events.onFirstMove?.();
  }

  private frame = () => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.frame);
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.time += delta;
    const reduced = this.opts.reduced;

    this.updateIntro(delta);
    if (this.introDone) this.updateMovement(delta);
    this.updateNear();

    if (this.pointerDirty && !this.drag?.moved) {
      this.pointerDirty = false;
      this.setHover(this.pick());
    }

    const state: FrameState = { time: this.time, delta, reduced, hover: this.hover, near: this.near };
    for (const update of this.updaters) update(state);

    this.updatePads(delta);
    this.updateMarker(delta);
    this.updateCamera(delta);
    this.updateLabels();

    this.renderer.render(this.scene, this.camera);
    this.adaptQuality(delta);
  };

  private updateIntro(delta: number) {
    if (this.introDone) {
      this.name?.reveal(1);
      return;
    }
    this.introT = Math.min(1, this.introT + delta / 2.8);
    this.name?.reveal(THREE.MathUtils.clamp((this.introT - 0.3) / 0.6, 0, 1));
    if (this.introT >= 1) {
      this.introDone = true;
      this.name?.reveal(1);
      this.opts.events.onIntroDone?.();
    }
  }

  private updateMovement(delta: number) {
    const k = this.keys;
    const ix = (k.has("d") || k.has("arrowright") ? 1 : 0) - (k.has("a") || k.has("arrowleft") ? 1 : 0);
    const iz = (k.has("w") || k.has("arrowup") ? 1 : 0) - (k.has("s") || k.has("arrowdown") ? 1 : 0);
    const dir = new THREE.Vector3();

    if ((ix || iz) && !this.focusId) {
      this.target = null;
      const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
      const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
      dir.addScaledVector(right, ix).addScaledVector(forward, iz).normalize();
      this.firstMove();
    } else if (this.target) {
      const to = this.target.clone().sub(this.pos).setY(0);
      const distance = to.length();
      if (distance < 0.12) {
        this.target = null;
      } else {
        dir.copy(to).divideScalar(distance).multiplyScalar(Math.min(1, distance / 0.7));
      }
    }

    this.vel.lerp(dir.multiplyScalar(SPEED), 1 - Math.exp(-delta * 10));
    this.pos.addScaledVector(this.vel, delta);

    const max = ISLAND_RADIUS - 0.9;
    const flat = Math.hypot(this.pos.x, this.pos.z);
    if (flat > max) {
      this.pos.x *= max / flat;
      this.pos.z *= max / flat;
    }
    for (const c of this.colliders) {
      const dx = this.pos.x - c.x;
      const dz = this.pos.z - c.z;
      const d = Math.hypot(dx, dz);
      const r = c.r + 0.32;
      if (d < r && d > 0.0001) {
        this.pos.x = c.x + (dx / d) * r;
        this.pos.z = c.z + (dz / d) * r;
      }
    }

    const speed = Math.hypot(this.vel.x, this.vel.z);
    if (this.target) {
      this.stuck = speed < 0.25 ? this.stuck + delta : 0;
      if (this.stuck > 0.6) this.target = null;
    }
    if (speed > 0.08) {
      this.heading = lerpAngle(this.heading, Math.atan2(this.vel.x, this.vel.z), 1 - Math.exp(-delta * 12));
    }
    if (this.character) {
      this.character.root.position.copy(this.pos);
      this.character.root.rotation.y = this.heading;
      this.character.update(this.time, delta, Math.min(1, speed / SPEED), this.opts.reduced);
    }
  }

  private updateNear() {
    let best: StationId | null = null;
    let bestDistance = Infinity;
    for (const station of stations) {
      const d = Math.hypot(this.pos.x - station.approach[0], this.pos.z - station.approach[1]);
      if (d < station.reach && d < bestDistance) {
        best = station.id;
        bestDistance = d;
      }
    }
    if (best !== this.near) {
      this.near = best;
      this.opts.events.onNear?.(best);
    }
  }

  private updatePads(delta: number) {
    const hoverStation = this.hover?.startsWith("project:") ? "projects" : this.hover;
    for (const [id, pad] of this.pads) {
      const material = pad.material as THREE.MeshBasicMaterial;
      let target = this.introDone ? 0.28 : 0;
      if (hoverStation === id) target = 0.7;
      if (this.near === id) target = this.opts.reduced ? 0.95 : 0.7 + Math.sin(this.time * 5) * 0.25;
      material.opacity = THREE.MathUtils.lerp(material.opacity, target, 1 - Math.exp(-delta * 8));
    }
  }

  private updateMarker(delta: number) {
    if (!this.marker || this.markerT >= 1) return;
    this.markerT = Math.min(1, this.markerT + delta * 1.6);
    this.marker.scale.setScalar(1 + this.markerT * 1.8);
    (this.marker.material as THREE.MeshBasicMaterial).opacity = 1 - this.markerT;
  }

  private updateCamera(delta: number) {
    const portrait = this.portrait();
    const wide = this.width >= 1024;
    const reduced = this.opts.reduced;
    this.yaw = THREE.MathUtils.lerp(this.yaw, this.yawTarget, 1 - Math.exp(-delta * 8));

    let dist = portrait ? 24 : 21;
    let height = portrait ? 21 : 15.5;
    const look = new THREE.Vector3();
    if (this.focusId) {
      dist = portrait ? 10 : 8;
      height = portrait ? 6.8 : 5.2;
      look.copy(this.focusPoint);
    } else {
      look.copy(this.pos).setY(0.9);
    }

    const sway = reduced || this.focusId ? 0 : this.parallax.x * 0.08;
    const lift = reduced || this.focusId ? 0 : this.parallax.y * 0.5;
    const yaw = this.yaw + sway;
    const desiredPos = new THREE.Vector3(
      look.x + Math.sin(yaw) * dist,
      look.y + height + lift,
      look.z + Math.cos(yaw) * dist,
    );
    const desiredLook = look.clone();
    if (!this.focusId && this.width >= 768) {
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const shift = wide ? -3.6 : -2.2;
      desiredLook.addScaledVector(right, shift);
      desiredPos.addScaledVector(right, shift);
    }
    if (this.focusId) {
      if (this.width >= 768) {
        const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
        const offset = wide ? 2.4 : 2.0;
        desiredLook.addScaledVector(right, offset);
        desiredPos.addScaledVector(right, offset);
      } else {
        desiredLook.y -= 2.2;
      }
    }

    if (!this.introDone) {
      const t = easeInOutCubic(this.introT);
      this.camPos.lerpVectors(this.introStartPos, desiredPos, t);
      this.camLook.lerpVectors(this.introStartLook, desiredLook, t);
    } else {
      const k = 1 - Math.exp(-delta * (reduced ? 14 : 4.5));
      this.camPos.lerp(desiredPos, k);
      this.camLook.lerp(desiredLook, k);
    }
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);
  }

  private updateLabels() {
    const show = !this.focusId && this.introT > 0.75;
    const v = new THREE.Vector3();
    const origin = this.opts.canvas.getBoundingClientRect();
    const blocked = this.obstacles()
      .filter((element) => element.offsetParent && getComputedStyle(element).opacity !== "0")
      .map((element) => element.getBoundingClientRect());
    for (const [id, element] of this.labels) {
      const station = stationById[id];
      v.set(station.position[0], ANCHOR_HEIGHT[id], station.position[1]).project(this.camera);
      const x = (v.x * 0.5 + 0.5) * this.width;
      const y = (-v.y * 0.5 + 0.5) * this.height;
      const inView = v.z < 1 && x > 40 && x < this.width - 40 && y > 100 && y < this.height - 96;
      const screenX = origin.left + x;
      const screenY = origin.top + y;
      const covered = blocked.some(
        (rect) => screenX > rect.left - 60 && screenX < rect.right + 60 && screenY > rect.top - 8 && screenY < rect.bottom + 40,
      );
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
      const visible = show && inView && !covered;
      element.style.opacity = visible ? "1" : "0";
      element.style.pointerEvents = visible ? "auto" : "none";
      element.tabIndex = visible ? 0 : -1;
    }
  }

  private adaptQuality(delta: number) {
    if (!this.introDone) return;
    this.frameAccum += delta;
    this.frameCount += 1;
    if (this.frameCount < 90) return;
    const average = (this.frameAccum / this.frameCount) * 1000;
    this.frameAccum = 0;
    this.frameCount = 0;
    if (average < 26) return;
    if (this.dpr > 1) {
      this.dpr = Math.max(1, this.dpr - 0.25);
      this.renderer.setPixelRatio(this.dpr);
      this.resize();
    } else if (this.renderer.shadowMap.enabled && average > 30) {
      this.renderer.shadowMap.enabled = false;
      if (this.sun) this.sun.castShadow = false;
      this.scene.traverse((object) => {
        const material = (object as THREE.Mesh).material;
        if (Array.isArray(material)) material.forEach((m) => (m.needsUpdate = true));
        else if (material) material.needsUpdate = true;
      });
    }
  }

  dispose() {
    this.disposed = true;
    this.pause();
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
    const textures = new Set<THREE.Texture>();
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      const list = Array.isArray(material) ? material : material ? [material] : [];
      for (const m of list) {
        for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value);
        m.dispose();
      }
    });
    textures.forEach((texture) => texture.dispose());
    Object.values(this.materials).forEach((material) => material.dispose());
    this.renderer.dispose();
  }
}

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;

    /* ── Renderer ──────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 6.5;

    /* ── Particle network ──────────────────────────────── */
    const COUNT = 140;
    const R_MIN = 1.6;
    const R_MAX = 3.0;
    const NEIGHBORS = 3;

    const pts: { x: number; y: number; z: number }[] = [];
    const posArr = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const r = R_MIN + Math.random() * (R_MAX - R_MIN);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(1 - 2 * Math.random());
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pts.push({ x, y, z });
      posArr[i * 3]     = x;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = z;
    }

    /* Nodes */
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.028,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const group = new THREE.Group();
    group.add(new THREE.Points(pGeo, pMat));

    /* Edges — each node connects to its N closest */
    const lineVerts: number[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < COUNT; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < COUNT; j++) {
        if (i === j) continue;
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dz = pts[i].z - pts[j].z;
        dists.push({ j, d: Math.sqrt(dx * dx + dy * dy + dz * dz) });
      }
      dists.sort((a, b) => a.d - b.d);
      for (const { j } of dists.slice(0, NEIGHBORS)) {
        const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (!seen.has(key)) {
          seen.add(key);
          lineVerts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }

    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
    const lMat = new THREE.LineBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.13,
    });
    group.add(new THREE.LineSegments(lGeo, lMat));

    /* Cyan edge layer (every other edge) for contrast */
    const lineVerts2: number[] = [];
    Array.from(seen).filter((_, i) => i % 3 === 0).forEach((key) => {
      const [a, b] = key.split("-").map(Number);
      lineVerts2.push(pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z);
    });

    const lGeo2 = new THREE.BufferGeometry();
    lGeo2.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lineVerts2), 3));
    const lMat2 = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.1,
    });
    group.add(new THREE.LineSegments(lGeo2, lMat2));

    scene.add(group);

    /* ── Mouse ─────────────────────────────────────────── */
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    /* ── Resize ────────────────────────────────────────── */
    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    /* ── Loop ──────────────────────────────────────────── */
    let raf: number;
    const tick = () => {
      const t = Date.now() * 0.00045;
      group.rotation.y = t * 0.5 + mx * 0.35;
      group.rotation.x = t * 0.28 + my * 0.2;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      pGeo.dispose(); pMat.dispose();
      lGeo.dispose(); lMat.dispose();
      lGeo2.dispose(); lMat2.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 scene-mask pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden
    />
  );
}

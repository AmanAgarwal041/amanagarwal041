"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const orb = orbRef.current;
    if (!dot || !orb) return;

    let mx = -200, my = -200;
    let ox = -200, oy = -200;
    let raf: number;
    const LERP = 0.09;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
    };

    const tick = () => {
      ox += (mx - ox) * LERP;
      oy += (my - oy) * LERP;
      orb.style.transform = `translate(${ox - 24}px, ${oy - 24}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onDown = () => orb.classList.add("clicking");
    const onUp   = () => orb.classList.remove("clicking");
    const hover  = () => orb.classList.add("hovered");
    const unhover = () => orb.classList.remove("hovered");

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(tick);

    const bind = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", hover);
        el.addEventListener("mouseleave", unhover);
      });
    };
    bind();
    const mo = new MutationObserver(bind);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cur-dot" aria-hidden />
      <div ref={orbRef} className="cur-orb" aria-hidden />
    </>
  );
}

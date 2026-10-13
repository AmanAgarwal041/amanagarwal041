"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WorldEngine } from "@/components/scene/engine";
import Panel from "@/components/ui/Panel";
import PanelContent, { panelMeta } from "@/components/ui/PanelContent";
import { intro, projects } from "@/content/site";
import { portrait, stationById, stations, type PanelId, type StationId } from "@/content/world";

type Mode = "idle" | "loading" | "world" | "fallback";
type Reason = "choice" | "unsupported" | "lowpower" | "error" | null;

const ease = [0.22, 1, 0.36, 1] as const;
const VIEW_KEY = "island:view";

export default function Playground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WorldEngine | null>(null);
  const labelEls = useRef(new Map<StationId, HTMLElement>());
  const openerRef = useRef<HTMLElement | null>(null);
  const activeRef = useRef<PanelId | null>(null);

  const [mode, setMode] = useState<Mode>("idle");
  const [reason, setReason] = useState<Reason>(null);
  const [reduced, setReduced] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [progress, setProgress] = useState({ label: "Sorting the bricks", done: 0, total: 6 });
  const [introDone, setIntroDone] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [near, setNear] = useState<StationId | null>(null);
  const [moved, setMoved] = useState(false);
  const [hintClosed, setHintClosed] = useState(false);
  const [active, setActive] = useState<PanelId | null>(null);
  const [fromList, setFromList] = useState(false);

  const want3d = mode === "loading" || mode === "world";

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setReduced(prefersReduced);
    setCoarse(isCoarse);
    const saved = window.localStorage.getItem(VIEW_KEY);
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowPower =
      (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2 || Boolean(nav.connection?.saveData);
    if (saved === "simple") {
      setReason("choice");
      setMode("fallback");
    } else if (lowPower && saved !== "3d") {
      setReason("lowpower");
      setMode("fallback");
    } else {
      setMode("loading");
    }
  }, []);

  const openPanel = useCallback((id: PanelId, fromList = false) => {
    setFromList(fromList);
    if (!activeRef.current && document.activeElement instanceof HTMLElement) openerRef.current = document.activeElement;
    activeRef.current = id;
    setActive(id);
    engineRef.current?.focus(id);
  }, []);

  const closePanel = useCallback(() => {
    activeRef.current = null;
    setActive(null);
    engineRef.current?.release();
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  }, []);

  const openPanelRef = useRef(openPanel);
  openPanelRef.current = openPanel;

  useEffect(() => {
    if (!want3d) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    let cancelled = false;
    let engine: WorldEngine | null = null;

    (async () => {
      try {
        const mod = await import("@/components/scene/engine");
        if (cancelled) return;
        if (!mod.supportsWebGL()) {
          setReason("unsupported");
          setMode("fallback");
          return;
        }
        engine = new mod.WorldEngine({
          canvas,
          container,
          reduced,
          coarse,
          events: {
            onProgress: (label, done, total) => setProgress({ label, done, total }),
            onHover: setHover,
            onNear: setNear,
            onSelect: (id) => openPanelRef.current(id),
            onIntroDone: () => setIntroDone(true),
            onFirstMove: () => setMoved(true),
            onError: () => {
              setReason("error");
              setMode("fallback");
            },
          },
        });
        engineRef.current = engine;
        await engine.init();
        if (cancelled) return;
        labelEls.current.forEach((element, id) => engine?.setLabel(id, element));
        engine.setTooltip(tooltipRef.current);
        engine.setLabelObstacles(() => Array.from(document.querySelectorAll<HTMLElement>("#home [data-label-obstacle]")));
        engine.start();
        setIntroDone(reduced);
        setMode("world");
      } catch {
        if (cancelled) return;
        setReason("error");
        setMode("fallback");
      }
    })();

    return () => {
      cancelled = true;
      engine?.dispose();
      engineRef.current = null;
    };
  }, [want3d, reduced, coarse]);

  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  const labelRefs = useMemo(
    () =>
      Object.fromEntries(
        stations.map((station) => [
          station.id,
          (element: HTMLElement | null) => {
            if (element) labelEls.current.set(station.id, element);
            else labelEls.current.delete(station.id);
            engineRef.current?.setLabel(station.id, element);
          },
        ]),
      ) as Record<StationId, (element: HTMLElement | null) => void>,
    [],
  );

  const goTo = (id: StationId) => {
    engineRef.current?.walkTo(id);
    openPanel(id);
  };

  const switchToSimple = () => {
    window.localStorage.setItem(VIEW_KEY, "simple");
    closePanel();
    setReason("choice");
    setMode("fallback");
  };

  const use3d = () => {
    window.localStorage.setItem(VIEW_KEY, "3d");
    setIntroDone(false);
    setMoved(false);
    setMode("loading");
  };

  const tooltip = useMemo(() => {
    if (!hover) return null;
    if (hover.startsWith("project:")) {
      const project = projects.find((item) => `project:${item.slug}` === hover);
      return project ? { title: project.name, text: project.kicker } : null;
    }
    const station = stationById[hover as StationId];
    return station ? { title: station.label, text: station.hint } : null;
  }, [hover]);

  const meta = active ? panelMeta(active) : null;
  const showHint = mode === "world" && introDone && !moved && !hintClosed && !active && !near;
  const loading = mode === "loading" || mode === "idle";

  return (
    <section id="home" aria-label="Aman's island" className="relative">
      {mode === "fallback" ? (
        <Fallback reason={reason} onOpen={openPanel} onTry3d={use3d} />
      ) : (
        <div ref={containerRef} className="world relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-sky">
          <div data-native-cursor className="absolute inset-0">
            <canvas ref={canvasRef} aria-label="Interactive 3D island. Use the places menu to reach every section." />
          </div>
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${active ? "opacity-0" : "opacity-100"}`}
          >
            <div className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-deep via-deep/70 to-transparent md:hidden" />
            <div className="absolute inset-y-0 left-0 hidden w-[52%] bg-gradient-to-r from-deep/90 via-deep/55 to-transparent md:block" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-deep/50 to-transparent" />
          </div>

          <div className="pointer-events-none absolute inset-0">
            {stations.map((station) => (
              <button
                key={station.id}
                ref={labelRefs[station.id]}
                type="button"
                tabIndex={-1}
                onClick={() => goTo(station.id)}
                className={`world-label pointer-events-auto flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink shadow-lg transition-colors ${
                  near === station.id ? "bg-pastel" : "bg-paper hover:bg-pastel"
                }`}
                style={{ opacity: 0 }}
              >
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: station.color }} />
                {station.label}
              </button>
            ))}
          </div>

          <div
            ref={tooltipRef}
            aria-hidden
            className={`pointer-events-none absolute left-0 top-0 z-20 max-w-[240px] rounded-xl bg-paper px-3 py-2 text-ink shadow-xl transition-opacity duration-150 ${
              tooltip && !coarse && !active ? "opacity-100" : "opacity-0"
            }`}
          >
            {tooltip && (
              <>
                <p className="font-display text-sm font-bold">{tooltip.title}</p>
                <p className="text-xs text-ink/70">{tooltip.text}</p>
              </>
            )}
          </div>

          <AnimatePresence>
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6 } }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-deep"
              >
                <Loader label={progress.label} value={progress.total ? progress.done / progress.total : 0} />
              </motion.div>
            )}
          </AnimatePresence>

          <IntroCard
            hidden={Boolean(active) || mode === "loading"}
            compact={moved}
            onOpenOpenlit={() => goTo("openlit")}
          />

          <AnimatePresence>
            {mode === "world" && !introDone && (
              <motion.button
                key="skip"
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => engineRef.current?.skipIntro()}
                data-label-obstacle
                className="glass absolute bottom-[92px] right-5 z-20 rounded-full px-4 py-2 text-xs text-paper md:bottom-auto md:right-8 md:top-24"
              >
                Skip intro
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showHint && (
              <motion.div
                key="hint"
                initial={{ opacity: 0, x: "-50%", y: 10 }}
                animate={{ opacity: 1, x: "-50%", y: 0 }}
                exit={{ opacity: 0, x: "-50%", y: 10 }}
                transition={{ duration: 0.4, ease }}
                data-label-obstacle
                className="glass absolute bottom-[92px] left-1/2 z-20 flex w-max max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-full py-2 pl-4 pr-2 text-[13px] text-white/80"
              >
                {coarse ? (
                  <p>
                    <span className="text-paper">Tap the ground</span> to walk · <span className="text-paper">tap objects</span> to explore
                  </p>
                ) : (
                  <p className="flex items-center gap-2 whitespace-nowrap">
                    <span className="flex gap-1">
                      <span className="kbd">W</span>
                      <span className="kbd">A</span>
                      <span className="kbd">S</span>
                      <span className="kbd">D</span>
                    </span>
                    move
                    <span aria-hidden className="text-mist/40">·</span>
                    <span className="text-paper">drag</span> to look
                    <span aria-hidden className="text-mist/40">·</span>
                    <span className="text-paper">click</span> anything
                    <span aria-hidden className="text-mist/40">·</span>
                    <span className="kbd">E</span> open
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setHintClosed(true)}
                  aria-label="Dismiss controls hint"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-mist hover:bg-white/10 hover:text-paper"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {mode === "world" && near && !active && (
              <motion.button
                key={`prompt-${near}`}
                type="button"
                initial={{ opacity: 0, y: 8, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 8, x: "-50%" }}
                onClick={() => openPanel(near)}
                className="absolute bottom-[92px] left-1/2 z-20 flex items-center gap-2 rounded-full bg-pastel px-4 py-2 text-sm font-medium text-ink shadow-xl"
              >
                {!coarse && <span className="kbd border-ink/30 text-ink">E</span>}
                Open {stationById[near].label}
              </motion.button>
            )}
          </AnimatePresence>

          <PlacesBar near={near} active={active} onGo={goTo} />

          {mode === "world" && (
            <button
              type="button"
              onClick={switchToSimple}
              className="absolute bottom-[26px] right-5 z-20 hidden text-xs text-mist underline-offset-4 hover:text-paper hover:underline md:right-8 lg:block"
            >
              Simple view
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {active && meta && (
          <Panel
            key="panel"
            title={meta.title}
            kicker={meta.kicker}
            onClose={closePanel}
            onBack={active.startsWith("project:") || fromList ? () => openPanel("projects") : undefined}
          >
            <PanelContent id={active} open={(id) => openPanel(id, active === "projects" || active.startsWith("project:"))} />
          </Panel>
        )}
      </AnimatePresence>
    </section>
  );
}

function Loader({ label, value }: { label: string; value: number }) {
  return (
    <div className="w-[min(280px,80vw)] text-center" role="status" aria-live="polite">
      <div aria-hidden className="relative mx-auto h-24 w-20">
        {["#e3000b", "#ffcd03", "#3fb4f0"].map((color, index) => (
          <motion.div
            key={color}
            className="absolute left-1/2 h-6 w-16 rounded-[3px]"
            style={{ background: color, bottom: index * 24 }}
            initial={{ x: "-50%", y: -40, opacity: 0 }}
            animate={{ x: "-50%", y: [-40, 0, 0, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, times: [0, 0.18, 0.85, 1], delay: index * 0.3, repeat: Infinity, repeatDelay: 0.2 }}
          >
            <span className="absolute -top-1.5 left-2 h-1.5 w-4 rounded-t-sm" style={{ background: color }} />
            <span className="absolute -top-1.5 right-2 h-1.5 w-4 rounded-t-sm" style={{ background: color }} />
          </motion.div>
        ))}
      </div>
      <p className="mt-5 font-display text-lg font-semibold text-paper">{label}…</p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper/10">
        <motion.div
          className="h-full rounded-full bg-sun"
          initial={{ width: "8%" }}
          animate={{ width: `${Math.max(8, value * 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

function IntroCard({
  hidden,
  compact,
  onOpenOpenlit,
}: {
  hidden: boolean;
  compact: boolean;
  onOpenOpenlit: () => void;
}) {
  const words = intro.greeting.split(" ");
  return (
    <div
      data-label-obstacle
      className={`pointer-events-none absolute inset-x-5 top-[84px] z-20 transition-opacity duration-500 md:inset-x-auto md:bottom-[150px] md:left-8 md:top-auto md:max-w-[460px] ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <h1 className="font-display text-[34px] font-extrabold leading-[0.95] tracking-tight text-paper md:text-6xl">
        <span className="sr-only">Aman Agarwal. </span>
        {words.map((word, index) => [
          index > 0 && " ",
          <motion.span
            key={word + index}
            className="inline-block"
            initial={{ opacity: 0, y: "0.4em" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + index * 0.08, ease }}
          >
            {word === "Aman." ? (
              <>
                <span className="text-sun">Aman</span>.
              </>
            ) : (
              word
            )}
          </motion.span>,
        ])}
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease }}
        className="mt-3 max-w-[30ch] font-display text-lg font-medium leading-snug text-paper/90 md:mt-4 md:text-2xl"
      >
        {intro.headline}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: compact ? 0 : 1 }}
        transition={{ duration: 0.6, delay: compact ? 0 : 0.7 }}
        className="hidden md:block"
      >
        <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-white/85 [text-shadow:0_1px_8px_rgba(8,20,56,0.45)]">{intro.supporting}</p>
        <div className={`mt-6 flex gap-3 ${compact ? "" : "pointer-events-auto"}`}>
          <button
            type="button"
            onClick={onOpenOpenlit}
            className="rounded-full bg-pastel px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            See OpenLIT
          </button>
          <a
            href="#about"
            className="glass rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/25"
          >
            Read the full story
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function PlacesBar({
  near,
  active,
  onGo,
}: {
  near: StationId | null;
  active: PanelId | null;
  onGo: (id: StationId) => void;
}) {
  const current = active?.startsWith("project:") ? "projects" : active;
  return (
    <nav
      aria-label="Places on the island"
      className={`absolute inset-x-0 bottom-5 z-20 flex justify-center px-4 transition-[right] duration-500 md:bottom-6 ${
        active ? "md:right-[452px] lg:right-[492px]" : ""
      }`}
    >
      <ul className="glass no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5">
        {stations.map((station) => {
          const isActive = current === station.id;
          const isNear = near === station.id;
          return (
            <li key={station.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onGo(station.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] transition-colors ${
                  isActive
                    ? "bg-paper text-ink"
                    : isNear
                      ? "bg-pastel text-ink"
                      : "text-white hover:bg-white/20"
                }`}
              >
                {station.id === "openlit" && (
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${isActive || isNear ? "bg-tide" : "bg-sun"}`} />
                )}
                {station.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Fallback({
  reason,
  onOpen,
  onTry3d,
}: {
  reason: Reason;
  onOpen: (id: PanelId) => void;
  onTry3d: () => void;
}) {
  const note =
    reason === "unsupported"
      ? "Your browser can't draw the 3D island, so here's the quick tour."
      : reason === "error"
        ? "The 3D island didn't load this time, so here's the quick tour."
        : reason === "lowpower"
          ? "Showing the lighter version to save your battery."
          : "You're in simple view.";
  return (
    <div
      className="relative min-h-[100svh] overflow-hidden pt-28 text-ink"
      style={{ background: "linear-gradient(180deg, #2f8ff0 0px, #bfe6ff 150px, #f3efe6 420px)" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 top-[300px] opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(11,16,32,0.07) 5px, transparent 6px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-20 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
            <span className="sr-only">Aman Agarwal. </span>
            Hey, I&apos;m <span className="text-brick-blue">Aman</span>.
          </h1>
          <p className="mt-5 max-w-[28ch] font-display text-2xl font-medium leading-snug text-ink/85 md:text-3xl">{intro.headline}</p>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink/65">{intro.supporting}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-ink/60">{note}</span>
            {reason !== "unsupported" && (
              <button
                type="button"
                onClick={onTry3d}
                className="rounded-full bg-pastel px-4 py-2 font-medium text-ink shadow-sm transition-colors hover:bg-white"
              >
                Explore the 3D island
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center lg:col-span-5">
          <div className="relative h-56 w-56 md:h-72 md:w-72">
            <div aria-hidden className="absolute inset-0 rotate-6 rounded-[2rem] bg-sun" />
            <div aria-hidden className="absolute -inset-2 -rotate-3 rounded-[2rem] bg-brick-red/90" />
            <img
              src={portrait.small}
              alt={portrait.alt}
              width={480}
              height={480}
              className="absolute inset-0 h-full w-full rounded-[2rem] border-4 border-paper object-cover"
            />
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3">
          {stations.map((station) => (
            <li key={station.id}>
              <button
                type="button"
                onClick={() => onOpen(station.id)}
                className="group relative w-full overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 pt-6 text-left shadow-[0_6px_20px_rgba(11,16,32,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(11,16,32,0.12)]"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: station.color }} />
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink/55">
                  <span aria-hidden className="h-2 w-2 rounded-sm" style={{ background: station.color }} />
                  {station.place}
                </span>
                <span className="mt-1 flex items-center justify-between font-display text-2xl font-bold">
                  {station.label}
                  <span aria-hidden className="text-ink/40 transition-transform group-hover:translate-x-1 group-hover:text-ink">
                    →
                  </span>
                </span>
                <span className="mt-1 block text-sm text-ink/65">{station.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

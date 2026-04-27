"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

const spring = { duration: 1.05, ease: [0.22, 1, 0.36, 1] as const };
const parent = { hidden: {}, visible: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } } };
const item   = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: spring } };

const socials = [
  { label: "GitHub",   href: "https://github.com/AmanAgarwal041" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/amanagarwal041/" },
  { label: "Twitter",  href: "https://x.com/_typeofnull" },
  { label: "OpenLIT",  href: "https://github.com/openlit/openlit" },
];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center">

      {/* Blobs in isolated overflow wrapper — never clips the name */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="aurora aurora-purple" />
        <div className="aurora aurora-cyan" />
        <div className="aurora aurora-green" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-35 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Particle network */}
      <Scene3D />

      {/* Vignette — fades 3D edges into bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, #020209 88%)",
        }}
      />

      {/* ── Content ─────────────────────────────────────── */}
      <motion.div
        variants={parent}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-screen-xl mx-auto px-6 text-center"
        style={{ zIndex: 10 }}
      >

        {/* Big name */}
        <motion.h1
          variants={item}
          className="font-display font-extrabold leading-none gradient-text"
          style={{
            fontSize: "clamp(5.5rem, 22vw, 22rem)",
            letterSpacing: "-0.03em",
            lineHeight: 0.88,
          }}
        >
          AMAN
        </motion.h1>

        {/* Full name tag — refined, visible */}
        <motion.p
          variants={item}
          className="mt-4 font-display text-slate-300"
          style={{
            fontSize: "clamp(0.85rem, 1.8vw, 1.5rem)",
            letterSpacing: "0.25em",
            fontWeight: 300,
          }}
        >
          AGARWAL
        </motion.p>

        {/* Role */}
        <motion.div variants={item} className="mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-white/20" />
          <p
            className="font-sans text-slate-300 font-medium tracking-[0.18em] uppercase"
            style={{ fontSize: "clamp(0.6rem, 1.1vw, 0.78rem)" }}
          >
            Principal&nbsp;Software&nbsp;Engineer&nbsp;·&nbsp;Co-founder
          </p>
          <span className="h-px w-10 bg-white/20" />
        </motion.div>

        {/* Specialties chips */}
        <motion.div variants={item} className="mt-5 flex flex-wrap justify-center gap-2">
          {["AI Security", "LLM Observability", "Full-Stack"].map((t) => (
            <span
              key={t}
              className="text-xs font-medium px-3 py-1 rounded-full border text-slate-300"
              style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
            >
              {t}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="mt-9 flex flex-wrap justify-center gap-4">
          <motion.a
            href="https://cal.com/aman.openlit/30min"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-white rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_36px_rgba(249,115,22,0.6)]"
          >
            Schedule a Call
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.a>
          <motion.a
            href="#experience"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm text-slate-200 hover:text-white transition-all duration-300 hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]"
            style={{ border: "1px solid rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.05)" }}
          >
            View Work
          </motion.a>
        </motion.div>

        {/* Social links — clearly legible */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-2"
        >
          {socials.map(({ label, href }, i) => (
            <span key={label} className="flex items-center gap-6">
              {i > 0 && <span className="text-white/15 select-none">·</span>}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-slate-400 hover:text-orange-400 transition-colors duration-200 tracking-[0.18em] uppercase"
              >
                {label}
              </a>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ zIndex: 10 }}
      >
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 origin-top"
          style={{ background: "linear-gradient(to bottom, rgba(249,115,22,0.6), transparent)" }}
        />
      </motion.div>
    </section>
  );
}

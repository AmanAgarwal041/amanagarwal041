"use client";

import { motion } from "framer-motion";

const row1 = [
  { icon: "⚛", label: "React" },
  { icon: "◈", label: "TypeScript" },
  { icon: "▲", label: "Next.js" },
  { icon: "⟳", label: "Redux" },
  { icon: "◉", label: "GraphQL" },
  { icon: "🐍", label: "Python" },
  { icon: "📡", label: "OpenTelemetry" },
  { icon: "🛡", label: "AI Security" },
  { icon: "🤖", label: "LLM Observability" },
  { icon: "◈", label: "HTML" },
  { icon: "⚛", label: "CSS" },
  { icon: "▲", label: "Javascript" },
];

const row2 = [
  { icon: "⬡", label: "Node.js" },
  { icon: "⚡", label: "Express" },
  { icon: "🐘", label: "PostgreSQL" },
  { icon: "🍃", label: "MongoDB" },
  { icon: "⚙", label: "Webpack" },
  { icon: "🔍", label: "SEO" },
  { icon: "📦", label: "WebRTC" },
  { icon: "🎯", label: "AMP" },
  { icon: "⬡", label: "Node.js" },
  { icon: "⚡", label: "Express" },
  { icon: "⚙", label: "Webpack" },
];

const row3 = [
  { icon: "🛡", label: "Prompt Engineering" },
  { icon: "🎨", label: "Frontend Development" },
  { icon: "✅", label: "Backend Development" },
  { icon: "⚡", label: "Fullstack Development" },
  { icon: "🛡", label: "SEO Optimisation" },
  { icon: "◈", label: "AI Orchestration" },
  { icon: "📡", label: "Open Source Orchestration" },
  { icon: "📊", label: "Debugging" },
];

function Pill({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="flex items-center gap-2.5 px-5 py-2.5 glass rounded-full text-sm text-slate-300 mx-2 whitespace-nowrap border border-white/6 select-none">
      <span className="text-base leading-none">{icon}</span>
      {label}
    </span>
  );
}

const projects = [
  {
    name: "Transilience AI",
    desc: "AI-powered security platform — autonomous agents for pentesting, CSPM, compliance, and dynamic UI generation.",
    href: "https://github.com/transilienceai",
    tag: "Full-stack · AI · Security",
    color: "from-orange-400/20 to-transparent",
    border: "border-orange-400/20 hover:border-orange-400/40",
    dot: "bg-orange-400",
    current: true,
  },
  {
    name: "OpenLIT",
    desc: "Open-source AI Engineering platform. OpenTelemetry-native LLM observability for 50+ providers.",
    href: "https://github.com/openlit/openlit",
    tag: "2.4k+ stars · Apache-2.0",
    color: "from-cyan-500/15 to-transparent",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    dot: "bg-cyan-400",
    current: true,
  },
];

export default function Stack() {
  return (
    <section id="stack" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-label mb-6"
        >
          Tech Stack
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold leading-tight text-white"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
        >
          Tools I <span className="gradient-text">Build With</span>
        </motion.h2>

        {/* Currently building */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-10 grid sm:grid-cols-2 gap-4"
        >
          {projects.map((p) => (
            <motion.a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 380, damping: 25 }}
              className={`group relative glass rounded-2xl p-5 border transition-all duration-300 ${p.border} overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`relative flex h-2 w-2`}>
                      <span className={`absolute h-full w-full rounded-full ${p.dot} opacity-60 animate-ping-slow`} />
                      <span className={`relative h-2 w-2 rounded-full ${p.dot}`} />
                    </span>
                    <span className="font-display font-bold text-white text-lg">{p.name}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
              <div className="relative z-10 mt-4">
                <span className="text-xs text-slate-400 tracking-wide">{p.tag}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="mt-14 space-y-3 relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-canvas to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-canvas to-transparent" />

        <div className="overflow-hidden">
          <div className="animate-mq">
            {[...row1, ...row1].map((t, i) => <Pill key={i} {...t} />)}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="animate-mqr">
            {[...row2, ...row2].map((t, i) => <Pill key={i} {...t} />)}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="animate-mq3">
            {[...row3, ...row3].map((t, i) => <Pill key={i} {...t} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

interface StatProps { target: number; suffix: string; label: string; inView: boolean; }

function Stat({ target, suffix, label, inView }: StatProps) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <motion.div variants={fadeUp} className="text-center sm:text-left">
      <p className="font-display font-extrabold text-5xl md:text-6xl gradient-text tabular-nums">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-slate-500 tracking-wide">{label}</p>
    </motion.div>
  );
}

const highlights = [
  {
    icon: "⚡",
    title: "AI Security Platform",
    desc: "Full-stack engineering of autonomous AI agents for pentesting, CSPM, compliance, and dynamic TSX component generation at Transilience AI.",
  },
  {
    icon: "🔭",
    title: "Open-Source Leadership",
    desc: "Co-founded OpenLIT — 2.4k+ stars, OpenTelemetry-native LLM observability supporting 50+ providers, GPU monitoring, and guardrails.",
  },
  {
    icon: "🎨",
    title: "Frontend Mastery",
    desc: "Expert in React, TypeScript, and Next.js with a track record in performance optimization, GraphQL, and 90+ Lighthouse scores.",
  },
  {
    icon: "🔧",
    title: "Full-Stack Range",
    desc: "Node.js, PostgreSQL, Python AI agents, Rust tooling — comfortable across the stack from UI to infrastructure.",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-label mb-6"
        >
          About Me
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold leading-tight text-white"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
        >
          Building the Future of
          <br />
          <span className="gradient-text">AI Security &amp; Observability</span>
        </motion.h2>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-slate-400 text-lg leading-relaxed max-w-2xl"
        >
          I&apos;m a Principal Software Engineer and co-founder who thrives at the intersection
          of AI, security, and open-source. At{" "}
          <a href="https://github.com/transilienceai" className="text-orange-400 hover:text-orange-300 transition-colors" target="_blank" rel="noopener noreferrer">
            Transilience AI
          </a>
          , I&apos;m building an AI-powered security platform from scratch — autonomous agents,
          dynamic UI generation, and developer tooling for the next generation of security teams.
          In parallel, I co-founded{" "}
          <a href="https://github.com/openlit/openlit" className="text-cyan-400 hover:text-cyan-300 transition-colors" target="_blank" rel="noopener noreferrer">
            OpenLIT
          </a>
          , one of the leading open-source observability platforms for LLM applications.
        </motion.p>

        {/* Stats */}
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-8 pb-14 border-b border-white/6"
        >
          <Stat target={10} suffix="+" label="Years shipping to production" inView={inView} />
          <Stat target={4}  suffix=""  label="Products built from scratch" inView={inView} />
          <Stat target={7}  suffix="+" label="Engineers led simultaneously" inView={inView} />
          <Stat target={2}  suffix=""  label="Companies currently building" inView={inView} />
        </motion.div>

        {/* Highlights grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid sm:grid-cols-2 gap-5"
        >
          {highlights.map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="glass rounded-2xl p-6 group"
            >
              <span className="text-2xl">{icon}</span>
              <h3 className="mt-3 font-display font-bold text-white text-lg">{title}</h3>
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

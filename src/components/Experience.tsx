"use client";

import { motion } from "framer-motion";

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

interface Experience {
  company: string;
  role: string;
  period: string;
  current: boolean;
  link?: string;
  bullets: string[];
  accent: "violet" | "cyan" | "slate";
}

const experiences: Experience[] = [
  {
    company: "Transilience AI",
    role: "Principal Software Engineer",
    period: "May 2025 — Present",
    current: true,
    link: "https://github.com/transilienceai",
    accent: "violet",
    bullets: [
      "Full-stack engineer building an AI-powered security platform from the ground up.",
      "Designed a multi-project AI skill system with autonomous agents for pentesting, policy creation, CSPM, and compliance automation.",
      "Engineered a dynamic TSX component generation system producing interactive, context-aware UI components at runtime — each tailored to its security project's AI-generated data.",
      "Built a developer debugging interface surfacing AI agent outputs in a structured, accessible way.",
    ],
  },
  {
    company: "OpenLIT",
    role: "Co-founder",
    period: "2024 — Present",
    current: true,
    link: "https://github.com/openlit/openlit",
    accent: "cyan",
    bullets: [
      "Co-founded OpenLIT, an open-source AI Engineering platform with 2.4k+ GitHub stars and 270+ forks.",
      "Built OpenTelemetry-native LLM Observability supporting 50+ LLM providers, GPU monitoring, Guardrails, and Evaluations.",
      "Authored technical content on LLM pipelines, prompt injection protection, and AI observability design.",
    ],
  },
  {
    company: "Appsmith",
    role: "Senior Frontend Engineer",
    period: "Oct 2021 — May 2025",
    current: false,
    link: "https://github.com/appsmithorg/appsmith/pulls?q=+is%3Apr+author%3AAmanAgarwal041+",
    accent: "slate",
    bullets: [
      "Implemented GraphQL API connectors making it a top-10 most utilized integration on the platform.",
      "Built a Node.js middleware layer for module sharing between services, eliminating redundant computation.",
      "Implemented interactive feature walkthroughs increasing tour engagement by 3%.",
    ],
  },
  {
    company: "Gradeup (Byju's Exam Prep)",
    role: "Staff Engineer",
    period: "Oct 2016 — Oct 2021",
    current: false,
    accent: "slate",
    bullets: [
      "Built a live virtual whiteboard teaching platform using HTML Canvas, WebRTC, and Janus.",
      "Developed the Goprep student platform from scratch (NextJS + Apollo GraphQL) with camera-based image search.",
      "Led a team of 7–8 engineers across 3–4 concurrent products on NextJS, NodeJS, and GraphQL.",
      "Drove Page Speed Insights to 70+ mobile and 90+ desktop via optimization.",
      "Architected Teacher Room Booking APIs on NodeJS, Express, GraphQL, and PostgreSQL.",
    ],
  },
  {
    company: "Limetray",
    role: "Software Engineer",
    period: "May 2016 — Oct 2016",
    current: false,
    accent: "slate",
    bullets: ["Revamped the UI of a food ordering POS desktop app on Electron, Sass, and AngularJS."],
  },
  {
    company: "Newgen Software",
    role: "Software Engineer",
    period: "Jul 2015 — May 2016",
    current: false,
    accent: "slate",
    bullets: [
      "Built a product workflow visualization tool with jQuery and MxClient.",
      "Implemented IoT sensor tracking APIs on NodeJS and MongoDB.",
    ],
  },
];

const dotColor = {
  violet: "bg-orange-400",
  cyan: "bg-cyan-400",
  slate: "bg-slate-600",
};

const borderColor = {
  violet: "border-orange-400/20 hover:border-orange-400/40",
  cyan: "border-cyan-500/20 hover:border-cyan-500/40",
  slate: "border-white/5 hover:border-white/10",
};

const roleColor = {
  violet: "text-orange-400",
  cyan: "text-cyan-400",
  slate: "text-slate-400",
};

export default function Experience() {
  return (
    <section id="experience" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-label mb-6"
        >
          Experience
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold leading-tight text-white"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
        >
          Where I&apos;ve <span className="gradient-text">Built</span>
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 relative"
        >
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-orange-400/50 via-white/5 to-transparent hidden sm:block" />

          <div className="space-y-6">
            {experiences.map((exp) => (
              <motion.div key={exp.company} variants={fadeLeft} className="sm:pl-10 relative">
                {/* Dot */}
                <div className="absolute left-0 top-5 hidden sm:flex items-center justify-center w-3.5 h-3.5">
                  {exp.current && (
                    <span className={`absolute w-3.5 h-3.5 rounded-full opacity-60 ${dotColor[exp.accent]} animate-ping-slow`} />
                  )}
                  <span className={`relative w-2.5 h-2.5 rounded-full ${dotColor[exp.accent]}`} />
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={`glass rounded-2xl p-6 border transition-all duration-300 ${borderColor[exp.accent]}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {exp.link ? (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-display font-bold text-white text-xl hover:opacity-80 transition-opacity"
                          >
                            {exp.company}
                          </a>
                        ) : (
                          <span className="font-display font-bold text-white text-xl">{exp.company}</span>
                        )}
                        {exp.current && (
                          <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-medium mt-0.5 ${roleColor[exp.accent]}`}>{exp.role}</p>
                    </div>
                    <span className="text-xs text-slate-400 tracking-wide whitespace-nowrap font-medium mt-1">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5 text-sm text-slate-400 leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

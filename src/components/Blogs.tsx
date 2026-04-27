"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };

const posts = [
  {
    title: "AI Didn't Break Security. It Finally Gave Us a Fighting Chance.",
    url: "https://www.linkedin.com/pulse/ai-didnt-break-security-finally-gave-us-fighting-chance-aman-agarwal-7u96c",
    platform: "LinkedIn",
    tags: ["AI Security", "Transilience AI", "Pentesting"],
    accent: "violet",
    featured: true,
  },
  {
    title: "5 Steps to Make Claude Work Better and Give You More Reliable Results",
    url: "https://www.linkedin.com/pulse/5-steps-make-claude-work-better-give-you-more-reliable-aman-agarwal-5arkc",
    platform: "LinkedIn",
    tags: ["Claude", "Agentic AI", "Workflows"],
    accent: "cyan",
  },
  {
    title: "How I Created a Marketing Video for OpenLIT — In Minutes, Not Hours",
    url: "https://www.linkedin.com/pulse/how-i-created-marketing-video-openlit-minutes-hours-aman-agarwal-xgmkc",
    platform: "LinkedIn",
    tags: ["OpenLIT", "AI Tools", "Automation"],
    accent: "emerald",
  },
  {
    title: "Designing an Observability Pipeline for LLM Applications",
    url: "https://openlit.io/blogs/pipeline-for-llm-apps",
    platform: "OpenLIT",
    tags: ["OpenTelemetry", "LLMs", "Observability"],
    accent: "violet",
  },
  {
    title: "How to Protect your LLM Apps from Prompt Injection Attacks",
    url: "https://openlit.io/blogs/protect-prompt-injection",
    platform: "OpenLIT",
    tags: ["Security", "Prompt Injection"],
    accent: "cyan",
  },
  {
    title: "Unlocking Seamless GenAI & LLM Observability with OpenLIT",
    url: "https://medium.com/@amanagarwal_99464/unlocking-seamless-genai-llm-observability-with-openlit-796039a8855e",
    platform: "Medium",
    tags: ["GenAI", "Open Source"],
    accent: "emerald",
  },
  {
    title: "Google One-Tap 2.0: Improved Iframe UX",
    url: "https://medium.com/gradeup/google-one-tap-2-0-8d369f9e98d3",
    platform: "Medium",
    tags: ["UX", "Google Auth", "Frontend"],
    accent: "slate",
  },
];

type Accent = "violet" | "cyan" | "emerald" | "slate";

const tagStyle: Record<Accent, string> = {
  violet:  "bg-orange-400/10 text-orange-400 border-orange-400/20",
  cyan:    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  slate:   "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const platformColor: Record<string, string> = {
  LinkedIn: "bg-blue-500",
  OpenLIT:  "bg-orange-400",
  Medium:   "bg-emerald-500",
};

export default function Blogs() {
  return (
    <section id="blogs" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-label mb-6"
        >
          Writing
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold leading-tight text-white"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
        >
          From the <span className="gradient-text">Blog</span>
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {posts.map((post) => {
            const accent = (post.accent as Accent) ?? "slate";
            return (
              <motion.a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                className={`glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 group flex flex-col gap-4 ${post.featured ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${platformColor[post.platform] ?? "bg-slate-500"}`} />
                  <span className="text-xs text-slate-400 tracking-wide font-medium">{post.platform}</span>
                </div>

                <h3 className="font-display font-bold text-white text-base leading-snug group-hover:text-orange-200 transition-colors duration-200 flex-1">
                  {post.title}
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <span key={t} className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold tracking-wide ${tagStyle[accent]}`}>
                      {t}
                    </span>
                  ))}
                </div>

                <span className="text-xs text-slate-400 group-hover:text-orange-400 transition-colors duration-200 flex items-center gap-1 mt-auto">
                  Read
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

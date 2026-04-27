"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Aman is a strong, capable frontend engineer, and it was a pleasure to work with him at Appsmith. His ability to debug complex issues is second to none — his structured, methodical approach made him an invaluable resource to the team. His GraphQL integration went to production without serious bugs and remains solid to this day. Beyond technical excellence, Aman is warm, collaborative, and a natural team player with a remarkable ability to lift morale even in challenging situations.",
    name: "Rohan Arthur",
    title: "Engineering Lead, Appsmith",
    href: "https://www.linkedin.com/in/rohan-arthur",
  },
  {
    text: "Aman has great coding abilities with exceptional problem solving skills. He catches up with things really fast — a very good learner. Overall, Aman is the kind of software engineer every company loves to have.",
    name: "Sarvagya Mishra",
    title: "Engineering Lead, Gradeup",
    href: "https://www.linkedin.com/in/sarvagyamishra",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-label mb-6"
        >
          Testimonials
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold leading-tight text-white"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
        >
          What People <span className="gradient-text">Say</span>
        </motion.h2>

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-8 border border-white/5 hover:border-orange-400/20 transition-all duration-300 flex flex-col gap-6"
            >
              {/* Quote mark */}
              <span
                className="font-display font-extrabold text-orange-400/30 leading-none select-none"
                style={{ fontSize: "5rem" }}
                aria-hidden
              >
                "
              </span>

              <p className="text-slate-300 leading-relaxed text-[0.95rem] -mt-8">{t.text}</p>

              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mt-auto group"
              >
                <div className="w-9 h-9 rounded-full bg-orange-400/20 flex items-center justify-center text-sm font-bold text-orange-300 font-display">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-400">{t.title}</p>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const socials = [
  { label: "GitHub",    href: "https://github.com/AmanAgarwal041" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/amanagarwal041/" },
  { label: "Twitter",   href: "https://x.com/_typeofnull" },
  { label: "npm",       href: "https://www.npmjs.com/~typeofnull" },
  { label: "OpenLIT",   href: "https://github.com/openlit/openlit" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-36 overflow-hidden">
      {/* Aurora accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)" }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-label justify-center mb-8"
        >
          Contact
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold leading-tight text-white"
          style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}
        >
          Let&apos;s Build
          <br />
          <span className="gradient-text">Something</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-slate-400 text-lg max-w-xl mx-auto leading-relaxed"
        >
          Open to opportunities, collaborations, and interesting conversations.
          AI, security, open-source, or frontend — I&apos;m just a mail away.
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <motion.a
            href="https://cal.com/aman.openlit/30min"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.55)]"
          >
            📅 Schedule a 30-min Call
          </motion.a>
          <motion.a
            href="mailto:agarwal.aman041@gmail.com"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-8 py-4 glass text-slate-300 hover:text-white rounded-full font-medium text-sm transition-all duration-300 hover:border-orange-400/40"
          >
            ✉ agarwal.aman041@gmail.com
          </motion.a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex justify-center flex-wrap gap-3"
        >
          {socials.map(({ label, href }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 glass rounded-full text-xs text-slate-500 hover:text-white border border-white/6 hover:border-orange-400/40 transition-all duration-200 tracking-wide"
            >
              {label}
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-24 text-center"
      >
        <p className="text-[10px] text-slate-600 tracking-[0.3em] uppercase">
          © 2026 Aman Agarwal
        </p>
      </motion.div>
    </section>
  );
}

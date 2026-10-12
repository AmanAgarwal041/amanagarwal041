"use client";

import { motion } from "framer-motion";
import { aboutParagraphs, stats, UPDATED_ISO, UPDATED_LABEL } from "@/content/site";
import { portrait } from "@/content/world";

const ease = [0.22, 1, 0.36, 1] as const;

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12px] font-medium uppercase tracking-[0.28em] text-sun"
          >
            About
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="relative mt-8 aspect-square w-48 lg:w-full lg:max-w-[15rem]"
          >
            <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-[1.75rem] bg-brick-blue" />
            <div aria-hidden className="absolute inset-0 -translate-x-2 -translate-y-2 rounded-[1.75rem] bg-sun" />
            <picture>
              <source srcSet={`${portrait.small} 480w, ${portrait.src} 800w`} sizes="240px" type="image/webp" />
              <img
                src={portrait.jpg}
                alt={portrait.alt}
                width={800}
                height={800}
                loading="lazy"
                className="relative h-full w-full rounded-[1.75rem] border-4 border-paper object-cover"
              />
            </picture>
          </motion.div>
        </div>
        <div className="lg:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="font-display text-4xl font-bold leading-tight tracking-tight text-paper md:text-6xl"
          >
            Engineer by craft. Builder by instinct.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-mist"
          >
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>
          <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-paper/10 pt-10 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.06, ease }}
              >
                <dt className="font-display text-4xl font-bold text-paper md:text-5xl">{stat.value}</dt>
                <dd className="mt-2 text-sm text-mist">{stat.label}</dd>
              </motion.div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-mist">
            Updated <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time>
          </p>
        </div>
      </div>
    </section>
  );
}

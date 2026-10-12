"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Testimonials() {
  return (
    <section id="notes" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-sun">Notes from people</p>
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        {testimonials.map((item, index) => (
          <motion.figure
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.08, ease }}
          >
            <blockquote className="font-display text-xl font-medium leading-snug text-paper md:text-2xl">“{item.text}”</blockquote>
            <figcaption className="mt-6">
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-paper">
                {item.name}
              </a>
              <p className="mt-1 text-sm text-mist">{item.title}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

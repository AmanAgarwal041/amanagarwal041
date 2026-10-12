"use client";

import { motion } from "framer-motion";
import { education, openSource, skillGroups } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Stack() {
  return (
    <section id="stack" className="mx-auto max-w-6xl px-5 py-8 pb-24 md:px-8 md:pb-32">
      <div className="grid gap-8 lg:grid-cols-12">
        <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-sun lg:col-span-3">Practice</p>
        <h2 className="font-display font-bold tracking-tight text-4xl leading-tight text-paper md:text-6xl lg:col-span-9">Tools I actually use</h2>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-3">
        {skillGroups.map((group, index) => (
          <motion.div
            key={group.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.06, ease }}
          >
            <h3 className="text-[12px] uppercase tracking-[0.22em] text-sun">{group.name}</h3>
            <ul className="mt-4">
              {group.items.map((item) => (
                <li key={item} className="border-b border-paper/10 py-2.5 text-paper/90 transition-colors duration-300 hover:text-sun">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 grid gap-12 border-t border-paper/10 pt-12 lg:grid-cols-2">
        <div>
          <h3 className="text-[12px] uppercase tracking-[0.22em] text-sun">Education</h3>
          <ul className="mt-5 space-y-6">
            {education.map((item) => (
              <li key={item.school}>
                <p className="font-display font-bold tracking-tight text-2xl text-paper">{item.school}</p>
                <p className="mt-1 text-sm text-mist">
                  {item.detail}
                  <span className="mx-2 text-paper/20">/</span>
                  {item.place}
                  <span className="mx-2 text-paper/20">/</span>
                  {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] uppercase tracking-[0.22em] text-sun">Open source</h3>
          <ul className="mt-5 space-y-3">
            {openSource.map((item) => (
              <li key={item.name} className="text-sm leading-relaxed text-mist">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-paper">
                    {item.name}
                  </a>
                ) : (
                  item.name
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

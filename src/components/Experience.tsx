"use client";

import { motion } from "framer-motion";
import { jobs } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Experience() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-8 lg:grid-cols-12">
        <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-sun lg:col-span-3">Experience</p>
        <h2 className="font-display font-bold tracking-tight text-4xl leading-tight text-paper md:text-6xl lg:col-span-9">Where the work happened</h2>
      </div>

      <div className="mt-14 border-t border-paper/10">
        {jobs.map((job, index) => (
          <motion.article
            key={job.company}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: Math.min(index * 0.03, 0.12), ease }}
            className="grid gap-6 border-b border-paper/10 py-10 lg:grid-cols-12"
          >
            <div className="lg:col-span-4">
              <h3 className="font-display font-bold tracking-tight text-3xl text-paper">
                {job.href ? (
                  <a href={job.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </h3>
              <p className="mt-3 text-sm text-mist">
                {job.period}
                <span className="mx-2 text-paper/20">/</span>
                {job.place}
              </p>
              {job.current && (
                <p className="mt-3 inline-flex rounded-full border border-accent/40 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-sun">
                  Current
                </p>
              )}
            </div>
            <div className="space-y-8 lg:col-span-8">
              {job.roles.map((role) => (
                <div key={role.title}>
                  <h4 className="text-sm font-medium uppercase tracking-[0.16em] text-sun">{role.title}</h4>
                  <ul className="mt-3 space-y-2">
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className="text-[15px] leading-relaxed text-mist">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

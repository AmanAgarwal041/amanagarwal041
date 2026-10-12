"use client";

import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { chapters, openlit, projects } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;
const book = projects.find((project) => project.slug === "autobiography");
const others = projects.filter((project) => project.slug !== "autobiography");

function setGlow(event: MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
}

export default function Projects() {
  const [hero] = openlit.images;
  return (
    <section id="projects" className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-accent-ink lg:col-span-3">Projects</p>
          <div className="lg:col-span-9">
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">Selected work</h2>
            <p className="mt-4 max-w-xl text-lg text-ink/70">
              An observability platform, a book written in the voice of AI, and the experiments in between.{" "}
              <a href="/resume/" className="link-underline text-ink">
                The longer record is the resume
              </a>
              .
            </p>
          </div>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          onMouseMove={setGlow}
          className="glow-card mt-14 overflow-hidden rounded-3xl bg-tide p-6 text-paper md:p-10"
        >
          <div className="relative z-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-[12px] uppercase tracking-[0.22em] text-sun">Featured · Co-founder</p>
              <h3 className="mt-3 font-display text-5xl font-extrabold leading-none tracking-tight">{openlit.name}</h3>
              <p className="mt-5 font-display text-xl font-medium leading-snug">{openlit.tagline}</p>
              <p className="mt-4 leading-relaxed text-mist">{openlit.summary}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4">
                {openlit.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="font-display text-2xl font-bold">{metric.value}</dt>
                    <dd className="text-xs text-mist">{metric.label}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                {openlit.links.map((link, index) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      index === 0
                        ? "inline-flex rounded-full bg-pastel px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
                        : "inline-flex rounded-full border border-paper/20 px-5 py-2.5 text-sm transition-colors hover:border-sun hover:text-sun"
                    }
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <figure className="self-center overflow-hidden rounded-2xl border border-paper/10 lg:col-span-7">
              <img src={hero.src} width={hero.width} height={hero.height} alt={hero.alt} loading="lazy" className="h-auto w-full" />
            </figure>
          </div>
        </motion.article>

        {book && (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            onMouseMove={setGlow}
            className="glow-card mt-5 overflow-hidden rounded-3xl border border-ink/10 bg-white/60 p-6 md:p-10"
          >
            <div className="relative z-10 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-[12px] uppercase tracking-[0.22em] text-accent-ink">{book.kicker}</p>
                <h3 className="mt-3 font-display text-4xl font-extrabold leading-none tracking-tight md:text-5xl">{book.name}</h3>
                <blockquote className="mt-6 font-display text-2xl font-semibold leading-snug text-ink/85">
                  “{book.quote}”
                  <span className="mt-3 block text-lg font-normal text-ink/55">{book.aside}</span>
                </blockquote>
                <p className="mt-6 leading-relaxed text-ink/75">{book.summary}</p>
                {book.links[0] && (
                  <a
                    href={book.links[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex rounded-full bg-tide px-5 py-3 text-sm text-paper transition-colors duration-300 hover:bg-accent-ink"
                  >
                    {book.links[0].label}
                  </a>
                )}
              </div>
              <ol className="lg:col-span-7 lg:border-l lg:border-ink/10 lg:pl-10">
                {chapters.map((chapter, index) => (
                  <li key={chapter} className="flex gap-4 border-b border-ink/10 py-3 text-sm last:border-b-0">
                    <span className="w-6 shrink-0 font-display font-bold text-accent-ink">{String(index + 1).padStart(2, "0")}</span>
                    <span className={index === 0 ? "text-ink" : "text-ink/70"}>{chapter}</span>
                  </li>
                ))}
                <li className="pt-4 text-xs uppercase tracking-[0.16em] text-ink/45">{book.note}</li>
              </ol>
            </div>
          </motion.article>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {others.map((project, index) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.06, ease }}
              onMouseMove={setGlow}
              className="glow-card flex flex-col rounded-3xl border border-ink/10 bg-white/50 p-6"
            >
              <div className="relative z-10 flex h-full flex-col">
                {project.shots?.[0] && (
                  <img
                    src={project.shots[0].src}
                    width={project.shots[0].width}
                    height={project.shots[0].height}
                    alt={project.shots[0].alt}
                    loading="lazy"
                    className="mb-6 h-auto w-full rounded-2xl border border-ink/10"
                  />
                )}
                <p className="text-[12px] uppercase tracking-[0.22em] text-accent-ink">{project.kicker}</p>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-tight">{project.name}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">{project.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-ink/10 px-2.5 py-1 text-[11px] tracking-wide text-ink/60">
                      {tag}
                    </li>
                  ))}
                </ul>
                {project.example && (
                  <p className="mt-5 text-sm leading-relaxed text-ink/70">
                    Example: <span className="text-ink">{project.example.title}</span>.{" "}
                    <a href={project.example.pdf} className="link-underline text-ink">
                      See the itinerary PDF
                    </a>
                  </p>
                )}
                {project.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-4 text-sm">
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

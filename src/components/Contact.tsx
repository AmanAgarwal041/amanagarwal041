"use client";

import { calendar, email, socials, UPDATED_ISO, UPDATED_LABEL } from "@/content/site";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
      <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-sun">Contact</p>
      <h2 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-5xl leading-[0.95] text-paper md:text-7xl">
        Have something interesting to build?
      </h2>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
        Let&apos;s talk about AI, open source, products, or that idea you&apos;ve been thinking about.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href={calendar}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex justify-center rounded-full bg-pastel px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
        >
          Schedule a 30-minute call
        </a>
        <a
          href={`mailto:${email}`}
          className="inline-flex justify-center rounded-full border border-paper/20 px-5 py-3 text-sm text-paper transition-colors hover:border-accent"
        >
          {email}
        </a>
      </div>

      <footer className="mt-24 flex flex-col gap-6 border-t border-paper/10 pt-8 text-sm text-mist md:flex-row md:items-end md:justify-between">
        <div>
          <p>
            Updated <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time>
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            <li>
              <a href="/resume/" className="link-underline hover:text-paper">
                Resume
              </a>
            </li>
            <li>
              <a href="/aman-agarwal-resume.pdf" className="link-underline hover:text-paper">
                Resume PDF
              </a>
            </li>
            <li>
              <a href="/llms.txt" className="link-underline hover:text-paper">
                llms.txt
              </a>
            </li>
            <li>
              <a href="#projects" className="link-underline hover:text-paper">
                Projects
              </a>
            </li>
            <li>
              <a href="#writing" className="link-underline hover:text-paper">
                Writing
              </a>
            </li>
          </ul>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {socials.map((item) => (
            <li key={item.label}>
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-paper">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </section>
  );
}

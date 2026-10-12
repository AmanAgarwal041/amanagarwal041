"use client";

import { useState, type ReactNode } from "react";
import {
  aboutParagraphs,
  calendar,
  email,
  engineering,
  jobs,
  openlit,
  openSource,
  projects,
  skillGroups,
  socials,
  stats,
  type Project,
  type ProjectShot,
} from "@/content/site";
import { portrait, stationById, type PanelId, type StationId } from "@/content/world";
import { useRepoStats } from "@/hooks/useRepoStats";

export function panelMeta(id: PanelId) {
  if (id.startsWith("project:")) {
    const project = projects.find((item) => `project:${item.slug}` === id);
    return { title: project?.name ?? "Project", kicker: project?.kicker ?? "Project" };
  }
  const station = stationById[id as StationId];
  if (id === "openlit") return { title: "OpenLIT", kicker: "Featured · Control room" };
  return { title: station.label, kicker: station.place };
}

function ExternalLink({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        primary
          ? "inline-flex items-center gap-1.5 rounded-full bg-pastel px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
          : "inline-flex items-center gap-1.5 rounded-full border border-paper/15 px-4 py-2 text-sm text-paper transition-colors hover:border-sun hover:text-sun"
      }
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-paper/12 px-3 py-1 text-xs text-mist">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 mt-8 text-[11px] font-medium uppercase tracking-[0.22em] text-mist">{children}</h3>;
}

export default function PanelContent({ id, open }: { id: PanelId; open: (id: PanelId) => void }) {
  if (id === "about") return <About />;
  if (id === "openlit") return <Openlit />;
  if (id === "projects") return <ProjectList open={open} />;
  if (id === "engineering") return <Engineering />;
  if (id === "experience") return <Experience />;
  if (id === "contact") return <Contact />;
  const project = projects.find((item) => `project:${item.slug}` === id);
  return project ? <ProjectDetail slug={project.slug} open={open} /> : null;
}

function About() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <div aria-hidden className="absolute inset-0 rotate-6 rounded-2xl bg-sun" />
          <img
            src={portrait.small}
            alt={portrait.alt}
            width={480}
            height={480}
            loading="lazy"
            className="absolute inset-0 h-full w-full rounded-2xl border-[3px] border-paper object-cover"
          />
        </div>
        <div>
          <p className="font-display text-xl font-bold">Aman Agarwal</p>
          <p className="text-sm text-mist">Principal Full Stack Engineer · Noida, India</p>
        </div>
      </div>
      <div className="space-y-4 text-[15px] leading-relaxed text-paper/85">
        {aboutParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-paper/10 p-4">
            <dt className="font-display text-3xl font-bold">{stat.value}</dt>
            <dd className="mt-1 text-xs text-mist">{stat.label}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="/resume/"
          className="inline-flex rounded-full bg-pastel px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
        >
          Read the resume
        </a>
        <a
          href="/aman-agarwal-resume.pdf"
          className="inline-flex rounded-full border border-paper/15 px-4 py-2 text-sm transition-colors hover:border-sun hover:text-sun"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}

function Openlit() {
  const live = useRepoStats("openlit/openlit");
  const [hero, trace] = openlit.images;
  return (
    <div>
      <figure className="overflow-hidden rounded-2xl border border-paper/10">
        <img src={hero.src} width={hero.width} height={hero.height} alt={hero.alt} className="h-auto w-full" />
      </figure>
      <p className="mt-6 font-display text-xl font-semibold leading-snug">{openlit.tagline}</p>
      <p className="mt-2 text-sm text-sun">{openlit.role}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-paper/80">{openlit.summary}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {openlit.links.map((link, index) => (
          <ExternalLink key={link.href} href={link.href} primary={index === 0}>
            {link.label}
          </ExternalLink>
        ))}
      </div>

      <Label>What it covers</Label>
      <Chips items={openlit.themes} />

      <Label>Decisions that shaped it</Label>
      <ol className="space-y-4">
        {openlit.decisions.map((decision, index) => (
          <li key={decision.title} className="flex gap-4">
            <span className="font-display text-lg font-bold text-accent">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="font-medium">{decision.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-mist">{decision.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <Label>Where it stands</Label>
      <dl className="grid grid-cols-2 gap-3">
        {openlit.metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-paper/10 p-4">
            <dt className="font-display text-2xl font-bold">{metric.value}</dt>
            <dd className="mt-1 text-xs text-mist">{metric.label}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-mist">
        {live
          ? `Live from GitHub right now: ${live.stars.toLocaleString("en-US")} stars and ${live.forks.toLocaleString("en-US")} forks.`
          : "Figures from my resume, October 2026."}
      </p>

      <figure className="mt-8 overflow-hidden rounded-2xl border border-paper/10">
        <img
          src={trace.src}
          width={trace.width}
          height={trace.height}
          alt={trace.alt}
          loading="lazy"
          className="h-auto w-full"
        />
      </figure>
    </div>
  );
}

function ProjectList({ open }: { open: (id: PanelId) => void }) {
  const cards = [
    { id: "openlit" as PanelId, name: openlit.name, kicker: "Featured", summary: openlit.tagline },
    ...projects.map((project) => ({
      id: `project:${project.slug}` as PanelId,
      name: project.name,
      kicker: project.kicker,
      summary: project.summary,
    })),
  ];
  return (
    <div>
      <p className="text-[15px] leading-relaxed text-paper/80">
        Things I&apos;ve built and keep building. Step through the portal, or pick one below.
      </p>
      <ul className="mt-6 space-y-3">
        {cards.map((card) => (
          <li key={card.id}>
            <button
              type="button"
              onClick={() => open(card.id)}
              className="group w-full rounded-2xl border border-paper/10 p-5 text-left transition-colors hover:border-sun"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-accent">{card.kicker}</span>
              <span className="mt-1 flex items-center justify-between font-display text-2xl font-bold">
                {card.name}
                <span aria-hidden className="text-sun transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-mist">{card.summary}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Shot({ shot }: { shot: ProjectShot }) {
  return (
    <figure className="mt-5">
      <div className="overflow-hidden rounded-2xl border border-paper/10 bg-white">
        <img src={shot.src} width={shot.width} height={shot.height} alt={shot.alt} loading="lazy" className="h-auto w-full" />
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-mist">{shot.caption}</figcaption>
    </figure>
  );
}

function Terminal({ lines }: { lines: NonNullable<Project["terminal"]> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-paper/10 bg-black/60">
      <div className="flex items-center gap-1.5 border-b border-paper/10 px-4 py-2.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-brick-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-sun" />
        <span className="h-2.5 w-2.5 rounded-full bg-brick-green" />
        <span className="ml-2 text-[11px] text-mist">zsh — my-monorepo</span>
      </div>
      <pre className="no-scrollbar overflow-x-auto px-4 py-3 font-mono text-[12px] leading-relaxed">
        {lines.map((line) => (
          <span key={line.command} className="block">
            <span className="text-brick-azure">$ </span>
            <span className="text-paper">{line.command}</span>
            {line.output && <span className="block whitespace-pre text-brick-green/90">{line.output}</span>}
          </span>
        ))}
      </pre>
    </div>
  );
}

function ProjectDetail({ slug, open }: { slug: string; open: (id: PanelId) => void }) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return null;
  const example = project.example;
  return (
    <div>
      {project.quote && (
        <blockquote className="rounded-2xl border border-paper/10 bg-white/10 p-5 font-display text-xl font-semibold leading-snug">
          “{project.quote}”
          {project.aside && <span className="mt-2 block text-base font-normal text-mist">{project.aside}</span>}
        </blockquote>
      )}
      <p className="mt-6 text-[15px] leading-relaxed text-paper/85 first:mt-0">{project.summary}</p>
      {project.shots?.slice(0, 1).map((shot) => <Shot key={shot.src} shot={shot} />)}
      {project.details && (
        <div className="mt-6 space-y-3 text-[14px] leading-relaxed text-paper/75">
          {project.details.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      {project.highlights && (
        <>
          <Label>What it does</Label>
          <ul className="grid gap-3 sm:grid-cols-2">
            {project.highlights.map((item) => (
              <li key={item.title} className="rounded-2xl border border-paper/10 p-4">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">{item.text}</p>
              </li>
            ))}
          </ul>
        </>
      )}
      {project.terminal && (
        <>
          <Label>A real session</Label>
          <Terminal lines={project.terminal} />
        </>
      )}
      {project.shots?.slice(1).map((shot) => <Shot key={shot.src} shot={shot} />)}
      {example && (
        <>
          <Label>Example trip it planned</Label>
          <div className="rounded-2xl border border-paper/10 bg-white/10 p-5">
            <p className="font-display text-lg font-bold leading-snug">{example.title}</p>
            <p className="mt-1 text-xs text-sun">{example.meta}</p>
            <p className="mt-3 text-sm leading-relaxed text-paper/75">{example.summary}</p>
            <ol className="mt-4 space-y-3">
              {example.days.map((day) => (
                <li key={day.title} className="border-l-2 border-brick-azure pl-3">
                  <p className="text-sm font-medium">{day.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-mist">{day.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-paper/70">
              <span className="font-medium text-paper">Budget: </span>
              {example.budget}
            </p>
          </div>
          {example.shots.map((shot) => (
            <Shot key={shot.src} shot={shot} />
          ))}
          <a
            href={example.pdf}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-pastel px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Download the full itinerary PDF
          </a>
        </>
      )}
      <div className="mt-6">
        <Chips items={project.tags} />
      </div>
      {project.note && <p className="mt-5 text-sm text-mist">{project.note}</p>}
      {project.links.length > 0 && (
        <div className="mt-7 flex flex-wrap gap-3">
          {project.links.map((link, index) => (
            <ExternalLink key={link.href} href={link.href} primary={index === 0}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      )}
      <Label>More projects</Label>
      <ul className="grid gap-2">
        {[{ id: "openlit" as PanelId, name: openlit.name }, ...projects.map((item) => ({ id: `project:${item.slug}` as PanelId, name: item.name }))]
          .filter((item) => item.id !== `project:${slug}`)
          .map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => open(item.id)}
                className="group flex w-full items-center justify-between rounded-xl border border-paper/10 px-4 py-3 text-left text-sm transition-colors hover:border-sun"
              >
                {item.name}
                <span aria-hidden className="text-sun transition-transform group-hover:translate-x-1">→</span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

function Engineering() {
  return (
    <div>
      <p className="text-[15px] leading-relaxed text-paper/80">
        How I like to build: fast interfaces, clear architecture, AI that you can observe, and code in the open.
      </p>
      <ul className="mt-6 space-y-4">
        {engineering.map((item) => (
          <li key={item.title} className="border-l-2 border-sun pl-4">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-mist">{item.text}</p>
          </li>
        ))}
      </ul>
      {skillGroups.map((group) => (
        <div key={group.name}>
          <Label>{group.name}</Label>
          <Chips items={group.items} />
        </div>
      ))}
      <Label>Open source</Label>
      <ul className="space-y-2 text-sm">
        {openSource.map((item) => (
          <li key={item.name}>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-underline text-paper">
                {item.name}
              </a>
            ) : (
              <span className="text-mist">{item.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Experience() {
  return (
    <div>
      <ol className="relative space-y-6 border-l border-paper/15 pl-6">
        {jobs.map((job) => (
          <li key={job.company} className="relative">
            <span
              aria-hidden
              className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ${job.current ? "bg-sun" : "bg-accent"}`}
            />
            <p className="text-xs text-mist">{job.period}</p>
            <p className="mt-0.5 font-display text-xl font-bold">{job.company}</p>
            <p className="text-sm text-accent">{job.roles.map((role) => role.title).join(" · ")}</p>
            <p className="mt-2 text-sm leading-relaxed text-paper/75">{job.roles[0].bullets[0]}</p>
          </li>
        ))}
      </ol>
      <a
        href="/resume/"
        className="mt-8 inline-flex rounded-full bg-pastel px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
      >
        Full resume
      </a>
    </div>
  );
}

function Contact() {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const mailto = `mailto:${email}?subject=${encodeURIComponent("Hello from your island")}&body=${encodeURIComponent(message)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <p className="font-display text-2xl font-bold leading-tight">Have something interesting to build?</p>
      <p className="mt-3 text-[15px] leading-relaxed text-paper/80">
        Let&apos;s talk about AI, open source, products, or that idea you&apos;ve been thinking about.
      </p>

      <div className="mt-6 rounded-2xl border border-paper/10 bg-white/10 p-4">
        <label htmlFor="capsule" className="font-mono text-xs text-sun">
          $ write --to aman
        </label>
        <textarea
          id="capsule"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Hi Aman, I'm building…"
          className="mt-2 w-full resize-none bg-transparent font-mono text-sm text-paper placeholder:text-mist/60 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-mist">Opens your mail app with this note.</span>
          <a
            href={mailto}
            className="inline-flex rounded-full bg-pastel px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Send it
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex rounded-full border border-paper/15 px-4 py-2 text-sm transition-colors hover:border-sun hover:text-sun"
        >
          {copied ? "Copied" : email}
        </button>
        <ExternalLink href={calendar}>Book a 30-minute call</ExternalLink>
      </div>

      <Label>Elsewhere</Label>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {socials.map((social) => (
          <li key={social.href}>
            <a href={social.href} target="_blank" rel="noopener noreferrer" className="link-underline text-paper">
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

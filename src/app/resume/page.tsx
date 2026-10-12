import type { Metadata } from "next";
import Nav from "@/components/Nav";
import {
  calendar,
  description,
  education,
  email,
  jobs,
  openlit,
  phone,
  projects,
  SITE_URL,
  skillGroups,
  socials,
  UPDATED_ISO,
  UPDATED_LABEL,
} from "@/content/site";

const resumeTitle = "Resume";
const resumeDescription =
  "Resume of Aman Agarwal: 11 years in software, principal full stack engineer at Transilience AI, co-founder of OpenLIT. Experience, skills, education.";

export const metadata: Metadata = {
  title: resumeTitle,
  description: resumeDescription,
  alternates: { canonical: `${SITE_URL}/resume/` },
  openGraph: {
    type: "profile",
    title: "Resume — Aman Agarwal",
    description: resumeDescription,
    url: `${SITE_URL}/resume/`,
    siteName: "Aman Agarwal",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Aman Agarwal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume — Aman Agarwal",
    description: resumeDescription,
    images: ["/og.png"],
  },
};

const resumeLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/resume/#page`,
  name: "Resume — Aman Agarwal",
  url: `${SITE_URL}/resume/`,
  description: resumeDescription,
  dateModified: UPDATED_ISO,
  inLanguage: "en-US",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  mainEntity: { "@id": `${SITE_URL}/#person` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Resume", item: `${SITE_URL}/resume/` },
    ],
  },
};

export default function ResumePage() {
  return (
    <main id="content" className="min-h-screen bg-paper text-ink">
      <Nav />
      <article className="mx-auto max-w-5xl px-5 pb-24 pt-32 md:px-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-accent-ink">Resume</p>
        <h1 className="mt-4 font-display font-bold tracking-tight text-6xl leading-none md:text-8xl">
          Aman Agarwal
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink/70">{description}</p>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li>
            <a href={`mailto:${email}`} className="link-underline">
              {email}
            </a>
          </li>
          <li>
            <a href={`tel:+91${phone}`} className="link-underline">
              {phone}
            </a>
          </li>
          <li>Noida, India</li>
          <li>
            <a href={calendar} className="link-underline">
              Book a call
            </a>
          </li>
          <li>
            <a href="/aman-agarwal-resume.pdf" className="link-underline">
              Download PDF
            </a>
          </li>
        </ul>

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <h2 className="text-[12px] uppercase tracking-[0.22em] text-accent-ink">Experience</h2>
            <div className="mt-6 space-y-10">
              {jobs.map((job) => (
                <section key={job.company}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display font-bold tracking-tight text-3xl">
                      {job.href ? (
                        <a href={job.href} className="link-underline">
                          {job.company}
                        </a>
                      ) : (
                        job.company
                      )}
                    </h3>
                    <p className="text-sm text-ink/55">
                      {job.period} · {job.place}
                    </p>
                  </div>
                  {job.roles.map((role) => (
                    <div key={role.title} className="mt-4">
                      <p className="text-sm font-medium">{role.title}</p>
                      <ul className="mt-2 space-y-1.5">
                        {role.bullets.map((bullet) => (
                          <li key={bullet} className="text-sm leading-relaxed text-ink/75">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </div>

          <aside className="space-y-10">
            <div>
              <h2 className="text-[12px] uppercase tracking-[0.22em] text-accent-ink">Selected work</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href={openlit.links[1].href} className="link-underline">
                    {openlit.name}
                  </a>
                </li>
                {projects.map((project) => (
                  <li key={project.slug}>
                    {project.links[0] ? (
                      <a href={project.links[0].href} className="link-underline">
                        {project.name}
                      </a>
                    ) : (
                      <span className="text-ink/70">{project.name}</span>
                    )}
                  </li>
                ))}
                <li>
                  <a href="/#projects" className="link-underline text-ink/60">
                    All projects on the site
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-[12px] uppercase tracking-[0.22em] text-accent-ink">Skills</h2>
              {skillGroups.map((group) => (
                <div key={group.name} className="mt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{group.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/80">{group.items.join(", ")}</p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-[12px] uppercase tracking-[0.22em] text-accent-ink">Education</h2>
              <ul className="mt-4 space-y-4">
                {education.map((item) => (
                  <li key={item.school}>
                    <p className="text-sm font-medium">{item.school}</p>
                    <p className="text-sm text-ink/65">
                      {item.detail}, {item.place}
                    </p>
                    <p className="text-xs text-ink/45">{item.period}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[12px] uppercase tracking-[0.22em] text-accent-ink">Elsewhere</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {socials.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="link-underline">
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="/#writing" className="link-underline">
                    Writing
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <p className="mt-16 text-sm text-ink/50">
          Updated <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time>
          {" · "}
          <a href="/" className="link-underline">
            Back to the site
          </a>
        </p>
      </article>
      <script type="application/ld+json" defer dangerouslySetInnerHTML={{ __html: JSON.stringify(resumeLd) }} />
    </main>
  );
}

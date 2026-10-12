"use client";

import { faqs } from "@/content/site";

const links: Record<string, { href: string; label: string; external?: boolean }[]> = {
  "Who is Aman Agarwal?": [
    { href: "/resume/", label: "Read the resume" },
    { href: "#work", label: "See the experience" },
  ],
  "What is Aman Agarwal building now?": [
    { href: "https://github.com/transilienceai/cldpm", label: "CLDPM on GitHub", external: true },
    { href: "#projects", label: "Projects on this page" },
  ],
  "What is Autobiography of AI?": [
    { href: "https://autobiographyofai.amanagarwal.xyz/", label: "Read Autobiography of AI", external: true },
  ],
  "What is OpenLIT?": [
    { href: "https://github.com/openlit/openlit", label: "OpenLIT on GitHub", external: true },
    { href: "https://openlit.io", label: "openlit.io", external: true },
  ],
  "How can I contact Aman Agarwal?": [
    { href: "mailto:agarwal.aman041@gmail.com", label: "Email Aman" },
    { href: "/resume/", label: "Open the resume" },
    { href: "/aman-agarwal-resume.pdf", label: "Download the PDF" },
  ],
};

export default function Faq() {
  return (
    <section id="faq" className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-accent-ink">FAQ</p>
        <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((item) => (
            <article key={item.question} className="grid gap-4 py-8 lg:grid-cols-12">
              <h2 className="font-display font-bold tracking-tight text-3xl leading-tight lg:col-span-5">{item.question}</h2>
              <div className="lg:col-span-7">
                <p className="text-lg leading-relaxed text-ink/75">{item.answer}</p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {links[item.question]?.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="link-underline"
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

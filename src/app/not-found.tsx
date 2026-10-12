import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist on amanagarwal.xyz.",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
  openGraph: null,
};

export default function NotFound() {
  return (
    <main id="content" className="min-h-screen bg-tide text-paper">
      <Nav />
      <section className="mx-auto max-w-3xl px-5 pb-24 pt-36 md:px-8 md:pt-44">
        <p className="text-[12px] uppercase tracking-[0.22em] text-sun">404</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">This page wandered off the island.</h1>
        <p className="mt-5 max-w-[46ch] text-lg text-mist">
          The link may be old or mistyped. Everything I work on is reachable from the home page.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3 text-sm">
          <li>
            <a href="/" className="inline-flex rounded-full bg-pastel px-5 py-2.5 font-medium text-ink">
              Back to the island
            </a>
          </li>
          <li>
            <a href="/#projects" className="inline-flex rounded-full border border-paper/20 px-5 py-2.5 hover:border-paper/50">
              Projects
            </a>
          </li>
          <li>
            <a href="/resume/" className="inline-flex rounded-full border border-paper/20 px-5 py-2.5 hover:border-paper/50">
              Resume
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}

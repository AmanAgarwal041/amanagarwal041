"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { calendar } from "@/content/site";

const links = [
  { label: "Projects", id: "projects" },
  { label: "Work", id: "work" },
  { label: "Writing", id: "writing" },
  { label: "FAQ", id: "faq" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);
  const home = pathname === "/" ? "" : "/";
  const solid = scrolled || open || pathname !== "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? window.scrollY / height : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const nodes = links
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="progress no-print" style={{ transform: `scaleX(${progress})` }} />
      <header
        className={`no-print fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          open || solid ? "glass-dark border-b border-white/10" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href={`${home}#home`} className="font-display text-xl font-extrabold leading-none tracking-tight text-white [text-shadow:0_1px_10px_rgba(8,20,56,0.45)]">
            Aman<span className="text-sun">.</span>
          </a>

          <ul className="glass hidden items-center gap-1 rounded-full p-1 md:flex">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`${home}#${link.id}`}
                  className={`block rounded-full px-4 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                    active === link.id ? "bg-white text-ink" : "text-white hover:bg-white/20"
                  }`}
                  aria-current={active === link.id ? "true" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/resume/"
                className={`block rounded-full px-4 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                  pathname?.startsWith("/resume") ? "bg-white text-ink" : "text-white hover:bg-white/20"
                }`}
                aria-current={pathname?.startsWith("/resume") ? "page" : undefined}
              >
                Resume
              </a>
            </li>
          </ul>

          <a
            href={calendar}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-pastel px-4 py-2 text-[13px] font-semibold text-ink shadow-[0_6px_20px_rgba(255,217,196,0.45)] transition-colors duration-300 hover:bg-white md:inline-flex"
          >
            Book a call
          </a>

          <button
            type="button"
            className="glass flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={`block h-px w-5 bg-paper transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-paper transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="glass-dark fixed inset-x-0 bottom-0 top-[68px] border-t border-white/10 px-6 py-8 md:hidden"
            >
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`${home}#${link.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        const id = link.id;
                        setOpen(false);
                        window.setTimeout(() => {
                          document.body.style.overflow = "";
                          const el = document.getElementById(id);
                          if (!el) return;
                          const top = el.getBoundingClientRect().top + window.scrollY - 84;
                          const root = document.documentElement;
                          const previous = root.style.scrollBehavior;
                          root.style.scrollBehavior = "auto";
                          window.scrollTo(0, Math.max(0, top));
                          root.style.scrollBehavior = previous;
                          window.history.pushState(null, "", `${home}#${id}`);
                        }, 120);
                      }}
                      className="block rounded-2xl px-4 py-3 font-display text-3xl text-white transition-colors hover:bg-white/10"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="/resume/" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-display text-3xl text-white transition-colors hover:bg-white/10">
                    Resume
                  </a>
                </li>
                <li className="pt-3">
                  <a href={calendar} className="inline-flex rounded-full bg-pastel px-4 py-2 text-sm font-medium text-ink">
                    Book a call
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

type PanelProps = {
  title: string;
  kicker: string;
  onClose: () => void;
  onBack?: () => void;
  children: ReactNode;
};

export default function Panel({ title, kicker, onClose, onBack, children }: PanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [title]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !ref.current) return;
      const focusable = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close panel"
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[55] bg-tide/40 md:hidden"
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        initial={{ opacity: 0, x: 40, y: 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[80svh] flex-col rounded-t-3xl border border-paper/10 bg-tide text-paper shadow-2xl md:inset-y-3 md:left-auto md:right-3 md:max-h-none md:w-[440px] md:rounded-3xl lg:w-[480px]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-paper/10 px-6 pb-4 pt-5">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-pastel px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-paper"
              >
                <span aria-hidden>←</span> All projects
              </button>
            )}
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sun">{kicker}</p>
            <h2
              id="panel-title"
              ref={headingRef}
              tabIndex={-1}
              className="mt-1 font-display text-3xl font-bold tracking-tight outline-none"
            >
              {title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-pastel"
            >
              Back to the island <span className="hidden text-ink/50 sm:inline">Esc</span>
            </button>
          </div>
        </header>
        <div className="overflow-y-auto overscroll-contain px-6 pb-8 pt-5">{children}</div>
      </motion.div>
    </>
  );
}

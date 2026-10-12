"use client";

import { motion } from "framer-motion";
import { posts } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Blogs() {
  return (
    <section id="writing" className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-accent-ink lg:col-span-3">Writing</p>
          <h2 className="font-display font-bold tracking-tight text-4xl leading-tight md:text-6xl lg:col-span-9">Notes from the work</h2>
        </div>
        <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {posts.map((post, index) => (
            <motion.a
              key={post.url}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.15), ease }}
              className="group grid gap-3 py-6 md:grid-cols-12 md:items-baseline"
            >
              <span className="text-[12px] uppercase tracking-[0.18em] text-accent-ink md:col-span-2">{post.platform}</span>
              <span className="font-display font-bold tracking-tight text-2xl leading-snug transition-colors duration-300 group-hover:text-accent-ink md:col-span-8">
                {post.title}
              </span>
              <span className="text-sm text-ink/50 md:col-span-2 md:text-right">{post.tags.join(" · ")}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

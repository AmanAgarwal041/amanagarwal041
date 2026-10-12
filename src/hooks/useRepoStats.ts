"use client";

import { useEffect, useState } from "react";

export type RepoStats = { stars: number; forks: number };

const cache = new Map<string, RepoStats>();

export function useRepoStats(repo: string, enabled = true) {
  const [stats, setStats] = useState<RepoStats | null>(() => cache.get(repo) ?? null);

  useEffect(() => {
    if (!enabled || cache.has(repo)) return;
    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${repo}`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data || typeof data.stargazers_count !== "number") return;
        const next = { stars: data.stargazers_count, forks: data.forks_count };
        cache.set(repo, next);
        setStats(next);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [repo, enabled]);

  return stats;
}

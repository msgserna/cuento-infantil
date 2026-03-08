// components/story/StoryProgress.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { STORY_SECTIONS } from "@/lib/story/sections";
import { cn } from "@/lib/utils";

export function StoryProgress() {
  const items = useMemo(
    () =>
      STORY_SECTIONS.filter((s) => s.index > 0).map((s) => ({
        id: s.id,
        index: s.index,
        title: s.title,
      })),
    []
  );
  const [active, setActive] = useState(1);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-story-section]")
    );

    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];

        if (!best) return;

        const el = best.target as HTMLElement;
        const idx = Number(el.dataset.index ?? "0");
        if (Number.isFinite(idx) && idx > 0) setActive(idx);
      },
      {
        threshold: [0.25, 0.4, 0.55, 0.7, 0.85],
      }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const scrollToId = (id: string) => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: string | HTMLElement, opts?: Record<string, unknown>) => void } })
      .__lenis;

    const el = document.getElementById(id);

    if (lenis) {
      lenis.scrollTo(el ?? `#${id}`, { duration: 1.1 });
      history.replaceState(null, "", `#${id}`);
      return;
    }

    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 md:flex md:flex-col md:items-center md:gap-1">
      {/* Número de sección activa */}
      <span className="mb-1 font-serif text-[10px] font-medium tracking-wider text-white/50">
        {active}/{items.length}
      </span>

      {/* Dots */}
      <nav className="flex flex-col items-center gap-[6px]" aria-label="Progreso del cuento">
        {items.map((it) => {
          const isActive = it.index === active;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => scrollToId(it.id)}
              className="group relative flex h-5 w-5 items-center justify-center"
              aria-label={`Ir a sección ${it.index}: ${it.title}`}
              title={`${it.index}. ${it.title}`}
            >
              {/* Glow behind active dot */}
              {isActive && (
                <span className="absolute h-3 w-3 animate-pulse rounded-full bg-white/20" />
              )}
              <span
                className={cn(
                  "relative rounded-full transition-all duration-300",
                  isActive
                    ? "h-[7px] w-[7px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.5)]"
                    : "h-[5px] w-[5px] bg-white/25 group-hover:bg-white/50"
                )}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

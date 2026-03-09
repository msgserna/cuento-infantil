// components/story/StoryEnding.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import { audioManager } from "@/lib/audio/audioManager";

export function StoryEnding() {
  const outroPlayedRef = useRef(false);
  const rootRef = useRef<HTMLElement | null>(null);

  // Play outro when section becomes visible
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !outroPlayedRef.current) {
          outroPlayedRef.current = true;
          audioManager.play("/narration/outro.mp3", 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = useCallback(() => {
    const lenis = (
      window as unknown as {
        __lenis?: {
          scrollTo: (
            target: number | string | HTMLElement,
            opts?: Record<string, unknown>
          ) => void;
        };
      }
    ).__lenis;

    if (lenis) {
      lenis.scrollTo("#s01", { duration: 2.5 });
    } else {
      document.getElementById("s01")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section ref={rootRef} className="relative flex story-viewport w-full flex-col items-center justify-center overflow-hidden bg-black px-6">
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/story/hg/outro.webp)" }}
      />
      {/* Dark overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-black/50" />

      {/* Luciérnagas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: 18, left: 12, dur: 3.2, delay: 0,   fx: 6,  fy: -8,  size: 3 },
          { top: 35, left: 28, dur: 4.1, delay: 0.7, fx: -5, fy: 6,   size: 2.5 },
          { top: 55, left: 8,  dur: 3.7, delay: 1.2, fx: 8,  fy: -5,  size: 3.5 },
          { top: 22, left: 55, dur: 4.5, delay: 0.3, fx: -7, fy: 9,   size: 2 },
          { top: 68, left: 42, dur: 3.0, delay: 1.8, fx: 5,  fy: -7,  size: 3 },
          { top: 14, left: 80, dur: 4.8, delay: 0.5, fx: -6, fy: 5,   size: 2.5 },
          { top: 80, left: 72, dur: 3.4, delay: 2.1, fx: 7,  fy: -6,  size: 3 },
          { top: 44, left: 65, dur: 5.0, delay: 0.9, fx: -4, fy: 8,   size: 2 },
          { top: 60, left: 85, dur: 3.6, delay: 1.5, fx: 6,  fy: -4,  size: 3.5 },
          { top: 30, left: 92, dur: 4.2, delay: 2.4, fx: -8, fy: 6,   size: 2.5 },
          { top: 75, left: 20, dur: 3.9, delay: 0.2, fx: 5,  fy: 7,   size: 3 },
          { top: 48, left: 48, dur: 4.6, delay: 1.1, fx: -6, fy: -5,  size: 2 },
          { top: 88, left: 55, dur: 3.3, delay: 2.7, fx: 7,  fy: -8,  size: 3.5 },
          { top: 10, left: 38, dur: 4.0, delay: 0.6, fx: -5, fy: 6,   size: 2.5 },
          { top: 65, left: 30, dur: 5.2, delay: 1.9, fx: 8,  fy: -5,  size: 2 },
          { top: 25, left: 70, dur: 3.8, delay: 3.0, fx: -7, fy: 7,   size: 3 },
          { top: 82, left: 88, dur: 4.3, delay: 0.4, fx: 5,  fy: -6,  size: 2.5 },
          { top: 52, left: 18, dur: 3.5, delay: 2.2, fx: -6, fy: 5,   size: 3 },
        ].map((f, i) => (
          <span
            key={i}
            className="firefly absolute rounded-full bg-[#c8ff50]"
            style={{
              width: `${f.size}px`,
              height: `${f.size}px`,
              top: `${f.top}%`,
              left: `${f.left}%`,
              "--duration": `${f.dur}s`,
              "--delay": `${f.delay}s`,
              "--fx": `${f.fx}px`,
              "--fy": `${f.fy}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Ornamental line */}
        <div className="flex items-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/40" />
          <span className="h-1.5 w-1.5 rotate-45 bg-amber-400/50" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/40" />
        </div>

        <h2 className="font-serif text-6xl font-bold italic text-white/90 md:text-8xl">
          Fin
        </h2>

        <p className="max-w-md font-serif text-lg leading-relaxed text-white/50 md:text-xl">
          Un cuento de los Hermanos Grimm
        </p>

        {/* Ornamental line */}
        <div className="flex items-center gap-3">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/30" />
          <span className="h-1 w-1 rotate-45 bg-amber-400/40" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/30" />
        </div>

        {/* Replay button */}
        <button
          type="button"
          onClick={scrollToTop}
          className="group mt-8 flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-3 font-serif text-base text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/30 hover:bg-white/10 hover:text-white/90"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
          Volver al inicio
        </button>
      </div>
    </section>
  );
}

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
    <section ref={rootRef} className="relative flex h-svh w-full flex-col items-center justify-center overflow-hidden bg-black px-6">
      {/* Subtle radial gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,90,43,0.12)_0%,_transparent_70%)]" />

      {/* Stars / sparkle dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
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

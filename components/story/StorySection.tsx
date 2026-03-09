// components/story/StorySection.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { StorySection as StorySectionType } from "@/lib/story/sections";
import { audioManager } from "@/lib/audio/audioManager";

type Props = {
  section: StorySectionType;
  className?: string;
};

/**
 * StorySection (adaptado)
 * - Sigue siendo una sección full-screen.
 * - Muestra el primer frame como fondo.
 * - Se usa idealmente para la portada (frames.length === 1).
 * - También sirve como fallback para renderizar una sección sin pin.
 */
export function StorySection({ section, className }: Props) {
  const frame = section.frames[0];
  const isCover = section.index === 0;
  const [started, setStarted] = useState(false);

  // Block ALL scroll while cover overlay is visible
  useEffect(() => {
    if (!isCover || started) return;

    const SCROLL_KEYS = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
    const prevent = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    const preventKey = (e: KeyboardEvent) => { if (SCROLL_KEYS.includes(e.key)) e.preventDefault(); };

    // Block mouse wheel and touch
    window.addEventListener("wheel", prevent, { passive: false, capture: true });
    window.addEventListener("touchmove", prevent, { passive: false, capture: true });
    window.addEventListener("touchstart", prevent, { passive: false, capture: true });
    // Block keyboard scroll
    window.addEventListener("keydown", preventKey, { capture: true });

    // Stop Lenis — retry until available
    let retryId: ReturnType<typeof setTimeout>;
    const stopLenis = () => {
      const lenis = (window as unknown as { __lenis?: { stop: () => void } }).__lenis;
      if (lenis) { lenis.stop(); }
      else { retryId = setTimeout(stopLenis, 50); }
    };
    stopLenis();

    return () => {
      window.removeEventListener("wheel", prevent, { capture: true });
      window.removeEventListener("touchmove", prevent, { capture: true });
      window.removeEventListener("touchstart", prevent, { capture: true });
      window.removeEventListener("keydown", preventKey, { capture: true });
      clearTimeout(retryId);
      const lenis = (window as unknown as { __lenis?: { start: () => void } }).__lenis;
      if (lenis) lenis.start();
    };
  }, [isCover, started]);

  const handleStart = useCallback(async () => {
    await audioManager.init();
    audioManager.playNarration("/narration/intro.mp3", 1);
    setStarted(true);
  }, []);

  return (
    <section
      id={section.id}
      data-story-section
      data-index={section.index}
      className={cn("relative story-viewport w-full overflow-hidden", className)}
      aria-label={`Sección ${section.index}: ${section.title}`}
    >
      {/* Background: video si existe, sino imagen */}
      <div className="absolute inset-0">
        {frame.videoSrc ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 min-h-full min-w-full object-cover"
            style={{
              pointerEvents: "none",
              width: "100%",
              height: "100%",
            }}
          >
            <source src={frame.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={frame.imageSrc}
            alt=""
            fill
            priority={isCover}
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70" />

      {/* Content */}
      {isCover ? (
        /* --- PORTADA: centrada, cinematográfica --- */
        <div
          className={cn(
            "relative z-10 flex h-full flex-col items-center justify-center px-6 text-center transition-all duration-[3s] ease-out",
            started
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0"
          )}
        >
          <h1 className="font-serif text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
            {section.title}
          </h1>

          {frame.dialogues?.length ? (
            <div className="mt-4 space-y-1">
              {frame.dialogues
                .filter((d) => d.text !== "Scroll para empezar")
                .map((d, i) => (
                  <p
                    key={i}
                    className="text-sm font-medium tracking-[0.3em] text-white/60 uppercase"
                  >
                    {d.text}
                  </p>
                ))}
            </div>
          ) : null}

          {/* Indicador de scroll animado */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:bottom-14">
            <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
              Scroll
            </p>
            <div className="animate-scroll-bounce flex flex-col items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
              >
                <path d="M7 10l5 5 5-5" />
              </svg>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="-mt-3 text-white/30"
              >
                <path d="M7 10l5 5 5-5" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        /* --- SECCIÓN NORMAL --- */
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-14 md:pb-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-white/80">
              Sección {section.index}/10
            </p>

            <h1 className="mt-2 text-4xl font-semibold leading-tight text-white md:text-6xl">
              {section.title}
            </h1>

            {frame.dialogues?.length ? (
              <div className="mt-5 space-y-2">
                {frame.dialogues.map((d, i) => (
                  <p
                    key={i}
                    className="max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
                  >
                    {d.speaker ? (
                      <span className="font-semibold text-white">
                        {d.speaker}:{" "}
                      </span>
                    ) : null}
                    {d.text}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Overlay de inicio — solo en la portada, desaparece al pulsar */}
      {isCover && !started && (
        <div
          className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center bg-black/80"
          onClick={handleStart}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleStart();
            }
          }}
          aria-label="Toca para empezar"
        >
          <p className="font-serif text-4xl font-bold text-white md:text-6xl lg:text-7xl">
            Hänsel y Gretel
          </p>
          <p className="mt-3 text-sm font-medium tracking-[0.3em] text-white/40 uppercase">
            Un cuento de los Hermanos Grimm
          </p>

          <p className="mt-16 animate-pulse text-sm tracking-[0.2em] text-white/40 uppercase">
            Toca para empezar
          </p>
        </div>
      )}
    </section>
  );
}

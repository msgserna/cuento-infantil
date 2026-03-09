// components/story/PinnedSection.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import type { StorySection } from "@/lib/story/sections";
import { audioManager } from "@/lib/audio/audioManager";
import { VisualEffects } from "./VisualEffects";
import { HoverGlow } from "./HoverGlow";

type Props = {
  section: StorySection;
  className?: string;
  pinScrollLength?: number;
};

const getLenis = () =>
  (window as unknown as { __lenis?: { stop: () => void; start: () => void; scrollTo: (target: number, opts?: Record<string, unknown>) => void } })
    .__lenis;

export function PinnedSection({
  section,
  className,
  pinScrollLength = 300,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dialogueRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Scroll lock state
  const scrollLockedRef = useRef(false);
  const maxFrameReachedRef = useRef(-1);
  const wheelCountRef = useRef(0);

  // Narration playback
  const narrationRef = useRef<AudioBufferSourceNode | null>(null);

  const frames = useMemo(() => section.frames.slice(0, 3), [section.frames]);

  const stopNarration = useCallback(() => {
    if (narrationRef.current) {
      try {
        narrationRef.current.stop();
      } catch {
        // already stopped
      }
      narrationRef.current = null;
    }
  }, []);

  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    scrollLockedRef.current = false;
    const lenis = getLenis();
    if (lenis) {
      // Reset lenis target to current position before resuming to prevent auto-jump
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      lenis.start();
    } else {
      document.body.style.overflow = "";
    }
  }, []);

  const skipNarration = useCallback(() => {
    stopNarration();
    unlockScroll();
  }, [stopNarration, unlockScroll]);

  const lockForNarration = useCallback(
    (frameIndex: number) => {
      if (scrollLockedRef.current) return;

      stopNarration();
      const src = frames[frameIndex]?.narrationSrc;
      if (!src) return;

      scrollLockedRef.current = true;
      wheelCountRef.current = 0;

      const lenis = getLenis();
      if (lenis) lenis.stop();
      else document.body.style.overflow = "hidden";

      // Preload next frame's narration while current plays
      const nextSrc = frames[frameIndex + 1]?.narrationSrc;
      if (nextSrc) audioManager.loadSound(nextSrc);

      audioManager.playNarration(src, 1).then((node) => {
        if (!node) {
          unlockScroll();
          return;
        }
        narrationRef.current = node;
        node.onended = () => {
          unlockScroll();
        };
      });
    },
    [frames, stopNarration, unlockScroll]
  );

  // Wheel / touch listener — skip narration after 3 scroll attempts
  useEffect(() => {
    const handleWheel = () => {
      if (!scrollLockedRef.current) return;
      wheelCountRef.current++;
      if (wheelCountRef.current >= 3) {
        skipNarration();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchmove", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleWheel);
    };
  }, [skipNarration]);

  // GSAP / ScrollTrigger setup
  useEffect(() => {
    if (!rootRef.current) return;
    if (frames.length < 2) return;

    let ctx: { revert: () => void } | undefined;
    const soundSourcesRef = {
      current: new Map<number, AudioBufferSourceNode>(),
    };

    (async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      const root = rootRef.current!;
      const f0 = frameRefs.current[0];
      const f1 = frameRefs.current[1];
      const f2 = frameRefs.current[2];

      const d0 = dialogueRefs.current[0];
      const d1 = dialogueRefs.current[1];
      const d2 = dialogueRefs.current[2];

      const title = titleRef.current;

      ctx = gsap.context(() => {
        gsap.set([f0, f1, f2], { opacity: 0 });
        gsap.set([d0, d1, d2], { opacity: 0, y: 20 });
        gsap.set(f0, { opacity: 1 });
        gsap.set(d0, { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: `+=${pinScrollLength}%`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            snap: {
              snapTo: (value: number) => {
                const snaps = [0, 0.5, 0.9, 1];
                // Prevent skipping unplayed frames: limit snap to next allowed position
                const nextIdx = Math.max(0, maxFrameReachedRef.current + 1);
                const maxAllowed = snaps[Math.min(nextIdx, snaps.length - 1)];
                const allowed = snaps.filter((s) => s <= maxAllowed + 0.001);
                return allowed.reduce((nearest, s) =>
                  Math.abs(s - value) < Math.abs(nearest - value) ? s : nearest,
                  allowed[0]
                );
              },
              duration: { min: 0.4, max: 1 },
              delay: 0.2,
              ease: "power2.inOut",
            },
            onLeave: (self) => {
              // Snap to the exact end of this section (= start of next section)
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(self.end, { duration: 0.3, force: true });
            },
            onEnterBack: (self) => {
              // Snap back to just inside this section's last frame
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(self.end - 2, { duration: 0.3, force: true });
            },
            onSnapComplete: (self) => {
              // Fires after snap animation ends — scroll is settled, safe to lock.
              const progress = self.progress;
              let frameIndex = 0;
              if (progress >= 0.7) frameIndex = 2;
              else if (progress >= 0.25) frameIndex = 1;

              if (frameIndex > maxFrameReachedRef.current && !scrollLockedRef.current) {
                maxFrameReachedRef.current = frameIndex;
                lockForNarration(frameIndex);
              }
            },
            onUpdate: () => {
              // Audio triggers only (no narration logic here)
              const progress = tl.scrollTrigger?.progress ?? 0;
              if (
                progress > 0.15 &&
                progress < 0.35 &&
                !soundSourcesRef.current.has(0)
              ) {
                audioManager
                  .play(
                    frames[0].audio?.soundFx || "",
                    frames[0].audio?.volume || 0.5
                  )
                  .then((src) => {
                    if (src) soundSourcesRef.current.set(0, src);
                  });
              }
              if (
                progress > 0.5 &&
                progress < 0.7 &&
                !soundSourcesRef.current.has(1)
              ) {
                audioManager
                  .play(
                    frames[1].audio?.soundFx || "",
                    frames[1].audio?.volume || 0.5
                  )
                  .then((src) => {
                    if (src) soundSourcesRef.current.set(1, src);
                  });
              }
              if (progress > 0.75 && !soundSourcesRef.current.has(2)) {
                audioManager
                  .play(
                    frames[2].audio?.soundFx || "",
                    frames[2].audio?.volume || 0.5
                  )
                  .then((src) => {
                    if (src) soundSourcesRef.current.set(2, src);
                  });
              }
            },
          },
        });

        tl.to({}, { duration: 1 }); // hold A

        // A -> B
        tl.to(f0, { opacity: 0, duration: 1, ease: "none" }, 1);
        tl.to(f1, { opacity: 1, duration: 1, ease: "none" }, 1);

        if (title) {
          tl.to(title, { opacity: 0, y: -8, duration: 0.5, ease: "none" }, 1);
        }

        tl.to(d0, { opacity: 0, y: -12, duration: 0.5, ease: "none" }, 1);
        tl.to(d1, { opacity: 1, y: 0, duration: 0.6, ease: "none" }, 1.3);

        // hold B
        tl.to({}, { duration: 0.6 });

        // B -> C
        tl.to(f1, { opacity: 0, duration: 1, ease: "none" }, 2.6);
        tl.to(f2, { opacity: 1, duration: 1, ease: "none" }, 2.6);

        tl.to(d1, { opacity: 0, y: -12, duration: 0.5, ease: "none" }, 2.6);
        tl.to(d2, { opacity: 1, y: 0, duration: 0.6, ease: "none" }, 2.85);

        // hold C — buffer so frame 2 reaches full opacity before pin ends
        tl.to({}, { duration: 0.4 });
      }, root);
    })();

    return () => {
      if (ctx) ctx.revert();
      soundSourcesRef.current.clear();
      maxFrameReachedRef.current = -1;
      if (narrationRef.current) {
        try { narrationRef.current.stop(); } catch { /* already stopped */ }
        narrationRef.current = null;
      }
      if (scrollLockedRef.current) {
        const lenis = getLenis();
        if (lenis) lenis.start();
        else document.body.style.overflow = "";
        scrollLockedRef.current = false;
      }
    };
  }, [frames, frames.length, pinScrollLength, lockForNarration]);

  return (
    <section
      ref={rootRef}
      id={section.id}
      data-story-section
      data-index={section.index}
      className={cn("relative story-viewport w-full overflow-hidden", className)}
      aria-label={`Sección ${section.index}: ${section.title}`}
    >
      {/* Frames apilados */}
      <div className="absolute inset-0">
        {frames.map((frame, i) => (
          <div
            key={frame.imageSrc}
            ref={(el) => {
              frameRefs.current[i] = el;
            }}
            className="absolute inset-0 opacity-0"
            style={{
              backgroundImage: frame.videoSrc
                ? undefined
                : `url(${frame.imageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              willChange: "opacity",
            }}
          >
            {frame.videoSrc && (
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
            )}
            {frame.effects && (
              <div className="absolute inset-0">
                <VisualEffects effect={frame.effects} visible={true} />
              </div>
            )}
            {frame.hotspots?.map((hotspot) => (
              <HoverGlow key={hotspot.id} hotspot={hotspot} />
            ))}
          </div>
        ))}
      </div>

      {/* Overlay para legibilidad */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/75" />

      {/* Título de sección */}
      <div
        ref={titleRef}
        className="pointer-events-none relative z-10 mx-auto max-w-6xl px-6 pt-10"
      >
        <p className="text-sm font-medium tracking-widest text-white/60 uppercase">
          {section.index} / 10
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
          {section.title}
        </h2>
      </div>

      {/* Diálogos por frame — typing secuencial */}
      {frames.map((frame, i) => (
        <div
          key={`${section.id}-dialogue-${i}`}
          ref={(el) => {
            dialogueRefs.current[i] = el;
          }}
          data-dialogue
          className="absolute bottom-16 left-0 right-0 z-10 flex justify-center px-6 opacity-0 md:bottom-24"
          style={{ willChange: "opacity, transform" }}
        >
          <div className="max-w-xl space-y-3 text-center">
            {frame.dialogues.map((d, idx) => (
              <p
                key={`${section.id}-${i}-${idx}`}
                className="font-serif text-xl leading-relaxed text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] md:text-2xl"
              >
                {d.speaker && (
                  <span className="italic text-amber-200/90">
                    {d.speaker}:{" "}
                  </span>
                )}
                {d.text}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* Gradiente inferior suave */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  );
}

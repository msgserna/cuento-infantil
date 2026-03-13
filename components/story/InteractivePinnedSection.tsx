// components/story/InteractivePinnedSection.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { StorySection } from "@/lib/story/sections";
import { audioManager } from "@/lib/audio/audioManager";
import { VisualEffects } from "./VisualEffects";
import { HoverGlow } from "./HoverGlow";

export type Interaction = {
  /** En qué frame se activa (0 = A, 1 = B, 2 = C) */
  afterFrame: number;
  /** Texto del prompt */
  prompt: string;
  /** Tipo de icono */
  icon: "push" | "branch";
  /** Sonido al interactuar */
  soundFx?: string;
  soundVolume?: number;
  /** Efecto visual al interactuar */
  visualEffect?: "shake" | "swing";
  /** Ms de espera tras la interacción antes de avanzar */
  autoAdvanceMs?: number;
  /** Whether to auto-advance to the next frame after interaction (default true) */
  shouldAutoAdvance?: boolean;
  /** Posición custom del botón (top/left en %). Por defecto centrado. */
  buttonPosition?: { top: string; left: string };
};

type Props = {
  section: StorySection;
  className?: string;
  pinScrollLength?: number;
  interaction: Interaction;
};

type Lenis = {
  stop: () => void;
  start: () => void;
  scrollTo: (
    target: number | string | HTMLElement,
    opts?: Record<string, unknown>
  ) => void;
};

const getLenis = () =>
  (window as unknown as { __lenis?: Lenis }).__lenis;

/**
 * InteractivePinnedSection
 *
 * Same as PinnedSection but with a click/tap interaction on one frame.
 * - On the interaction frame, locks scroll and shows a button.
 * - User must click/tap to continue.
 * - After clicking: visual effect + sound, then optionally auto-advance.
 */
export function InteractivePinnedSection({
  section,
  className,
  pinScrollLength = 400,
  interaction,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dialogueRefs = useRef<Array<HTMLDivElement | null>>([]);

  const frames = useMemo(() => section.frames.slice(0, 3), [section.frames]);

  const [showPrompt, setShowPrompt] = useState(false);
  const hasInteractedRef = useRef(false);

  // Scroll lock state (for interaction only)
  const scrollLockedRef = useRef(false);
  const lockReasonRef = useRef<"interaction" | "narration" | null>(null);
  const maxFrameReachedRef = useRef(-1);
  const wheelCountRef = useRef(0);

  // Narration playback
  const narrationRef = useRef<AudioBufferSourceNode | null>(null);

  // Sound effect playback (looped ambient)
  const activeSfxRef = useRef<AudioBufferSourceNode | null>(null);
  const activeSfxFrameRef = useRef<number>(-1);

  // Track which frame is currently visible (for prompt guard)
  const [visibleFrame, setVisibleFrame] = useState(0);

  // Store GSAP ScrollTrigger for precise auto-advance positioning
  const scrollTriggerRef = useRef<{
    start: number;
    end: number;
    progress: number;
  } | null>(null);

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

  const stopSfx = useCallback(() => {
    if (activeSfxRef.current) {
      try {
        activeSfxRef.current.stop();
      } catch {
        // already stopped
      }
      activeSfxRef.current = null;
    }
  }, []);

  const playSfxForFrame = useCallback(
    (frameIndex: number) => {
      if (activeSfxFrameRef.current === frameIndex) return;
      stopSfx();
      activeSfxFrameRef.current = frameIndex;

      const frame = frames[frameIndex];
      if (!frame?.audio?.soundFx) return;

      audioManager
        .play(frame.audio.soundFx, frame.audio.volume ?? 0.2, frame.audio.delay ?? 0, true)
        .then((src) => {
          if (src) activeSfxRef.current = src;
        });
    },
    [frames, stopSfx]
  );

  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    scrollLockedRef.current = false;
    lockReasonRef.current = null;
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

  /**
   * Lock scroll for a frame:
   * - Interaction frame → lock + show button (stays locked until user clicks)
   * - Other frames → lock + play narration, unlock when narration ends
   */
  const lockForFrame = useCallback(
    (frameIndex: number) => {
      if (scrollLockedRef.current) return;

      stopNarration();

      // Interaction frame
      if (
        frameIndex === interaction.afterFrame &&
        !hasInteractedRef.current
      ) {
        const targetFrame = frameRefs.current[interaction.afterFrame];
        if (
          !targetFrame ||
          parseFloat(targetFrame.style.opacity || "0") <= 0.5
        ) {
          return;
        }

        scrollLockedRef.current = true;
        lockReasonRef.current = "interaction";
        wheelCountRef.current = 0;

        const lenis = getLenis();
        if (lenis) lenis.stop();
        else document.body.style.overflow = "hidden";

        // Play narration for interaction frame too
        const src = frames[frameIndex]?.narrationSrc;
        if (src) {
          audioManager.playNarration(src, 1).then((node) => {
            if (node) narrationRef.current = node;
          });
        }

        setShowPrompt(true);
        return;
      }

      // Normal frame — lock until narration ends
      const src = frames[frameIndex]?.narrationSrc;
      if (!src) return;

      scrollLockedRef.current = true;
      lockReasonRef.current = "narration";
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
    [frames, interaction.afterFrame, stopNarration, unlockScroll]
  );

  // Auto-advance after interaction
  const autoAdvance = useCallback(() => {
    const lenis = getLenis();
    if (!lenis) return;

    if (interaction.afterFrame === 2) {
      // Last frame: advance to next section
      const nextSection = document.querySelector(
        `[data-story-section][data-index="${section.index + 1}"]`
      ) as HTMLElement | null;
      if (nextSection) {
        lenis.scrollTo(nextSection, { duration: 1.5 });
      }
    } else {
      // Use ScrollTrigger position for precise scroll to next hold zone
      const st = scrollTriggerRef.current;
      if (st) {
        // afterFrame 0 → hold B at ~60%, afterFrame 1 → hold C at ~90%
        const targetProgress = interaction.afterFrame === 0 ? 0.6 : 0.9;
        const targetScroll =
          st.start + (st.end - st.start) * targetProgress;
        lenis.scrollTo(targetScroll, { duration: 1.5 });
      }
    }
  }, [interaction.afterFrame, section.index]);

  const handleInteract = useCallback(async () => {
    if (hasInteractedRef.current) return;
    hasInteractedRef.current = true;

    const gsap = (await import("gsap")).default;

    // Sound
    if (interaction.soundFx) {
      audioManager.play(interaction.soundFx, interaction.soundVolume ?? 0.7);
    }

    // Visual effect
    if (interaction.visualEffect === "shake") {
      if (flashRef.current) {
        gsap.to(flashRef.current, {
          opacity: 0.5,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        });
      }
      if (rootRef.current) {
        gsap.to(rootRef.current, {
          x: "+=4",
          duration: 0.04,
          yoyo: true,
          repeat: 5,
          ease: "none",
          onComplete: () => {
            gsap.set(rootRef.current, { x: 0 });
          },
        });
      }
    } else if (interaction.visualEffect === "swing") {
      // Gentle tremor for branch
      if (rootRef.current) {
        gsap.to(rootRef.current, {
          y: "+=3",
          duration: 0.06,
          yoyo: true,
          repeat: 5,
          ease: "none",
          onComplete: () => {
            gsap.set(rootRef.current, { y: 0 });
          },
        });
      }
    }

    const advanceDelay = interaction.autoAdvanceMs ?? 2000;
    const shouldAdvance = interaction.shouldAutoAdvance !== false;

    setTimeout(() => {
      setShowPrompt(false);
      unlockScroll();

      if (shouldAdvance) {
        setTimeout(() => autoAdvance(), 300);
      }
    }, advanceDelay);
  }, [interaction, unlockScroll, autoAdvance]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleInteract();
      }
    },
    [handleInteract]
  );

  // Wheel / touch — skip narration after 3 attempts, block for interaction
  useEffect(() => {
    const handleWheel = (e: Event) => {
      if (!scrollLockedRef.current) return;
      if (lockReasonRef.current === "interaction") {
        e.preventDefault();
        return;
      }
      // Narration lock — allow skip
      wheelCountRef.current++;
      if (wheelCountRef.current >= 3) {
        skipNarration();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleWheel, { passive: false });
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
            onRefreshInit: (self) => {
              scrollTriggerRef.current = self as unknown as {
                start: number;
                end: number;
                progress: number;
              };
            },
            onLeave: (self) => {
              stopSfx();
              activeSfxFrameRef.current = -1;
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(self.end, { duration: 0.3, force: true });
            },
            onLeaveBack: () => {
              stopSfx();
              activeSfxFrameRef.current = -1;
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
                lockForFrame(frameIndex);
              }
            },
            onUpdate: (self) => {
              // Store latest ST reference
              scrollTriggerRef.current = self as unknown as {
                start: number;
                end: number;
                progress: number;
              };

              // Track visible frame for prompt visibility (no narration logic here)
              let bestFrame = 0;
              let bestOpacity = 0;
              for (let i = 0; i < 3; i++) {
                const f = frameRefs.current[i];
                if (!f) continue;
                const opacity = parseFloat(f.style.opacity || "0");
                if (opacity > bestOpacity) {
                  bestOpacity = opacity;
                  bestFrame = i;
                }
              }
              setVisibleFrame(bestFrame);

              // Determine current frame from progress and play its looped SFX
              const progress = self.progress;
              let currentFrame = 0;
              if (progress >= 0.7) currentFrame = 2;
              else if (progress >= 0.25) currentFrame = 1;

              playSfxForFrame(currentFrame);
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
      stopSfx();
      activeSfxFrameRef.current = -1;
      scrollTriggerRef.current = null;
      maxFrameReachedRef.current = -1;
      hasInteractedRef.current = false;
      setShowPrompt(false);
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
  }, [frames, frames.length, pinScrollLength, lockForFrame, playSfxForFrame, stopSfx]);

  // Icon rendering
  const renderIcon = () => {
    if (interaction.icon === "push") {
      return (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-300"
        >
          <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
          <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 13" />
        </svg>
      );
    }
    return (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-300"
      >
        <path d="M17 10h3a1 1 0 0 1 0 2h-3" />
        <path d="M17 6h4a1 1 0 0 1 0 2h-4" />
        <path d="M3 22V12a4 4 0 0 1 4-4h6" />
        <path d="M13 4l4 4-4 4" />
      </svg>
    );
  };

  const glowColor =
    interaction.icon === "push"
      ? "border-amber-400/60 bg-orange-600/30"
      : "border-amber-600/60 bg-amber-800/30";

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
            {frame.sparkles?.map((s, idx) => (
              <span
                key={idx}
                className="pointer-events-none absolute rounded-full"
                style={{
                  top: s.top,
                  left: s.left,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  backgroundColor: s.color,
                  "--sparkle-color": s.color,
                  animation: `${s.type === "moon" ? "moon-glow" : "sparkle-twinkle"} ${s.type === "moon" ? "4s" : "2.5s"} ease-in-out infinite ${s.delay}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/75" />

      {/* Flash naranja (efecto push) */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-30 bg-orange-600 opacity-0"
      />

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

      {/* Prompt interactivo */}
      {showPrompt && visibleFrame === interaction.afterFrame && (
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          style={{ touchAction: "manipulation" }}
          onClick={handleInteract}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={interaction.prompt}
          aria-live="assertive"
        >
          {/* Pulse overlay */}
          <div className="absolute inset-0 animate-pulse bg-black/20" />

          {/* Button + label */}
          <div
            className="absolute z-10 flex flex-col items-center gap-4"
            style={
              interaction.buttonPosition
                ? {
                    top: interaction.buttonPosition.top,
                    left: interaction.buttonPosition.left,
                    transform: "translate(-50%, -50%)",
                  }
                : {
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }
            }
          >
            <div
              className={cn(
                "animate-pulse-glow flex min-h-[80px] min-w-[80px] items-center justify-center rounded-full border-2 p-5 backdrop-blur-sm",
                glowColor
              )}
            >
              {renderIcon()}
            </div>
            <p className="animate-fade-in-up font-serif text-xl text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:text-2xl">
              {interaction.prompt}
            </p>
          </div>
        </div>
      )}

      {/* Diálogos por frame */}
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

      {/* Gradiente inferior */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  );
}

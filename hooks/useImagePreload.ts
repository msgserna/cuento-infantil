// hooks/useImagePreload.ts
"use client";

import { useEffect, useRef } from "react";
import { STORY_SECTIONS } from "@/lib/story/sections";
import { audioManager } from "@/lib/audio/audioManager";

/**
 * Precarga las imágenes y audios de las N secciones siguientes a la activa.
 * Usa IntersectionObserver para detectar qué sección está visible
 * y precarga los recursos de las secciones cercanas.
 */
export function useImagePreload(ahead = 2) {
  const preloadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const allImages = STORY_SECTIONS.flatMap((s, sIdx) =>
      s.frames.map((f) => ({ src: f.imageSrc, sectionIndex: sIdx }))
    );

    const allAudio = STORY_SECTIONS.flatMap((s, sIdx) =>
      s.frames.flatMap((f) => {
        const urls: { src: string; sectionIndex: number }[] = [];
        if (f.narrationSrc) urls.push({ src: f.narrationSrc, sectionIndex: sIdx });
        if (f.audio?.soundFx) urls.push({ src: f.audio.soundFx, sectionIndex: sIdx });
        return urls;
      })
    );

    const preloadImage = (src: string) => {
      if (preloadedRef.current.has(src)) return;
      preloadedRef.current.add(src);
      const img = new Image();
      img.src = src;
    };

    const preloadAudio = (src: string) => {
      if (preloadedRef.current.has(src)) return;
      preloadedRef.current.add(src);
      audioManager.loadSound(src);
    };

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-story-section]")
    );

    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const idx = Number(
            (entry.target as HTMLElement).dataset.index ?? "1"
          );
          const start = idx;
          const end = Math.min(idx + ahead, STORY_SECTIONS.length);

          for (let i = start; i < end; i++) {
            allImages
              .filter((img) => img.sectionIndex === i)
              .forEach((img) => preloadImage(img.src));
            allAudio
              .filter((a) => a.sectionIndex === i)
              .forEach((a) => preloadAudio(a.src));
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((s) => io.observe(s));

    return () => io.disconnect();
  }, [ahead]);
}

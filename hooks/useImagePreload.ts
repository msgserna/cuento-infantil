// hooks/useImagePreload.ts
"use client";

import { useEffect, useRef } from "react";
import { STORY_SECTIONS } from "@/lib/story/sections";

/**
 * Precarga las imágenes de las N secciones siguientes a la activa.
 * Usa IntersectionObserver para detectar qué sección está visible
 * y precarga las imágenes de las secciones cercanas.
 */
export function useImagePreload(ahead = 2) {
  const preloadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const allImages = STORY_SECTIONS.flatMap((s, sIdx) =>
      s.frames.map((f) => ({ src: f.imageSrc, sectionIndex: sIdx }))
    );

    const preloadImage = (src: string) => {
      if (preloadedRef.current.has(src)) return;
      preloadedRef.current.add(src);
      const img = new Image();
      img.src = src;
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
          // Precargar imágenes de las N secciones siguientes
          const start = idx; // sección actual ya se muestra, precargar siguiente
          const end = Math.min(idx + ahead, STORY_SECTIONS.length);

          for (let i = start; i < end; i++) {
            allImages
              .filter((img) => img.sectionIndex === i)
              .forEach((img) => preloadImage(img.src));
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((s) => io.observe(s));

    return () => io.disconnect();
  }, [ahead]);
}

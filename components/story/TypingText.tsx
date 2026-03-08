// components/story/TypingText.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speaker?: string;
  /** Milisegundos entre cada carácter */
  speed?: number;
  /** Delay en ms antes de empezar a escribir (para secuenciar múltiples diálogos) */
  delay?: number;
  /** Clase CSS del párrafo */
  className?: string;
};

/**
 * TypingText: Muestra texto con efecto máquina de escribir.
 * Se activa cuando el contenedor [data-dialogue] padre tiene opacity > 0.5.
 * Acepta un `delay` para secuenciar múltiples diálogos uno tras otro.
 */
export function TypingText({
  text,
  speaker,
  speed = 35,
  delay = 0,
  className,
}: Props) {
  const [visibleChars, setVisibleChars] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasVisibleRef = useRef(false);
  const isTypingRef = useRef(false);

  const clearTyping = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    isTypingRef.current = false;
  }, []);

  const startTyping = useCallback(() => {
    clearTyping();
    setVisibleChars(0);

    // Esperar el delay antes de empezar a escribir
    delayRef.current = setTimeout(() => {
      isTypingRef.current = true;
      let current = 0;
      intervalRef.current = setInterval(() => {
        current++;
        setVisibleChars(current);
        if (current >= text.length) {
          clearTyping();
        }
      }, speed);
    }, delay);
  }, [text, speed, delay, clearTyping]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dialogueContainer = el.closest("[data-dialogue]") as HTMLElement | null;
    if (!dialogueContainer) return;

    let rafId: number;

    const check = () => {
      // Leer opacity directamente del style inline (GSAP lo pone ahí)
      const inlineOpacity = dialogueContainer.style.opacity;
      const opacity = inlineOpacity !== "" ? parseFloat(inlineOpacity) : 0;
      const isVisible = opacity > 0.5;

      if (isVisible && !wasVisibleRef.current) {
        wasVisibleRef.current = true;
        startTyping();
      } else if (!isVisible && wasVisibleRef.current) {
        wasVisibleRef.current = false;
        clearTyping();
        setVisibleChars(0);
      }

      rafId = requestAnimationFrame(check);
    };

    rafId = requestAnimationFrame(check);

    return () => {
      cancelAnimationFrame(rafId);
      clearTyping();
    };
  }, [startTyping, clearTyping]);

  // Listen for "story-complete-typing" event to instantly finish all text
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const section = el.closest("[data-story-section]") as HTMLElement | null;
    if (!section) return;

    const handler = () => {
      clearTyping();
      setVisibleChars(text.length);
    };

    section.addEventListener("story-complete-typing", handler);
    return () => section.removeEventListener("story-complete-typing", handler);
  }, [text.length, clearTyping]);

  const displayedText = text.slice(0, visibleChars);
  const hiddenText = text.slice(visibleChars);
  const showCursor =
    wasVisibleRef.current && visibleChars < text.length && isTypingRef.current;

  return (
    <p ref={ref} className={className}>
      {speaker ? (
        <span className="italic text-amber-200/90">{speaker}: </span>
      ) : null}
      <span>{displayedText}</span>
      {showCursor && <span className="animate-typing-cursor">|</span>}
      <span className="invisible">{hiddenText}</span>
    </p>
  );
}

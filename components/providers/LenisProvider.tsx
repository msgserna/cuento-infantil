// components/providers/LenisProvider.tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import type gsapCore from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type Props = { children: React.ReactNode };

export function LenisProvider({ children }: Props) {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let gsap: typeof gsapCore | null = null;
    let ScrollTrigger: typeof ScrollTriggerType | null = null;

    let removeTicker: ((time: number) => void) | null = null;

    const setup = async () => {
      gsap = (await import("gsap")).default;
      const STModule = await import("gsap/ScrollTrigger");
      ScrollTrigger = STModule.default;
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        lerp: 0.07,
        smoothWheel: true,
        wheelMultiplier: 0.6,
        touchMultiplier: 1.2,
        anchors: true,
      });

      (window as unknown as { __lenis: Lenis }).__lenis = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      removeTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(removeTicker);
      gsap.ticker.lagSmoothing(0);

      requestAnimationFrame(() => ScrollTrigger!.refresh());
    };

    setup();

    return () => {
      if (gsap && removeTicker) gsap.ticker.remove(removeTicker);
      lenis?.destroy();
      (window as unknown as { __lenis: Lenis | undefined }).__lenis =
        undefined;
    };
  }, []);

  return <>{children}</>;
}

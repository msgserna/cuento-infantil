// components/story/HoverGlow.tsx
"use client";

import { useState, useCallback } from "react";

type Hotspot = {
  id: string;
  top: string;
  left: string;
  size: string;
  glowColor: string;
  autoGlow?: boolean;
};

type Props = {
  hotspot: Hotspot;
};

/**
 * HoverGlow — zona interactiva que brilla al pasar el ratón o tocar.
 * Con autoGlow: brillo permanente con pulso animado.
 */
export function HoverGlow({ hotspot }: Props) {
  const [active, setActive] = useState(false);

  const activate = useCallback(() => setActive(true), []);
  const deactivate = useCallback(() => setActive(false), []);

  const isGlowing = hotspot.autoGlow || active;

  return (
    <div
      className="absolute rounded-full transition-all duration-500 ease-out"
      style={{
        top: hotspot.top,
        left: hotspot.left,
        width: hotspot.size,
        height: hotspot.size,
        transform: "translate(-50%, -50%)",
        pointerEvents: hotspot.autoGlow ? "none" : "auto",
        cursor: hotspot.autoGlow ? "default" : "pointer",
        boxShadow: isGlowing
          ? hotspot.autoGlow
            ? `0 0 30px 15px ${hotspot.glowColor}, 0 0 60px 30px ${hotspot.glowColor}`
            : `0 0 60px 30px ${hotspot.glowColor}, 0 0 120px 60px ${hotspot.glowColor}`
          : "none",
        background: isGlowing && !hotspot.autoGlow
          ? `radial-gradient(circle, ${hotspot.glowColor} 0%, transparent 70%)`
          : "transparent",
        animation: hotspot.autoGlow ? "glow-pulse 3s ease-in-out infinite" : undefined,
      }}
      onMouseEnter={hotspot.autoGlow ? undefined : activate}
      onMouseLeave={hotspot.autoGlow ? undefined : deactivate}
      onTouchStart={hotspot.autoGlow ? undefined : activate}
      onTouchEnd={hotspot.autoGlow ? undefined : deactivate}
      aria-hidden="true"
    />
  );
}

// components/story/HoverGlow.tsx
"use client";

import { useState, useCallback } from "react";

type Hotspot = {
  id: string;
  top: string;
  left: string;
  size: string;
  glowColor: string;
};

type Props = {
  hotspot: Hotspot;
};

/**
 * HoverGlow — zona interactiva que brilla al pasar el ratón o tocar.
 * Se posiciona con top/left/size sobre el frame padre (position: relative/absolute).
 */
export function HoverGlow({ hotspot }: Props) {
  const [active, setActive] = useState(false);

  const activate = useCallback(() => setActive(true), []);
  const deactivate = useCallback(() => setActive(false), []);

  return (
    <div
      className="absolute rounded-full transition-all duration-500 ease-out"
      style={{
        top: hotspot.top,
        left: hotspot.left,
        width: hotspot.size,
        height: hotspot.size,
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
        cursor: "pointer",
        boxShadow: active
          ? `0 0 60px 30px ${hotspot.glowColor}, 0 0 120px 60px ${hotspot.glowColor}`
          : "none",
        background: active
          ? `radial-gradient(circle, ${hotspot.glowColor} 0%, transparent 70%)`
          : "transparent",
      }}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onTouchStart={activate}
      onTouchEnd={deactivate}
      aria-hidden="true"
    />
  );
}

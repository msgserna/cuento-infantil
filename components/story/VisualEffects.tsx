/**
 * VisualEffects: Componente que renderiza efectos visuales dinámicos
 * - Luz dinámica (glow/overlay colorido) con parallax
 * - Partículas (nieve, lluvia, chispas, hojas)
 * - Parallax en elementos según scroll
 * - Blur/Motion effects
 */

"use client";

import { useEffect, useRef, useState } from "react";

export type VisualEffect = {
  lightColor?: string; // "#ff6b00"
  lightIntensity?: number; // 0-1
  parallaxIntensity?: number; // 0-1
  particleType?: "none" | "snow" | "rain" | "sparks" | "leaves";
  blur?: number; // px
};

type Props = {
  effect?: VisualEffect;
  visible?: boolean;
  className?: string;
};

export function VisualEffects({ effect, visible = true, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      rotation?: number;
      rotationSpeed?: number;
    }>
  >([]);

  // Parallax: mover luces y partículas según posición del ratón
  useEffect(() => {
    if (!visible || !effect?.parallaxIntensity) return;

    const intensity = effect.parallaxIntensity;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = ((e.clientX - cx) / cx) * intensity * 30;
      const dy = ((e.clientY - cy) / cy) * intensity * 20;
      setParallaxOffset({ x: dx, y: dy });
    };

    // En mobile: parallax suave con scroll en vez de ratón
    const handleScroll = () => {
      if (window.innerWidth > 768) return; // solo mobile
      const scrollY = window.scrollY;
      const dy = (scrollY % window.innerHeight) / window.innerHeight;
      setParallaxOffset({ x: 0, y: dy * intensity * 40 - 20 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visible, effect?.parallaxIntensity]);

  // Partículas
  useEffect(() => {
    if (!visible || !canvasRef.current || !effect?.particleType || effect.particleType === "none") {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const w = canvas.width;
    const h = canvas.height;

    // Configuración según tipo de partícula
    const configs = {
      snow: { count: 60, sizeMin: 1, sizeMax: 4, vyMin: 0.3, vyMax: 1.2, vxRange: 0.4 },
      rain: { count: 80, sizeMin: 1, sizeMax: 2, vyMin: 4, vyMax: 8, vxRange: 0.8 },
      sparks: { count: 35, sizeMin: 0.5, sizeMax: 2.5, vyMin: -2, vyMax: -0.5, vxRange: 2 },
      leaves: { count: 25, sizeMin: 2, sizeMax: 5, vyMin: 0.5, vyMax: 1.5, vxRange: 1.2 },
    };

    const cfg = configs[effect.particleType] || configs.snow;

    particlesRef.current = Array.from({ length: cfg.count }, () => ({
      x: Math.random() * w,
      y: effect.particleType === "sparks"
        ? h - Math.random() * h * 0.3 // chispas desde abajo
        : Math.random() * h,
      vx: (Math.random() - 0.5) * cfg.vxRange,
      vy: cfg.vyMin + Math.random() * (cfg.vyMax - cfg.vyMin),
      size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
      opacity: 0.2 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        // Viento sutil sinusoidal para nieve y hojas
        if (effect.particleType === "snow" || effect.particleType === "leaves") {
          p.vx += Math.sin(p.y * 0.01) * 0.01;
          p.vx = Math.max(-cfg.vxRange, Math.min(cfg.vxRange, p.vx));
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.rotation !== undefined) p.rotation! += p.rotationSpeed || 0;

        // Wrap around
        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; } // sparks going up
        if (p.x > w + 10) p.x = -10;
        if (p.x < -10) p.x = w + 10;

        // Chispas parpadean
        if (effect.particleType === "sparks") {
          p.opacity = 0.3 + Math.random() * 0.7;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = getParticleColor(effect.particleType!, 1);

        if (effect.particleType === "rain") {
          // Gota de lluvia: línea
          ctx.strokeStyle = getParticleColor("rain", 1);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 0.5, p.y + p.size * 4);
          ctx.stroke();
        } else if (effect.particleType === "leaves") {
          // Hoja: elipse rotada
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Nieve y chispas: círculo
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Glow para chispas
          if (effect.particleType === "sparks") {
            ctx.shadowBlur = 8;
            ctx.shadowColor = getParticleColor("sparks", 0.8);
            ctx.fill();
          }
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [visible, effect?.particleType]);

  if (!effect || !visible) return null;

  const hasParallax = !!effect.parallaxIntensity;
  const parallaxTransform = hasParallax
    ? `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`
    : undefined;

  const lightHex = effect.lightColor || "";
  const intensityAlpha = Math.round((effect.lightIntensity || 0.3) * 255)
    .toString(16)
    .padStart(2, "0");

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ pointerEvents: "none", overflow: "hidden" }}
    >
      {/* Canvas para partículas — con parallax */}
      {effect.particleType && effect.particleType !== "none" && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            pointerEvents: "none",
            mixBlendMode: "screen",
            transform: parallaxTransform,
            transition: hasParallax ? "transform 0.3s ease-out" : undefined,
            // Expandir canvas para que el parallax no deje huecos
            ...(hasParallax ? { inset: "-20px", width: "calc(100% + 40px)", height: "calc(100% + 40px)" } : {}),
          }}
        />
      )}

      {/* Overlay de luz dinámica — con parallax */}
      {effect.lightColor && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${lightHex}${intensityAlpha} 0%, transparent 70%)`,
            opacity: effect.lightIntensity || 0.3,
            mixBlendMode: "screen",
            filter: effect.blur ? `blur(${effect.blur}px)` : undefined,
            transform: parallaxTransform,
            transition: hasParallax ? "transform 0.3s ease-out" : undefined,
            // Expandir para que no deje huecos
            ...(hasParallax ? { inset: "-30px" } : {}),
          }}
        />
      )}

      {/* Segunda capa de luz más difusa — para profundidad */}
      {effect.lightColor && effect.lightIntensity && effect.lightIntensity > 0.2 && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 60%, ${lightHex}${Math.round(effect.lightIntensity * 0.4 * 255).toString(16).padStart(2, "0")} 0%, transparent 60%)`,
            opacity: effect.lightIntensity * 0.5,
            mixBlendMode: "screen",
            // Parallax invertido para la segunda capa (profundidad)
            transform: hasParallax
              ? `translate(${-parallaxOffset.x * 0.5}px, ${-parallaxOffset.y * 0.5}px)`
              : undefined,
            transition: hasParallax ? "transform 0.4s ease-out" : undefined,
          }}
        />
      )}
    </div>
  );
}

function getParticleColor(type: string, opacity: number): string {
  switch (type) {
    case "snow":
      return `rgba(200, 220, 255, ${opacity})`;
    case "rain":
      return `rgba(140, 180, 255, ${opacity})`;
    case "sparks":
      return `rgba(255, 180, 60, ${opacity})`;
    case "leaves":
      return `rgba(180, 110, 50, ${opacity})`;
    default:
      return `rgba(255, 255, 255, ${opacity})`;
  }
}

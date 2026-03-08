// app/page.tsx
"use client";

import { STORY_SECTIONS } from "@/lib/story/sections";
import { StoryProgress } from "@/components/story/StoryProgress";
import { StorySection } from "@/components/story/StorySection";
import { PinnedSection } from "@/components/story/PinnedSection";
import {
  InteractivePinnedSection,
  type Interaction,
} from "@/components/story/InteractivePinnedSection";
import { AudioControls } from "@/components/ui/AudioControls";
import { StoryEnding } from "@/components/story/StoryEnding";
import { useImagePreload } from "@/hooks/useImagePreload";

// Configuración de interacciones por sección
const INTERACTIONS: Record<string, Interaction> = {
  s04: {
    afterFrame: 2, // Frame C (niños solos junto al fuego)
    prompt: "Toca para escuchar la rama",
    icon: "branch",
    soundFx: "/sounds/fire-crackle.mp3",
    soundVolume: 0.6,
    visualEffect: "swing",
    autoAdvanceMs: 1500,
    shouldAutoAdvance: false,
    buttonPosition: { top: "22%", left: "82%" }, // Sobre la rama colgante
  },
  s10: {
    afterFrame: 0, // Frame A (Gretel empuja a la bruja)
    prompt: "Toca para empujar a la bruja",
    icon: "push",
    soundFx: "/sounds/fire-crackle.mp3",
    soundVolume: 0.8,
    visualEffect: "shake",
    autoAdvanceMs: 2000,
  },
};

export default function Page() {
  useImagePreload(2);
  const cover = STORY_SECTIONS.find((s) => s.id === "s01");
  const chapters = STORY_SECTIONS.filter((s) => s.id !== "s01");

  if (!cover) {
    return (
      <div className="min-h-svh bg-black p-6 text-white">
        Falta la sección s01 (portada) en STORY_SECTIONS.
      </div>
    );
  }

  return (
    <div className="bg-black">
      <StoryProgress />

      {/* Portada: 1 imagen */}
      <StorySection section={cover} />

      {/* Secciones 1..10: pin + 3 frames */}
      {chapters.map((section) => {
        const interaction = INTERACTIONS[section.id];

        if (interaction) {
          return (
            <InteractivePinnedSection
              key={section.id}
              section={section}
              pinScrollLength={500}
              interaction={interaction}
            />
          );
        }

        return (
          <PinnedSection
            key={section.id}
            section={section}
            pinScrollLength={450}
          />
        );
      })}

      {/* Sección final */}
      <StoryEnding />

      {/* Controles de audio */}
      <AudioControls />
    </div>
  );
}

/**
 * Controles de audio del usuario
 * Permite que el usuario ajuste el volumen maestro del sitio
 */

"use client";

import { useState } from "react";
import { audioManager } from "@/lib/audio/audioManager";

export function useAudioControls() {
  const [masterVolume, setMasterVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (volume: number) => {
    setMasterVolume(volume);
    audioManager.setMasterVolume(volume);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioManager.setMasterVolume(masterVolume);
      setIsMuted(false);
    } else {
      audioManager.setMasterVolume(0);
      setIsMuted(true);
    }
  };

  return {
    masterVolume,
    isMuted,
    handleVolumeChange,
    toggleMute,
  };
}

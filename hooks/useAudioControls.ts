"use client";

import { useRef, useState } from "react";
import { audioManager } from "@/lib/audio/audioManager";

export function useAudioControls() {
  const [masterVolume, setMasterVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [isNarratorMuted, setIsNarratorMuted] = useState(false);
  const prevNarratorVolume = useRef(1);

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

  const toggleNarratorMute = () => {
    if (isNarratorMuted) {
      audioManager.setNarratorVolume(prevNarratorVolume.current);
      setIsNarratorMuted(false);
    } else {
      prevNarratorVolume.current = audioManager.getNarratorVolume();
      audioManager.setNarratorVolume(0);
      setIsNarratorMuted(true);
    }
  };

  return {
    masterVolume,
    isMuted,
    isNarratorMuted,
    handleVolumeChange,
    toggleMute,
    toggleNarratorMute,
  };
}

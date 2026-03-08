/**
 * AudioControls: Controles flotantes de volumen
 */

"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudioControls } from "@/hooks/useAudioControls";

export function AudioControls() {
  const { masterVolume, isMuted, handleVolumeChange, toggleMute } = useAudioControls();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Control deslizable de volumen */}
      {isOpen && (
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <span className="text-xs text-white/60 min-w-[2.5rem]">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => (isOpen ? toggleMute() : setIsOpen(!isOpen))}
        className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all backdrop-blur-sm border border-white/20"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useAudioControls } from "@/hooks/useAudioControls";

export function AudioControls() {
  const { masterVolume, isMuted, isNarratorMuted, handleVolumeChange, toggleMute, toggleNarratorMute } =
    useAudioControls();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="bg-black/85 backdrop-blur-md rounded-xl p-4 border border-white/15 w-56 flex flex-col gap-4 shadow-xl"
        >
          {/* Narrador */}
          <button
            onClick={toggleNarratorMute}
            className="flex items-center gap-3 w-full group"
            aria-label={isNarratorMuted ? "Activar narrador" : "Silenciar narrador"}
          >
            <span className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${isNarratorMuted ? "border-white/20 bg-white/5" : "border-amber-400/40 bg-amber-400/10"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={isNarratorMuted ? "text-white/30" : "text-amber-300"}>
                <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            </span>
            <span className={`text-sm font-medium transition-colors ${isNarratorMuted ? "text-white/30 line-through" : "text-white/80"}`}>
              Narrador
            </span>
            <span className="ml-auto">
              {isNarratorMuted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/25"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400/60"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </span>
          </button>

          {/* Divisor */}
          <div className="h-px bg-white/10" />

          {/* Volumen general */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              <span className="text-xs text-white/50">Volumen</span>
              <span className="ml-auto text-xs text-white/40">{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Divisor */}
          <div className="h-px bg-white/10" />

          {/* Silenciar todo */}
          <button
            onClick={toggleMute}
            className="flex items-center gap-3 w-full group"
            aria-label={isMuted ? "Activar sonido" : "Silenciar todo"}
          >
            <span className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${isMuted ? "border-red-400/40 bg-red-400/10" : "border-white/20 bg-white/5"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={isMuted ? "text-red-400" : "text-white/50"}>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                {isMuted ? (
                  <>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </>
                ) : (
                  <>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </>
                )}
              </svg>
            </span>
            <span className={`text-sm font-medium transition-colors ${isMuted ? "text-red-400/80" : "text-white/80"}`}>
              {isMuted ? "Sin sonido" : "Silenciar todo"}
            </span>
          </button>
        </div>
      )}

      {/* Botón engranaje */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`rounded-full p-3 transition-all backdrop-blur-sm border ${isOpen ? "bg-white/20 border-white/30" : "bg-white/10 border-white/20 hover:bg-white/20"}`}
        aria-label="Ajustes de audio"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-white transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
        >
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
    </div>
  );
}

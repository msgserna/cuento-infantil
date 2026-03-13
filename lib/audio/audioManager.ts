/**
 * AudioManager: Gestor centralizado de sonidos
 * - Carga y cachea archivos de audio
 * - Dos canales: narrador y efectos de sonido
 * - Volumen maestro controla ambos
 */

class AudioManager {
  private audioContext: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private masterGain: GainNode | null = null;
  private narratorGain: GainNode | null = null;
  private isInitialized = false;
  private resumeListenerAdded = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    const AudioContextClass = (window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext) as typeof AudioContext;
    this.audioContext = new AudioContextClass();

    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.6;

    this.narratorGain = this.audioContext.createGain();
    this.narratorGain.connect(this.masterGain);
    this.narratorGain.gain.value = 1;

    this.isInitialized = true;
    this.ensureResumeOnInteraction();
  }

  private ensureResumeOnInteraction(): void {
    if (this.resumeListenerAdded) return;
    this.resumeListenerAdded = true;

    const resume = () => {
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
    };

    const events = ["click", "touchstart", "scroll", "keydown"] as const;
    const handler = () => {
      resume();
      for (const evt of events) {
        window.removeEventListener(evt, handler, true);
      }
    };

    for (const evt of events) {
      window.addEventListener(evt, handler, { capture: true, passive: true });
    }

    resume();
  }

  async loadSound(url: string): Promise<AudioBuffer | null> {
    if (this.buffers.has(url)) {
      return this.buffers.get(url)!;
    }

    try {
      await this.init();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      this.buffers.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Error cargando sonido ${url}:`, error);
      return null;
    }
  }

  /** Reproduce un efecto de sonido (pasa por masterGain) */
  async play(
    url: string,
    volume: number = 1,
    delay: number = 0,
    loop: boolean = false
  ): Promise<AudioBufferSourceNode | null> {
    try {
      await this.init();
      if (this.audioContext!.state === "suspended") {
        await this.audioContext!.resume();
      }
      const buffer = await this.loadSound(url);
      if (!buffer) return null;

      const source = this.audioContext!.createBufferSource();
      source.buffer = buffer;
      source.loop = loop;

      const gain = this.audioContext!.createGain();
      gain.gain.value = volume;
      source.connect(gain);
      gain.connect(this.masterGain!);

      const startTime =
        delay > 0 ? this.audioContext!.currentTime + delay / 1000 : this.audioContext!.currentTime;
      source.start(startTime);

      return source;
    } catch (error) {
      console.error("Error reproduciendo sonido:", error);
      return null;
    }
  }

  /** Reproduce narración (pasa por narratorGain → masterGain) */
  async playNarration(
    url: string,
    volume: number = 1
  ): Promise<AudioBufferSourceNode | null> {
    try {
      await this.init();
      if (this.audioContext!.state === "suspended") {
        await this.audioContext!.resume();
      }
      const buffer = await this.loadSound(url);
      if (!buffer) return null;

      const source = this.audioContext!.createBufferSource();
      source.buffer = buffer;

      const gain = this.audioContext!.createGain();
      gain.gain.value = volume;
      source.connect(gain);
      gain.connect(this.narratorGain!);

      source.start(this.audioContext!.currentTime);
      return source;
    } catch (error) {
      console.error("Error reproduciendo narración:", error);
      return null;
    }
  }

  async playWithFadeIn(
    url: string,
    volume: number = 1,
    fadeDuration: number = 0.5,
    delay: number = 0
  ): Promise<AudioBufferSourceNode | null> {
    try {
      await this.init();
      if (this.audioContext!.state === "suspended") {
        await this.audioContext!.resume();
      }
      const buffer = await this.loadSound(url);
      if (!buffer) return null;

      const source = this.audioContext!.createBufferSource();
      source.buffer = buffer;

      const gain = this.audioContext!.createGain();
      gain.gain.value = 0;
      source.connect(gain);
      gain.connect(this.masterGain!);

      const startTime =
        delay > 0 ? this.audioContext!.currentTime + delay / 1000 : this.audioContext!.currentTime;
      gain.gain.linearRampToValueAtTime(volume, startTime + fadeDuration);
      source.start(startTime);

      return source;
    } catch (error) {
      console.error("Error reproduciendo sonido con fade:", error);
      return null;
    }
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  getMasterVolume(): number {
    return this.masterGain?.gain.value ?? 0.6;
  }

  setNarratorVolume(volume: number): void {
    if (this.narratorGain) {
      this.narratorGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  getNarratorVolume(): number {
    return this.narratorGain?.gain.value ?? 1;
  }

  stopAll(): void {
    if (this.audioContext) {
      this.audioContext.suspend().then(() => {
        this.audioContext?.resume();
      });
    }
  }

  dispose(): void {
    this.stopAll();
    this.buffers.clear();
  }
}

export const audioManager = new AudioManager();

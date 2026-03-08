/**
 * AudioManager: Gestor centralizado de sonidos
 * - Carga y cachea archivos de audio
 * - Reproduce sonidos con volumen controlado
 * - Integración con GSAP para timing preciso
 */

class AudioManager {
  private audioContext: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private resumeListenerAdded = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    const AudioContextClass = (window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext) as typeof AudioContext;
    this.audioContext = new AudioContextClass();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.6;
    this.isInitialized = true;

    // Resume suspended context on first user interaction
    this.ensureResumeOnInteraction();
  }

  /**
   * Browsers suspend AudioContext until user interacts.
   * Listen for click/touch/scroll/keydown and resume.
   */
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
      // Remove listeners after first interaction
      for (const evt of events) {
        window.removeEventListener(evt, handler, true);
      }
    };

    for (const evt of events) {
      window.addEventListener(evt, handler, { capture: true, passive: true });
    }

    // Also try to resume immediately (works if user already interacted)
    resume();
  }

  /**
   * Precarga un archivo de audio
   */
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

  /**
   * Reproduce un sonido
   * @param url - Ruta del audio
   * @param volume - Volumen (0-1)
   * @param delay - Delay en ms
   * @returns Nodo de sonido para control avanzado
   */
  async play(
    url: string,
    volume: number = 1,
    delay: number = 0
  ): Promise<AudioBufferSourceNode | null> {
    try {
      await this.init();

      // Ensure context is running (browser autoplay policy)
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

  /**
   * Reproduce un sonido con fade-in
   */
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
      gain.gain.value = 0; // Inicia en 0

      source.connect(gain);
      gain.connect(this.masterGain!);

      const startTime =
        delay > 0 ? this.audioContext!.currentTime + delay / 1000 : this.audioContext!.currentTime;

      // Programar fade-in desde el inicium
      gain.gain.linearRampToValueAtTime(volume, startTime + fadeDuration);

      source.start(startTime);

      return source;
    } catch (error) {
      console.error("Error reproduciendo sonido con fade:", error);
      return null;
    }
  }

  /**
   * Para todos los sonidos
   */
  stopAll(): void {
    if (this.audioContext) {
      // Restablece el contexto para parar todos los sonidos
      this.audioContext.suspend().then(() => {
        this.audioContext?.resume();
      });
    }
  }

  /**
   * Cambia el volumen maestro
   */
  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Obtiene el volumen maestro
   */
  getMasterVolume(): number {
    return this.masterGain?.gain.value ?? 0.6;
  }

  /**
   * Limpia recursos
   */
  dispose(): void {
    this.stopAll();
    this.buffers.clear();
  }
}

// Singleton
export const audioManager = new AudioManager();

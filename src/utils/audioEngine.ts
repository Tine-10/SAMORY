/**
 * SAMORY Gentle Background Audio Engine
 * Built using the Web Audio API for 100% reliable, zero-latency,
 * soothing ambient piano chords and harmonic textures with warm acoustic resonance.
 */

export type SoundTrackType = 'piano' | 'lofi' | 'ambient';

export interface SoundTrackInfo {
  id: SoundTrackType;
  name: string;
  description: string;
}

export const SOUND_TRACKS: SoundTrackInfo[] = [
  {
    id: 'piano',
    name: 'Serenade of Memories',
    description: 'Tiếng đàn piano ấm áp, dịu êm lưu giữ hồi ức',
  },
  {
    id: 'lofi',
    name: 'Nostalgic Afternoon',
    description: 'Giai điệu lofi ấm cúng với tiếng tách nhẹ của băng đĩa',
  },
  {
    id: 'ambient',
    name: 'Warm Sunset Glow',
    description: 'Thanh âm ambient êm dịu, thư giãn cho tâm hồn',
  },
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.45;
  private currentTrack: SoundTrackType = 'piano';
  private masterGain: GainNode | null = null;
  private loopTimer: number | null = null;
  private noiseNode: AudioNode | null = null;
  private onStateChange: ((isPlaying: boolean) => void) | null = null;

  constructor() {
    // Initialized lazily on user gesture or autoplay attempt
  }

  public setOnStateChange(cb: (isPlaying: boolean) => void) {
    this.onStateChange = cb;
  }

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public async start(): Promise<boolean> {
    try {
      const ctx = this.initContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (this.isPlaying) return true;

      this.isPlaying = true;
      this.fadeVolume(this.volume, 1.2);
      this.startMelodyLoop();
      this.onStateChange?.(true);
      return true;
    } catch {
      this.isPlaying = false;
      this.onStateChange?.(false);
      return false;
    }
  }

  public stop() {
    if (!this.isPlaying) return;
    this.fadeVolume(0, 0.5);
    window.setTimeout(() => {
      this.isPlaying = false;
      if (this.loopTimer !== null) {
        window.clearTimeout(this.loopTimer);
        this.loopTimer = null;
      }
      if (this.noiseNode) {
        try {
          (this.noiseNode as AudioBufferSourceNode).stop();
        } catch {}
        this.noiseNode = null;
      }
      this.onStateChange?.(false);
    }, 500);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setTrack(track: SoundTrackType) {
    this.currentTrack = track;
    if (this.isPlaying) {
      if (this.loopTimer !== null) {
        window.clearTimeout(this.loopTimer);
        this.loopTimer = null;
      }
      this.startMelodyLoop();
    }
  }

  public getCurrentTrack(): SoundTrackType {
    return this.currentTrack;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private fadeVolume(target: number, durationSec: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, durationSec / 3);
    }
  }

  // Harmonic chord progressions
  // Keys: Cmaj7 - Am7 - Fmaj7 - G6 / Dm9 - G13 - Cmaj9
  private playPianoNote(frequency: number, time: number, duration: number, gainLevel: number = 0.3) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm Rhodes / soft piano tone
    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(frequency, time);
    // Slight detune for acoustic warmth and chorusing
    osc2.frequency.setValueAtTime(frequency * 1.002, time);

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.exponentialRampToValueAtTime(320, time + duration);

    // Piano strike envelope (fast attack, gentle natural exponential decay)
    oscGain.gain.setValueAtTime(0.0001, time);
    oscGain.gain.linearRampToValueAtTime(gainLevel * this.volume, time + 0.03);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);

    osc1.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
  }

  // Soft vinyl noise for lofi track
  private createVinylWarmth() {
    if (!this.ctx || !this.masterGain || this.noiseNode) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // very soft pinkish crackle
        data[i] = (Math.random() * 2 - 1) * 0.015;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06 * this.volume, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start();
      this.noiseNode = noise;
    } catch {}
  }

  private startMelodyLoop() {
    if (!this.isPlaying || !this.ctx) return;

    // Frequencies (Hz) for serene chords
    // C4=261.63, E4=329.63, G4=392.00, B4=493.88
    // A3=220.00, C4=261.63, E4=329.63, G4=392.00
    // F3=174.61, A3=220.00, C4=261.63, E4=329.63
    // G3=196.00, B3=246.94, D4=293.66, F4=349.23
    const progressions = [
      // Chord 1: Cmaj7
      [261.63, 329.63, 392.0, 493.88, 523.25],
      // Chord 2: Am9
      [220.0, 261.63, 329.63, 392.0, 493.88],
      // Chord 3: Fmaj7#11
      [174.61, 261.63, 329.63, 369.99, 440.0],
      // Chord 4: Gsus4 -> G6
      [196.0, 246.94, 293.66, 392.0, 440.0],
    ];

    if (this.currentTrack === 'lofi') {
      this.createVinylWarmth();
    } else if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
      } catch {}
      this.noiseNode = null;
    }

    let chordIndex = 0;

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;
      const chord = progressions[chordIndex % progressions.length];
      const duration = this.currentTrack === 'ambient' ? 5.8 : 4.4;

      // Arpeggiate gently with soft time offset
      chord.forEach((freq, idx) => {
        const offset = idx * 0.14;
        const noteDuration = duration + (idx * 0.4);
        const gain = (idx === 0 ? 0.32 : 0.22) * (this.currentTrack === 'ambient' ? 0.8 : 1);
        this.playPianoNote(freq, now + offset, noteDuration, gain);
      });

      // Extra high sparkle bell tone occasionally
      if (Math.random() > 0.35) {
        const highSparkles = [587.33, 659.25, 783.99, 880.0, 987.77];
        const randomHigh = highSparkles[Math.floor(Math.random() * highSparkles.length)];
        this.playPianoNote(randomHigh, now + 1.2 + Math.random() * 1.5, 3.2, 0.12);
      }

      chordIndex++;
      this.loopTimer = window.setTimeout(playChordStep, duration * 1000 * 0.95);
    };

    playChordStep();
  }
}

export const soundManager = new AudioEngine();

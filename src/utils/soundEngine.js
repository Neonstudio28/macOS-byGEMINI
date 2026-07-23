// macOS 26 Tahoe — Authentic Web Audio Sound Engine
// Boot chime modeled on the classic Apple Mac startup chord

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.88;
    this._bootPlayed = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx({ sampleRate: 44100 });
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return !!this.ctx;
  }

  // ─── Apple macOS Startup Chime ─────────────────────────────────────────────
  // The authentic Mac startup chord is an F# major chord played with:
  //  • A rich pipe-organ style tone (triangle + slight sawtooth harmonics)
  //  • A slow attack (~80ms), long sustain, and long exponential release (~4s)
  //  • A warm low-pass filter sweep that opens up then slowly closes
  //  • Sub-bass reinforcement at F#1 (46.25 Hz)
  //
  // Frequencies for F# major (root F#, major third A#, fifth C#):
  //   F#1  = 46.25 Hz  (sub-bass weight)
  //   F#2  = 92.50 Hz  (bass)
  //   A#2  = 116.54 Hz (alto bass)
  //   C#3  = 138.59 Hz (mid bass)
  //   F#3  = 185.00 Hz (mid)
  //   A#3  = 233.08 Hz (mid-high)
  //   C#4  = 277.18 Hz (high mid)
  //   F#4  = 369.99 Hz (high)
  //   A#4  = 466.16 Hz (shimmer)
  //   C#5  = 554.37 Hz (bright top)
  playBoot() {
    if (!this.enabled) return;
    if (!this.init()) return;
    this._bootPlayed = true;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master gain for overall chime volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(this.volume * 0.72, now + 0.08);
    masterGain.gain.setValueAtTime(this.volume * 0.72, now + 0.8);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 5.2);
    masterGain.connect(ctx.destination);

    // Warm analog low-pass filter sweep
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + 3.5);
    filter.Q.setValueAtTime(0.8, now);
    filter.connect(masterGain);

    // Slight reverb via convolution-like delay nodes
    const delay1 = ctx.createDelay(0.5);
    delay1.delayTime.value = 0.18;
    const delayGain1 = ctx.createGain();
    delayGain1.gain.value = 0.18;
    delay1.connect(delayGain1);
    delayGain1.connect(filter);

    // Chord voice definitions: [frequency, waveType, relativeAmplitude]
    const voices = [
      [46.25,  'sine',     0.30],  // F#1 — sub-bass weight
      [92.50,  'sine',     0.42],  // F#2 — bass
      [116.54, 'triangle', 0.22],  // A#2 — alto bass
      [138.59, 'triangle', 0.18],  // C#3 — mid bass
      [185.00, 'triangle', 0.36],  // F#3 — core mid
      [233.08, 'triangle', 0.30],  // A#3 — mid
      [277.18, 'sine',     0.24],  // C#4 — upper mid
      [369.99, 'sine',     0.20],  // F#4 — high
      [466.16, 'sine',     0.14],  // A#4 — shimmer
      [554.37, 'sine',     0.10],  // C#5 — bright
    ];

    voices.forEach(([freq, type, amp], i) => {
      // Primary oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      // Slight de-tune for chorus width
      osc.detune.setValueAtTime((i % 3 - 1) * 2.5, now);

      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(amp, now + 0.08);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

      osc.connect(oscGain);
      oscGain.connect(filter);

      // Detuned second oscillator for organ-like beating
      if (freq > 100) {
        const osc2 = ctx.createOscillator();
        const osc2Gain = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq, now);
        osc2.detune.setValueAtTime(+6.5, now);
        osc2Gain.gain.setValueAtTime(0.0001, now);
        osc2Gain.gain.linearRampToValueAtTime(amp * 0.28, now + 0.08);
        osc2Gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);
        osc2.connect(osc2Gain);
        osc2Gain.connect(delay1);
        osc2.start(now);
        osc2.stop(now + 5.1);
      }

      osc.start(now);
      osc.stop(now + 5.1);
    });
  }

  // ─── Login Unlock Chime (soft ascending bell) ──────────────────────────────
  playLogin() {
    if (!this.enabled) return;
    if (!this.init()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Two-note ascending chime: C#5 → F#5
    [[554.37, 0], [739.99, 0.12]].forEach(([freq, delay]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.linearRampToValueAtTime(0.22 * this.volume, now + delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.75);
    });
  }

  // ─── Click (UI tap sound) ──────────────────────────────────────────────────
  playClick() {
    if (!this.enabled) return;
    if (!this.init()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

    gain.gain.setValueAtTime(0.07 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // ─── Window Open (airy swoosh up) ─────────────────────────────────────────
  playWindowOpen() {
    if (!this.enabled) return;
    if (!this.init()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.14);
    gain.gain.setValueAtTime(0.09 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // ─── Window Close (soft descending) ───────────────────────────────────────
  playWindowClose() {
    if (!this.enabled) return;
    if (!this.init()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.11);
    gain.gain.setValueAtTime(0.07 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // ─── Trash Drop ───────────────────────────────────────────────────────────
  playTrashDrop() {
    if (!this.enabled) return;
    if (!this.init()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(75, now + 0.18);
    gain.gain.setValueAtTime(0.22 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // ─── Error / Wrong Password Buzz ──────────────────────────────────────────
  playError() {
    if (!this.enabled) return;
    if (!this.init()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, now + i * 0.08);
      gain.gain.setValueAtTime(0.08 * this.volume, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.07);
    }
  }
}

export const sounds = new SoundEngine();

import { ref, readonly } from 'vue'

let audioCtx: AudioContext | null = null
const isMuted = ref(false)

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function useSoundEngine() {
  const toggleMute = () => {
    isMuted.value = !isMuted.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_muted', isMuted.value ? 'true' : 'false')
    }
  }

  const unmute = () => {
    isMuted.value = false
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_muted', 'false')
    }
  }

  const initSound = () => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('nexus_muted')
    if (saved !== null) {
      isMuted.value = saved === 'true'
    }
  }

  // 1. Crisp UI Click (8ms bandpass click)
  const playClick = () => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04)

    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  }

  // 2. High-Frequency Cyber Pip (Hover)
  const playHover = () => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.03)

    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.03)
  }

  // 3. Dimensional Reality Warp (Mode Shift)
  const playWarp = () => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    
    // Sub bass drop
    const subOsc = ctx.createOscillator()
    const subGain = ctx.createGain()
    subOsc.type = 'triangle'
    subOsc.frequency.setValueAtTime(240, now)
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.6)
    subGain.gain.setValueAtTime(0.35, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    subOsc.connect(subGain)
    subGain.connect(ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 0.6)

    // Cyber sweep
    const sweepOsc = ctx.createOscillator()
    const sweepGain = ctx.createGain()
    sweepOsc.type = 'sawtooth'
    sweepOsc.frequency.setValueAtTime(150, now)
    sweepOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.4)
    sweepGain.gain.setValueAtTime(0.12, now)
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
    sweepOsc.connect(sweepGain)
    sweepGain.connect(ctx.destination)
    sweepOsc.start(now)
    sweepOsc.stop(now + 0.45)
  }

  // 4. Beatpad Procedural Synths (8 distinct pads)
  const playPad = (index: number) => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const frequencies = [60, 180, 420, 523.25, 880, 329.63, 55, 1046.5]
    const types: OscillatorType[] = ['sine', 'triangle', 'sawtooth', 'square', 'sine', 'sawtooth', 'triangle', 'sine']
    const durations = [0.25, 0.15, 0.08, 0.4, 0.2, 0.35, 0.5, 0.3]

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = types[index % types.length]
    const baseFreq = frequencies[index % frequencies.length]

    if (index === 0) {
      // 808 Kick
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.1)
    } else if (index === 4) {
      // Laser zap
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.18)
    } else {
      osc.frequency.setValueAtTime(baseFreq, now)
    }

    const dur = durations[index % durations.length]
    gain.gain.setValueAtTime(0.28, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + dur)
  }

  // Exact Crack Sound from the React Glass Implementation
  const playCrack = () => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const size = Math.floor(ctx.sampleRate * 0.09)
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < size; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 3000
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.22, now)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
    noise.connect(hp)
    hp.connect(g)
    g.connect(ctx.destination)
    noise.start(now)
  }

  // 5. Procedural Glass Shatter Sound (Impact + Crack + Resonant Shards)
  const playGlassShatter = () => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // 1. Transient Impact Thud
    const thudOsc = ctx.createOscillator()
    const thudGain = ctx.createGain()
    thudOsc.type = 'triangle'
    thudOsc.frequency.setValueAtTime(140, now)
    thudOsc.frequency.exponentialRampToValueAtTime(30, now + 0.12)
    thudGain.gain.setValueAtTime(0.45, now)
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    thudOsc.connect(thudGain)
    thudGain.connect(ctx.destination)
    thudOsc.start(now)
    thudOsc.stop(now + 0.12)

    // 2. Highpass Filtered Noise Burst (Crispy Crack)
    const bufferSize = Math.floor(ctx.sampleRate * 0.18)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(2600, now)
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.5, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)

    // 3. Resonant Glass Shard Pings
    const freqs = [3100, 4200, 5600, 6800, 8400]
    freqs.forEach((freq, idx) => {
      const pingOsc = ctx.createOscillator()
      const pingGain = ctx.createGain()
      pingOsc.type = 'sine'
      const startOffset = idx * 0.015
      pingOsc.frequency.setValueAtTime(freq + (Math.random() * 200 - 100), now + startOffset)
      pingGain.gain.setValueAtTime(0.14, now + startOffset)
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + 0.25)
      pingOsc.connect(pingGain)
      pingGain.connect(ctx.destination)
      pingOsc.start(now + startOffset)
      pingOsc.stop(now + startOffset + 0.25)
    })
  }

  // 6. Confetti Celebration Arpeggio
  const playConfetti = () => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5] // C E G C
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.07
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.25)
    })
  }

  return {
    isMuted: readonly(isMuted),
    toggleMute,
    unmute,
    initSound,
    playClick,
    playHover,
    playWarp,
    playGlassShatter,
    playCrack,
    playPad,
    playConfetti,
  }
}

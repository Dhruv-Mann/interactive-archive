<template>
  <div
    ref="containerRef"
    class="relative w-full h-[100dvh] overflow-hidden bg-[#722F99]"
    style="touch-action: none;"
    aria-label="NEXUS UFO Interactive Sequence"
    role="img"
  >
    <canvas ref="canvasRef" class="block w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ─── UTILS ───────────────────────────────────────────────────────────────────
function wrapText(ctx: CanvasRenderingContext2D, text: string, font: string, maxWidth: number): string[] {
  ctx.font = font
  const paragraphs = text.split('\n')
  const lines: string[] = []
  for (const para of paragraphs) {
    const words = para.split(' ')
    let current = ''
    for (const word of words) {
      const test = current ? current + ' ' + word : word
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current)
        current = word
      } else {
        current = test
      }
    }
    lines.push(current)
  }
  return lines
}

// ─── CONFIGURATION ───────────────────────────────────────────────────────────
type EngineConfig = {
  ufoSpeed: number
  ufoScale: number
  showBeam: boolean
  showAntenna: boolean
  pushForce: number
  springStrength: number
  damping: number
  burnGravity: number
  beamRadius: number
  beamForce: number
  screenShake: boolean
  showEmbers: boolean
  showParticles: boolean
  showStars: boolean
  showCursor: boolean
  textOpacity: number
  showDebris: boolean
  debrisCount: number
  debrisSpeed: number
}

const cfg: EngineConfig = {
  ufoSpeed: 0.18,
  ufoScale: 1,
  showBeam: true,
  showAntenna: true,
  pushForce: 6,
  springStrength: 0.015,
  damping: 0.93,
  burnGravity: 0.8,
  beamRadius: 120,
  beamForce: 25,
  screenShake: true,
  showEmbers: true,
  showParticles: true,
  showStars: true,
  showCursor: true,
  textOpacity: 1,
  showDebris: true,
  debrisCount: 8,
  debrisSpeed: 0.6,
}

const title = "WE DO EVERYTHING"
const tagline = "A COLLECTIVE OF MBA STUDENTS REDEFINING WHAT A CLUB CAN BE. WE BUILD. WE HOST. WE PLAY."
const credits = [
  { role: "curated by", name: "THE VISIONARIES" },
  { role: "soundscapes", name: "THE UNDERGROUND" },
  { role: "visual design", name: "THE ARCHITECTS" },
  { role: "engineered by", name: "THE DEVS IN THE DARK" },
  { role: "in memory of", name: "EVERY BORING NIGHT" },
  { role: "energy provided by", name: "PURE ADRENALINE" }
]

const TUNNEL_FRAGMENTS = [
  "WE BUILD",
  "WE HOST",
  "WE PLAY",
  "REDEFINING THE CLUB",
  "MBA COLLECTIVE",
  "NEXUS FRAMEWORK",
  "WE DO EVERYTHING"
]

// ─── FONTS ───────────────────────────────────────────────────────────────────
const F_DISPLAY = '"Space Grotesk", sans-serif'
const F_CREDIT = '"Inter", sans-serif'
const F_MONO = '"Space Mono", monospace'

// ─── PALETTE (Adapted to Managia Chaos Theme) ────────────────────────────────
const COL_BG = "#722F99"
const COL_TITLE_GHOST = "rgba(254, 231, 200, 0.15)" // Faint Cream
const COL_LABEL = "#FF9292" // Soft Pink
const COL_CREDIT = "#FEE7C8" // Cream
const COL_DIM = "rgba(197, 193, 193, 0.6)" // Gray #C5C1C1
const COL_BEAM_A = "rgba(255, 146, 146, 0.25)" // #FF9292 beam
const COL_BEAM_B = "rgba(254, 231, 200, 0.15)" // #FEE7C8 beam
const COL_STAR = "#C5C1C1"
const EMBER_CHARS = ["·", "•", "∘", "˚", "✺", "∗"]
const EMBER_COLORS = ["#FF9292", "#FEE7C8", "#ffffff"]
const STAR_CHARS = ["·", "∘", "˚", "⋆", "."]
const BEAM_CHARS = "· ∘ ○ ◦ ⋄ ∙".split(" ")

// ─── DEBRIS KINDS ────────────────────────────────────────────────────────────
type DebrisKind = { shape: "diamond" | "ring" | "triangle" | "cross"; color: string; hp: number; size: number; speed: number }
const DEBRIS_KINDS: DebrisKind[] = [
  { shape: "diamond", color: "#FF9292", hp: 1, size: 9, speed: 1.0 },
  { shape: "ring", color: "#FEE7C8", hp: 3, size: 11, speed: 0.5 },
  { shape: "triangle", color: "#C5C1C1", hp: 1, size: 7, speed: 2.1 },
  { shape: "cross", color: "#ffffff", hp: 2, size: 8, speed: 0.8 },
]

function drawDebrisShape(ctx: CanvasRenderingContext2D, shape: DebrisKind["shape"], r: number) {
  ctx.beginPath()
  if (shape === "diamond") {
    ctx.moveTo(0, -r)
    ctx.lineTo(r, 0)
    ctx.lineTo(0, r)
    ctx.lineTo(-r, 0)
    ctx.closePath()
    ctx.stroke()
  } else if (shape === "ring") {
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.stroke()
  } else if (shape === "triangle") {
    ctx.moveTo(0, -r)
    ctx.lineTo(r * 0.9, r * 0.7)
    ctx.lineTo(-r * 0.9, r * 0.7)
    ctx.closePath()
    ctx.stroke()
  } else {
    ctx.moveTo(-r, 0)
    ctx.lineTo(r, 0)
    ctx.moveTo(0, -r)
    ctx.lineTo(0, r)
    ctx.stroke()
  }
}

// ─── VUE COMPONENT STATE ─────────────────────────────────────────────────────
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let rafId = 0
let ro: ResizeObserver | null = null

onMounted(() => {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2)
  let initialized = false

  // ─── Gradient Cache ──────────────────────────────────────────────────────────
  // Declared here (before resize()) so they are initialised before resize() is
  // called immediately below. let is TDZ-sensitive; declaring after the call
  // causes "Cannot access 'lastGradSc' before initialization".
  let cachedGlowGrad: CanvasGradient | null = null
  let cachedBodyGrad: CanvasGradient | null = null
  let cachedDomeGrad: CanvasGradient | null = null
  let lastIsBeaming: boolean | null = null
  let lastGradSc = -1

  function resize() {
    if (!container || !canvas) return
    const rect = container.getBoundingClientRect()
    W = Math.max(1, rect.width)
    H = Math.max(1, rect.height)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    lastGradSc = -1  // Invalidate gradient cache on resize
    if (initialized) {
      layoutAllText()
      buildTunnel()
    }
  }
  ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  const BASE_W = 1400
  function responsiveScale() {
    return Math.max(0.4, Math.min(1.1, W / BASE_W))
  }

  // Pointer
  const pointer = { x: W / 2, y: H / 2 }
  function setPointerFromEvent(clientX: number, clientY: number) {
    const rect = canvas!.getBoundingClientRect()
    pointer.x = clientX - rect.left
    pointer.y = clientY - rect.top
  }
  
  let isBeaming = false
  const onMove = (e: PointerEvent) => setPointerFromEvent(e.clientX, e.clientY)
  const onDown = (e: PointerEvent) => {
    setPointerFromEvent(e.clientX, e.clientY)
    isBeaming = true
  }
  const onUp = () => { isBeaming = false }
  
  canvas.addEventListener("pointermove", onMove)
  canvas.addEventListener("pointerdown", onDown)
  window.addEventListener("pointerup", onUp)
  canvas.addEventListener("touchmove", (e: TouchEvent) => {
    e.preventDefault()
    if (e.touches[0]) setPointerFromEvent(e.touches[0].clientX, e.touches[0].clientY)
  }, { passive: false })

  // Shake
  let shakeIntensity = 0, shakeX = 0, shakeY = 0
  function triggerShake(intensity: number) {
    if (!cfg.screenShake) return
    shakeIntensity = Math.max(shakeIntensity, Math.min(intensity, 8))
  }
  function updateShake() {
    if (shakeIntensity > 0.1) {
      shakeX = (Math.random() - 0.5) * shakeIntensity
      shakeY = (Math.random() - 0.5) * shakeIntensity
      shakeIntensity *= 0.85
    } else {
      shakeX = 0; shakeY = 0; shakeIntensity = 0
    }
  }

  // Letters (SoA)
  const MAX_LETTERS = 2000
  let letterCount = 0
  const lHomeX = new Float32Array(MAX_LETTERS)
  const lHomeY = new Float32Array(MAX_LETTERS)
  const lX = new Float32Array(MAX_LETTERS)
  const lY = new Float32Array(MAX_LETTERS)
  const lVx = new Float32Array(MAX_LETTERS)
  const lVy = new Float32Array(MAX_LETTERS)
  const lAngle = new Float32Array(MAX_LETTERS)
  const lAngVel = new Float32Array(MAX_LETTERS)
  const lCharW = new Float32Array(MAX_LETTERS)
  const lBaseAlpha = new Float32Array(MAX_LETTERS)
  const lBurnTimer = new Float32Array(MAX_LETTERS)
  const lScaleMul = new Float32Array(MAX_LETTERS)
  const lGravity = new Float32Array(MAX_LETTERS)
  const lChar: string[] = []
  const lFont: string[] = []
  const lColor: string[] = []

  // Embers + Particles
  const MAX_EMBERS = 60
  let emberCount = 0
  const emX = new Float32Array(MAX_EMBERS)
  const emY = new Float32Array(MAX_EMBERS)
  const emVx = new Float32Array(MAX_EMBERS)
  const emVy = new Float32Array(MAX_EMBERS)
  const emLife = new Float32Array(MAX_EMBERS)
  const emSize = new Float32Array(MAX_EMBERS)
  const emChar: string[] = new Array(MAX_EMBERS)
  const emColor: string[] = new Array(MAX_EMBERS)
  
  function spawnEmber(x: number, y: number) {
    if (!cfg.showEmbers || emberCount >= MAX_EMBERS) return
    const i = emberCount++
    const a = Math.random() * Math.PI * 2
    emX[i] = x; emY[i] = y
    emVx[i] = Math.cos(a) * (1 + Math.random() * 3)
    emVy[i] = Math.sin(a) * (1 + Math.random() * 3) - 2
    emLife[i] = 0.3 + Math.random() * 0.6
    emSize[i] = 4 + Math.random() * 7
    emChar[i] = EMBER_CHARS[(Math.random() * EMBER_CHARS.length) | 0]
    emColor[i] = EMBER_COLORS[(Math.random() * EMBER_COLORS.length) | 0]
  }

  const MAX_PARTICLES = 150
  let particleCount = 0
  const pX = new Float32Array(MAX_PARTICLES), pY = new Float32Array(MAX_PARTICLES)
  const pVx = new Float32Array(MAX_PARTICLES), pVy = new Float32Array(MAX_PARTICLES)
  const pLife = new Float32Array(MAX_PARTICLES), pMaxLife = new Float32Array(MAX_PARTICLES)
  const pSize = new Float32Array(MAX_PARTICLES)
  const pChar: string[] = new Array(MAX_PARTICLES)

  // Layout Text
  type TextEntry = { text: string; font: string; fontSize: number; color: string; alpha: number; yOffset: number; maxWidth: number; lineHeight: number; column: "left" | "right" | "center" }
  function buildTextEntries(scale: number, availH: number, twoCol: boolean): TextEntry[] {
    const entries: TextEntry[] = [
      { text: tagline, font: `700 13px ${F_MONO}`, fontSize: 13 * scale, color: COL_DIM, alpha: 0.6, yOffset: -50 * scale, maxWidth: 1300, lineHeight: 20, column: "center" },
      { text: title, font: `900 130px ${F_DISPLAY}`, fontSize: 130 * scale, color: COL_TITLE_GHOST, alpha: 0.8, yOffset: -10 * scale, maxWidth: 1300, lineHeight: 140 * scale, column: "center" },
    ]
    const startY = 210 * scale
    const rowCount = twoCol ? Math.ceil(credits.length / 2) : credits.length
    const bottomMargin = 60 * scale
    const idealGap = rowCount > 0 ? (availH - startY - bottomMargin) / rowCount : 0
    const rowGap = Math.max(56 * scale, Math.min(96 * scale, idealGap))
    const nameSize = Math.max(15, Math.min(34, rowGap * 0.34)) * scale
    const labelSize = 12 * scale

    credits.forEach((c, i) => {
      const row = twoCol ? Math.floor(i / 2) : i
      const y = startY + row * rowGap
      const col = twoCol ? (i % 2 === 0 ? "left" : "right") : "left"
      entries.push({ text: c.role.toUpperCase(), font: `700 12px ${F_MONO}`, fontSize: labelSize, color: COL_LABEL, alpha: 0.9, yOffset: y, maxWidth: 900, lineHeight: 18, column: col })
      entries.push({ text: c.name, font: `600 ${nameSize}px ${F_CREDIT}`, fontSize: nameSize, color: COL_CREDIT, alpha: 0.95, yOffset: y + Math.max(18, nameSize * 0.7), maxWidth: 640, lineHeight: nameSize * 1.15, column: col })
    })
    return entries
  }

  function layoutAllText() {
    letterCount = 0; lChar.length = 0; lFont.length = 0; lColor.length = 0
    const scale = responsiveScale()
    const mx = Math.max(30, W * 0.06), my = Math.max(50, H * 0.08)
    const cw = W - mx * 2
    const twoCol = cw > 640
    const availH = H - my
    const entries = buildTextEntries(scale, availH, twoCol)
    const col2X = twoCol ? mx + cw * 0.56 : mx

    for (const entry of entries) {
      const fontStr = entry.font.includes("px") ? entry.font : `${entry.fontSize}px ${entry.font}`
      let baseX: number, maxW: number
      if (entry.column === "right") {
        baseX = twoCol ? col2X : mx
        maxW = Math.min(entry.maxWidth * scale, twoCol ? cw * 0.4 : cw)
      } else if (entry.column === "center") {
        maxW = Math.min(entry.maxWidth * scale, cw)
        baseX = mx + (cw - maxW) / 2
      } else {
        baseX = mx
        maxW = Math.min(entry.maxWidth * scale, twoCol ? cw * 0.5 : cw)
      }
      const baseY = my + entry.yOffset

      try {
        const lines = wrapText(ctx!, entry.text, fontStr, maxW)
        for (let li = 0; li < lines.length; li++) {
          let xc = baseX
          const y = baseY + li * entry.lineHeight
          ctx!.font = fontStr
          for (const char of lines[li]) {
            if (letterCount >= MAX_LETTERS) continue
            const cw2 = ctx!.measureText(char).width
            const i = letterCount++
            lHomeX[i] = xc + cw2 / 2
            lHomeY[i] = y + entry.lineHeight / 2
            lX[i] = lHomeX[i]; lY[i] = lHomeY[i]
            lVx[i] = 0; lVy[i] = 0; lAngle[i] = 0; lAngVel[i] = 0
            lCharW[i] = cw2; lBaseAlpha[i] = entry.alpha
            lBurnTimer[i] = 0; lScaleMul[i] = 1; lGravity[i] = 0
            lChar[i] = char; lFont[i] = fontStr; lColor[i] = entry.color
            xc += cw2
          }
        }
      } catch {}
    }
  }

  // UFO Logic
  let ufoX = W / 2, ufoY = H / 2
  let ufoPx = ufoX, ufoPy = ufoY
  function updateUFO() {
    ufoPx = ufoX; ufoPy = ufoY
    ufoX += (pointer.x - ufoX) * cfg.ufoSpeed
    ufoY += (pointer.y - ufoY) * cfg.ufoSpeed
  }

  function interactLetters(dt: number) {
    const sc = cfg.ufoScale * responsiveScale()
    const bodyRadX = 52 * sc, bodyRadY = 18 * sc
    const domeRadX = 28 * sc, domeRadY = 22 * sc
    const damp = cfg.damping, spring = cfg.springStrength, push = cfg.pushForce, bGrav = cfg.burnGravity
    const vdx = ufoX - ufoPx, vdy = ufoY - ufoPy

    for (let li = 0; li < letterCount; li++) {
      let vx = lVx[li], vy = lVy[li], av = lAngVel[li]
      const x = lX[li], y = lY[li], cw = lCharW[li]

      const dxBody = x - ufoX, dyBody = y - ufoY
      const ellipseBody = (dxBody / bodyRadX) ** 2 + (dyBody / bodyRadY) ** 2
      const ellipseDome = (dxBody / domeRadX) ** 2 + ((dyBody - domeRadY * 0.8) / domeRadY) ** 2

      if (ellipseBody < 1.15 || ellipseDome < 1.1) {
        const d = Math.sqrt(dxBody * dxBody + dyBody * dyBody) || 1
        const minD = 28 * sc + cw * 0.4 + 4
        const f = push * Math.max(0, (minD - d) / minD) * sc
        const nx = dxBody / d, ny = dyBody / d
        vx += nx * f + vdx * 0.4
        vy += ny * f + vdy * 0.4
        av += (nx * 0.3 - ny * 0.2) * f * 0.12
      }

      const wdx = x - ufoPx, wdy = y - ufoPy
      const wdSq = wdx * wdx + wdy * wdy
      if (wdSq < 1800 && wdSq > 100) {
        const w = (1 - Math.sqrt(wdSq) / 42) * 0.1
        vx += vdx * w
        vy += vdy * w
      }

      if (lBurnTimer[li] > 0) {
        lBurnTimer[li] -= dt
        lGravity[li] = bGrav
        if (Math.random() < dt * 2) spawnEmber(x, y)
        if (lBurnTimer[li] <= 0) {
          lBurnTimer[li] = 0
          lScaleMul[li] = 1
          lGravity[li] = 0
          lAngle[li] = 0
        }
      }

      const hdx = lHomeX[li] - x, hdy = lHomeY[li] - y
      const hd = Math.sqrt(hdx * hdx + hdy * hdy)
      if (hd > 0.5) {
        const sf = spring * (1 + hd * 0.001)
        vx += hdx * sf; vy += hdy * sf
        av -= lAngle[li] * 0.05
      } else {
        lAngle[li] *= 0.9
      }

      vy += lGravity[li]
      lVx[li] = vx * damp; lVy[li] = vy * damp
      lAngVel[li] = av * 0.91
      lX[li] = x + lVx[li]; lY[li] = y + lVy[li]
      lAngle[li] += lAngVel[li]
    }
  }

  function beamBlastAt(bx: number, by: number, dx: number, dy: number) {
    let hits = 0
    const rSq = cfg.beamRadius * cfg.beamRadius, ff = cfg.beamForce, fr = cfg.beamRadius
    for (let li = 0; li < letterCount; li++) {
      const ldx = lX[li] - bx, ldy = lY[li] - by
      const dSq = ldx * ldx + ldy * ldy
      if (dSq < rSq && dSq > 0.01) {
        const d = Math.sqrt(dSq), f = ff * (1 - d / fr) ** 2
        lVx[li] += (ldx / d) * 0.4 * f + dx * 0.6 * f
        lVy[li] += (ldy / d) * 0.4 * f + dy * 0.6 * f - f * 0.2
        lBurnTimer[li] = Math.max(lBurnTimer[li], 0.5 + Math.random() * 1.2)
        hits++
      }
    }
    if (hits > 3) {
      triggerShake(Math.min(hits * 0.4, 6))
      for (let i = 0; i < Math.min(hits, 4); i++) spawnEmber(bx, by)
    }
  }

  function drawLetters() {
    const opMul = cfg.textOpacity
    let prevFont = ""
    let prevColor = ""
    let prevAlpha = -1

    ctx!.textAlign = "center"
    ctx!.textBaseline = "middle"

    for (let i = 0; i < letterCount; i++) {
      const burning = lBurnTimer[i] > 0
      let alpha = lBaseAlpha[i] * opMul
      let color = lColor[i]
      
      if (burning) {
        color = "#FF9292" // Optimized: static color string prevents GC allocation
        alpha = Math.min(1, alpha + 0.3)
      }
      
      const font = lFont[i]
      if (font !== prevFont) { ctx!.font = font; prevFont = font }
      if (color !== prevColor) { ctx!.fillStyle = color; prevColor = color }
      if (alpha !== prevAlpha) { ctx!.globalAlpha = alpha; prevAlpha = alpha }

      const sm = lScaleMul[i]
      const ang = lAngle[i]

      // FAST PATH: skip expensive save/translate/rotate/restore
      if (sm === 1 && ang === 0) {
        ctx!.fillText(lChar[i], lX[i], lY[i])
      } else {
        // SLOW PATH (Fallback)
        ctx!.save()
        ctx!.translate(lX[i], lY[i])
        if (ang !== 0) ctx!.rotate(ang)
        if (sm !== 1) ctx!.scale(sm, sm)
        ctx!.fillText(lChar[i], 0, 0)
        ctx!.restore()
      }
    }
  }

  let beamAccum = 0, totalBeamTime = 0
  function emitBeam(dt: number) {
    if (!isBeaming) { totalBeamTime = 0; return }
    beamAccum += dt; totalBeamTime += dt
    const hx = ufoX, hy = ufoY
    if (cfg.showParticles) {
      while (beamAccum > 0.02) {
        beamAccum -= 0.02
        if (particleCount >= MAX_PARTICLES) break
        for (let j = 0; j < 3; j++) {
          if (particleCount >= MAX_PARTICLES) break
          const i = particleCount++
          const sp = (Math.random() - 0.5) * 0.3
          const spd = 6 + Math.random() * 8
          pX[i] = hx + sp * 30; pY[i] = hy + 20
          pVx[i] = sp * 2; pVy[i] = spd
          pLife[i] = 1; pMaxLife[i] = 0.25 + Math.random() * 0.35
          pSize[i] = 8 + Math.random() * 10
          pChar[i] = BEAM_CHARS[(Math.random() * BEAM_CHARS.length) | 0]
        }
      }
    } else { beamAccum = 0 }
    const bx = hx, by = hy + cfg.beamRadius * 0.5
    beamBlastAt(bx, by, 0, 1)
    hitDebrisWithBeam(bx, by)
    triggerShake(Math.min(1 + totalBeamTime * 0.15, 2.5))
  }

  function updateParticlesAndEmbers(dt: number) {
    for (let i = particleCount - 1; i >= 0; i--) {
      pX[i] += pVx[i]; pY[i] += pVy[i]; pVy[i] += 0.3; pVx[i] *= 0.98
      pLife[i] -= dt / pMaxLife[i]
      if (pLife[i] <= 0) {
        particleCount--
        pX[i] = pX[particleCount]; pY[i] = pY[particleCount]
        pVx[i] = pVx[particleCount]; pVy[i] = pVy[particleCount]
        pLife[i] = pLife[particleCount]; pMaxLife[i] = pMaxLife[particleCount]
        pSize[i] = pSize[particleCount]; pChar[i] = pChar[particleCount]
      }
    }
    for (let i = emberCount - 1; i >= 0; i--) {
      emX[i] += emVx[i]; emY[i] += emVy[i]; emVy[i] += 0.12; emVx[i] *= 0.97
      emLife[i] -= dt
      if (emLife[i] <= 0) {
        emberCount--
        emX[i] = emX[emberCount]; emY[i] = emY[emberCount]
        emVx[i] = emVx[emberCount]; emVy[i] = emVy[emberCount]
        emLife[i] = emLife[emberCount]; emSize[i] = emSize[emberCount]
        emChar[i] = emChar[emberCount]; emColor[i] = emColor[emberCount]
      }
    }
  }

  function drawParticles() {
    if (cfg.showEmbers) {
      ctx!.textAlign = "center"
      ctx!.textBaseline = "middle"
      for (let i = 0; i < emberCount; i++) {
        ctx!.globalAlpha = Math.min(1, emLife[i] * 2)
        ctx!.font = `${emSize[i]}px ${F_MONO}`
        ctx!.fillStyle = emColor[i]
        ctx!.fillText(emChar[i], emX[i], emY[i])
      }
    }
    if (cfg.showParticles && isBeaming) {
      const bw = cfg.beamRadius * 0.55 * cfg.ufoScale
      const bh = cfg.beamRadius * 1.2
      const grad = ctx!.createLinearGradient(ufoX, ufoY + 20, ufoX, ufoY + 20 + bh)
      grad.addColorStop(0, COL_BEAM_A)
      grad.addColorStop(0.5, COL_BEAM_B)
      grad.addColorStop(1, "rgba(255, 146, 146, 0)")
      ctx!.beginPath()
      ctx!.moveTo(ufoX - bw * 0.2, ufoY + 20)
      ctx!.lineTo(ufoX + bw * 0.2, ufoY + 20)
      ctx!.lineTo(ufoX + bw, ufoY + 20 + bh)
      ctx!.lineTo(ufoX - bw, ufoY + 20 + bh)
      ctx!.closePath()
      ctx!.fillStyle = grad
      ctx!.fill()
    }
    if (cfg.showParticles) {
      ctx!.textAlign = "center"; ctx!.textBaseline = "middle"
      for (let i = 0; i < particleCount; i++) {
        const t = pLife[i]
        ctx!.globalAlpha = t * 0.75
        ctx!.font = `${pSize[i] * (0.4 + t * 0.6)}px ${F_MONO}`
        ctx!.fillStyle = `rgba(255, 146, 146, ${0.4 + t * 0.5})` // Pink tinted particles
        ctx!.fillText(pChar[i], pX[i], pY[i])
      }
    }
    ctx!.globalAlpha = 1
  }

  // Tunnel
  const TUNNEL_RINGS = 14
  const TUNNEL_DEPTH = 1200
  const tunnelZ = new Float32Array(TUNNEL_RINGS)
  const tunnelSide = new Uint8Array(TUNNEL_RINGS)
  const tunnelTextIdx = new Uint8Array(TUNNEL_RINGS)
  function buildTunnel() {
    for (let i = 0; i < TUNNEL_RINGS; i++) {
      tunnelZ[i] = (i / TUNNEL_RINGS) * TUNNEL_DEPTH
      tunnelSide[i] = i % 4
      tunnelTextIdx[i] = i % TUNNEL_FRAGMENTS.length
    }
  }
  buildTunnel()
  function drawTunnel() {
    const cx = W * 0.5, cy = H * 0.5
    ctx!.font = `11px ${F_MONO}`
    ctx!.textAlign = "center"; ctx!.textBaseline = "middle"
    for (let i = 0; i < TUNNEL_RINGS; i++) {
      tunnelZ[i] -= 0.5
      if (tunnelZ[i] < 10) {
        tunnelZ[i] += TUNNEL_DEPTH; tunnelSide[i] = (tunnelSide[i] + 1) % 4
        tunnelTextIdx[i] = (Math.random() * TUNNEL_FRAGMENTS.length) | 0
      }
      const scale = 400 / (400 + tunnelZ[i])
      const alpha = Math.max(0, Math.min(0.06, 0.075 * scale - 0.01))
      if (alpha < 0.003) continue
      const spread = 350 * scale
      let x: number, y: number
      const s = tunnelSide[i]
      if (s === 0) { x = cx; y = cy - spread }
      else if (s === 1) { x = cx + spread; y = cy }
      else if (s === 2) { x = cx; y = cy + spread }
      else { x = cx - spread; y = cy }
      ctx!.globalAlpha = alpha
      ctx!.fillStyle = COL_DIM
      ctx!.fillText(TUNNEL_FRAGMENTS[tunnelTextIdx[i]], x, y)
    }
    ctx!.globalAlpha = 1
  }

  // Debris
  type Debris = { x: number; y: number; vx: number; vy: number; hp: number; shape: DebrisKind["shape"]; size: number; color: string; phase: number; dying: boolean; deathTimer: number; kind: number }
  const debris: Debris[] = []
  function spawnDebris() {
    const ki = (Math.random() * DEBRIS_KINDS.length) | 0; const k = DEBRIS_KINDS[ki]
    const edge = (Math.random() * 4) | 0
    let x = 0, y = 0
    if (edge === 0) { x = -30; y = Math.random() * H }
    else if (edge === 1) { x = W + 30; y = Math.random() * H }
    else if (edge === 2) { x = Math.random() * W; y = -30 }
    else { x = Math.random() * W; y = H + 30 }
    debris.push({ x, y, vx: (Math.random() - 0.5) * k.speed * 2, vy: (Math.random() - 0.5) * k.speed * 2, hp: k.hp, shape: k.shape, size: k.size, color: k.color, phase: Math.random() * Math.PI * 2, dying: false, deathTimer: 0, kind: ki })
  }
  function updateDebris(dt: number, time: number) {
    if (!cfg.showDebris) return
    let alive = 0
    for (let i = 0; i < debris.length; i++) if (!debris[i].dying) alive++
    while (alive < cfg.debrisCount) { spawnDebris(); alive++ }
    for (let i = debris.length - 1; i >= 0; i--) {
      const e = debris[i]
      if (e.dying) {
        e.deathTimer -= dt; e.x += e.vx; e.y += e.vy; e.vx *= 0.95; e.vy *= 0.95
        if (e.deathTimer <= 0) { debris[i] = debris[debris.length - 1]; debris.pop() }
        continue
      }
      const spd = cfg.debrisSpeed
      if (e.kind === 2) {
        e.x += Math.sin(time * 1.5 + e.phase) * spd * 1.2
        e.y += Math.cos(time * 1.2 + e.phase * 1.3) * spd * 0.8
      } else if (e.kind === 1) {
        e.x += e.vx * spd; e.y += e.vy * spd
        if (Math.random() < dt * 0.5) { e.vx += (Math.random() - 0.5) * 3; e.vy += (Math.random() - 0.5) * 3 }
        e.vx *= 0.99; e.vy *= 0.99
      } else {
        e.vx += (W / 2 - e.x) * 0.0001 + (Math.random() - 0.5) * 0.1
        e.vy += (H / 2 - e.y) * 0.0001 + (Math.random() - 0.5) * 0.1
        e.vx *= 0.995; e.vy *= 0.995
        e.x += e.vx * spd; e.y += e.vy * spd
      }
      if (e.x < -50) e.x = W + 40; if (e.x > W + 50) e.x = -40
      if (e.y < -50) e.y = H + 40; if (e.y > H + 50) e.y = -40
      const dx = e.x - ufoX, dy = e.y - ufoY, dSq = dx * dx + dy * dy
      if (dSq < 15000) {
        const d = Math.sqrt(dSq) || 1; const fl = 1.5 * (1 - d / 122)
        e.vx += (dx / d) * fl; e.vy += (dy / d) * fl
      }
    }
  }
  function hitDebrisWithBeam(fx: number, fy: number) {
    if (!cfg.showDebris) return
    const hr = cfg.beamRadius * 0.6, hrSq = hr * hr
    for (const e of debris) {
      if (e.dying) continue
      const dx = e.x - fx, dy = e.y - fy, dSq = dx * dx + dy * dy
      if (dSq < hrSq) {
        const d = Math.sqrt(dSq) || 1
        e.hp--
        e.vx += (dx / d) * 5; e.vy += (dy / d) * 5
        if (e.hp <= 0) {
          e.dying = true; e.deathTimer = 0.5; e.vx = (dx / d) * 8; e.vy = (dy / d) * 8 - 3
          for (let j = 0; j < 3; j++) spawnEmber(e.x, e.y)
        }
      }
    }
  }
  function drawDebris(time: number) {
    if (!cfg.showDebris) return
    ctx!.textAlign = "center"; ctx!.textBaseline = "middle"
    for (const e of debris) {
      if (e.dying) {
        const t = e.deathTimer / 0.5
        ctx!.save(); ctx!.translate(e.x, e.y); ctx!.rotate(time * 15); ctx!.scale(t, t)
        ctx!.globalAlpha = t * 0.8; ctx!.strokeStyle = "#FF9292"
        ctx!.lineWidth = Math.max(1, e.size * 0.12)
        drawDebrisShape(ctx!, e.shape, e.size)
        ctx!.restore()
      } else {
        const bob = Math.sin(time * 2.5 + e.phase) * 4
        ctx!.save(); ctx!.translate(e.x, e.y + bob)
        ctx!.globalAlpha = e.kind === 2 ? 0.4 + Math.sin(time * 3 + e.phase) * 0.2 : 0.75
        ctx!.strokeStyle = e.color
        ctx!.lineWidth = Math.max(1, e.size * 0.12)
        drawDebrisShape(ctx!, e.shape, e.size)
        ctx!.restore()
      }
    }
    ctx!.globalAlpha = 1
  }

  // Stars
  const STAR_N = 25
  const starX = new Float32Array(STAR_N), starY = new Float32Array(STAR_N), starSpd = new Float32Array(STAR_N), starPhase = new Float32Array(STAR_N), starSz = new Float32Array(STAR_N), starOp = new Float32Array(STAR_N)
  const starC: string[] = []
  for (let i = 0; i < STAR_N; i++) {
    starX[i] = Math.random() * (W || 1); starY[i] = Math.random() * (H || 1)
    starSpd[i] = 0.1 + Math.random() * 0.4; starPhase[i] = Math.random() * Math.PI * 2
    starSz[i] = 10 + Math.random() * 10; starOp[i] = 0.05 + Math.random() * 0.1
    starC[i] = STAR_CHARS[(Math.random() * STAR_CHARS.length) | 0]
  }
  function drawStars(time: number) {
    if (!cfg.showStars) return
    ctx!.fillStyle = COL_STAR; ctx!.textAlign = "center"; ctx!.textBaseline = "middle"
    for (let i = 0; i < STAR_N; i++) {
      starY[i] -= starSpd[i]
      if (starY[i] < -30) { starY[i] = H + 30; starX[i] = Math.random() * W }
      ctx!.globalAlpha = starOp[i] * (0.5 + Math.sin(time * 0.4 + starPhase[i]) * 0.5)
      ctx!.font = `${starSz[i]}px ${F_MONO}`
      ctx!.fillText(starC[i], starX[i] + Math.sin(time * 0.7 + starPhase[i]) * 10, starY[i])
    }
    ctx!.globalAlpha = 1
  }

  // UFO Base Drawing
  function drawUFO(time: number) {
    const sc = cfg.ufoScale * responsiveScale()
    const x = ufoX, y = ufoY
    const bob = Math.sin(time * 1.8) * 4 * sc

    ctx!.save()
    ctx!.translate(x, y + bob)

    // Glow: recreate only when isBeaming or scale changes (not every frame)
    if (isBeaming !== lastIsBeaming || sc !== lastGradSc) {
      const glowR = 70 * sc
      cachedGlowGrad = ctx!.createRadialGradient(0, 0, 10, 0, 0, glowR)
      cachedGlowGrad.addColorStop(0, isBeaming ? "rgba(255, 146, 146, 0.30)" : "rgba(254, 231, 200, 0.12)")
      cachedGlowGrad.addColorStop(1, "rgba(0,0,0,0)")

      // Body and dome gradients: static, only recreate on scale change
      if (sc !== lastGradSc) {
        cachedBodyGrad = ctx!.createRadialGradient(-10 * sc, -5 * sc, 2, 0, 0, 55 * sc)
        cachedBodyGrad.addColorStop(0, "#4a2a5e")
        cachedBodyGrad.addColorStop(0.4, "#2d163d")
        cachedBodyGrad.addColorStop(1, "#180924")

        cachedDomeGrad = ctx!.createRadialGradient(-8 * sc, -18 * sc, 2, 0, -12 * sc, 26 * sc)
        cachedDomeGrad.addColorStop(0, "rgba(255, 146, 146, 0.45)")
        cachedDomeGrad.addColorStop(0.5, "rgba(24, 9, 36, 0.85)")
        cachedDomeGrad.addColorStop(1, "rgba(24, 9, 36, 0.95)")

        lastGradSc = sc
      }
      lastIsBeaming = isBeaming
    }

    const glowR = 70 * sc
    ctx!.globalAlpha = 1; ctx!.fillStyle = cachedGlowGrad!
    ctx!.beginPath(); ctx!.ellipse(0, 0, glowR, glowR * 0.5, 0, 0, Math.PI * 2); ctx!.fill()

    const nLights = 8, ringR = 44 * sc
    for (let i = 0; i < nLights; i++) {
      const a = (i / nLights) * Math.PI * 2 + time * 1.4
      const lx = Math.cos(a) * ringR, ly = Math.sin(a) * ringR * 0.35
      const phase = Math.sin(time * 4 + i * 1.1)
      ctx!.globalAlpha = 0.5 + phase * 0.3
      ctx!.fillStyle = phase > 0 ? "#FEE7C8" : "#FF9292"
      ctx!.beginPath(); ctx!.arc(lx, ly, 2.5 * sc, 0, Math.PI * 2); ctx!.fill()
    }

    ctx!.globalAlpha = 0.25; ctx!.fillStyle = "#000"
    ctx!.beginPath(); ctx!.ellipse(0, 6 * sc, 52 * sc, 14 * sc, 0, 0, Math.PI * 2); ctx!.fill()

    ctx!.globalAlpha = 0.92; ctx!.fillStyle = cachedBodyGrad!
    ctx!.beginPath(); ctx!.ellipse(0, 0, 52 * sc, 16 * sc, 0, 0, Math.PI * 2); ctx!.fill()

    ctx!.globalAlpha = 0.55; ctx!.strokeStyle = "#FF9292"
    ctx!.lineWidth = 1.5 * sc
    ctx!.beginPath(); ctx!.ellipse(0, 0, 52 * sc, 16 * sc, 0, 0, Math.PI * 2); ctx!.stroke()

    ctx!.globalAlpha = 0.85; ctx!.fillStyle = cachedDomeGrad!
    ctx!.beginPath(); ctx!.ellipse(0, -8 * sc, 28 * sc, 22 * sc, 0, Math.PI, 0); ctx!.fill()

    ctx!.globalAlpha = 0.45; ctx!.strokeStyle = "#FEE7C8"
    ctx!.lineWidth = 1 * sc
    ctx!.beginPath(); ctx!.ellipse(0, -8 * sc, 28 * sc, 22 * sc, 0, Math.PI, 0); ctx!.stroke()

    if (cfg.showAntenna) {
      const antH = 18 * sc
      ctx!.globalAlpha = 0.7; ctx!.strokeStyle = "#FF9292"; ctx!.lineWidth = 1.5 * sc
      ctx!.beginPath(); ctx!.moveTo(0, -30 * sc); ctx!.lineTo(0, -30 * sc - antH); ctx!.stroke()
      const blink = 0.4 + Math.sin(time * 6) * 0.4
      ctx!.globalAlpha = blink; ctx!.fillStyle = "#FEE7C8"
      ctx!.beginPath(); ctx!.arc(0, -30 * sc - antH, 3.5 * sc, 0, Math.PI * 2); ctx!.fill()
    }
    ctx!.restore()
  }

  function drawCursor(time: number) {
    if (!cfg.showCursor) return
    const mx = pointer.x, my = pointer.y
    ctx!.save(); ctx!.translate(mx, my); ctx!.rotate(time * 0.5)
    ctx!.globalAlpha = 0.3; ctx!.strokeStyle = "#FF9292"; ctx!.lineWidth = 1
    ctx!.beginPath(); ctx!.arc(0, 0, 14, 0, Math.PI * 0.5); ctx!.stroke()
    ctx!.beginPath(); ctx!.arc(0, 0, 14, Math.PI, Math.PI * 1.5); ctx!.stroke()
    ctx!.restore()
    ctx!.globalAlpha = isBeaming ? 0.9 : 0.5
    ctx!.fillStyle = isBeaming ? "#FEE7C8" : "#FF9292"
    ctx!.beginPath(); ctx!.arc(mx, my, isBeaming ? 3 : 2, 0, Math.PI * 2); ctx!.fill()
    ctx!.globalAlpha = 1
  }

  // ─── Main Loop ─────────────────────────────────────────────────────────────
  let lastTime = performance.now(), time = 0

  function frame(now: number) {
    const dt = Math.min((now - lastTime) / 1000, 0.05)
    lastTime = now; time += dt

    updateShake()
    ctx!.save()
    ctx!.translate(shakeX, shakeY)
    ctx!.clearRect(0, 0, W, H)
    drawTunnel()
    drawStars(time)
    updateUFO()
    interactLetters(dt)
    emitBeam(dt)
    updateParticlesAndEmbers(dt)
    updateDebris(dt, time)
    drawLetters()
    drawDebris(time)
    drawParticles()
    drawUFO(time)
    drawCursor(time)
    ctx!.restore()

    rafId = requestAnimationFrame(frame)
  }

  initialized = true
  layoutAllText()
  rafId = requestAnimationFrame(frame)

})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  if (ro) ro.disconnect()
})
</script>

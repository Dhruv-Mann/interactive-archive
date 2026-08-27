<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050508]">
    <!-- Real-time 21st.dev Phyrs ASCII / Dither Canvas2D Shader -->
    <canvas
      ref="canvasRef"
      class="w-full h-full object-cover block opacity-75 mix-blend-screen transition-opacity duration-700"
    ></canvas>

    <!-- Post-Effect Vignette Layer (PFX intensity: 38) -->
    <div class="absolute inset-0 cyber-vignette pointer-events-none"></div>

    <!-- Scanline Subtle Texture -->
    <div class="absolute inset-0 cyber-scanlines opacity-15 pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    cellSize?: number
    brightness?: number
    contrast?: number
    animSpeed?: number
    animIntensity?: number
  }>(),
  {
    cellSize: 18,
    brightness: 12,
    contrast: 115,
    animSpeed: 100,
    animIntensity: 60,
  }
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animRaf: number | null = null
let mousePos = { x: -1000, y: -1000 }

// 4x4 Bayer Ordered Dithering Matrix (normalized to [0, 1])
const BAYER_4X4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16],
]

// Extended Cyber ASCII characters
const ASCII_CHARS = [' ', '·', ':', '+', '*', '%', '#', '■', '█']

const initCanvas = () => {
  if (typeof window === 'undefined') return
  const canvas = canvasRef.value
  if (!canvas) return

  const isMobile = window.innerWidth < 768
  const step = isMobile ? props.cellSize * 1.3 : props.cellSize

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  startRenderLoop(step)
}

const startRenderLoop = (step: number) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let lastTime = performance.now()
  const fps = window.innerWidth < 768 ? 30 : 60
  const interval = 1000 / fps

  const render = (now: number) => {
    const elapsed = now - lastTime

    if (elapsed > interval) {
      lastTime = now - (elapsed % interval)

      const w = canvas.width
      const h = canvas.height
      const t = (now * 0.001 * props.animSpeed) / 100
      const waveStrength = (props.animIntensity / 100) * 0.45

      // 1. Clear background to dark void
      ctx.fillStyle = '#050508'
      ctx.fillRect(0, 0, w, h)

      const cols = Math.ceil(w / step)
      const rows = Math.ceil(h / step)

      // 2. Render 21st.dev Phyrs ASCII / Dither Grid
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * step
          const y = r * step

          // Mathematical procedural scene raster (cyber waves + diagonal flow + harmonic rings)
          const nx = c / cols
          const ny = r / rows

          // Primary undulating wave harmonics
          const wave1 = Math.sin(c * 0.12 + t * 1.5) * Math.cos(r * 0.1 - t * 0.8)
          const wave2 = Math.sin((c + r) * 0.08 + t * 2.0)
          const wave3 = Math.cos(Math.hypot(c - cols / 2, r - rows / 2) * 0.14 - t * 2.2)

          let lum = (wave1 * 0.35 + wave2 * 0.35 + wave3 * 0.3) * waveStrength + 0.38

          // Dynamic Cursor Proximity Ripple Field
          const dist = Math.hypot(x - mousePos.x, y - mousePos.y)
          if (dist < 320) {
            const ripple = (1 - dist / 320) * 0.65
            lum += ripple
          }

          // Apply contrast & brightness formula
          lum = Math.min(1, Math.max(0, lum))

          // Bayer 4x4 Dither Thresholding
          const threshold = BAYER_4X4[r % 4][c % 4]

          if (lum > threshold * 0.75) {
            const intensity = (lum - threshold * 0.75) / (1 - threshold * 0.75)

            // Dynamic Cyber Palette Blending:
            // Top: Neon Chartreuse (#CCFF00)
            // Mid: Electric Cyan (#00F0FF)
            // Ambient: Blue / Violet (#3CA6FF)
            if (intensity > 0.65) {
              ctx.fillStyle = '#CCFF00'
              ctx.shadowColor = '#CCFF00'
              ctx.shadowBlur = 6
            } else if (intensity > 0.35) {
              ctx.fillStyle = '#00F0FF'
              ctx.shadowColor = '#00F0FF'
              ctx.shadowBlur = 4
            } else {
              ctx.fillStyle = '#3CA6FF'
              ctx.shadowColor = 'transparent'
              ctx.shadowBlur = 0
            }

            // Draw dithered square block with dynamic scaling
            const size = Math.max(2, (step - 4) * intensity)
            const offX = (step - size) / 2
            const offY = (step - size) / 2

            ctx.fillRect(x + offX, y + offY, size, size)

            // Draw center ASCII punctuation glyph for high intensity nodes
            if (intensity > 0.8 && step >= 14) {
              ctx.fillStyle = '#FFFFFF'
              ctx.font = `${Math.floor(step * 0.6)}px monospace`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              const charIdx = Math.min(ASCII_CHARS.length - 1, Math.floor(intensity * ASCII_CHARS.length))
              ctx.fillText(ASCII_CHARS[charIdx], x + step / 2, y + step / 2)
            }
          }
        }
      }
    }

    animRaf = requestAnimationFrame(render)
  }

  animRaf = requestAnimationFrame(render)
}

const onMouseMove = (e: MouseEvent) => {
  mousePos.x = e.clientX
  mousePos.y = e.clientY
}

const onTouchMove = (e: TouchEvent) => {
  if (e.touches && e.touches[0]) {
    mousePos.x = e.touches[0].clientX
    mousePos.y = e.touches[0].clientY
  }
}

const handleResize = () => {
  if (animRaf) cancelAnimationFrame(animRaf)
  initCanvas()
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    initCanvas()
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
  }
})

onUnmounted(() => {
  if (animRaf) cancelAnimationFrame(animRaf)
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.cyber-vignette {
  background: radial-gradient(
    circle at center,
    transparent 35%,
    rgba(5, 5, 8, 0.45) 70%,
    rgba(5, 5, 8, 0.92) 100%
  );
}

.cyber-scanlines {
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.03) 0px,
    rgba(255, 255, 255, 0.03) 1px,
    transparent 1px,
    transparent 3px
  );
}
</style>

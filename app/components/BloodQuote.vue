<template>
  <div 
    class="pink-sweep-sheet" 
    :class="{ 'red-mode': isBloodHovered }"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <!-- Blood Droplets Canvas Layer -->
    <canvas ref="dropletsCanvasRef" class="blood-droplets-canvas" />

    <!-- Blade Slice Sparks Canvas Layer -->
    <canvas ref="sliceCanvasRef" class="slice-canvas" />

    <div 
      class="quote-editorial-wrapper font-display"
      :style="{
        transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }"
    >
      <div class="quote-line">
        <span class="phrase-medium">Giving up is not</span>
      </div>
      <div class="quote-line">
        <span class="phrase-medium">in the</span>
      </div>
      <div class="quote-line">
        <span 
          ref="bloodWordRef"
          class="blood-giant"
          :style="{
            transform: `scale(${kineticScale})`,
            fontWeight: kineticWeight,
            letterSpacing: `${kineticSpacing}em`
          }"
        >
          BLOOD
        </span>
        <span class="sir-delicate">, sir.</span>
      </div>
    </div>

    <!-- Interactive Terminal Box -->
    <div class="terminal-box" :style="{ transform: `perspective(1200px) rotateX(${tiltX * -0.3}deg) rotateY(${tiltY * -0.3}deg)` }">
      <div class="terminal-header">
        <div class="terminal-dots">
          <span class="dot bg-[#FF2A5F]"></span>
          <span class="dot bg-[#FEE7C8]"></span>
          <span class="dot bg-[#C5C1C1]"></span>
        </div>
        <div class="terminal-title">root@unmanaged:~</div>
      </div>
      <div class="terminal-body font-mono">
        <div class="cmd-line">
          <span class="prompt">root@unmanaged:~$</span> <span class="cmd">ls -la ./directives</span>
        </div>
        <div class="cmd-output">
          <button @click="scrollToSection('core-syndicate')" class="term-link bg-transparent border-none text-left">> CONTACT_US.exe</button>
          <button @click="scrollToSection('core-syndicate')" class="term-link bg-transparent border-none text-left">> MEET_THE_TEAM.sh</button>
          <button @click="scrollToSection('events-archive')" class="term-link bg-transparent border-none text-left">> VIEW_ARCHIVES.log</button>
        </div>
        <div class="cmd-line mt-3">
          <span class="prompt">root@unmanaged:~$</span> <span class="cursor animate-pulse">_</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isBloodHovered = ref(false)
const dropletsCanvasRef = ref<HTMLCanvasElement | null>(null)
const sliceCanvasRef = ref<HTMLCanvasElement | null>(null)
const bloodWordRef = ref<HTMLElement | null>(null)

let dropletRafId: number | null = null
let sliceRafId: number | null = null
let sectionVisible = false  // IntersectionObserver gate for both RAF loops
let sectionObserver: IntersectionObserver | null = null

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// 1. 3D Parallax Tilt State
const tiltX = ref(0)
const tiltY = ref(0)

// 2. Kinetic Variable Font Proximity States
const kineticWeight = ref(900)
const kineticSpacing = ref(-0.04)
const kineticScale = ref(1)

// 3. Blade Slice Tracking
const isMouseDown = ref(false)
let lastMouseX = 0
let lastMouseY = 0

interface SliceParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}
let sliceParticles: SliceParticle[] = []
interface SliceTrail {
  x: number
  y: number
  alpha: number
}
let sliceTrail: SliceTrail[] = []

function updateBloodHover(mx: number, my: number) {
  const r1 = bloodWordRef.value?.getBoundingClientRect()
  const pad = 32

  const inWord1 = r1 && (mx >= r1.left - pad && mx <= r1.right + pad && my >= r1.top - pad && my <= r1.bottom + pad)

  isBloodHovered.value = !!inWord1
}

function handleMouseMove(e: MouseEvent) {
  const { innerWidth, innerHeight } = window
  const mouseX = e.clientX
  const mouseY = e.clientY

  tiltX.value = (-(mouseY - innerHeight / 2) / (innerHeight / 2)) * 8
  tiltY.value = ((mouseX - innerWidth / 2) / (innerWidth / 2)) * 8

  updateKineticFont(mouseX, mouseY, bloodWordRef.value, kineticWeight, kineticSpacing, kineticScale)
  updateBloodHover(mouseX, mouseY)

  const dx = mouseX - lastMouseX
  const dy = mouseY - lastMouseY
  const speed = Math.sqrt(dx * dx + dy * dy)

  sliceTrail.push({ x: mouseX, y: mouseY, alpha: 1.0 })
  if (sliceTrail.length > 25) sliceTrail.shift()

  if (speed > 16) {
    for (let i = 0; i < 3; i++) {
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8
      const sparkSpeed = 3 + Math.random() * 7
      sliceParticles.push({
        x: mouseX,
        y: mouseY,
        vx: Math.cos(angle) * sparkSpeed,
        vy: Math.sin(angle) * sparkSpeed,
        life: 1.0,
        color: Math.random() > 0.4 ? '#FF2A5F' : '#ffffff'
      })
    }
  }

  lastMouseX = mouseX
  lastMouseY = mouseY
}

function updateKineticFont(
  mx: number,
  my: number,
  el: HTMLElement | null,
  weightRef: { value: number },
  spacingRef: { value: number },
  scaleRef: { value: number }
) {
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)

  const maxDist = 280
  if (dist < maxDist) {
    const factor = 1 - dist / maxDist
    weightRef.value = Math.round(900 + factor * 100)
    spacingRef.value = -0.04 + factor * 0.08
    scaleRef.value = 1 + factor * 0.07
  } else {
    weightRef.value = 900
    spacingRef.value = -0.04
    scaleRef.value = 1
  }
}

function handleMouseDown() { isMouseDown.value = true }
function handleMouseUp() { isMouseDown.value = false }

interface BloodDroplet {
  x: number
  y: number
  radius: number
  length: number
  speed: number
  opacity: number
  color: string
}
let droplets: BloodDroplet[] = []

function initDroplets() {
  const canvas = dropletsCanvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement
  canvas.width = parent ? parent.clientWidth : window.innerWidth
  canvas.height = parent ? parent.clientHeight : window.innerHeight

  const sliceCanvas = sliceCanvasRef.value
  if (sliceCanvas) {
    sliceCanvas.width = parent ? parent.clientWidth : window.innerWidth
    sliceCanvas.height = parent ? parent.clientHeight : window.innerHeight
  }

  droplets = []
  const count = 42
  const darkRedShades = ['#800014', '#5A000D', '#9A0019', '#3D0008', '#6B0010']

  for (let i = 0; i < count; i++) {
    droplets.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 3 + Math.random() * 9,
      length: 10 + Math.random() * 26,
      speed: 1.2 + Math.random() * 2.8,
      opacity: 0.75 + Math.random() * 0.25,
      color: darkRedShades[Math.floor(Math.random() * darkRedShades.length)]
    })
  }
}

function renderDroplets() {
  const canvas = dropletsCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (isBloodHovered.value && sectionVisible) {
    // Performance: reset shadow once before loop — avoids leaking shadow state
    // to subsequent draws. shadowBlur removed from per-droplet path: it forces
    // a GPU blur composite per draw call at 60fps which is the heaviest cost here.
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0

    droplets.forEach(d => {
      d.y += d.speed

      if (d.y > canvas.height + 40) {
        d.y = -30
        d.x = Math.random() * canvas.width
      }

      ctx.save()
      ctx.globalAlpha = d.opacity
      ctx.fillStyle = d.color

      ctx.beginPath()
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI)
      ctx.lineTo(d.x, d.y - d.length)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.beginPath()
      ctx.arc(d.x - d.radius * 0.3, d.y - d.radius * 0.15, d.radius * 0.32, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    })
  }

  dropletRafId = requestAnimationFrame(renderDroplets)
}

function renderSliceCanvas() {
  const canvas = sliceCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (sliceTrail.length > 1) {
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = '#FF2A5F'
    ctx.lineWidth = 2.5
    ctx.shadowColor = '#FF2A5F'
    ctx.shadowBlur = 12

    for (let i = 0; i < sliceTrail.length; i++) {
      const pt = sliceTrail[i]
      pt.alpha -= 0.04
      if (i === 0) ctx.moveTo(pt.x, pt.y)
      else ctx.lineTo(pt.x, pt.y)
    }
    ctx.stroke()
    ctx.restore()
    
    sliceTrail = sliceTrail.filter(p => p.alpha > 0)
  }

  for (let i = sliceParticles.length - 1; i >= 0; i--) {
    const pt = sliceParticles[i]
    pt.x += pt.vx
    pt.y += pt.vy
    pt.life -= 0.035

    if (pt.life <= 0) {
      sliceParticles.splice(i, 1)
    } else {
      ctx.save()
      ctx.globalAlpha = Math.max(0, pt.life)
      ctx.fillStyle = pt.color
      ctx.shadowColor = pt.color
      ctx.shadowBlur = 8
      ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3)
      ctx.restore()
    }
  }

  sliceRafId = requestAnimationFrame(renderSliceCanvas)
}

function handleResize() {
  initDroplets()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  setTimeout(() => {
    initDroplets()
  }, 100)
  dropletRafId = requestAnimationFrame(renderDroplets)
  sliceRafId = requestAnimationFrame(renderSliceCanvas)

  // Gate both RAF loops via IntersectionObserver.
  // When BloodQuote is off-screen the loops still run but immediately return
  // after clearRect — which is cheap. However, when sectionVisible is false
  // we can skip even that. The loops are kept alive so they resume instantly
  // on re-entry without needing to restart RAF chains.
  const el = dropletsCanvasRef.value?.parentElement
  if (el) {
    sectionObserver = new IntersectionObserver(
      ([entry]) => { sectionVisible = entry.isIntersecting },
      { rootMargin: '100px 0px' }
    )
    sectionObserver.observe(el)
  }
})

onBeforeUnmount(() => {
  if (dropletRafId) cancelAnimationFrame(dropletRafId)
  if (sliceRafId) cancelAnimationFrame(sliceRafId)
  sectionObserver?.disconnect()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.pink-sweep-sheet {
  position: relative;
  width: 100%;
  height: 100dvh;
  z-index: 50;
  background: radial-gradient(circle at 50% 50%, #240b12 0%, #0d0506 65%, #000000 100%);
  border-top: 3px solid #AE3B8B;
  box-shadow: 0 -20px 90px rgba(0, 0, 0, 0.95), inset 0 0 140px rgba(174, 59, 139, 0.3);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10vh 8vw;
  overflow: hidden;
  transition: background 0.42s cubic-bezier(0.16, 1, 0.3, 1), 
              border-color 0.42s ease, 
              box-shadow 0.42s ease;
}

.blood-droplets-canvas,
.slice-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.slice-canvas {
  z-index: 25;
}

.pink-sweep-sheet.red-mode {
  background: radial-gradient(circle at 50% 50%, #FF2A5F 0%, #B30030 55%, #5E0018 100%);
  border-top-color: #ffffff;
  box-shadow: 0 0 140px rgba(255, 42, 95, 0.85), inset 0 0 160px rgba(255, 255, 255, 0.25);
}

.quote-editorial-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(8px, 1.5vw, 16px);
  text-align: left;
  max-width: 1400px;
  transform-style: preserve-3d;
  will-change: transform;
}

.quote-line {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: clamp(12px, 2vw, 24px);
  flex-wrap: wrap;
  line-height: 1;
  transform-style: preserve-3d;
}

.phrase-medium,
.blood-giant,
.sir-delicate {
  will-change: transform, font-weight, letter-spacing;
  transition: color 0.4s ease;
}

.phrase-medium {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  color: #FAFAFA;
  opacity: 0.94;
}

.blood-giant {
  font-size: clamp(4rem, 10vw, 8rem);
  font-family: 'Archivo Black', system-ui, sans-serif;
  font-weight: 900;
  color: #FF2A5F;
  text-shadow: 0 0 32px rgba(255, 42, 95, 0.95),
               0 0 70px rgba(255, 42, 95, 0.55),
               0 0 110px rgba(174, 59, 139, 0.45);
  text-transform: uppercase;
  cursor: pointer;
  display: inline-block;
  line-height: 0.8;
}

.pink-sweep-sheet.red-mode .blood-giant {
  color: #000000;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.9), 0 0 60px rgba(255, 255, 255, 0.5);
}

.sir-delicate {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-style: italic;
  color: #E17888;
  margin-bottom: 0.5em; /* Optical alignment with giant text baseline */
}

.pink-sweep-sheet.red-mode .sir-delicate {
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
}

/* Terminal Box */
.terminal-box {
  position: absolute;
  bottom: 8vh;
  right: 8vw;
  width: min(90vw, 560px);
  background: rgba(10, 2, 4, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 42, 95, 0.3);
  border-radius: 8px;
  z-index: 10;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 42, 95, 0.15);
  overflow: hidden;
  will-change: transform;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(255, 42, 95, 0.1);
  border-bottom: 1px solid rgba(255, 42, 95, 0.2);
}

.terminal-dots {
  display: flex;
  gap: 12px;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  opacity: 0.8;
}

.terminal-title {
  font-family: 'Space Mono', monospace;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
}

.terminal-body {
  padding: 28px;
  font-size: 20px;
  color: #E17888;
  line-height: 1.7;
}

.prompt {
  color: #FF2A5F;
  margin-right: 8px;
}

.cmd {
  color: #FAFAFA;
}

.cmd-output {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding-left: 16px;
  border-left: 2px solid rgba(255, 42, 95, 0.3);
}

.term-link {
  color: #E17888;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  display: block;
}

.term-link:hover {
  color: #FFFFFF;
  text-shadow: 0 0 8px #FF2A5F;
  transform: translateX(4px);
}

.cursor {
  display: inline-block;
  width: 14px;
  height: 22px;
  background-color: #FF2A5F;
  vertical-align: middle;
}
</style>

<template>
  <!-- Crosshair lines: fixed to viewport, visible only in Phase 4 -->
  <Teleport to="body">
    <Transition name="tc-snap">
      <div v-if="active" class="team-crosshair-root">
      <!-- Turbulence SVG filters -->
      <svg class="team-crosshair-svg" aria-hidden="true">
        <defs>
          <filter id="tcf-noise-x">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref="filterXRef" />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="tcf-noise-y">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref="filterYRef" />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>

      <!-- Horizontal line -->
      <div
        ref="lineHRef"
        class="tc-line tc-line--h"
        :style="{ opacity: linesOpacity }"
      />
      <!-- Vertical line -->
      <div
        ref="lineVRef"
        class="tc-line tc-line--v"
        :style="{ opacity: linesOpacity }"
      />
    </div>
    </Transition>

    <!-- Hover info card -->
    <Transition name="tc-card">
      <div
        v-if="active && hoveredMember"
        class="tc-card"
        :style="{ left: `${rawMouse.x + 28}px`, top: `${rawMouse.y}px` }"
      >
        <span class="tc-card-role">{{ hoveredMember.role }}</span>
        <h3 class="tc-card-name">{{ hoveredMember.name }}</h3>
        <div class="tc-card-divider" />
        <p class="tc-card-quote">"{{ hoveredMember.quote ?? hoveredMember.bio.split('.')[0] }}"</p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import type { TeamMember } from '~/types'

interface Props {
  active?: boolean
  duplicateIconEls?: HTMLElement[]
  members?: TeamMember[]
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  duplicateIconEls: () => [],
  members: () => []
})

const filterXRef = ref<SVGFETurbulenceElement | null>(null)
const filterYRef = ref<SVGFETurbulenceElement | null>(null)
const lineHRef = ref<HTMLDivElement | null>(null)
const lineVRef = ref<HTMLDivElement | null>(null)

const rawMouse   = reactive({ x: 0, y: 0 })
const smoothPos  = { x: 0, y: 0 }
const linesOpacity = ref(0)
const hoveredMember = ref<TeamMember | null>(null)

let rafId: number | null = null
let turbValue = { v: 0 }
let turbRafId: number | null = null

// ── Smooth lerp loop ──────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function startSmoothLoop() {
  const tick = () => {
    smoothPos.x = lerp(smoothPos.x, rawMouse.x, 0.14)
    smoothPos.y = lerp(smoothPos.y, rawMouse.y, 0.14)
    if (lineHRef.value) lineHRef.value.style.top = `${smoothPos.y}px`
    if (lineVRef.value) lineVRef.value.style.left = `${smoothPos.x}px`
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}

function stopSmoothLoop() {
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
}

// ── Turbulence glitch ─────────────────────────────────────────────
function triggerGlitch() {
  turbValue.v = 1
  const decay = () => {
    turbValue.v *= 0.85
    filterXRef.value?.setAttribute('baseFrequency', turbValue.v.toFixed(6))
    filterYRef.value?.setAttribute('baseFrequency', turbValue.v.toFixed(6))
    if (turbValue.v > 0.0001) {
      turbRafId = requestAnimationFrame(decay)
    } else {
      filterXRef.value?.setAttribute('baseFrequency', '0.000001')
      filterYRef.value?.setAttribute('baseFrequency', '0.000001')
      if (lineHRef.value) lineHRef.value.style.filter = 'none'
      if (lineVRef.value) lineVRef.value.style.filter = 'none'
    }
  }
  if (lineHRef.value) lineHRef.value.style.filter = 'url(#tcf-noise-x)'
  if (lineVRef.value) lineVRef.value.style.filter = 'url(#tcf-noise-y)'
  turbRafId = requestAnimationFrame(decay)
}

// ── Mouse handler (global) ────────────────────────────────────────
function onMouseMove(e: MouseEvent) {
  rawMouse.x = e.clientX
  rawMouse.y = e.clientY
  linesOpacity.value = 1

  if (!props.active || !props.duplicateIconEls.length) {
    hoveredMember.value = null
    return
  }

  let found: TeamMember | null = null
  let foundIdx = -1
  for (let i = 0; i < props.duplicateIconEls.length; i++) {
    const el = props.duplicateIconEls[i]
    if (!el) continue
    const r = el.getBoundingClientRect()
    if (e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top  && e.clientY <= r.bottom) {
      found = props.members[i] ?? null
      foundIdx = i
      break
    }
  }

  // Apply zoom to hovered icon, reset all others
  props.duplicateIconEls.forEach((el, i) => {
    if (!el) return
    if (!el.style.transition) {
      el.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease'
      el.style.zIndex = '60'
    }
    if (i === foundIdx) {
      el.style.transform = 'scale(2)'
      el.style.boxShadow = '0 0 40px rgba(255, 42, 95, 0.6)'
      el.style.zIndex = '70'
    } else {
      el.style.transform = 'scale(1)'
      el.style.boxShadow = 'none'
      el.style.zIndex = '60'
    }
  })

  if (found !== hoveredMember.value) {
    hoveredMember.value = found
    if (found) triggerGlitch()
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────
onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  // Don't start the smooth loop yet — it will be started when active becomes true.
  // This prevents 60 Vue reactive updates/sec on smoothPos for an invisible component.
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  stopSmoothLoop()
  if (turbRafId !== null) cancelAnimationFrame(turbRafId)
})

// Reset zoom on all icons when phase deactivates; start/stop RAF with active state.
watch(() => props.active, (val) => {
  if (val) {
    // Phase 4 just activated — start the smooth loop
    startSmoothLoop()
  } else {
    // Phase deactivated — stop the loop to free the RAF budget
    stopSmoothLoop()
    hoveredMember.value = null
    linesOpacity.value = 0
    // Instantly reset all icon zoom
    props.duplicateIconEls.forEach((el) => {
      if (!el) return
      el.style.transform = 'scale(1)'
      el.style.boxShadow = 'none'
    })
  }
})
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────────────── */
.team-crosshair-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 8000;
}
.team-crosshair-svg {
  position: fixed;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* ── Lines ─────────────────────────────────────────────────── */
.tc-line {
  position: fixed;
  background: rgba(255, 42, 95, 0.65);
  pointer-events: none;
  transition: opacity 0.2s ease;
  will-change: transform;
}
.tc-line--h {
  left: 0;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
}
.tc-line--v {
  top: 0;
  height: 100%;
  width: 2px;
  transform: translateX(-50%);
}

/* ── Info Card ─────────────────────────────────────────────── */
.tc-card {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  width: 196px;
  padding: 16px 18px;
  background: rgba(10, 10, 15, 0.94);
  border: 1px solid rgba(255, 42, 95, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(6px);
  box-shadow:
    0 6px 32px rgba(0, 0, 0, 0.65),
    0 0 18px rgba(255, 42, 95, 0.10),
    inset 0 0 0 0.5px rgba(255,255,255,0.04);
  display: flex;
  flex-direction: column;
  gap: 5px;
  transform: translateY(-50%);
}

.tc-card-role {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #FF2A5F;
}
.tc-card-name {
  font-family: 'Archivo Black', sans-serif;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  margin: 0;
  line-height: 1.15;
}
.tc-card-divider {
  width: 24px;
  height: 1px;
  background: rgba(255, 42, 95, 0.45);
  margin: 3px 0;
}
.tc-card-quote {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 10.5px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
  font-style: italic;
  margin: 0;
}

/* ── Card Transition ───────────────────────────────────────── */
.tc-card-enter-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.tc-card-leave-active { transition: opacity 0.09s ease, transform 0.09s ease; }
.tc-card-enter-from  { opacity: 0; transform: translateY(-50%) translateX(-8px); }
.tc-card-leave-to    { opacity: 0; transform: translateY(-50%) translateX(-8px); }
/* ── Instant snap-off transition (0ms) ─────────────────────── */
.tc-snap-leave-active { transition: none; }
.tc-snap-enter-active { transition: none; }
</style>

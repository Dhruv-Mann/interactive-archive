<template>
  <header ref="heroSectionRef" class="hero-section">
    <div class="poem-outer">
      <div
        ref="contentRef"
        class="content"
        style="display: block; width: 1000px; height: 562px;"
      >
          <!-- Left and Right Hands in the void, outside the screen -->
          <img class="ascii-hand left-hand" src="/images/left-hand.png" alt="" aria-hidden="true" />
          <img class="ascii-hand right-hand" src="/images/right-hand.png" alt="" aria-hidden="true" />

          <!-- All 3D cubes (primary + reflection) anchored here for rAF queries -->
          <div class="container-full-3d">

          <!-- Hue cycle color overlay (matches original filter-animation) -->
          <div class="animated hue" />

          <!-- Background: perspective exhibition room image -->
          <img
            class="backgroundImage"
            src="/images/poem-bg.jpg"
            alt=""
            aria-hidden="true"
            @error="(e) => (e.target as HTMLElement).style.display = 'none'"
          />

          <div class="poem-cube-container" ref="cubeContainerRef">
            <div class="cube">
              <div class="face top" />
              <div class="face bottom" />
              <div class="face left text" v-html="poemHTML" />
              <div class="face right text" v-html="poemHTML" />
              <div class="face front" />
              <div class="face back text" v-html="poemHTML" />
            </div>
          </div>

          <!-- Reflection cube (floor mirror — flipped vertically) -->
          <div class="container-reflect">
            <div class="cube">
              <div class="face top" />
              <div class="face bottom" />
              <div class="face left text" v-html="poemHTML" />
              <div class="face right text" v-html="poemHTML" />
              <div class="face front" />
              <div class="face back text" v-html="poemHTML" />
            </div>
          </div>

          <!-- Foreground: couple silhouette in front of everything -->
          <img
            class="boyImage"
            src="/images/poem-boy.png"
            alt="Couple standing in the exhibition room"
            @error="(e) => (e.target as HTMLElement).style.display = 'none'"
          />

          </div><!-- /.container-full-3d -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRafWhenVisible } from '~/composables/useRafWhenVisible'

// ─── Poem HTML ───────────────────────────────────────────────────────────────
const PHRASE_HTML = '<span class="brand-red">NEXUS</span> — A collective where digital passion is born   ✶   '
// Loop is modulo-based; 12 copies (~30k px) covers every face with headroom.
const REPEAT = 12

const poemHTML = computed((): string => {
  const text = Array.from({ length: REPEAT }, () => PHRASE_HTML).join('')
  return `<p>${text}</p>`
})

// ─── Responsive Scaling ────────────────────────────────────────────────────────────
const contentRef = ref<HTMLElement | null>(null)

const adjustContentSize = (): void => {
  if (!contentRef.value || typeof window === 'undefined') return
  const viewportWidth = window.innerWidth
  const scaleFactor = viewportWidth < 1000
    ? (viewportWidth / 1000) * 0.9
    : Math.min(1, viewportWidth / 1100)
  contentRef.value.style.transform = `scale(${scaleFactor})`
}

// ─── JavaScript rAF Animation (Direct DOM Bypass) ────────────────────────────────
//
// WHY JS INSTEAD OF CSS KEYFRAMES:
// The original CSS approach used 3 different keyframe distances (54000, 54870,
// 55740 px) at the same duration — creating slightly different speeds. The
// faces drift apart continuously and only re-sync at t=83s. This creates
// visible desync throughout the animation.
//
// CORRECT MATH for continuous text across 3 faces:
//   At the back-left corner junction:
//     left face right edge (local x=500) must show same text as back face left edge (x=0)
//     → back must lead left by exactly 500px in the text string
//   At the back-right corner junction:
//     back face right edge (local x=1000) must show same text as right face left edge (x=0)
//     → right must lead back by exactly 1000px → right leads left by 1500px
//
// Solution: all 3 faces at IDENTICAL speed, with fixed initial offsets:
//   LEFT:  offset =    0 px
//   BACK:  offset = +500 px (left face local width)
//   RIGHT: offset = +1500 px (left 500px + back 1000px)
//
// Using rAF + direct DOM manipulation (AGENTS.md: "Direct DOM Bypass for 1:1
// Interactions") keeps us at 60fps without Vue reactivity overhead.

const cubeContainerRef = ref<HTMLElement | null>(null)
const heroSectionRef = ref<HTMLElement | null>(null)

// Per-face paragraph element caches — filled on mount
let leftParagraphs:  HTMLElement[] = []
let backParagraphs:  HTMLElement[] = []
let rightParagraphs: HTMLElement[] = []

// Animation state
let loopWidth  = 80_000  // total text width (measured on mount); safe fallback
let startTs    = 0
const SPEED    = 120     // px/s — 50% faster than original 80px/s

// Precomputed junction offsets (local-space px)
const BACK_LEAD  = 500   // back face leads left by left wall width
const RIGHT_LEAD = 1500  // right face leads left by left(500) + back(1000)

const applyOffsets = (offset: number): void => {
  const lo = -((offset             ) % loopWidth)
  const bo = -((offset + BACK_LEAD ) % loopWidth)
  const ro = -((offset + RIGHT_LEAD) % loopWidth)
  // translate3d stays on the compositor; margin-left would reflow 6 paragraphs / frame.
  for (const p of leftParagraphs)  p.style.transform = `translate3d(${lo}px, -50%, 0)`
  for (const p of backParagraphs)  p.style.transform = `translate3d(${bo}px, -50%, 0)`
  for (const p of rightParagraphs) p.style.transform = `translate3d(${ro}px, -50%, 0)`
}

const tick = (ts: number): void => {
  if (!leftParagraphs.length) return
  if (!startTs) startTs = ts
  applyOffsets(SPEED * ((ts - startTs) / 1000))
}

useRafWhenVisible(heroSectionRef, tick, { rootMargin: '20% 0px' })

const startAnimation = (): void => {
  if (!cubeContainerRef.value) return

  const query = (cls: string): HTMLElement[] =>
    Array.from(cubeContainerRef.value!.querySelectorAll(`.face.${cls}.text p`))
      .filter((el): el is HTMLElement => el instanceof HTMLElement)

  leftParagraphs  = query('left')
  backParagraphs  = query('back')
  rightParagraphs = query('right')

  const sample = leftParagraphs[0]
  if (sample) loopWidth = sample.scrollWidth
}

onMounted(() => {
  if (typeof window === 'undefined') return
  adjustContentSize()
  window.addEventListener('resize', adjustContentSize, { passive: true })

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(startAnimation))
  } else {
    setTimeout(startAnimation, 300)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', adjustContentSize)
  }
})
</script>

<style scoped>
/* ─────────────────────────────────────────────────────────────────────────────
   HERO SECTION LAYOUT
   Full-viewport centred container. Black base matches the background image.
───────────────────────────────────────────────────────────────────────────── */
.hero-section {
  position: relative;
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
  user-select: none;
}

.poem-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* The 1000×562 world container — scaled by JS on small viewports */
.content {
  transform-origin: center center;
  position: relative;
}

/* ─────────────────────────────────────────────────────────────────────────────
   FULL CONTAINER (clips everything to the 1000×562 world)
───────────────────────────────────────────────────────────────────────────── */
.container-full-3d {
  position: relative;
  width: 1000px;
  height: 562px;
  overflow: hidden;
  background: #030407;
}

/* ─────────────────────────────────────────────────────────────────────────────
   BACKGROUND IMAGE — the perspective room
───────────────────────────────────────────────────────────────────────────── */
.backgroundImage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  z-index: 0;
  pointer-events: none;
}

/* ─────────────────────────────────────────────────────────────────────────────
   COUPLE SILHOUETTE — foreground, above all 3D text
───────────────────────────────────────────────────────────────────────────── */
.boyImage {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 449px;
  max-width: none;
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 0 30px rgba(0, 0, 0, 0.95));
}

/* ─────────────────────────────────────────────────────────────────────────────
   ASCII HANDS — Framing the text loop OUTSIDE the screen
───────────────────────────────────────────────────────────────────────────── */
.ascii-hand {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 80%; /* Scales relative to the 562px content box */
  z-index: 15;
  pointer-events: none;
  filter: drop-shadow(0 0 15px rgba(204, 255, 0, 0.2));
}

.left-hand {
  right: 100%;
  margin-right: -10px; /* Adjusted to make fingertips barely touch the edge */
}

.right-hand {
  left: 100%;
  margin-left: -10px;
}

/* ─────────────────────────────────────────────────────────────────────────────
   HUE CYCLE OVERLAY
   Cycles through 3 distinct color phases (pink → purple → blue → pink),
   each at different animation rates so the transition feels organic/alive.
   mix-blend-mode: color tints the entire scene including text and walls.
───────────────────────────────────────────────────────────────────────────── */
.animated.hue {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  mix-blend-mode: color;
  animation: hue-cycle-overlay 18s ease-in-out infinite;
}

@keyframes hue-cycle-overlay {
  0%   { background: rgba(220,  40, 120, 0.45); }   /* hot pink    */
  33%  { background: rgba(130,  40, 240, 0.50); }   /* deep purple */
  66%  { background: rgba( 40, 100, 240, 0.45); }   /* electric blue */
  100% { background: rgba(220,  40, 120, 0.45); }   /* back to pink */
}

/* ─────────────────────────────────────────────────────────────────────────────
   3D CUBE CONTAINER (primary)
   perspective: 500px matches the depth of the cube (side walls are 500px).
   perspective-origin: centres at ~43% vertical — aligns vanishing point
   with the glowing horizontal band in poem-bg.jpg.
───────────────────────────────────────────────────────────────────────────── */
.poem-cube-container {
  position: absolute;
  inset: 0;
  width: 1000px;
  height: 562px;
  perspective: 500px;
  perspective-origin: 50% 50%;
  z-index: 2;
  pointer-events: none;
}

/* ─────────────────────────────────────────────────────────────────────────────
   FLOOR REFLECTION CONTAINER
   Vertically flipped around y ≈ 66% (the floor line in the background image).
   Fade + blur to simulate a glossy floor reflection.
───────────────────────────────────────────────────────────────────────────── */
.container-reflect {
  position: absolute;
  inset: 0;
  width: 1000px;
  height: 562px;
  perspective: 500px;
  perspective-origin: 50% 50%;
  z-index: 2;
  pointer-events: none;

  transform: scaleY(-1);
  transform-origin: 50% 66%;
  opacity: 0.4;
  filter: blur(1px);
  mask-image: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%);
}

/* ─────────────────────────────────────────────────────────────────────────────
   THE CUBE
   Positioned so the text band sits inside the glowing wall strip.
   poem-bg.jpg's glow band starts at ~37% from top → 562 × 0.37 ≈ 208px.
   Height of text band ≈ 140px to fill the glowing strip.
───────────────────────────────────────────────────────────────────────────── */
.cube {
  position: absolute;
  /* Moving down from 222px to 238px brings the back wall text
     into the glowing strip of the background image. */
  top: 238px;
  left: 0;
  width: 1000px;
  height: 115px;
  transform-style: preserve-3d;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CUBE FACES — base
───────────────────────────────────────────────────────────────────────────── */
.face {
  position: absolute;
  top: 0;
  backface-visibility: hidden;
  overflow: hidden;
}

/* Empty/invisible faces */
.face.top,
.face.bottom,
.face.front {
  display: none;
}

/* ─── LEFT WALL ────────────────────────────────────────────────────────────
   500px wide, pivots inward from the left edge.
   transform-origin: left center + rotateY(90deg)
   → the left edge stays at x=0, the right edge recedes to z=-500px.
   Matches the left wall of poem-bg.jpg.
─────────────────────────────────────────────────────────────────────────── */
.face.left {
  width: 500px;
  height: 115px;
  left: 0;
  transform-origin: left center;
  transform: rotateY(90deg);
}

/* ─── BACK WALL ────────────────────────────────────────────────────────────
   1000px wide, translated 500px into depth.
   With perspective: 500px, projects as ~500px apparent width on screen,
   spanning from x=250 to x=750 (the glowing back screen in poem-bg.jpg).
─────────────────────────────────────────────────────────────────────────── */
.face.back {
  width: 1000px;
  height: 115px;
  left: 0;
  transform: translateZ(-500px);
}

/* ─── RIGHT WALL ───────────────────────────────────────────────────────────
   500px wide, pivots inward from the right edge.
   transform-origin: right center + rotateY(-90deg)
   → the right edge stays at x=1000, the left edge recedes to z=-500px.
─────────────────────────────────────────────────────────────────────────── */
.face.right {
  width: 500px;
  height: 115px;
  left: 500px;
  transform-origin: right center;
  transform: rotateY(-90deg);
}

/* ─────────────────────────────────────────────────────────────────────────────
   TEXT INSIDE FACES
   Each face's <p> is positioned absolutely and scrolls via margin-left.
   Uses :deep() because v-html injects the <p> outside scoped style scope.
───────────────────────────────────────────────────────────────────────────── */
.face.text :deep(p) {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate3d(0, -50%, 0);
  will-change: transform;
  margin: 0;
  padding: 0;

  white-space: nowrap;
  font-family: 'Space Grotesk', 'Outfit', 'Inter', system-ui, sans-serif;
  font-size: 95px;
  font-weight: 300;
  letter-spacing: 0.01em;
  line-height: 1;

  /* Clean white — no glow, letting the background light strip do the work */
  color: rgba(255, 255, 255, 0.90);
  text-shadow: none;
  /* Color cycles through pink / purple / blue via overlay + own animation */
  animation: text-color-cycle 18s ease-in-out infinite;
  animation-delay: -6s;
}

/* Red brand highlight for NEXUS — no glow, just a clean vivid red */
.face.text :deep(.brand-red) {
  color: #ff2255;
  text-shadow: none;
  animation: brand-red-pulse 3.2s ease-in-out infinite;
}

@keyframes text-color-cycle {
  0%   { color: rgba(255, 200, 220, 0.92); }  /* soft pink   */
  33%  { color: rgba(200, 180, 255, 0.92); }  /* soft purple */
  66%  { color: rgba(180, 220, 255, 0.92); }  /* soft blue   */
  100% { color: rgba(255, 200, 220, 0.92); }  /* back to pink */
}

@keyframes brand-red-pulse {
  0%, 100% {
    color: #ff2255;
    text-shadow: 0 0 6px rgba(255,34,85,0.8), 0 0 20px rgba(255,34,85,0.5);
  }
  50% {
    color: #ff4466;
    text-shadow: 0 0 12px rgba(255,34,85,1.0), 0 0 35px rgba(255,34,85,0.7);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   MARQUEE KEYFRAME ANIMATIONS
   Three faces, three keyframes with staggered end-distances.

   The 870px increment between keyframe totals = apparent projected width of
   each side wall at the perspective junction. This creates the seamless
   wrap-around visual where text appears to flow continuously:
     RIGHT WALL → BACK WALL → LEFT WALL

   Duration is the same (55s) for all three. Different total scroll distances
   mean different speeds — right scrolls fastest, left scrolls slowest —
   which offsets the text exactly to appear continuous at each corner.
───────────────────────────────────────────────────────────────────────────── */
/* CSS animation is intentionally removed from these selectors.
   Animation is driven by JavaScript rAF in <script setup> above,
   which applies margin-left directly to the DOM for 60fps performance
   and mathematically guaranteed cross-face sync. */
.face.left.text :deep(p),
.face.back.text :deep(p),
.face.right.text :deep(p) {
  /* margin-left set dynamically by JS */
}
</style>

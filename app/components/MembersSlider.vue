<template>
  <div class="parallax-container" ref="containerRef">
    <ul class="project-list">
      <li
        v-for="i in indices"
        :key="i"
        class="project"
        :ref="el => setProjectRef(i, el)"
      >
        <img :src="getProjectData(i).image" :alt="getProjectData(i).title" crossorigin="anonymous" />
      </li>
    </ul>

    <div class="minimap">
      <div class="minimap-wrapper">
        <div class="minimap-img-preview">
          <div
            v-for="i in indices"
            :key="'img-'+i"
            class="minimap-img-item"
            :ref="el => setMinimapRef(i, el)"
          >
            <img :src="getProjectData(i).image" :alt="getProjectData(i).title" crossorigin="anonymous" />
          </div>
        </div>
        <div class="minimap-info-list">
          <div
            v-for="i in indices"
            :key="'info-'+i"
            class="minimap-item-info"
            :ref="el => setInfoRef(i, el)"
          >
            <div class="minimap-item-info-row text-[#FF9292] font-mono font-bold tracking-widest text-sm mb-1">
              <p>{{ getProjectNumber(i) }}</p>
              <p>{{ getProjectData(i).title }}</p>
            </div>
            <div class="minimap-item-info-row text-[#C5C1C1] font-sans font-medium uppercase text-xs">
              <p>{{ getProjectData(i).category }}</p>
              <p>{{ getProjectData(i).year }}</p>
            </div>
            <div class="minimap-item-info-row text-[#FEE7C8] font-serif text-sm mt-3 italic">
              <p>{{ getProjectData(i).description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Title overlay to fit NEXUS Aesthetic -->
    <div class="absolute top-12 left-12 pointer-events-none z-20">
      <h2 class="text-4xl md:text-6xl font-black tracking-tighter text-[#FEE7C8] mix-blend-difference">THE SYNDICATE</h2>
      <p class="text-[#FF9292] font-mono text-sm tracking-widest mt-2">CLUB ARCHITECTS // INFINITE SCROLL</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'

interface ProjectData {
  title: string
  image: string
  category: string
  year: string
  description: string
}

// Unsplash images provided in the React component snippet, adapted for NEXUS roles
const PROJECT_DATA: ProjectData[] = [
  {
    title: "MEMBER // KAI",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    category: "VISIONARY",
    year: "EST. 2024",
    description: "Architect of the chaos.",
  },
  {
    title: "MEMBER // LUNA",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
    category: "SOUNDSCAPE",
    year: "EST. 2024",
    description: "The underground pulse.",
  },
  {
    title: "MEMBER // NOVA",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop",
    category: "AESTHETICS",
    year: "EST. 2024",
    description: "Visual distortions.",
  },
  {
    title: "MEMBER // JAX",
    image: "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=1887&auto=format&fit=crop",
    category: "OPERATIONS",
    year: "EST. 2025",
    description: "No rules enforcer.",
  },
  {
    title: "MEMBER // RAE",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1896&auto=format&fit=crop",
    category: "NIGHTLIFE",
    year: "EST. 2025",
    description: "Pure adrenaline.",
  },
]

const CONFIG = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
}

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor

const getProjectData = (index: number) => {
  return PROJECT_DATA[index]
}

const getProjectNumber = (index: number) => {
  return (index + 1).toString().padStart(2, "0")
}

const indices = ref<number[]>(PROJECT_DATA.map((_, i) => i))

const state = {
  currentY: 0,
  targetY: 0,
  isDragging: false,
  isSnapping: false,
  snapStart: { time: 0, y: 0, target: 0 },
  lastScrollTime: Date.now(),
  dragStart: { y: 0, scrollY: 0 },
  projectHeight: 0,
  minimapHeight: 250,
}

const containerRef = ref<HTMLElement | null>(null)
const projectsRef = shallowRef(new Map<number, HTMLElement>())
const minimapRef = shallowRef(new Map<number, HTMLElement>())
const infoRef = shallowRef(new Map<number, HTMLElement>())

const setProjectRef = (i: number, el: any) => {
  if (el) projectsRef.value.set(i, el)
  else projectsRef.value.delete(i)
}
const setMinimapRef = (i: number, el: any) => {
  if (el) minimapRef.value.set(i, el)
  else minimapRef.value.delete(i)
}
const setInfoRef = (i: number, el: any) => {
  if (el) infoRef.value.set(i, el)
  else infoRef.value.delete(i)
}

let requestRef = 0
let onResizeHandler: () => void

const updateParallax = (img: HTMLImageElement | null | undefined, scroll: number, index: number, height: number) => {
  if (!img) return
  const target = (-scroll - index * height) * 0.2
  
  if (!img.dataset.parallaxCurrent) {
    img.dataset.parallaxCurrent = target.toString()
    img.style.transform = `translateY(${target}px) scale(1.5)`
    return
  }
  
  let current = parseFloat(img.dataset.parallaxCurrent)
  current = lerp(current, target, 0.1)
  
  if (Math.abs(current - target) > 0.01) {
    img.style.transform = `translateY(${current}px) scale(1.5)`
    img.dataset.parallaxCurrent = current.toString()
  }
}

const updateSnap = () => {
  const s = state
  const progress = Math.min((Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION, 1)
  const eased = 1 - Math.pow(1 - progress, 3)
  s.targetY = s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased
  if (progress >= 1) s.isSnapping = false
}

const snapToProject = () => {
  const s = state
  if (s.projectHeight === 0) return
  let current = Math.round(-s.targetY / s.projectHeight)
  current = Math.max(0, Math.min(PROJECT_DATA.length - 1, current))
  const target = -current * s.projectHeight
  s.isSnapping = true
  s.snapStart = { time: Date.now(), y: s.targetY, target }
}

const updatePositions = () => {
  const s = state
  if (s.projectHeight === 0) return
  const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight

  projectsRef.value.forEach((el, index) => {
    const y = index * s.projectHeight + s.currentY
    el.style.transform = `translateY(${y}px)`
    const img = el.querySelector("img")
    updateParallax(img, s.currentY, index, s.projectHeight)
  })

  minimapRef.value.forEach((el, index) => {
    const y = index * s.minimapHeight + minimapY
    el.style.transform = `translateY(${y}px)`
    const img = el.querySelector("img")
    updateParallax(img, minimapY, index, s.minimapHeight)
  })

  infoRef.value.forEach((el, index) => {
    const y = index * s.minimapHeight + minimapY
    el.style.transform = `translateY(${y}px)`
  })
}

const animate = () => {
  const s = state
  const now = Date.now()

  if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
    if (s.projectHeight > 0) {
      let current = Math.round(-s.targetY / s.projectHeight)
      current = Math.max(0, Math.min(PROJECT_DATA.length - 1, current))
      const snapPoint = -current * s.projectHeight
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject()
    }
  }

  if (s.isSnapping) updateSnap()
  if (!s.isDragging) {
    s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR
  }

  updatePositions()
}

const animationLoop = () => {
  animate()
  requestRef = requestAnimationFrame(animationLoop)
}

let boundWheel: (e: WheelEvent) => void
let boundTouchStart: (e: TouchEvent) => void
let boundTouchMove: (e: TouchEvent) => void
let boundTouchEnd: () => void

onMounted(() => {
  state.projectHeight = window.innerHeight
  
  boundWheel = (e: WheelEvent) => {
    const s = state
    s.isSnapping = false
    s.lastScrollTime = Date.now()
    
    const delta = Math.max(Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY), -CONFIG.MAX_VELOCITY)
    const newTarget = s.targetY - delta
    const minScroll = -(PROJECT_DATA.length - 1) * s.projectHeight
    
    // Allow natural scroll if we are trying to scroll past the boundaries
    if (newTarget > 0 && e.deltaY < 0) return
    if (newTarget < minScroll && e.deltaY > 0) return
    
    e.preventDefault()
    s.targetY = Math.max(minScroll, Math.min(0, newTarget))
  }

  boundTouchStart = (e: TouchEvent) => {
    const s = state
    s.isDragging = true
    s.isSnapping = false
    s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY }
    s.lastScrollTime = Date.now()
  }

  boundTouchMove = (e: TouchEvent) => {
    const s = state
    if (!s.isDragging) return
    
    const deltaY = (e.touches[0].clientY - s.dragStart.y) * 1.5
    const newTarget = s.dragStart.scrollY + deltaY
    const minScroll = -(PROJECT_DATA.length - 1) * s.projectHeight

    // At boundary, allow native scroll
    if ((newTarget > 0 && deltaY > 0) || (newTarget < minScroll && deltaY < 0)) return
    
    e.preventDefault()
    s.targetY = Math.max(minScroll, Math.min(0, newTarget))
    s.lastScrollTime = Date.now()
  }

  boundTouchEnd = () => {
    state.isDragging = false
  }

  onResizeHandler = () => {
    state.projectHeight = window.innerHeight
    if (containerRef.value) {
      containerRef.value.style.height = `${window.innerHeight}px`
    }
  }

  const container = containerRef.value
  if (container) {
    container.addEventListener("wheel", boundWheel, { passive: false })
    container.addEventListener("touchstart", boundTouchStart)
    container.addEventListener("touchmove", boundTouchMove, { passive: false })
    container.addEventListener("touchend", boundTouchEnd)
  }
  
  window.addEventListener("resize", onResizeHandler)
  onResizeHandler()

  requestRef = requestAnimationFrame(animationLoop)
})

onUnmounted(() => {
  const container = containerRef.value
  if (container) {
    container.removeEventListener("wheel", boundWheel)
    container.removeEventListener("touchstart", boundTouchStart)
    container.removeEventListener("touchmove", boundTouchMove)
    container.removeEventListener("touchend", boundTouchEnd)
  }
  window.removeEventListener("resize", onResizeHandler)
  if (requestRef) cancelAnimationFrame(requestRef)
})
</script>

<style scoped>
.parallax-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #07070A; /* Dark base, but images will cover it */
}

.project-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  will-change: transform;
}

.project img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.5);
  will-change: transform;
}

.minimap {
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  width: 340px;
  height: 250px;
  z-index: 10;
  pointer-events: none;
  background: rgba(114, 47, 153, 0.15); /* #722F99 with opacity */
  backdrop-filter: blur(12px);
  border: 1px solid rgba(254, 231, 200, 0.1);
  padding: 1rem;
  border-radius: 4px;
}

.minimap-wrapper {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  height: 100%;
}

.minimap-img-preview {
  position: relative;
  width: 100px;
  height: 100%;
  overflow: hidden;
  border-radius: 2px;
}

.minimap-img-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 250px;
  overflow: hidden;
  will-change: transform;
}

.minimap-img-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.minimap-info-list {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.minimap-item-info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 218px; /* Adjusted for padding */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  will-change: transform;
}

.minimap-item-info-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>

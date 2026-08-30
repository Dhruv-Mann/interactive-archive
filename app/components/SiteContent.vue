<template>
  <div class="min-h-screen bg-[#07070A] text-white selection:bg-[#FF2A5F] selection:text-white relative overflow-x-hidden">
    
    <!-- Top Navigation Bar -->
    <div class="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none mix-blend-difference">
      <div class="text-white font-bold text-xl tracking-[0.2em] select-none uppercase">NEXUS</div>
    </div>


    <!-- Main Content Flow -->
    <main class="relative z-10">
      <!-- 0. NEW Landing Hero (HtmlBlaze) -->
      <NewLandingHero />

      <!-- Timeline Light Beam Connector 0 -->
      <div class="h-[80vh] w-full pointer-events-none flex items-center justify-center relative overflow-hidden">
        
        <!-- 1. Top Center-Left (Hand Level) -->
        <div class="absolute top-[15%] right-[52vw] flex flex-col gap-3 text-[12px] font-mono text-zinc-300 tracking-[0.2em] uppercase text-right z-20">
          <span>[01] Initiating unmanaged protocol.</span>
        </div>
        <!-- Background ASCII Art (PNG) -->
        <div class="absolute inset-0 flex items-center justify-center z-0 opacity-70">
          <img 
            src="/ascii-art.png" 
            alt="ASCII Art" 
            class="h-[60vh] w-auto mix-blend-screen object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            style="
              -webkit-mask-image: radial-gradient(ellipse 60% 65% at 50% 50%, black 30%, rgba(0,0,0,0.6) 60%, transparent 85%);
              mask-image: radial-gradient(ellipse 60% 65% at 50% 50%, black 30%, rgba(0,0,0,0.6) 60%, transparent 85%);
            "
          />
        </div>

        <!-- The light beam -->
        <div 
          class="h-full w-[2px] z-10"
          style="background: linear-gradient(to bottom, transparent 0%, #E6E6FA 15%, #E6E6FA 85%, transparent 100%); box-shadow: 0 0 20px rgba(230, 230, 250, 0.6), 0 0 40px rgba(181, 126, 220, 0.4);"
        ></div>

        <!-- Lissajous Beams Overlay (Originating at hand, curving around, converging at bottom) -->
        <LissajousBeams :origin-x="0.5" :origin-y="0.26" />

        <!-- 2. Middle Right (Max Expansion Level, pushed outside the curve) -->
        <div class="absolute top-[63%] left-[82vw] flex flex-col gap-3 text-[12px] font-mono text-zinc-300 tracking-[0.2em] uppercase text-left z-20">
          <span>[02] Chaos at it's peak.</span>
        </div>

        <!-- 3. Bottom Center-Right (Convergence Level) -->
        <div class="absolute bottom-[2%] left-[60vw] flex flex-col gap-3 text-[12px] font-mono text-zinc-300 tracking-[0.2em] uppercase text-left z-20">
          <span>[03] Managing the unmanagable.</span>
        </div>
      </div>

      <!-- 1. 3D Poem Hero Room -->
      <PoemHero />
      
      <!-- Timeline Light Beam Connector 1 -->
      <div class="h-[80vh] w-full pointer-events-none flex flex-col items-center justify-center relative overflow-hidden">
        <!-- Dithered image container -->
        <div 
          class="absolute left-[8vw] flex items-center justify-center pointer-events-none"
          :style="{ opacity: spacer1ImageOpacity }"
        >

          <img 
            ref="spacer1ImageRef"
            src="/1-transparent.png" 
            alt="Dithered Reveal" 
            class="relative z-10 max-h-[55vh] max-w-[50vw] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          />
        </div>
        
        <!-- The light beam -->
        <div 
          class="h-full w-[2px] z-10"
          style="background: linear-gradient(to bottom, transparent 0%, #E6E6FA 15%, #E6E6FA 85%, transparent 100%); box-shadow: 0 0 20px rgba(230, 230, 250, 0.6), 0 0 40px rgba(181, 126, 220, 0.4);"
        ></div>

        <!-- Right Side: Text & Button -->
        <div class="absolute right-[8vw] flex flex-col items-end justify-center pointer-events-auto z-20 w-[40vw]">
          
          <!-- Stacked Typography -->
          <div class="flex flex-col items-end leading-none" :style="{ fontFamily: '&quot;Marker Felt&quot;, &quot;Comic Sans MS&quot;, cursive' }">
            <Shuffle
              text="Not Your"
              shuffle-direction="right"
              :duration="0.3"
              :shuffle-times="1"
              class="text-4xl text-zinc-400"
            />
            <Shuffle
              text="AVERAGE"
              shuffle-direction="right"
              :duration="0.4"
              :shuffle-times="2"
              class="text-[6rem] font-black tracking-tighter text-zinc-100 my-2"
            />
            <Shuffle
              text="Club"
              shuffle-direction="right"
              :duration="0.3"
              :shuffle-times="1"
              class="text-4xl text-zinc-400"
            />
          </div>

          <SpecularButton
            class="mt-8 mr-2"
            size="lg"
            :radius="18"
            tint="#ffffff"
            :tint-opacity="0"
            :blur="0"
            text-color="#f5f5f5"
            line-color="#b57edc"
            base-color="#525252"
            :intensity="1.2"
            :shine-size="15"
            :shine-fade="40"
            :thickness="1.5"
            :speed="0.35"
            follow-mouse
            :proximity="250"
            :auto-animate="false"
          >
            Join the elites
          </SpecularButton>
        </div>
      </div>

      <!-- 2. UFO Abduction Credits Interactive Section -->
      <UfoHero />

      <!-- Timeline Light Beam Connector 2 -->
      <div id="connector-2" class="h-[80vh] w-full pointer-events-none flex flex-col items-center justify-center relative overflow-hidden">
        
        <!-- ASCII Canvas Container: v-if unmounts Three.js when off-screen (kills its RAF loop) -->
        <div 
          v-if="isAsciiMounted"
          class="absolute inset-0 flex items-center justify-center pointer-events-auto"
          :style="{ opacity: spacer2AsciiOpacity }"
        >
          <AsciiText text="NEXUS" :asciiFontSize="8" :textFontSize="200" :planeBaseHeight="5.6" />
        </div>

        <div 
          class="h-full w-[2px] z-10 pointer-events-none"
          style="background: linear-gradient(to bottom, transparent 0%, #E6E6FA 15%, #E6E6FA 85%, transparent 100%); box-shadow: 0 0 20px rgba(230, 230, 250, 0.6), 0 0 40px rgba(181, 126, 220, 0.4);"
        ></div>
      </div>

      <!-- 3. Blood Quote Section -->
      <BloodQuote />

      <!-- Timeline Light Beam Connector 3 -->
      <div id="connector-3" class="h-[80vh] w-full pointer-events-none flex flex-col items-center justify-center relative overflow-hidden">
        <!-- ASCII lion skull — right side, screen strips black, mask dissolves edges -->
        <div
          class="absolute right-[4vw] flex items-center justify-center pointer-events-none"
          :style="{ opacity: spacer3ImageOpacity }"
        >
          <img
            ref="spacer3ImageRef"
            src="/ascii-lion.png"
            alt="ASCII Lion"
            class="relative z-10 max-h-[65vh] max-w-[50vw] object-contain"
            style="
              mix-blend-mode: screen;
              -webkit-mask-image: radial-gradient(ellipse 60% 65% at 50% 45%, black 30%, rgba(0,0,0,0.6) 55%, transparent 80%);
              mask-image: radial-gradient(ellipse 60% 65% at 50% 45%, black 30%, rgba(0,0,0,0.6) 55%, transparent 80%);
            "
          />
        </div>

        <div 
          class="h-full w-[2px] z-10"
          style="background: linear-gradient(to bottom, transparent 0%, #E6E6FA 15%, #E6E6FA 85%, transparent 100%); box-shadow: 0 0 20px rgba(230, 230, 250, 0.6), 0 0 40px rgba(181, 126, 220, 0.4);"
        ></div>
      </div>

      <!-- 4. Team Members Section (GSAP Pinned Scroll) -->
      <TeamMembers id="core-syndicate" />

      <!-- Timeline Light Beam Connector 4 -->
      <div class="h-[80vh] w-full pointer-events-none flex flex-col items-center justify-center relative overflow-hidden">
        <!-- ASCII lion skull — screen mode strips black, radial mask dissolves edges -->
        <div
          class="absolute left-[4vw] flex items-center justify-center pointer-events-none"
          :style="{ opacity: spacer4ImageOpacity }"
        >
          <img
            ref="spacer4ImageRef"
            src="/dithered2.png"
            alt="Dithered Statue"
            class="relative z-10 max-h-[65vh] max-w-[50vw] object-contain"
            style="
              mix-blend-mode: screen;
              -webkit-mask-image: radial-gradient(ellipse 60% 65% at 50% 50%, black 30%, rgba(0,0,0,0.6) 55%, transparent 80%);
              mask-image: radial-gradient(ellipse 60% 65% at 50% 50%, black 30%, rgba(0,0,0,0.6) 55%, transparent 80%);
            "
          />
        </div>

        <div 
          class="h-full w-[2px] z-10"
          style="background: linear-gradient(to bottom, transparent 0%, #E6E6FA 15%, #E6E6FA 85%, transparent 100%); box-shadow: 0 0 20px rgba(230, 230, 250, 0.6), 0 0 40px rgba(181, 126, 220, 0.4);"
        ></div>
      </div>

      <!-- 5. Events Section (Vue 3 Native Transitions Carousel) -->
      <EventsSection id="events-archive" />
    </main>

    <!-- Cyber Footer removed for empty canvas -->


    <!-- RSVP / Party Floating Notification Toast -->
    <div
      v-if="toastMessage"
      class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#0E0E14] border-2 border-[#CCFF00] text-xs font-mono text-white shadow-[0_0_30px_#CCFF00] animate-bounce flex items-center gap-2"
    >
      <span class="text-base">🎉</span>
      <span>{{ toastMessage }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NewLandingHero from './NewLandingHero.vue'
import PoemHero from './PoemHero.vue'
import UfoHero from './UfoHero.vue'
import BloodQuote from './BloodQuote.vue'
import TeamMembers from './TeamMembers.vue'
import EventsSection from './EventsSection.vue'
import AsciiText from './AsciiText.vue'
import { useLenis } from '~/composables/useLenis'

useLenis() // Smooth scroll — bridges Lenis to GSAP ScrollTrigger globally
const toastMessage = ref<string | null>(null)

// Removed Lissajous logic to replace with horizontal CHAOS animation

// Spacer 1 Reveal Animation Logic
const spacer1ImageRef = ref<HTMLImageElement | null>(null)
const spacer1ImageOpacity = ref(0)
const spacer1ImageRotation = ref(0)
const spacer3ImageRef = ref<HTMLImageElement | null>(null)
const spacer3ImageOpacity = ref(0)
const spacer4ImageRef = ref<HTMLImageElement | null>(null)
const spacer4ImageOpacity = ref(0)
const spacer2AsciiOpacity = ref(0)

// WebGL visibility gate — v-if unmounts Three.js when off-screen,
// completely halting its RAF loop and freeing GPU budget during scrolling.
const isAsciiMounted = ref(false)

// RAF-throttled scroll handler: getBoundingClientRect is expensive at 60fps.
// We gate it to one call per animation frame maximum.
let scrollRafId: number | null = null

const handleScroll = () => {
  if (scrollRafId !== null) return  // Already queued for this frame
  scrollRafId = requestAnimationFrame(() => {
    scrollRafId = null
    _doScrollCalc()
  })
}

const _doScrollCalc = () => {
  const windowCenterY = window.innerHeight / 2

  if (spacer1ImageRef.value) {
    const rect = spacer1ImageRef.value.getBoundingClientRect()
    const centerY = rect.top + rect.height / 2
    
    // Calculate distance from center of screen
    const distance = Math.abs(centerY - windowCenterY)
    const maxDistance = window.innerHeight * 0.6 // Starts fading when it's 60% away from center
    
    // Map distance to opacity (max 0.6)
    const factor = 1 - (distance / maxDistance)
    spacer1ImageOpacity.value = Math.max(0, Math.min(0.6, factor * 0.8))
    
    // Removed Lissajous spin logic
  }

  const spacer2Element = document.getElementById('connector-2')
  if (spacer2Element) {
    const rect2 = spacer2Element.getBoundingClientRect()
    const centerY2 = rect2.top + rect2.height / 2
    
    const distance2 = Math.abs(centerY2 - windowCenterY)
    const maxDistance2 = window.innerHeight * 0.6
    
    const factor2 = 1 - (distance2 / maxDistance2)
    spacer2AsciiOpacity.value = Math.max(0, Math.min(1.0, factor2 * 1.5))
  }

  // Spacer 3 — ascii lion skull (left side, after BloodQuote)
  if (spacer3ImageRef.value) {
    const rect3 = spacer3ImageRef.value.getBoundingClientRect()
    const centerY3 = rect3.top + rect3.height / 2
    const distance3 = Math.abs(centerY3 - windowCenterY)
    const maxDistance3 = window.innerHeight * 0.6
    const factor3 = 1 - (distance3 / maxDistance3)
    spacer3ImageOpacity.value = Math.max(0, Math.min(0.7, factor3 * 0.9))
  }

  // Spacer 4 — dithered statue (right side, after TeamMembers)
  if (spacer4ImageRef.value) {
    const rect4 = spacer4ImageRef.value.getBoundingClientRect()
    const centerY4 = rect4.top + rect4.height / 2
    const distance4 = Math.abs(centerY4 - windowCenterY)
    const maxDistance4 = window.innerHeight * 0.6
    const factor4 = 1 - (distance4 / maxDistance4)
    spacer4ImageOpacity.value = Math.max(0, Math.min(0.65, factor4 * 0.85))
  }
}
const handleRsvpToast = (eventTitle: string) => {
  toastMessage.value = `PASS RESERVED: ${eventTitle}! SEE YOU AFTER HOURS.`
  setTimeout(() => {
    toastMessage.value = null
  }, 4000)
}


onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // IntersectionObserver: mount AsciiText only when near viewport.
    // rootMargin '200%' = start mounting when within 2 screen heights.
    const webglObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if ((entry.target as HTMLElement).id === 'connector-2') {
            isAsciiMounted.value = entry.isIntersecting
          }
        })
      },
      { rootMargin: '200% 0px', threshold: 0 }
    )

    const c2 = document.getElementById('connector-2')
    if (c2) webglObserver.observe(c2)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

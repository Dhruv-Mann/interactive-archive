<template>
  <div class="w-full overflow-x-hidden bg-[#07070A]">
    <section
      ref="heroSectionRef"
      class="hero relative w-screen h-screen px-4 flex flex-col items-center justify-center bg-[#07070A] text-white overflow-hidden"
    >
      <!-- Background Swiper (Z-index 0) -->
      <div
        ref="heroHeaderRef"
        class="absolute inset-0 w-full h-full will-change-transform z-0"
      >
        <ClientOnly>
          <Swiper
            :modules="swiperModules"
            effect="fade"
            :autoplay="{ delay: 3200, disableOnInteraction: false }"
            :loop="true"
            :speed="1200"
            class="hero-bg-swiper"
          >
            <SwiperSlide v-for="(src, i) in teamImages" :key="i" class="relative overflow-hidden">
              <img
                :src="src"
                :alt="`Team Background ${i + 1}`"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 z-10 bg-gradient-to-b from-[#07070A]/80 via-[#07070A]/50 to-[#07070A]/90 mix-blend-multiply"></div>
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>

      <!-- Animated Icons (Z-index 2) -->
      <div
        ref="animatedIconsRef"
        class="animated-icons fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 w-[90%] md:w-[60%] will-change-transform z-10"
      >
        <div
          v-for="(member, index) in teamMembersData"
          :key="index"
          :ref="(el) => { if (el) iconElementsRef[index] = el as HTMLDivElement }"
          class="animated-icon-wrapper flex-1 flex flex-col items-center gap-3 will-change-transform"
        >
          <div class="animated-icon w-full aspect-[3/4] overflow-hidden bg-[#12121A] border border-white/10 shadow-[0_0_15px_rgba(255,42,95,0.2)]">
            <img :src="member.image" :alt="`Team Icon ${index + 1}`" class="w-full h-full object-cover" />
          </div>
          
          <!-- Static Info Label (Claude Orange: #D97757) -->
          <div 
            :ref="(el) => { if (el) teamInfoRefs[index] = el as HTMLDivElement }"
            class="team-info-label flex flex-col items-center justify-center opacity-100 will-change-opacity"
          >
            <span class="text-[#D97757] font-bold uppercase text-[9px] md:text-xs tracking-widest premium-font mb-1">{{ member.role }}</span>
            <span class="text-white font-black uppercase text-[10px] md:text-sm tracking-[0.2em] display-font">{{ member.name }}</span>
          </div>
        </div>
      </div>

      <!-- Text Content (Z-index 10) -->
      <h1 class="animated-text relative z-20 max-w-[95vw] md:max-w-[70vw] text-center text-white text-[clamp(1.4rem,4vw,3.5rem)] font-black uppercase leading-[1.4] md:leading-[1.2] display-font">
        
        <span :ref="(el) => { if (el) textSegmentsRef[0] = el as HTMLSpanElement }" class="text-segment opacity-0 text-[#FF2A5F] block mb-4 text-[0.4em] tracking-[0.4em] font-bold premium-font">
          CORE SYNDICATE
        </span>

        <span :ref="(el) => { if (el) textSegmentsRef[1] = el as HTMLSpanElement }" class="text-segment opacity-0">MEET THE</span>
        <div :ref="(el) => { if (el) placeholdersRef[0] = el as HTMLDivElement }" class="placeholder-icon mx-2 md:-mt-2 w-10 h-12 md:w-16 md:h-20 inline-block align-middle will-change-transform invisible border border-[#FF2A5F]/30 bg-[#07070A]/50"></div>

        <span :ref="(el) => { if (el) textSegmentsRef[2] = el as HTMLSpanElement }" class="text-segment opacity-0">VISIONARIES WHO</span>
        <div :ref="(el) => { if (el) placeholdersRef[1] = el as HTMLDivElement }" class="placeholder-icon mx-2 md:-mt-2 w-10 h-12 md:w-16 md:h-20 inline-block align-middle will-change-transform invisible border border-[#FF2A5F]/30 bg-[#07070A]/50"></div>

        <span :ref="(el) => { if (el) textSegmentsRef[3] = el as HTMLSpanElement }" class="text-segment opacity-0">ORCHESTRATE</span>
        <div :ref="(el) => { if (el) placeholdersRef[2] = el as HTMLDivElement }" class="placeholder-icon mx-2 md:-mt-2 w-10 h-12 md:w-16 md:h-20 inline-block align-middle will-change-transform invisible border border-[#FF2A5F]/30 bg-[#07070A]/50"></div>

        <span :ref="(el) => { if (el) textSegmentsRef[4] = el as HTMLSpanElement }" class="text-segment opacity-0 text-[#FF2A5F]">ABSOLUTE CHAOS</span>
        <div :ref="(el) => { if (el) placeholdersRef[3] = el as HTMLDivElement }" class="placeholder-icon mx-2 md:-mt-2 w-10 h-12 md:w-16 md:h-20 inline-block align-middle will-change-transform invisible border border-[#FF2A5F]/30 bg-[#07070A]/50"></div>

        <span :ref="(el) => { if (el) textSegmentsRef[5] = el as HTMLSpanElement }" class="text-segment opacity-0">INTO A METICULOUSLY</span>
        <div :ref="(el) => { if (el) placeholdersRef[4] = el as HTMLDivElement }" class="placeholder-icon mx-2 md:-mt-2 w-10 h-12 md:w-16 md:h-20 inline-block align-middle will-change-transform invisible border border-[#FF2A5F]/30 bg-[#07070A]/50"></div>
        
        <span :ref="(el) => { if (el) textSegmentsRef[6] = el as HTMLSpanElement }" class="text-segment opacity-0 text-[#B57EDC]">NEXUS</span>
        <div :ref="(el) => { if (el) placeholdersRef[5] = el as HTMLDivElement }" class="placeholder-icon mx-2 md:-mt-2 w-10 h-12 md:w-16 md:h-20 inline-block align-middle will-change-transform invisible border border-[#FF2A5F]/30 bg-[#07070A]/50"></div>

        <span :ref="(el) => { if (el) textSegmentsRef[7] = el as HTMLSpanElement }" class="text-segment opacity-0 block mt-2 text-white">LEGACY.</span>
      </h1>

      <!-- Crosshair cursor + hover card (only active in Phase 4) -->
      <TeamCrosshair
        :active="isPhase4"
        :duplicateIconEls="duplicateIconEls"
        :members="teamMembersData"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import TeamCrosshair from './TeamCrosshair.vue'

import { TEAM_MEMBERS } from '~/constants/data'

gsap.registerPlugin(ScrollTrigger)

const swiperModules = [Autoplay, EffectFade]

// The text requires 6 placeholders to perfectly distribute the 6 team images.
const teamMembersData = TEAM_MEMBERS.slice(0, 6)
const teamImages = teamMembersData.map(member => member.image)

const animatedIconsRef = ref<HTMLDivElement | null>(null)
const heroHeaderRef = ref<HTMLDivElement | null>(null)
const heroSectionRef = ref<HTMLElement | null>(null)
const iconElementsRef = ref<(HTMLDivElement)[]>([])
const teamInfoRefs = ref<(HTMLDivElement)[]>([])
const textSegmentsRef = ref<(HTMLSpanElement)[]>([])
const placeholdersRef = ref<(HTMLDivElement)[]>([])

// Phase 4 state — drives crosshair activation
const isPhase4 = ref(false)
// Expose the live duplicateIcons array to the crosshair component
const duplicateIconEls = ref<HTMLElement[]>([])
let duplicateIcons: HTMLElement[] | null = null
let textAnimationOrder: { segment: HTMLElement; originalIndex: number }[] = []
let mm: gsap.MatchMedia

onMounted(async () => {
  await nextTick()

  const textSegments = textSegmentsRef.value
  const animationOrder: { segment: HTMLElement; originalIndex: number }[] = []

  textSegments.forEach((segment, index) => {
    if (segment) animationOrder.push({ segment, originalIndex: index })
  })

  // Randomize text segment animation order for the staggered fade-in at the end
  for (let i = animationOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [animationOrder[i], animationOrder[j]] = [animationOrder[j], animationOrder[i]]
  }

  textAnimationOrder = animationOrder

  const isMobile = window.innerWidth < 768
  // Adjust icon sizes to better fit portrait ratios instead of squares
  const headerIconWidth = isMobile ? 40 : 64
  const firstIcon = iconElementsRef.value[0]
  const currentIconWidth = firstIcon ? firstIcon.getBoundingClientRect().width : 1
  const exactScale = headerIconWidth / currentIconWidth

  mm = gsap.matchMedia()
  
  mm.add("(min-width: 300px)", () => {
    ScrollTrigger.create({
      trigger: heroSectionRef.value,
      start: "top top",
      end: `+=${window.innerHeight * 8}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onLeave: () => { isPhase4.value = false },
      onLeaveBack: () => { isPhase4.value = false },
      onUpdate: (self) => {
        const progress = self.progress

        textSegments.forEach((segment) => {
          if (segment) gsap.set(segment, { opacity: 0 })
        })

        if (progress < 0.3) {
          // Phase 1: Scroll down -> Image banner translates up and out
          isPhase4.value = false
          const moveProgress = progress / 0.3
          const containerMoveY = -window.innerHeight * 0.3 * moveProgress

          teamInfoRefs.value.forEach(info => {
            if (info) gsap.set(info, { opacity: 1 })
          })

          if (progress < 0.15) {
            const headerProgress = progress / 0.15
            gsap.set(heroHeaderRef.value, {
              transform: `translateY(${-50 * headerProgress}px)`,
              opacity: 1 - headerProgress,
            })
          } else {
            gsap.set(heroHeaderRef.value, { transform: "translateY(-50px)", opacity: 0 })
          }

          if (duplicateIcons) {
            duplicateIcons.forEach((d) => d.parentNode?.removeChild(d))
            duplicateIcons = null
            duplicateIconEls.value = []
          }

          gsap.set(animatedIconsRef.value, { x: 0, y: containerMoveY, scale: 1, opacity: 1 })

          iconElementsRef.value.forEach((icon, index) => {
            if (icon) {
              const staggerDelay = index * 0.1
              const iconProgress = gsap.utils.mapRange(staggerDelay, staggerDelay + 0.5, 0, 1, moveProgress)
              const clamped = Math.max(0, Math.min(1, iconProgress))
              gsap.set(icon, { x: 0, y: (-containerMoveY) * (1 - clamped) })
            }
          })

        } else if (progress < 0.6) {
          // Phase 2: Icons collapse toward the center of the screen
          isPhase4.value = false
          const scaleProgress = (progress - 0.3) / 0.3

          // Fade out the labels quickly right as shrinking begins
          const fadeProgress = Math.min(1, scaleProgress * 4) // Fully hidden by 25% of Phase 2
          teamInfoRefs.value.forEach(info => {
            if (info) gsap.set(info, { opacity: 1 - fadeProgress })
          })

          gsap.set(heroHeaderRef.value, { transform: "translateY(-50px)", opacity: 0 })

          if (duplicateIcons) {
            duplicateIcons.forEach((d) => d.parentNode?.removeChild(d))
            duplicateIcons = null
            duplicateIconEls.value = []
          }

          const containerRect = animatedIconsRef.value!.getBoundingClientRect()
          const deltaX = (window.innerWidth / 2 - (containerRect.left + containerRect.width / 2)) * scaleProgress
          const deltaY = (window.innerHeight / 2 - (containerRect.top + containerRect.height / 2)) * scaleProgress

          gsap.set(animatedIconsRef.value, {
            x: deltaX,
            y: -window.innerHeight * 0.3 + deltaY,
            scale: 1 + (exactScale - 1) * scaleProgress,
            opacity: 1,
          })

          iconElementsRef.value.forEach((icon) => { if (icon) gsap.set(icon, { x: 0, y: 0 }) })

        } else if (progress < 0.75) {
          // Phase 3: Icons split off and fly to their specific placeholder targets
          isPhase4.value = false
          const moveProgress = (progress - 0.6) / 0.15

          teamInfoRefs.value.forEach(info => {
            if (info) gsap.set(info, { opacity: 0 })
          })

          gsap.set(heroHeaderRef.value, { transform: "translateY(-50px)", opacity: 0 })

          const containerRect = animatedIconsRef.value!.getBoundingClientRect()
          const deltaX = window.innerWidth / 2 - (containerRect.left + containerRect.width / 2)
          const deltaY = window.innerHeight / 2 - (containerRect.top + containerRect.height / 2)

          gsap.set(animatedIconsRef.value, {
            x: deltaX,
            y: -window.innerHeight * 0.3 + deltaY,
            scale: exactScale,
            opacity: 0,
          })

          iconElementsRef.value.forEach((icon) => { if (icon) gsap.set(icon, { x: 0, y: 0 }) })

          if (!duplicateIcons) {
            duplicateIcons = []
            iconElementsRef.value.forEach((wrapper) => {
              if (wrapper) {
                const icon = wrapper.querySelector('.animated-icon')
                if (icon) {
                  const duplicate = icon.cloneNode(true) as HTMLElement
                  duplicate.className = "duplicate-icon"
                  Object.assign(duplicate.style, {
                    position: "absolute",
                    width: headerIconWidth + "px",
                    height: (headerIconWidth * (4/3)) + "px", // 3:4 aspect ratio for portrait
                    zIndex: "50",
                  })
                  document.body.appendChild(duplicate)
                  duplicateIcons!.push(duplicate)
                  duplicateIconEls.value = duplicateIcons!
                }
              }
            })
          }

          duplicateIcons?.forEach((duplicate, index) => {
            if (index < placeholdersRef.value.length) {
              const iconNode = iconElementsRef.value[index]?.querySelector('.animated-icon')
              if (!iconNode) return;

              const iconRect = iconNode.getBoundingClientRect()
              const startPageX = iconRect.left + iconRect.width / 2 + window.scrollX
              const startPageY = iconRect.top + iconRect.height / 2 + window.scrollY

              const targetRect = placeholdersRef.value[index]!.getBoundingClientRect()
              const targetPageX = targetRect.left + targetRect.width / 2 + window.scrollX
              const targetPageY = targetRect.top + targetRect.height / 2 + window.scrollY

              const moveX = targetPageX - startPageX
              const moveY = targetPageY - startPageY

              let currentX = 0
              let currentY = moveProgress < 0.5 ? moveY * (moveProgress / 0.5) : moveY
              if (moveProgress >= 0.5) currentX = moveX * ((moveProgress - 0.5) / 0.5)

              duplicate.style.left = startPageX + currentX - (headerIconWidth / 2) + "px"
              duplicate.style.top = startPageY + currentY - ((headerIconWidth * (4/3)) / 2) + "px"
              duplicate.style.opacity = "1"
              duplicate.style.display = "flex"
            }
          })

        } else {
          // Phase 4: Text randomly fades in alongside the placed icons
          isPhase4.value = true
          teamInfoRefs.value.forEach(info => {
            if (info) gsap.set(info, { opacity: 0 })
          })

          gsap.set(heroHeaderRef.value, { transform: "translateY(-100px)", opacity: 0 })
          gsap.set(animatedIconsRef.value, { opacity: 0 })

          duplicateIcons?.forEach((duplicate, index) => {
            if (index < placeholdersRef.value.length) {
              const targetRect = placeholdersRef.value[index]!.getBoundingClientRect()
              const targetPageX = targetRect.left + targetRect.width / 2 + window.scrollX
              const targetPageY = targetRect.top + targetRect.height / 2 + window.scrollY
              duplicate.style.left = targetPageX - (headerIconWidth / 2) + "px"
              duplicate.style.top = targetPageY - ((headerIconWidth * (4/3)) / 2) + "px"
              duplicate.style.opacity = "1"
              duplicate.style.display = "flex"
            }
          })

          textAnimationOrder.forEach((item, randomIndex) => {
            const segStart = 0.75 + randomIndex * 0.03
            const segProgress = gsap.utils.mapRange(segStart, segStart + 0.015, 0, 1, progress)
            gsap.set(item.segment, { opacity: Math.max(0, Math.min(1, segProgress)) })
          })
        }
      }
    })
  })
})

onUnmounted(() => {
  if (mm) mm.revert()
  ScrollTrigger.getAll().forEach((t) => t.kill())
  if (duplicateIcons) {
    duplicateIcons.forEach((d) => d.parentNode?.removeChild(d))
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700;900&family=Archivo+Black&display=swap');

.premium-font { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.03em; }
.display-font { font-family: 'Archivo Black', sans-serif; letter-spacing: 0.1em; }

.hero-bg-swiper { position: absolute; inset: 0; width: 100% !important; height: 100% !important; z-index: 0; }
.hero-bg-swiper .swiper-wrapper, .hero-bg-swiper .swiper-slide { width: 100% !important; height: 100% !important; }
.hero-bg-swiper .swiper-slide { opacity: 0 !important; transition: opacity 1.2s ease !important; }
.hero-bg-swiper .swiper-slide-active { opacity: 1 !important; }
</style>

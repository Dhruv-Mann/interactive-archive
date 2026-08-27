<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Code, Mic, Music, Gamepad2 } from 'lucide-vue-next'
import { EVENTS } from '~/constants/data'

// Map the first 4 events to the carousel features
const topEvents = EVENTS.slice(0, 4)

const ICONS = [Code, Mic, Music, Gamepad2]

const features = topEvents.map((event, index) => ({
  id: event.id,
  label: event.title,
  icon: ICONS[index],
  image: event.image,
  description: event.description,
}))

const AUTO_PLAY_INTERVAL = 3000
const ITEM_HEIGHT = 65

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const step = ref(0)
const isPaused = ref(false)

const currentIndex = computed(() => {
  return ((step.value % features.length) + features.length) % features.length
})

let interval: ReturnType<typeof setInterval>

const nextStep = () => {
  step.value++
}

const handleChipClick = (index: number) => {
  const diff = (index - currentIndex.value + features.length) % features.length
  if (diff > 0) step.value += diff
}

onMounted(() => {
  interval = setInterval(() => {
    if (!isPaused.value) nextStep()
  }, AUTO_PLAY_INTERVAL)
})

onUnmounted(() => {
  clearInterval(interval)
})

const getCardStatus = (index: number) => {
  const diff = index - currentIndex.value
  const len = features.length

  let normalizedDiff = diff
  if (diff > len / 2) normalizedDiff -= len
  if (diff < -len / 2) normalizedDiff += len

  if (normalizedDiff === 0) return "active"
  if (normalizedDiff === -1) return "prev"
  if (normalizedDiff === 1) return "next"
  return "hidden"
}
</script>

<template>
  <div class="w-full overflow-x-hidden bg-[#07070A] py-20 relative">
    
    <div class="w-full max-w-7xl mx-auto px-4 md:px-8">
      <div class="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border-2 border-white/10 bg-[#07070A] shadow-[0_0_50px_rgba(255,42,95,0.05)]">
        
        <!-- Left Side (Chips) -->
        <div class="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16 bg-[#0E0E14] border-b-2 lg:border-b-0 lg:border-r-2 border-white/5">
          <div class="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b from-[#0E0E14] via-[#0E0E14]/80 to-transparent z-40 pointer-events-none" />
          <div class="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t from-[#0E0E14] via-[#0E0E14]/80 to-transparent z-40 pointer-events-none" />
          
          <div class="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            <div
              v-for="(feature, index) in features"
              :key="feature.id"
              class="absolute flex items-center justify-start transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              :style="{
                height: ITEM_HEIGHT + 'px',
                width: 'fit-content',
                transform: `translateY(${wrap(-(features.length / 2), features.length / 2, index - currentIndex) * ITEM_HEIGHT}px)`,
                opacity: Math.max(0, 1 - Math.abs(wrap(-(features.length / 2), features.length / 2, index - currentIndex)) * 0.25),
                zIndex: index === currentIndex ? 50 : 10
              }"
            >
              <button
                @click="handleChipClick(index)"
                @mouseenter="isPaused = true"
                @mouseleave="isPaused = false"
                class="relative flex items-center gap-4 px-6 md:px-8 py-3 transition-all duration-700 text-left group border-2 rounded-full"
                :class="[
                  index === currentIndex
                    ? 'bg-[#FF2A5F] text-white border-[#FF2A5F] shadow-[4px_4px_0px_#B57EDC]'
                    : 'bg-transparent text-white/50 border-white/20 hover:border-white/40 hover:text-white'
                ]"
              >
                <div
                  class="flex items-center justify-center transition-colors duration-500"
                  :class="index === currentIndex ? 'text-white' : 'text-white/40'"
                >
                  <component :is="feature.icon" :size="20" :stroke-width="2.5" />
                </div>

                <span class="font-display font-black text-sm md:text-[15px] tracking-widest whitespace-nowrap uppercase">
                  {{ feature.label }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side (Images) -->
        <div class="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative bg-[#07070A] flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden">
          
          <!-- Big text background -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span class="font-display text-[15vw] font-black uppercase text-[#FF2A5F] whitespace-nowrap">EVENTS</span>
          </div>

          <div class="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            <div
              v-for="(feature, index) in features"
              :key="feature.id"
              class="absolute inset-0 overflow-hidden border-[6px] border-[#12121A] bg-[#0E0E14] origin-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              :class="[
                getCardStatus(index) === 'active' ? 'rounded-[2rem] md:rounded-[2.8rem] shadow-[10px_10px_0px_#FF2A5F]' : 'rounded-[2rem] md:rounded-[2.8rem] shadow-none',
              ]"
              :style="{
                transform: `translateX(${getCardStatus(index) === 'active' ? 0 : getCardStatus(index) === 'prev' ? -100 : getCardStatus(index) === 'next' ? 100 : 0}px) scale(${getCardStatus(index) === 'active' ? 1 : getCardStatus(index) === 'prev' || getCardStatus(index) === 'next' ? 0.85 : 0.7}) rotate(${getCardStatus(index) === 'prev' ? -3 : getCardStatus(index) === 'next' ? 3 : 0}deg)`,
                opacity: getCardStatus(index) === 'active' ? 1 : getCardStatus(index) === 'prev' || getCardStatus(index) === 'next' ? 0.4 : 0,
                zIndex: getCardStatus(index) === 'active' ? 20 : getCardStatus(index) === 'prev' || getCardStatus(index) === 'next' ? 10 : 0,
                pointerEvents: getCardStatus(index) === 'active' ? 'auto' : 'none',
              }"
            >
              <img
                :src="feature.image"
                :alt="feature.label"
                class="w-full h-full object-cover transition-all duration-700"
                :class="getCardStatus(index) === 'active' ? 'grayscale-0 blur-0' : 'grayscale blur-[2px] brightness-50'"
              />

              <!-- Info Overlay -->
              <transition
                enter-active-class="transition-all duration-500 ease-out"
                enter-from-class="opacity-0 translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-4"
              >
                <div
                  v-if="getCardStatus(index) === 'active'"
                  class="absolute inset-x-0 bottom-0 p-8 pt-32 bg-gradient-to-t from-[#07070A] via-[#07070A]/80 to-transparent flex flex-col justify-end pointer-events-none"
                >
                  <div class="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] w-fit mb-4">
                    VOL. {{ index + 1 }} • EVENT
                  </div>
                  <p class="text-white font-mono font-medium text-sm md:text-base leading-tight tracking-tight border-l-2 border-[#FF2A5F] pl-4">
                    {{ feature.description }}
                  </p>
                </div>
              </transition>

              <!-- Top Left Badge -->
              <div
                class="absolute top-6 left-6 flex items-center gap-3 transition-opacity duration-300"
                :class="getCardStatus(index) === 'active' ? 'opacity-100' : 'opacity-0'"
              >
                <div class="w-3 h-3 bg-[#FF2A5F] shadow-[0_0_15px_#FF2A5F] animate-pulse rounded-none" />
                <span class="text-white text-[10px] font-black uppercase tracking-[0.3em] font-display">
                  ARCHIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700;900&family=Archivo+Black&display=swap');

.premium-font { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.03em; }
.display-font { font-family: 'Archivo Black', sans-serif; letter-spacing: 0.1em; }
</style>

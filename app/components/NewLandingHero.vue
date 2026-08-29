<script setup lang="ts">
import { ref } from 'vue'
import HtmlBlaze from './HtmlBlaze.vue'
import HtmlEffectDemoSurface from './HtmlEffectDemoSurface.vue'

interface Props {
  scale?: number;
  speed?: number;
  strength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  scale: 6,
  speed: 1,
  strength: 0.03,
});

const fireIntensity = ref(1.0)
</script>

<template>
  <section class="relative h-[100dvh] w-full bg-zinc-950 p-3 sm:p-5 flex items-center justify-center overflow-hidden">
    
    <!-- Sleek Fire Intensity Slider -->
    <div class="absolute top-8 right-8 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
      <span class="text-xs font-mono text-zinc-400 tracking-[0.2em] uppercase">Intensity</span>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        v-model.number="fireIntensity"
        class="w-32 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
        :style="{ background: `linear-gradient(to right, #FF4500 ${fireIntensity * 100}%, #27272a ${fireIntensity * 100}%)` }"
      />
      <span class="text-xs font-mono text-white w-10 text-right">{{ Math.round(fireIntensity * 100) }}%</span>
    </div>

    <HtmlBlaze
      v-bind="props"
      :intensity="fireIntensity"
      class="w-full max-w-6xl aspect-[21/9] mx-auto border border-white/15 bg-white text-zinc-950 rounded-2xl shadow-2xl"
    >
      <HtmlEffectDemoSurface
        effect="blaze"
        headline="UNMANAGED"
        description="AKA MANAGIA"
      />
    </HtmlBlaze>
  </section>
</template>

<style scoped>
/* Custom Slider Thumb Styling */
input[type=range]::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px rgba(255, 69, 0, 0.8);
  cursor: pointer;
  border: 2px solid #FF4500;
}
input[type=range]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px rgba(255, 69, 0, 0.8);
  cursor: pointer;
  border: 2px solid #FF4500;
}
</style>

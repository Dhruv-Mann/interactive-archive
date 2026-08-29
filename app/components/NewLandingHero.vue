<script setup lang="ts">
import HtmlBlaze from './HtmlBlaze.vue'
</script>

<template>
  <section class="relative w-full h-[100dvh] bg-[#07070A] flex flex-col items-center justify-center overflow-hidden">
    <!-- HTML Blaze wrapped title -->
    <HtmlBlaze class="w-full max-w-6xl aspect-[21/9] mx-auto flex items-center justify-center">
      <div class="flex flex-col items-center justify-center w-full h-full text-center">
        <h1 class="text-[15vw] font-black tracking-tighter leading-none text-white uppercase" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);">
          NEXUS
        </h1>
        <p class="text-2xl md:text-4xl font-mono text-white tracking-[0.3em] mt-8 uppercase" style="text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);">
          Digital Collective
        </p>
      </div>
    </HtmlBlaze>
  </section>
</template>

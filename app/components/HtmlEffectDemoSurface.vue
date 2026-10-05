<script setup lang="ts">
defineProps<{
  effect: string;
  headline: string;
  description: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full p-8 text-center bg-white text-zinc-950">
    <h1 class="text-[11vw] sm:text-7xl md:text-8xl font-black tracking-tighter mb-4 sm:mb-6 leading-none">
      {{ headline }}
    </h1>
    <p class="text-base sm:text-xl text-zinc-600 max-w-xl mx-auto font-mono">
      {{ description }}
    </p>
  </div>
</template>

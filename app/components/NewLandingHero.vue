<script setup lang="ts">
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
</script>

<template>
  <section class="h-[100dvh] w-full bg-zinc-950 p-3 sm:p-5 flex items-center justify-center">
    <HtmlBlaze
      v-bind="props"
      class="w-full max-w-6xl aspect-video border border-white/15 bg-white text-zinc-950 rounded-2xl shadow-2xl"
    >
      <HtmlEffectDemoSurface
        effect="blaze"
        headline="UNMANAGED"
        description="AKA MANAGIA"
      />
    </HtmlBlaze>
  </section>
</template>

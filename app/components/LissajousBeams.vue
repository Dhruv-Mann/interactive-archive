<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRafWhenVisible } from '~/composables/useRafWhenVisible';

const props = withDefaults(defineProps<{
  originX?: number;
  originY?: number;
  spread?: number;
}>(), {
  originX: 0.5,
  originY: 0.35,
  spread: 1.2,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let gradient: CanvasGradient | null = null;
const paths: Path2D[] = [];
const lineWidths: number[] = [];
const dashPatterns: number[][] = [];
const dashSpeeds: number[] = [];
let cachedW = 0;
let cachedH = 0;

const waves = [
  { baseOffset: 0.10, amp: 0.05, freq: 0.015, speed: 2.0, phase: 0 },
  { baseOffset: 0.16, amp: 0.08, freq: 0.010, speed: 1.5, phase: Math.PI / 3 },
  { baseOffset: 0.24, amp: 0.12, freq: 0.005, speed: 1.0, phase: Math.PI / 1.5 },
];

function rebuildCache() {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const width = canvas.parentElement?.clientWidth || window.innerWidth;
  const height = canvas.parentElement?.clientHeight || window.innerHeight;
  if (width === cachedW && height === cachedH && paths.length) return;

  canvas.width = width;
  canvas.height = height;
  cachedW = width;
  cachedH = height;
  ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) return;

  const startX = width * props.originX;
  const startY = height * props.originY;
  const endY = height;

  gradient = ctx.createLinearGradient(0, startY, 0, endY);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(181, 126, 220, 1)');

  paths.length = 0;
  lineWidths.length = 0;
  dashPatterns.length = 0;
  dashSpeeds.length = 0;

  for (const direction of [-1, 1]) {
    waves.forEach((wave, index) => {
      const path = new Path2D();
      path.moveTo(startX, startY);
      for (let y = startY; y <= endY; y += 2) {
        const progress = (y - startY) / (endY - startY);
        const envelope = Math.sin(progress * Math.PI);
        const xOffset = wave.baseOffset * width * props.spread * envelope;
        path.lineTo(startX + direction * xOffset, y);
      }
      paths.push(path);
      lineWidths.push(3 - index * 0.5);
      dashPatterns.push([100 + index * 20, 150 + index * 30]);
      dashSpeeds.push(wave.speed);
    });
  }
}

function tick(now: number) {
  if (!canvasRef.value || !ctx || !gradient || !paths.length) return;
  const canvas = canvasRef.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = gradient;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(181, 126, 220, 0.5)';
  ctx.shadowBlur = 10;

  // Wall-clock phase so pausing off-screen does not desync dash flow.
  const time = now * 0.12;

  for (let i = 0; i < paths.length; i++) {
    ctx.lineWidth = lineWidths[i];

    ctx.setLineDash([]);
    ctx.globalAlpha = 0.15;
    ctx.lineDashOffset = 0;
    ctx.stroke(paths[i]);

    ctx.setLineDash(dashPatterns[i]);
    ctx.lineDashOffset = -time * dashSpeeds[i];
    ctx.globalAlpha = 1.0;
    ctx.stroke(paths[i]);
  }

  ctx.globalAlpha = 1;
}

useRafWhenVisible(canvasRef, tick, { rootMargin: '20% 0px' });

onMounted(() => {
  rebuildCache();
  window.addEventListener('resize', rebuildCache, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', rebuildCache);
});
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full pointer-events-none absolute inset-0 z-10"></canvas>
</template>

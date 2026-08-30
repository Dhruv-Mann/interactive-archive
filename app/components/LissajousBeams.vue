<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = withDefaults(defineProps<{
  originX?: number; // 0 to 1 (percentage)
  originY?: number; // 0 to 1 (percentage)
  spread?: number; // Global width multiplier
}>(), {
  originX: 0.5,
  originY: 0.35, // Hand
  spread: 1.2,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;
let time = 0;

// Defines the 3 unique wave characteristics. Amp and offset are percentages of canvas width.
const waves = [
  { baseOffset: 0.10, amp: 0.05, freq: 0.015, speed: 2.0, phase: 0 },
  { baseOffset: 0.16, amp: 0.08, freq: 0.010, speed: 1.5, phase: Math.PI / 3 },
  { baseOffset: 0.24, amp: 0.12, freq: 0.005, speed: 1.0, phase: Math.PI / 1.5 },
];

function resize() {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
  canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
}

function render() {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const startX = canvas.width * props.originX;
  const startY = canvas.height * props.originY;
  const endY = canvas.height;

  // Create vertical gradient: Top 70% White -> Bottom 30% Purple
  const gradient = ctx.createLinearGradient(0, startY, 0, endY);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(181, 126, 220, 1)');

  ctx.strokeStyle = gradient;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(181, 126, 220, 0.5)';
  ctx.shadowBlur = 10;

  time += 2.0; // Speed of the downward flow

  // Draw 6 lines (3 left, 3 right)
  [-1, 1].forEach((direction) => {
    waves.forEach((wave, index) => {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Line thickness varies slightly per wave for depth
      ctx.lineWidth = 3 - index * 0.5;

      // Draw path downwards from hand to bottom
      for (let y = startY; y <= endY; y += 2) {
        const progress = (y - startY) / (endY - startY);
        // Envelope starts at 0, peaks at 1 in the middle, ends at 0 (hourglass shape)
        const envelope = Math.sin(progress * Math.PI); 
        
        // Perfectly smooth nested curves (no snaking/wobble)
        const xOffset = wave.baseOffset * canvas.width * props.spread * envelope;
        
        const x = startX + direction * xOffset;
        ctx.lineTo(x, y);
      }
      
      // 1. Draw the persistent, dim base track
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.15;
      ctx.stroke();
      
      // 2. Draw the bright flowing energy pulses
      // Vary the dash pattern slightly per wave for a more organic feel
      ctx.setLineDash([100 + index * 20, 150 + index * 30]);
      ctx.lineDashOffset = -time * wave.speed; 
      ctx.globalAlpha = 1.0;
      ctx.stroke();
    });
  });

  animationFrameId = requestAnimationFrame(render);
}

onMounted(() => {
  resize();
  window.addEventListener('resize', resize);
  render();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full pointer-events-none absolute inset-0 z-10"></canvas>
</template>

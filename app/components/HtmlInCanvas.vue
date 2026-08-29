<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { toCanvas } from "html-to-image";

interface Props {
  shaderCode: string;
  uniforms?: Record<string, any>;
  autoPause?: boolean;
  frameRate?: number;
  interactive?: boolean;
  paused?: boolean;
  pixelRatio?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  autoPause: true,
  frameRate: 60,
  interactive: false,
  paused: false,
  pixelRatio: 1,
});

const containerRef = ref<HTMLElement | null>(null);
const slotRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isVisible = ref(true);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let material: THREE.ShaderMaterial | null = null;
let texture: THREE.CanvasTexture | null = null;
let animationFrameId: number | null = null;
let observer: IntersectionObserver | null = null;
let startTime = performance.now();

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const wrapperShader = `
  uniform sampler2D iChannel0;
  uniform vec3 iResolution;
  uniform float iTime;
  uniform float iHasContent;
  varying vec2 vUv;

  ${props.shaderCode}

  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
`;

async function updateTexture() {
  if (!slotRef.value || !material) return;

  // Wait for fonts to load before capturing to ensure text is visible
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }
  
  // Add a tiny delay to ensure DOM is fully painted
  await new Promise(resolve => setTimeout(resolve, 50));

  try {
    const canvas = await toCanvas(slotRef.value, {
      pixelRatio: props.pixelRatio,
      style: { opacity: '1' }, // Force opacity 1 during capture since the DOM node is opacity-0
      skipFonts: false
    });

    if (texture) texture.dispose();
    texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    material.uniforms.iChannel0.value = texture;
    material.uniforms.iHasContent.value = 1.0;
  } catch {
    if (material) material.uniforms.iHasContent.value = 0.0;
  }
}

function initThree() {
  if (!containerRef.value || !canvasRef.value) return;

  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const parsedUniforms: Record<string, THREE.IUniform> = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3(width, height, 1) },
    iChannel0: { value: null },
    iHasContent: { value: 0.0 },
  };

  if (props.uniforms) {
    for (const key in props.uniforms) {
      parsedUniforms[key] = { value: props.uniforms[key] };
    }
  }

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: wrapperShader,
    uniforms: parsedUniforms,
    transparent: true,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    precision: "highp",
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, props.pixelRatio));
}

function render() {
  // Always queue next frame to keep loop alive
  animationFrameId = requestAnimationFrame(render);

  // Skip heavy WebGL calls if off-screen or manually paused
  if (props.paused || !isVisible.value) return;

  const currentTime = (performance.now() - startTime) / 1000;
  if (material) {
    material.uniforms.iTime.value = currentTime;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

watch(
  () => props.uniforms,
  (newVal) => {
    if (!material || !newVal) return;
    for (const key in newVal) {
      if (material.uniforms[key]) {
        material.uniforms[key].value = newVal[key];
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  initThree();
  updateTexture();
  render();

  // Performance Optimization: Only render when near viewport
  if (containerRef.value && typeof window !== 'undefined') {
    observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.value = entry.isIntersecting;
      },
      { rootMargin: '100% 0px', threshold: 0 }
    );
    observer.observe(containerRef.value);
  }
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  renderer?.dispose();
  if (observer) observer.disconnect();
});
</script>

<template>
  <div ref="containerRef" :class="['relative overflow-hidden', props.class]">
    <div ref="slotRef" class="pointer-events-none absolute inset-0 opacity-0">
      <slot />
    </div>
    <canvas ref="canvasRef" class="h-full w-full pointer-events-none" />
  </div>
</template>

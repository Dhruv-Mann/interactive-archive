<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { toCanvas } from "html-to-image";
import { useRafWhenVisible } from "~/composables/useRafWhenVisible";

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

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let material: THREE.ShaderMaterial | null = null;
let texture: THREE.CanvasTexture | null = null;
let geometry: THREE.PlaneGeometry | null = null;
let resizeObserver: ResizeObserver | null = null;
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

  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  await new Promise(resolve => setTimeout(resolve, 50));

  try {
    const canvas = await toCanvas(slotRef.value, {
      pixelRatio: props.pixelRatio,
      style: { opacity: '1' },
      skipFonts: false
    });

    if (texture) texture.dispose();
    texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    material.uniforms.iChannel0.value = texture;
    material.uniforms.iHasContent.value = 1.0;
  } catch {
    if (material) material.uniforms.iHasContent.value = 0.0;
  }
}

function applySize() {
  if (!containerRef.value || !renderer || !material) return;
  const width = Math.max(1, containerRef.value.clientWidth);
  const height = Math.max(1, containerRef.value.clientHeight);
  renderer.setSize(width, height, false);
  material.uniforms.iResolution.value.set(width, height, 1);
}

function initThree() {
  if (!containerRef.value || !canvasRef.value) return;

  const width = Math.max(1, containerRef.value.clientWidth);
  const height = Math.max(1, containerRef.value.clientHeight);

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
    depthTest: false,
    depthWrite: false,
  });

  geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    precision: "highp",
    powerPreference: "high-performance",
    stencil: false,
    depth: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, props.pixelRatio));
  renderer.setSize(width, height, false);
}

function tick(now: number) {
  if (props.paused || !renderer || !scene || !camera || !material) return;
  material.uniforms.iTime.value = (now - startTime) / 1000;
  renderer.render(scene, camera);
}

useRafWhenVisible(containerRef, tick, { rootMargin: '25% 0px' });

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

  if (containerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => applySize());
    resizeObserver.observe(containerRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  texture?.dispose();
  geometry?.dispose();
  material?.dispose();
  renderer?.dispose();
  texture = null;
  geometry = null;
  material = null;
  renderer = null;
  scene = null;
  camera = null;
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

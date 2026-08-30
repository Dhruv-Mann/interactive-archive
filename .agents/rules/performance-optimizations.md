---
description: Advanced UI Performance Guidelines
---

# Enterprise-Grade UI Performance Optimizations

When building interactive experiences, complex canvas components, or heavy DOM manipulations, you MUST strictly apply these performance optimizations:

## 1. Animation Culling (Intersection & Visibility)
Never run `requestAnimationFrame` (rAF) loops or continuous library animations (like Swiper autoplay) when the user cannot see them.
- Always use `IntersectionObserver` to detect when a heavy component is in the viewport.
- Always attach a `visibilitychange` listener to `document` to detect tab switching.
- **Rule:** Start the `raf` loop ONLY when `(entry.isIntersecting && document.visibilityState === 'visible')`. Stop the loop completely otherwise.
- Apply this pattern to all WebGL loops, Canvas 2D loops, and GSAP/Swiper continuous auto-play functions.

## 2. Direct DOM Bypass for 1:1 Interactions
Never use Vue's reactivity system (`ref`, `reactive`, inline `:style` bindings) for raw mouse tracking, panning, dragging, or cursor following.
- Vue's VDOM thrashing will cause severe frame drops.
- **Rule:** Store the raw pointer values in a plain JS object (not `reactive`). Inside a `requestAnimationFrame` tick, calculate the lerp/easing, and apply the updates directly to the DOM using Vanilla JS: `elRef.value.style.transform = ...` or `style.left`.

## 3. Hardware-Accelerated Canvas Contexts
When initializing high-performance 2D canvases, always provide optimization hints.
- **Rule:** Use `canvas.getContext('2d', { alpha: true, desynchronized: true })`. The `desynchronized` hint bypasses the DOM compositor for lower latency rendering, critical for interactive canvases.

## 4. Centralized Font Preloading
Never use `@import` inside `<style scoped>` for Google Fonts. It blocks rendering and causes layout shifts.
- **Rule:** Always define fonts in `nuxt.config.ts` using the `@nuxtjs/google-fonts` module. Ensure `preload: true` and `display: 'swap'` are configured.

Respecting these guidelines is non-negotiable for maintaining 60fps on this interactive template.

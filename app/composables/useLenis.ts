/**
 * useLenis.ts
 *
 * Initialises Lenis smooth scroll and bridges it to GSAP ScrollTrigger's
 * internal ticker. Call once from the top-level component (SiteContent).
 *
 * PERF NOTE: We intentionally do NOT add lenis.on('scroll', ScrollTrigger.update).
 * The GSAP ticker bridge (gsap.ticker.add) already calls lenis.raf() which
 * internally triggers scroll events that GSAP reads. Double-calling
 * ScrollTrigger.update() was causing redundant layout recalculations at 60fps.
 */

import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

export function useLenis() {
  let lenis: Lenis | null = null
  let gsapTick: ((time: number) => void) | null = null

  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)

    lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.8,
      wheelMultiplier: 1.0,
      infinite: false,
    })

    // Single integration point: GSAP ticker drives Lenis.
    // ScrollTrigger reads window.scrollY which Lenis updates — no extra listener needed.
    gsapTick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(gsapTick)

    // Critical: prevents GSAP from throttling on slow frames and causing jank
    gsap.ticker.lagSmoothing(0)

    onUnmounted(() => {
      if (gsapTick) gsap.ticker.remove(gsapTick)
      lenis?.destroy()
      lenis = null
    })
  })

  return { getLenis: () => lenis }
}

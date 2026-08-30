import { onBeforeUnmount, watch, type Ref } from 'vue'

interface Options {
  rootMargin?: string
  pauseWhenHidden?: boolean
}

/**
 * Runs a rAF loop only while `el` is near the viewport (and the tab is visible).
 * The loop is cancelled outright when off-screen — not merely skipped — so
 * WebGL / canvas work does not compete with Lenis while the user is elsewhere.
 */
export function useRafWhenVisible(
  el: Ref<HTMLElement | null | undefined>,
  tick: (now: number) => void,
  options: Options = {},
) {
  const rootMargin = options.rootMargin ?? '25% 0px'
  const pauseWhenHidden = options.pauseWhenHidden ?? true

  let rafId = 0
  let inView = false
  let observer: IntersectionObserver | null = null

  const loop = (now: number) => {
    rafId = requestAnimationFrame(loop)
    tick(now)
  }

  const start = () => {
    if (rafId) return
    rafId = requestAnimationFrame(loop)
  }

  const stop = () => {
    if (!rafId) return
    cancelAnimationFrame(rafId)
    rafId = 0
  }

  const sync = () => {
    const tabVisible =
      !pauseWhenHidden
      || typeof document === 'undefined'
      || document.visibilityState === 'visible'
    if (inView && tabVisible) start()
    else stop()
  }

  const attach = (node: HTMLElement) => {
    if (typeof IntersectionObserver === 'undefined') {
      inView = true
      sync()
      return
    }
    observer?.disconnect()
    observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        sync()
      },
      { rootMargin, threshold: 0 },
    )
    observer.observe(node)
    inView = true
    sync()
  }

  watch(
    el,
    (node) => {
      if (node) {
        attach(node)
      } else {
        inView = false
        stop()
        observer?.disconnect()
        observer = null
      }
    },
    { immediate: true, flush: 'post' },
  )

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', sync)
  }

  onBeforeUnmount(() => {
    stop()
    observer?.disconnect()
    observer = null
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', sync)
    }
  })

  return { isRunning: () => rafId !== 0, start, stop }
}

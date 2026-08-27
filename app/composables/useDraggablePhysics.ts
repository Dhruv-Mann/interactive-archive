export function useDraggablePhysics() {
  const attachDraggable = (
    el: HTMLElement,
    options: {
      initialX?: number
      initialY?: number
      initialRotate?: number
      onDrop?: () => void
    } = {}
  ) => {
    let isDragging = false
    let startX = 0
    let startY = 0
    let currentX = options.initialX || 0
    let currentY = options.initialY || 0
    let currentRotate = options.initialRotate || 0
    let velocityX = 0
    let lastMouseX = 0

    el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRotate}deg)`
    el.style.setProperty('--rot', `${currentRotate}deg`)

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      startX = e.clientX - currentX
      startY = e.clientY - currentY
      lastMouseX = e.clientX
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
      el.style.zIndex = '100'
      el.style.transition = 'none'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      currentX = e.clientX - startX
      currentY = e.clientY - startY
      
      velocityX = e.clientX - lastMouseX
      lastMouseX = e.clientX
      
      // Dynamic tilt based on drag speed
      const dragTilt = currentRotate + Math.max(-15, Math.min(15, velocityX * 0.8))
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${dragTilt}deg) scale(1.05)`
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return
      isDragging = false
      el.releasePointerCapture(e.pointerId)
      el.style.cursor = 'grab'
      el.style.zIndex = '50'
      
      // Settle animation with spring decay
      el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRotate}deg) scale(1)`
      
      if (options.onDrop) {
        options.onDrop()
      }
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
    }
  }

  return { attachDraggable }
}

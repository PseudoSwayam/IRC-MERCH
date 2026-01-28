'use client'

import { useEffect, useRef } from 'react'
import { SmokeSystem } from '@/gl/smoke/SmokeSystem'

export default function SmokeEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const smokeSystemRef = useRef<SmokeSystem | null>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    console.log('🌫️ SmokeEffect: Component mounted', { canvas })

    // Initialize 3D smoke system
    smokeSystemRef.current = new SmokeSystem(canvas)

    // Scroll handler for smoke intensity
    const handleScroll = () => {
      if (!smokeSystemRef.current) return

      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = Math.min(Math.max(scrollTop / Math.max(docHeight, 1), 0), 1)

      smokeSystemRef.current.updateScrollProgress(scrollProgress)
    }

    // Use RAF for smooth scroll updates
    const updateScroll = () => {
      handleScroll()
      rafRef.current = requestAnimationFrame(updateScroll)
    }

    rafRef.current = requestAnimationFrame(updateScroll)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
      
      if (smokeSystemRef.current) {
        smokeSystemRef.current.destroy()
        smokeSystemRef.current = null
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 50,
        opacity: 0.68, // 🔍 B) Reduced from 0.75 for luxury subtlety (~10% reduction)
        width: '100%',
        height: '100%',
        mixBlendMode: 'screen', // Blend with background
        filter: 'blur(1px)', // Subtle blur for softer edges
      }}
    />
  )
}

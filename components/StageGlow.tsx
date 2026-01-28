'use client'

import { useEffect, useState, useRef } from 'react'

export default function StageGlow() {
  const [opacity, setOpacity] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    // Scroll handler with easing curve
    const handleScroll = () => {
      // Get the model section
      const modelSection = document.getElementById('model-section')
      if (!modelSection) return

      const rect = modelSection.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate progress based on section visibility
      // When section enters view (top of section at bottom of viewport) = 0
      // When section is centered = ~0.5
      // When section exits view (bottom of section at top of viewport) = 1
      const sectionHeight = rect.height
      const sectionTop = rect.top
      const sectionBottom = rect.bottom
      
      // More precise progress calculation
      let progress = 0
      if (sectionBottom > 0 && sectionTop < windowHeight) {
        // Section is in viewport
        const visibleTop = Math.max(0, -sectionTop)
        const visibleBottom = Math.min(sectionHeight, windowHeight - sectionTop)
        const visibleHeight = visibleBottom - visibleTop
        const centerOffset = (windowHeight / 2) - (sectionTop + sectionHeight / 2)
        
        // Normalize to 0-1 based on section scroll through viewport
        progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)))
      }
      
      // Apply easing curve: fade in smoothly, peak at middle, fade out
      // Using smoothstep-like easing for beautiful transitions
      const fadeIn = Math.min(1, Math.max(0, (progress - 0.05) / (0.35 - 0.05)))
      const smoothFadeIn = fadeIn * fadeIn * (3 - 2 * fadeIn) // smoothstep
      
      const fadeOut = Math.min(1, Math.max(0, (progress - 0.65) / (1.0 - 0.65)))
      const smoothFadeOut = 1 - (fadeOut * fadeOut * (3 - 2 * fadeOut)) // inverted smoothstep
      
      const alpha = smoothFadeIn * smoothFadeOut
      
      // Debug: log to console occasionally
      if (Math.random() < 0.02) {
        console.log('🎯 StageGlow:', { progress: progress.toFixed(3), alpha: alpha.toFixed(3), opacity: (alpha).toFixed(3) })
      }
      
      setOpacity(alpha)
    }

    // Use RAF for smooth updates
    const updateScroll = () => {
      handleScroll()
      rafRef.current = requestAnimationFrame(updateScroll)
    }

    rafRef.current = requestAnimationFrame(updateScroll)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial calculation
    handleScroll()

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        // Positioning: horizontally centered, BELOW the shirt (not behind)
        left: '50%',
        bottom: '15%', // Position from bottom for floor effect
        transform: 'translateX(-50%)',
        zIndex: 5, // Higher z-index to ensure visibility
        
        // Size: wide ellipse
        width: '700px',
        height: '280px',
        
        // Responsive sizing
        maxWidth: '95vw',
        
        // Opacity controlled by scroll - reduced for subtlety
        opacity: opacity * 0.5, // 50% max for subtle pedestal effect
        
        // Transition for smooth opacity changes
        transition: 'opacity 0.15s ease-out',
        
        // Will-change for performance
        willChange: 'opacity',
      }}
    >
      {/* Inner glow ellipse - MUCH brighter for visibility */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse closest-side, rgba(102, 217, 255, 0.65) 0%, rgba(64, 166, 230, 0.45) 25%, rgba(64, 166, 230, 0.25) 50%, rgba(64, 166, 230, 0.08) 70%, transparent 85%)',
          filter: 'blur(40px)',
          borderRadius: '50%',
        }}
      />
      
      {/* Middle glow for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse closest-side, rgba(102, 217, 255, 0.45) 0%, rgba(64, 166, 230, 0.25) 40%, transparent 70%)',
          filter: 'blur(60px)',
          borderRadius: '50%',
          transform: 'scale(1.2)',
        }}
      />
      
      {/* Outer glow for extra softness */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse closest-side, rgba(64, 166, 230, 0.35) 0%, rgba(64, 166, 230, 0.15) 35%, transparent 65%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          transform: 'scale(1.5)',
        }}
      />
    </div>
  )
}

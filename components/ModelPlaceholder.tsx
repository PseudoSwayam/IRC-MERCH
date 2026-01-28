'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const TshirtModel = dynamic(() => import('./TshirtModel'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
})

const SmokeEffect = dynamic(() => import('./SmokeEffect'), { 
  ssr: false 
})

const LightRays = dynamic(() => import('./LightRays'), {
  ssr: false
})

export default function ModelPlaceholder() {
  const ref = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "center center"]
  })
  
  // Apply spring physics for ultra-smooth scroll animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  useEffect(() => {
    // Use requestAnimationFrame for optimal performance
    let rafId: number
    
    const updateProgress = () => {
      const latest = smoothProgress.get()
      const clamped = Math.min(latest, 1)
      
      // Only update if value changed significantly (avoid unnecessary renders)
      if (Math.abs(clamped - scrollProgress) > 0.001) {
        setScrollProgress(clamped)
      }
      
      rafId = requestAnimationFrame(updateProgress)
    }
    
    rafId = requestAnimationFrame(updateProgress)
    
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [smoothProgress, scrollProgress])

  return (
    <section
      id="model-section"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: '#000000',
        willChange: 'transform', // Hint browser for optimization
      }}
    >
      {/* Smoke Effect - Full viewport coverage, outside the centered container */}
      <div className="absolute inset-0" style={{ zIndex: 5 }}>
        <SmokeEffect />
      </div>

      {/* � Light Rays - Center stage dramatic effect */}
      <div className="absolute inset-0" style={{ zIndex: 8, pointerEvents: 'none', opacity: scrollProgress * 0.6 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#66D9FF"
          raysSpeed={0.5}
          lightSpread={0.8}
          rayLength={2.5}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0.1}
          distortion={0.05}
          pulsating={false}
          fadeDistance={0.9}
          saturation={0.85}
        />
      </div>

      {/* �💎 Light Halo Behind Shirt - Makes it pop like on stage */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 6,
          background: 'radial-gradient(circle at center, rgba(64, 150, 255, 0.15) 0%, transparent 50%)',
          opacity: scrollProgress * 0.8, // Fade in with scroll
        }}
      />

      {/* 🔍 A) Slight center darkening vignette - Cinematic framing */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 7,
          background: 'radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.3) 80%)',
          opacity: scrollProgress * 0.6, // Very subtle
        }}
      />

      {/* Centered frame container - Properly centered with flex */}
      <div className="relative w-full max-w-6xl mx-auto px-6" style={{ zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ 
            duration: 1, 
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative w-full h-[80vh] md:aspect-[4/3] md:h-auto"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Invisible frame - for positioning only */}
          <div className="absolute inset-0 rounded-3xl" />
          
          {/* 3D Model Container - Optimized for mobile */}
          <div 
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{ 
              transform: 'translateZ(0)', // Just GPU acceleration, no scaling
              backfaceVisibility: 'hidden', // Prevent flicker
              zIndex: 10, // Above stage glow
            }}
          >
            <TshirtModel scrollProgress={scrollProgress} isMobile={isMobile} />
          </div>
        </motion.div>
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
    </section>
  )
}

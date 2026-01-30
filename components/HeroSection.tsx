'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRef, memo } from 'react'

function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  const scrollToModel = () => {
    const modelSection = document.getElementById('model-section')
    modelSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-3 mb-8 border border-blue-500/30 rounded-full bg-blue-500/5 backdrop-blur-xl"
          >
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            </div>
            <span className="text-sm font-mono text-blue-400 tracking-wider uppercase">
              Limited Edition • 2026
            </span>
          </motion.div>

          {/* Main heading */}
          <h1 className="font-display text-7xl md:text-9xl font-black mb-6 tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block bg-gradient-to-br from-white via-blue-100 to-blue-300 bg-clip-text text-transparent"
            >
              IRC MERCH
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="space-y-3 mb-12"
          >
            <p className="text-2xl md:text-3xl text-gray-400 font-light tracking-wide">
              ITER Robotics Club
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="px-4 py-1.5 border border-gray-800 rounded-full">Premium Quality</span>
              <span className="text-gray-700">•</span>
              <span className="px-4 py-1.5 border border-gray-800 rounded-full">Custom Designs</span>
              <span className="text-gray-700">•</span>
              <span className="px-4 py-1.5 border border-gray-800 rounded-full">Exclusive</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
    </motion.section>
  )
}

export default memo(HeroSection)

'use client'

import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'

// Lazy load heavy components with higher priority for GL
const GL = dynamic(() => import('@/gl/index').then(mod => ({ default: mod.GL })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />
})

const ModelPlaceholder = dynamic(() => import('@/components/ModelPlaceholder'), {
  loading: () => <div className="min-h-screen" />,
  ssr: false
})

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* 3D Particle Background - Always visible */}
      <div className="fixed inset-0 z-0">
        <GL hovering={false} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* 3D Model Placeholder Section */}
        <ModelPlaceholder />
      </div>
    </main>
  )
}

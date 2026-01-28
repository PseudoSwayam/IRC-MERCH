'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'

function Model({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF('/models/Tshirt.glb')
  const meshRef = useRef<THREE.Group>(null)
  
  // Smooth interpolation for rotation
  const targetRotation = useRef(0)
  const currentRotation = useRef(-Math.PI / 6)
  
  // Memoize rotation calculation
  const getTargetRotation = useMemo(() => {
    const initialRotation = -Math.PI / 6 // -30 degrees
    const rotationAmount = Math.PI * 7 / 6 // 210 degrees
    return initialRotation + (scrollProgress * rotationAmount)
  }, [scrollProgress])
  
  useFrame(() => {
    if (meshRef.current) {
      targetRotation.current = getTargetRotation
      
      // Smooth lerp for buttery animation (0.1 = smooth, 0.5 = responsive)
      currentRotation.current += (targetRotation.current - currentRotation.current) * 0.12
      
      meshRef.current.rotation.y = currentRotation.current
    }
  })
  
  return (
    <primitive 
      ref={meshRef}
      object={scene} 
      scale={1.8}
      position={[0, -3.2, 0]}
    />
  )
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  )
}

export default function TshirtModel({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 2]}
      frameloop="demand" // Only render when needed
      performance={{ min: 0.5 }} // Adaptive performance
    >
      <Suspense fallback={<Loader />}>
        {/* Optimized lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} castShadow={false} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#3b82f6" />
        <pointLight position={[-5, -5, -5]} intensity={0.6} color="#06b6d4" />
        
        <Model scrollProgress={scrollProgress} />
        
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}

// Preload the model
useGLTF.preload('/models/Tshirt.glb')

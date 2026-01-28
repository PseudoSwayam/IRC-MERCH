'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { Suspense, useRef, useMemo, useLayoutEffect } from 'react'
import * as THREE from 'three'

function Model({ scrollProgress, isMobile }: { scrollProgress: number; isMobile?: boolean }) {
  const { scene } = useGLTF('/models/Tshirt.glb')
  const meshRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  
  // Smooth interpolation for rotation
  const targetRotation = useRef(0)
  const currentRotation = useRef(-Math.PI / 6)
  
  // Calculate bounding box and reposition model
  useLayoutEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene)
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()
      
      box.getCenter(center)
      box.getSize(size)
      
      // Fully center model in world space (X, Y, Z)
      scene.position.x = -center.x
      scene.position.y = -center.y
      scene.position.z = -center.z
      
      // Small rightward offset for mobile if needed
      if (isMobile) {
        scene.position.x += size.x * 0.11
      } else {
        // Desktop slight right nudge for visual centering
        scene.position.x += size.x * 0.12
      }
      
      // Keep camera centered
      camera.position.y = 0
    }
  }, [scene, isMobile, camera])
  
  // Memoize rotation calculation
  const getTargetRotation = useMemo(() => {
    const initialRotation = -Math.PI / 6 // -30 degrees
    const rotationAmount = Math.PI * 7 / 6 // 210 degrees
    return initialRotation + (scrollProgress * rotationAmount)
  }, [scrollProgress])
  
  // Calculate scale based on bounding box
  const modelScale = useMemo(() => {
    const baseScale = 1.8
    return isMobile ? baseScale * 1.15 : baseScale
  }, [isMobile])
  
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
      scale={modelScale}
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

export default function TshirtModel({ scrollProgress = 0, isMobile = false }: { scrollProgress?: number; isMobile?: boolean }) {
  // Camera settings: closer distance and slightly wider FOV on mobile
  const cameraPosition: [number, number, number] = [0, 0, isMobile ? 8.2 : 10]
  const cameraFov = isMobile ? 50 : 45

  return (
    <Canvas
      camera={{ position: cameraPosition, fov: cameraFov }}
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
        
        <Model scrollProgress={scrollProgress} isMobile={isMobile} />
        
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}

// Preload the model
useGLTF.preload('/models/Tshirt.glb')

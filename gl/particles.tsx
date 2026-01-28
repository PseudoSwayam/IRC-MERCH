"use client"

import * as THREE from "three"
import { useMemo, useState, useRef } from "react"
import { createPortal, useFrame } from "@react-three/fiber"

import { DofPointsMaterial } from "./shaders/pointMaterial"
import { SimulationMaterial } from "./shaders/simulationMaterial"
import * as easing from "maath/easing"

// Custom FBO hook without drei
function useFBO(width: number, height: number, options: any) {
  return useMemo(() => {
    const target = new THREE.WebGLRenderTarget(width, height, options)
    return target
  }, [width, height])
}

export function Particles({
  speed,
  aperture,
  focus,
  size = 256,
  noiseScale = 1.0,
  noiseIntensity = 0.5,
  timeScale = 0.5,
  pointSize = 2.0,
  opacity = 1.0,
  planeScale = 1.0,
  useManualTime = false,
  manualTime = 0,
  introspect = false,
  ...props
}: {
  speed: number
  // fov: number
  aperture: number
  focus: number
  size: number
  noiseScale?: number
  noiseIntensity?: number
  timeScale?: number
  pointSize?: number
  opacity?: number
  planeScale?: number
  useManualTime?: boolean
  manualTime?: number
  introspect?: boolean
}) {
  // Ultra-smooth reveal animation
  const revealStartTime = useRef<number | null>(null)
  const [isRevealing, setIsRevealing] = useState(true)
  const revealDuration = 3.0 // Extended for maximum smoothness
  // Create simulation material with scale parameter
  const simulationMaterial = useMemo(() => {
    return new SimulationMaterial(planeScale)
  }, [planeScale])

  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  })

  const dofPointsMaterial = useMemo(() => {
    const m = new DofPointsMaterial()
    m.uniforms.positions.value = target.texture
    m.uniforms.initialPositions.value = simulationMaterial.uniforms.positions.value
    m.uniforms.uPlaneScale.value = planeScale // pass planeScale to color gradient normalization
    return m
  }, [simulationMaterial])

  const [scene] = useState(() => new THREE.Scene())
  const [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1))
  const [positions] = useState(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]))
  const [uvs] = useState(() => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]))

  const particles = useMemo(() => {
    const length = size * size
    const particles = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      const i3 = i * 3
      particles[i3 + 0] = (i % size) / size
      particles[i3 + 1] = i / size / size
    }
    return particles
  }, [size])

  useFrame((state, delta) => {
    if (!dofPointsMaterial || !simulationMaterial) return

    state.gl.setRenderTarget(target)
    state.gl.clear()
    // @ts-ignore
    state.gl.render(scene, camera)
    state.gl.setRenderTarget(null)

    // Use manual time if enabled, otherwise use elapsed time
    const currentTime = useManualTime ? manualTime : state.clock.elapsedTime

    // Initialize reveal start time on first frame
    if (revealStartTime.current === null) {
      revealStartTime.current = currentTime
    }

    // Calculate reveal progress
    const revealElapsed = currentTime - revealStartTime.current
    const revealProgress = Math.min(revealElapsed / revealDuration, 1.0)

    // Ultra-smooth easing with custom curve for beautiful expansion
    // Combining cubic ease-out with a gentle acceleration at the start
    const easeOutCubic = 1 - Math.pow(1 - revealProgress, 3)
    const easeInOutQuart = revealProgress < 0.5 
      ? 8 * revealProgress * revealProgress * revealProgress * revealProgress
      : 1 - Math.pow(-2 * revealProgress + 2, 4) / 2
    
    // Blend both for the most beautiful smooth reveal
    const easedProgress = easeOutCubic * 0.7 + easeInOutQuart * 0.3

    // Expand from center with extended radius for full coverage
    const revealFactor = easedProgress * 5.5 // Larger radius for complete, graceful reveal

    if (revealProgress >= 1.0 && isRevealing) {
      setIsRevealing(false)
    }

    dofPointsMaterial.uniforms.uTime.value = currentTime

    dofPointsMaterial.uniforms.uFocus.value = focus
    dofPointsMaterial.uniforms.uBlur.value = aperture

    easing.damp(dofPointsMaterial.uniforms.uTransition, "value", introspect ? 1.0 : 0.0, introspect ? 0.35 : 0.2, delta)

    simulationMaterial.uniforms.uTime.value = currentTime
    simulationMaterial.uniforms.uNoiseScale.value = noiseScale
    simulationMaterial.uniforms.uNoiseIntensity.value = noiseIntensity
    simulationMaterial.uniforms.uTimeScale.value = timeScale * speed

    // Update point material uniforms
    dofPointsMaterial.uniforms.uPointSize.value = pointSize
    dofPointsMaterial.uniforms.uOpacity.value = opacity
    dofPointsMaterial.uniforms.uRevealFactor.value = revealFactor
    dofPointsMaterial.uniforms.uRevealProgress.value = easedProgress
  })

  return (
    <>
      {createPortal(
        // @ts-ignore
        <mesh material={simulationMaterial}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
          </bufferGeometry>
        </mesh>,
        // @ts-ignore
        scene,
      )}
      {/* @ts-ignore */}
      <points material={dofPointsMaterial} {...props}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
      </points>

      {/* Plane showing simulation texture */}
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={target.texture} />
      </mesh> */}
    </>
  )
}

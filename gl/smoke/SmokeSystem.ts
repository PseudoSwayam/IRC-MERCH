import * as THREE from 'three'
import { smokeVertexShader } from './smokeVertexShader'
import { smokeFragmentShader } from './smokeFragmentShader'

export class SmokeSystem {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private smokeParticles: THREE.Points
  private material: THREE.ShaderMaterial
  private animationId: number | null = null
  private startTime: number
  private isDestroyed: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.startTime = Date.now()
    
    console.log('🌫️ SmokeSystem: Initializing...', {
      canvasSize: { width: canvas.width, height: canvas.height },
      windowSize: { width: window.innerWidth, height: window.innerHeight }
    })

    // Setup scene
    this.scene = new THREE.Scene()

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    this.camera.position.set(0, 0, 10) // Moved back for better view

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)
    
    console.log('🌫️ SmokeSystem: Renderer setup complete', {
      size: { width: window.innerWidth, height: window.innerHeight },
      pixelRatio: this.renderer.getPixelRatio()
    })

    // Create smoke particles
    this.smokeParticles = this.createSmokeParticles()
    this.scene.add(this.smokeParticles)
    
    console.log('🌫️ SmokeSystem: Smoke particles created', {
      particleCount: 260,
      materialType: 'ShaderMaterial',
      features: 'FBM noise, directional flow, color falloff'
    })

    // Get material reference
    this.material = this.smokeParticles.material as THREE.ShaderMaterial

    // Handle resize
    window.addEventListener('resize', this.handleResize)

    // Start animation
    this.animate()
    
    console.log('🌫️ SmokeSystem: Animation loop started')
  }

  private createSmokeParticles(): THREE.Points {
    // ═══════════════════════════════════════════════════════════
    // 🔥 220-300 smaller particles with varying scales
    // ═══════════════════════════════════════════════════════════
    const particleCount = 260 // Sweet spot for performance + quality
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const timeOffsets = new Float32Array(particleCount)
    const fromLeft = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)
    const scales = new Float32Array(particleCount)
    const rotations = new Float32Array(particleCount)

    // Spawn particles from both sides - heavier on sides, avoid center
    for (let i = 0; i < particleCount; i++) {
      const isLeft = i < particleCount / 2
      const side = isLeft ? 1.0 : 0.0
      
      // ─────────────────────────────────────────────────────────
      // Position: Keep particles on the SIDES (extend to screen edges)
      // ─────────────────────────────────────────────────────────
      // X: Left side = -10 to -15, Right side = 10 to 15 (matched!)
      const sideDistance = 10 + Math.random() * 5
      positions[i * 3] = isLeft ? -sideDistance : sideDistance
      
      // Y: Full vertical spread for wall-like effect
      const verticalSpread = Math.random() - 0.5
      positions[i * 3 + 1] = verticalSpread * 14 // Increased vertical coverage
      
      // Z: Depth layers - some closer, some further
      const depthBias = Math.pow(Math.random(), 1.5) // More particles further back
      positions[i * 3 + 2] = (depthBias - 0.5) * 10

      // ─────────────────────────────────────────────────────────
      // Size: Smaller base size (40-90 instead of 100-250)
      // ─────────────────────────────────────────────────────────
      sizes[i] = 40 + Math.random() * 50
      
      // ─────────────────────────────────────────────────────────
      // Scale: Overlapping layers with different sizes
      // ─────────────────────────────────────────────────────────
      const scaleRandom = Math.random()
      if (scaleRandom < 0.3) {
        scales[i] = 0.4 + Math.random() * 0.3 // Small particles (30%)
      } else if (scaleRandom < 0.7) {
        scales[i] = 0.7 + Math.random() * 0.5 // Medium particles (40%)
      } else {
        scales[i] = 1.2 + Math.random() * 0.8 // Large particles (30%)
      }
      
      // ─────────────────────────────────────────────────────────
      // Timing & Movement
      // ─────────────────────────────────────────────────────────
      timeOffsets[i] = Math.random() * Math.PI * 2
      fromLeft[i] = side
      speeds[i] = 0.4 + Math.random() * 0.6 // Varied speeds
      
      // ─────────────────────────────────────────────────────────
      // Rotation: Random rotation for variety
      // ─────────────────────────────────────────────────────────
      rotations[i] = Math.random() * Math.PI * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aTimeOffset', new THREE.BufferAttribute(timeOffsets, 1))
    geometry.setAttribute('aFromLeft', new THREE.BufferAttribute(fromLeft, 1))
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aRotation', new THREE.BufferAttribute(rotations, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uColor1: { value: new THREE.Color(0x0026ff) }, // Deep blue (not used directly now)
        uColor2: { value: new THREE.Color(0x00d4ff) }, // Cyan (not used directly now)
      },
      vertexShader: smokeVertexShader,
      fragmentShader: smokeFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    })

    return new THREE.Points(geometry, material)
  }

  private handleResize = () => {
    if (this.isDestroyed) return

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight
    )
  }

  public updateScrollProgress(progress: number) {
    if (this.isDestroyed) return
    
    // Clamp progress between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress))
    this.material.uniforms.uScrollProgress.value = clampedProgress
    
    // Log occasionally for debugging
    if (Math.random() < 0.01) {
      console.log('🌫️ SmokeSystem: Scroll update', { 
        progress: clampedProgress.toFixed(3),
        alpha: this.material.uniforms.uScrollProgress.value 
      })
    }
  }

  private animate = () => {
    if (this.isDestroyed) return

    this.animationId = requestAnimationFrame(this.animate)

    const elapsedTime = (Date.now() - this.startTime) * 0.001
    this.material.uniforms.uTime.value = elapsedTime

    this.renderer.render(this.scene, this.camera)
  }

  public destroy() {
    this.isDestroyed = true

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
    }

    window.removeEventListener('resize', this.handleResize)

    // Dispose geometry and material
    this.smokeParticles.geometry.dispose()
    this.material.dispose()

    // Dispose renderer
    this.renderer.dispose()
  }
}

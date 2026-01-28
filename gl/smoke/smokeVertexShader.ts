export const smokeVertexShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollProgress;
uniform vec2 uResolution;

attribute float aSize;
attribute float aTimeOffset;
attribute float aFromLeft;
attribute float aSpeed;
attribute float aScale;
attribute float aRotation;

varying float vAlpha;
varying vec2 vUv;
varying float vProgress;
varying float vRotation;
varying float vDepth; // Pass depth to fragment shader for color temperature
varying float vWorldX; // Pass world X position for center masking

// ═══════════════════════════════════════════════════════════
// 🌊 SIMPLEX NOISE for Organic Flow
// ═══════════════════════════════════════════════════════════

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// ═══════════════════════════════════════════════════════════
// 🎯 MAIN VERTEX SHADER
// ═══════════════════════════════════════════════════════════

void main() {
  vUv = uv;
  vRotation = aRotation + uTime * 0.1; // Slow rotation over time
  
  // Time with per-particle offset
  float time = uTime * 0.3 + aTimeOffset * 10.0;
  
  // ─────────────────────────────────────────────────────────
  // Scroll Progress with proper fade curve
  // ─────────────────────────────────────────────────────────
  vProgress = uScrollProgress;
  
  vec3 pos = position;
  
  // ─────────────────────────────────────────────────────────
  // 💎 NEW: Depth calculation for parallax & color temperature
  // ─────────────────────────────────────────────────────────
  // Normalize Z position to 0-1 range for depth effects
  vDepth = (pos.z + 5.0) / 10.0; // Map -5 to +5 → 0 to 1
  
  // ─────────────────────────────────────────────────────────
  // 💎 NEW: Velocity variation based on depth (parallax)
  // ─────────────────────────────────────────────────────────
  // Closer particles (higher Z) move faster, creating depth illusion
  float depthSpeed = 0.5 + vDepth * 1.0; // 0.5x to 1.5x speed
  
  // ─────────────────────────────────────────────────────────
  // Directional Flow: Keep on sides, minimal center movement
  // ─────────────────────────────────────────────────────────
  float direction = aFromLeft > 0.5 ? 1.0 : -1.0;
  
  // Minimal horizontal movement with depth-based parallax
  float xOffset = time * aSpeed * 0.05 * direction * uScrollProgress * depthSpeed;
  
  // ─────────────────────────────────────────────────────────
  // Turbulent Noise: Organic curling motion with depth parallax
  // ─────────────────────────────────────────────────────────
  float noiseScale = 0.4;
  
  // Horizontal curl with depth-based speed
  float curlX = snoise(vec2(pos.y * noiseScale + time * 0.2 * depthSpeed, time * 0.15));
  
  // Vertical flow with curl
  float curlY = snoise(vec2(pos.x * noiseScale + time * 0.15 * depthSpeed, time * 0.1));
  
  // Depth variation
  float curlZ = snoise(vec2(time * 0.12, pos.y * 0.2 + time * 0.08));
  
  // ─────────────────────────────────────────────────────────
  // Apply Movement - Stay on sides!
  // ─────────────────────────────────────────────────────────
  pos.x += xOffset + curlX * 0.2 * uScrollProgress; // Reduced curl from 0.4 to 0.2
  
  // 🔍 D) Add slight upward bias for realistic fog behavior
  float upwardDrift = time * 0.08 * uScrollProgress; // Gentle upward rise
  pos.y += sin(time * 0.4 + aTimeOffset) * 0.15 + curlY * 0.5 + upwardDrift;
  
  pos.z += curlZ * 0.4;
  
  // ─────────────────────────────────────────────────────────
  // 💎 NEW: Pass world X position for center protection
  // ─────────────────────────────────────────────────────────
  vWorldX = pos.x;
  
  // ─────────────────────────────────────────────────────────
  // Alpha Curve: Smooth fade in/out
  // ─────────────────────────────────────────────────────────
  float fadeIn = smoothstep(0.05, 0.3, vProgress);
  float fadeOut = 1.0 - smoothstep(0.7, 1.0, vProgress);
  vAlpha = fadeIn * fadeOut;
  
  // Per-particle alpha variation for depth
  vAlpha *= 0.6 + aSpeed * 0.4;
  
  // ─────────────────────────────────────────────────────────
  // Size: Smaller particles, varying scales
  // ─────────────────────────────────────────────────────────
  float sizeMultiplier = aSize * aScale * (0.3 + uScrollProgress * 0.7);
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = sizeMultiplier * (uResolution.y / 2.5) * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

export const smokeFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying float vAlpha;
varying vec2 vUv;
varying float vProgress;
varying float vRotation;
varying float vDepth; // For depth-based effects
varying float vWorldX; // For center protection mask

// ═══════════════════════════════════════════════════════════
// 🔥 FRACTAL BROWNIAN MOTION (FBM) - The Secret Sauce
// ═══════════════════════════════════════════════════════════

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  // Smooth interpolation
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

// Multi-octave fractal noise
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  // Layer 1: Base shape
  value += noise(p * frequency) * amplitude;
  
  // Layer 2: Breakup detail
  frequency *= 2.0;
  amplitude *= 0.5;
  value += noise(p * frequency) * amplitude;
  
  // Layer 3: Fine erosion
  frequency *= 2.0;
  amplitude *= 0.5;
  value += noise(p * frequency) * amplitude;
  
  return value;
}

// ═══════════════════════════════════════════════════════════
// 🎨 MAIN SHADER - ELITE EDITION
// ═══════════════════════════════════════════════════════════

void main() {
  // Get UV relative to point center
  vec2 uv = gl_PointCoord - 0.5;
  
  // Apply rotation for variety
  float c = cos(vRotation);
  float s = sin(vRotation);
  mat2 rot = mat2(c, -s, s, c);
  uv = rot * uv;
  
  // Distance from center
  float d = length(uv);
  
  // ─────────────────────────────────────────────────────────
  // 💎 IMPROVED: Sharper inner edge, softer outer edge
  // ─────────────────────────────────────────────────────────
  float innerEdge = smoothstep(0.5, 0.25, d); // Sharper falloff
  float outerEdge = smoothstep(0.5, 0.0, d);  // Softer outer glow
  float base = mix(outerEdge, innerEdge, 0.6); // Blend both
  
  // ─────────────────────────────────────────────────────────
  // Fractal Noise: Time-based distortion
  // ─────────────────────────────────────────────────────────
  vec2 noiseCoord = uv * 3.0 + uTime * 0.15;
  float n = fbm(noiseCoord);
  
  // Edge erosion with more detail
  float erosion = fbm(uv * 6.0 + uTime * 0.18); // Increased frequency for finer detail
  
  // ─────────────────────────────────────────────────────────
  // 💎 NEW: Scanline interference pattern (digital aesthetic)
  // ─────────────────────────────────────────────────────────
  float scanline = sin((gl_PointCoord.y + uTime * 0.05) * 60.0) * 0.5 + 0.5;
  float scanlineEffect = mix(1.0, scanline, 0.03); // Very subtle
  
  // ─────────────────────────────────────────────────────────
  // Smoke Shape: Combine base with noise
  // ─────────────────────────────────────────────────────────
  float smoke = base * n * (0.65 + erosion * 0.35) * scanlineEffect;
  
  // ─────────────────────────────────────────────────────────
  // 💎 NEW: Enhanced breathing density (slower, more subtle)
  // ─────────────────────────────────────────────────────────
  float slowBreath = 0.85 + sin(uTime * 0.15) * 0.15; // Slower pulse (0.15Hz)
  float fastBreath = sin(uTime * 0.8 + vRotation) * 0.05 + 1.0; // Original ±5%
  smoke *= slowBreath * fastBreath;
  
  // ─────────────────────────────────────────────────────────
  // Alpha Curve: Proper fade in/out
  // ─────────────────────────────────────────────────────────
  float scrollAlpha = smoothstep(0.05, 0.4, uScrollProgress) 
                    * (1.0 - smoothstep(0.6, 1.0, uScrollProgress));
  
  // ─────────────────────────────────────────────────────────
  // � C) Fade out earlier after reveal (0.6 instead of 0.75)
  // ─────────────────────────────────────────────────────────
  float revealFade = uScrollProgress < 0.6 ? 1.0 : 1.0 - smoothstep(0.6, 0.85, uScrollProgress);
  
  // Reduced max opacity for subtle polish (0.3 max)
  float finalAlpha = smoke * scrollAlpha * vAlpha * revealFade * 0.3;
  
  // ─────────────────────────────────────────────────────────
  // 💎 NEW: Center Protection (keep shirt in focus)
  // ─────────────────────────────────────────────────────────
  float centerMask = smoothstep(0.0, 4.0, abs(vWorldX)); // Fade smoke near center
  finalAlpha *= centerMask;
  
  // ─────────────────────────────────────────────────────────
  // 💎 IMPROVED: Color grade to ice blue/steel (luxury feel)
  // ─────────────────────────────────────────────────────────
  // Close particles = warm ice blue (0.4, 0.85, 1.0)
  // Far particles = cool steel (0.25, 0.65, 0.9)
  vec3 warmIce = vec3(0.4, 0.85, 1.0);      // Less saturated, cooler
  vec3 coolSteel = vec3(0.25, 0.65, 0.9);   // Steel blue
  vec3 deepNavy = vec3(0.0, 0.1, 0.35);     // Darker navy
  
  // Depth-based color temperature (less dramatic shift)
  vec3 depthColor = mix(warmIce, coolSteel, vDepth * 0.7);
  
  // Radial gradient from bright center to dark edges
  vec3 color = mix(deepNavy, depthColor, smoke * 0.8);
  
  // ─────────────────────────────────────────────────────────
  // 💎 NEW: Chromatic aberration on edges (RGB split)
  // ─────────────────────────────────────────────────────────
  float edgeFactor = smoothstep(0.2, 0.5, d);
  vec3 aberration = vec3(
    smoke * (1.0 + edgeFactor * 0.02), // R slightly outward
    smoke,                              // G centered
    smoke * (1.0 - edgeFactor * 0.02)  // B slightly inward
  );
  color *= aberration;
  
  // Add subtle energy glow in center
  float glow = smoothstep(0.5, 0.0, d) * 0.35;
  color += depthColor * glow;
  
  // Desaturate slightly for digital feel (reduced from 0.15 to 0.1)
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(color, vec3(gray), 0.1);
  
  // ─────────────────────────────────────────────────────────
  // Discard transparent pixels
  // ─────────────────────────────────────────────────────────
  if (finalAlpha < 0.01) discard;
  
  gl_FragColor = vec4(color, finalAlpha);
}
`

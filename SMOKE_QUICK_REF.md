# 🔥 Smoke Effect Quick Reference

## What Changed

### Shaders
- **Fragment Shader:** FBM noise, radial color falloff, proper alpha curves
- **Vertex Shader:** Directional flow, curl turbulence, varied particle scales

### Particle System
- **Count:** 100 → 260 particles
- **Size:** 40-90px (smaller, overlapping)
- **Layers:** 3 scale categories (small, medium, large)
- **Attributes:** Added `aScale` and `aRotation`

### Visual Style
- **Colors:** Cyan-blue center → deep navy edges
- **Opacity:** Max 0.4 (was unlimited)
- **Blur:** 1px CSS filter
- **Blend:** Screen mode with 0.85 opacity

### Movement
- **Flow:** Left → right, right ← left (converging)
- **Curl:** 3D turbulence with simplex noise
- **Fade:** Smooth in (0.05-0.4), smooth out (0.6-1.0)

## Key Files Modified

1. `gl/smoke/smokeFragmentShader.ts` - FBM + color system
2. `gl/smoke/smokeVertexShader.ts` - Flow + curl
3. `gl/smoke/SmokeSystem.ts` - 260 particles + attributes
4. `components/SmokeEffect.tsx` - CSS blur polish

## Result
✅ "Energy field opening" aesthetic  
✅ Matches sharp + digital landing page  
✅ Thin, wispy, heavier on sides  
✅ No blocking center content

## Test It
1. Start server: `npm run dev`
2. Open: http://localhost:3000
3. Scroll down to see smoke fade in/out
4. Observe: Fractal texture, directional flow, color gradient

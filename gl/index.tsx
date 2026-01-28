"use client"

import { Canvas } from "@react-three/fiber";
import { Particles } from "./particles";
import { Suspense } from "react";

export const GL = ({ hovering }: { hovering: boolean }) => {
  // Smooth wave parameters with robotic aesthetic
  const speed = 0.8; // Slower for smoother motion
  const focus = 3.8;
  const aperture = 1.79;
  const size = 384;
  const noiseScale = 0.5; // Lower for broader, smoother waves
  const noiseIntensity = 0.45; // Controlled intensity for smooth waves
  const timeScale = 1;
  const pointSize = 11.0; // Balanced size
  const opacity = 1.0;
  const planeScale = 10.0;
  const useManualTime = false;
  const manualTime = 0;
  
  return (
    <div id="webgl" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}>
      <Canvas
        camera={{
          position: [1.26, 2.66, -1.82],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
        gl={{ 
          antialias: true, // Enabled for smoothness
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]} // Higher quality rendering
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={["#000000"]} />
        <Suspense fallback={null}>
          <Particles
            speed={speed}
            aperture={aperture}
            focus={focus}
            size={size}
            noiseScale={noiseScale}
            noiseIntensity={noiseIntensity}
            timeScale={timeScale}
            pointSize={pointSize}
            opacity={opacity}
            planeScale={planeScale}
            useManualTime={useManualTime}
            manualTime={manualTime}
            introspect={hovering}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

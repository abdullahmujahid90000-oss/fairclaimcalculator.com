"use client";

import { useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Orb({
  position,
  scale,
  color,
  speed = 0.15,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.4;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color={color}
        distort={0.35}
        speed={1.2}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

/** Nudges the whole orb group toward the cursor, gently, on every frame. */
function ParallaxGroup({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, x * 0.6, 0.04);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, y * 0.3, 0.04);
  });

  return <group ref={group}>{children}</group>;
}

/**
 * The actual WebGL scene — three soft, blurred-looking distorted spheres
 * plus a faint particle field. Deliberately sparse: this sits behind hero
 * copy, so it must read as ambient texture, not a focal point.
 *
 * Always dynamically imported with `ssr: false` from `hero-background.tsx`
 * — never import this module directly from a server component.
 */
export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#5E6AD2" />
      <pointLight position={[-5, -3, -5]} intensity={20} color="#8B7CF6" />
      <ParallaxGroup>
        <Orb position={[-1.8, 0.6, -2]} scale={1.7} color="#5B62E0" speed={0.12} />
        <Orb position={[2, -0.8, -3]} scale={2.2} color="#4338CA" speed={0.08} />
        <Orb position={[0.6, 1.4, -4]} scale={1.1} color="#8B7CF6" speed={0.18} />
      </ParallaxGroup>
      <Sparkles count={60} scale={[8, 4, 4]} size={1.5} speed={0.15} opacity={0.25} color="#ffffff" />
    </Canvas>
  );
}

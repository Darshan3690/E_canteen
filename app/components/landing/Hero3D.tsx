"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Burger() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Gentle continuous rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={2}>
      {/* Top Bun - Soft, golden brown */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#EAB308" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Sesame Seeds (Instanced for performance, simplified here as small spheres) */}
      <mesh position={[0.4, 1.4, 0.2]} scale={0.05}>
        <sphereGeometry />
        <meshStandardMaterial color="#FEF3C7" />
      </mesh>
      <mesh position={[-0.3, 1.3, 0.4]} scale={0.05}>
        <sphereGeometry />
        <meshStandardMaterial color="#FEF3C7" />
      </mesh>
      <mesh position={[0, 1.5, -0.3]} scale={0.05}>
        <sphereGeometry />
        <meshStandardMaterial color="#FEF3C7" />
      </mesh>


      {/* Lettuce - Green wavy abstract */}
      <mesh position={[0, 0.25, 0]} rotation={[0.1, 0, 0.1]}>
        <cylinderGeometry args={[1.05, 1.05, 0.1, 32]} />
        <meshStandardMaterial color="#22C55E" roughness={0.4} />
      </mesh>
      
      {/* Tomato - Red slice */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.1, 32]} />
        <meshStandardMaterial color="#EF4444" roughness={0.2} />
      </mesh>

      {/* Cheese - Yellow abstract square with corners sticking out */}
      <mesh position={[0, -0.05, 0]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[1.6, 0.05, 1.6]} />
        <meshStandardMaterial color="#FACC15" roughness={0.3} />
      </mesh>

      {/* Patty - Dark Brown */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[1, 1, 0.3, 32]} />
        <meshStandardMaterial color="#5C3D2E" roughness={0.8} />
      </mesh>

      {/* Bottom Bun */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.95, 0.85, 0.4, 32]} />
        <meshStandardMaterial color="#EAB308" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="h-[400px] w-full md:h-[600px] pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={40} />
        <Environment preset="city" />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FFEDD5" />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#F97316" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Burger />
        </Float>

        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={4}
          color="#1C1917"
        />
      </Canvas>
    </div>
  );
}

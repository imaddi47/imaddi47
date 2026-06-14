"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * The footer "publisher's mark": a steam locomotive on a continuously rotating
 * turntable, rendered with react-three-fiber (real-time render loop so it always
 * spins). Modelled side-profile (length along X) and turned about Y.
 */

const STEEL = "#3a332b";
const STEEL_DARK = "#211c16";
const BRASS = "#c8973f";
const OXBLOOD = "#b4472b";
const EMBER = "#ff7a33";
const LAMP = "#ffd27a";

function Wheel({ x }: { x: number }) {
  return (
    <group position={[x, 5, 0]}>
      {[10, -10].map((z) => (
        <group key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[7, 7, 2.4, 22]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.6} roughness={0.45} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[7.2, 7.2, 0.7, 22]} />
            <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh>
            <boxGeometry args={[1.6, 13, 2.6]} />
            <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Locomotive() {
  return (
    <group scale={0.62}>
      {/* footplate */}
      <mesh position={[-2, 2, 0]}>
        <boxGeometry args={[72, 5, 26]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.55} roughness={0.5} />
      </mesh>
      {/* buffer beam */}
      <mesh position={[34, 6, 0]}>
        <boxGeometry args={[5, 11, 26]} />
        <meshStandardMaterial color={OXBLOOD} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* boiler */}
      <mesh position={[6, 15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[9, 9, 40, 26]} />
        <meshStandardMaterial color={STEEL} metalness={0.65} roughness={0.4} />
      </mesh>
      <mesh position={[27, 15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[9.4, 9.4, 8, 26]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.6} roughness={0.5} />
      </mesh>
      {[-2, 14].map((x) => (
        <mesh key={x} position={[x, 15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[9.1, 0.8, 8, 30]} />
          <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[2, 25, 0]}>
        <sphereGeometry args={[4.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.32} />
      </mesh>
      {/* chimney */}
      <mesh position={[22, 26, 0]}>
        <cylinderGeometry args={[3.2, 3.8, 10, 18]} />
        <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.45} />
      </mesh>
      <mesh position={[22, 31, 0]}>
        <cylinderGeometry args={[3.9, 3.9, 1.6, 18]} />
        <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.3} />
      </mesh>
      {/* headlamp */}
      <mesh position={[33, 18, 0]}>
        <sphereGeometry args={[2.6, 14, 14]} />
        <meshStandardMaterial color={LAMP} emissive={LAMP} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* cab */}
      <mesh position={[-22, 18, 0]}>
        <boxGeometry args={[20, 22, 22]} />
        <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.45} />
      </mesh>
      <mesh position={[-22, 30, 0]}>
        <boxGeometry args={[23, 2.4, 25]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.55} roughness={0.5} />
      </mesh>
      {[12, -12].map((z) => (
        <mesh key={z} position={[-22, 20, z]}>
          <boxGeometry args={[9, 9, 0.6]} />
          <meshStandardMaterial color={EMBER} emissive={EMBER} emissiveIntensity={1.7} toneMapped={false} />
        </mesh>
      ))}
      <Wheel x={20} />
      <Wheel x={-2} />
      <Wheel x={-22} />
    </group>
  );
}

function Turntable({ reduced, spin }: { reduced: boolean; spin: boolean }) {
  const loco = useRef<THREE.Group>(null);
  const steam = useRef<THREE.Group>(null);

  // On pointer devices, OrbitControls handles rotation (drag + auto-rotate). On
  // touch (no controls, to keep page scroll), we spin the loco here instead.
  useFrame((state, delta) => {
    if (loco.current && spin && !reduced) loco.current.rotation.y += delta * 0.55;
    if (steam.current && !reduced) {
      const t = state.clock.elapsedTime;
      steam.current.children.forEach((m, i) => {
        const mesh = m as THREE.Mesh;
        const life = (t * 0.4 + i / 8) % 1;
        mesh.position.set(0, 16 + life * 26, 0);
        mesh.scale.setScalar(0.4 + life * 2.4);
        (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - life) * 0.28;
      });
    }
  });

  return (
    <>
      <group ref={loco}>
        <Locomotive />
      </group>
      {!reduced && (
        <group ref={steam} position={[0, 14, 0]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i}>
              <sphereGeometry args={[3, 10, 10]} />
              <meshBasicMaterial color="#d8cdbb" transparent opacity={0.2} depthWrite={false} />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
}

export function LocoClip({ width = 240, height = 160, className }: { width?: number; height?: number; className?: string }) {
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine =
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  return (
    <div
      className={className}
      style={{ width, height, cursor: fine ? "grab" : "default" }}
      data-cursor={fine ? "hover" : undefined}
    >
      <Canvas
        frameloop="always"
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 32, position: [56, 34, 82], near: 1, far: 600 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} color="#6a5236" />
        <directionalLight position={[40, 60, 50]} intensity={2.6} color="#ffe7c4" />
        <directionalLight position={[-50, 10, -30]} intensity={0.8} color="#9a5a44" />
        <pointLight position={[10, 8, 0]} intensity={50} color={EMBER} distance={120} decay={1.5} />
        <Turntable reduced={reduced} spin={!fine} />
        {fine && (
          <OrbitControls
            makeDefault
            target={[0, 8, 0]}
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
            autoRotate={!reduced}
            autoRotateSpeed={1.1}
            minPolarAngle={Math.PI * 0.22}
            maxPolarAngle={Math.PI * 0.6}
          />
        )}
      </Canvas>
    </div>
  );
}

"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A small steam locomotive built from primitives — modelled as a top/¾ view
 * (length along local +Y, nose at +Y, top facing local +Z toward the camera)
 * so it reads while descending the vertical rail. Wheels spin and steam trails
 * in proportion to scroll speed.
 */

const STEEL = "#2b2620";
const STEEL_DARK = "#1c1813";
const BRASS = "#c8973f";
const OXBLOOD = "#b4472b";
const EMBER = "#ff7a33";
const LAMP = "#ffd27a";

type Props = {
  progress: RefObject<number>;
  reduced: boolean;
};

const STEAM_COUNT = 7;

export function Locomotive({ progress, reduced }: Props) {
  const wheels = useRef<THREE.Group>(null);
  const firebox = useRef<THREE.PointLight>(null);
  const steam = useRef<THREE.Group>(null);
  const prev = useRef(progress.current ?? 0);
  const phase = useRef(0);

  useFrame((_, delta) => {
    const p = progress.current ?? 0;
    const d = p - prev.current;
    prev.current = p;
    const speed = Math.min(Math.abs(d) * 60, 1); // 0..1 normalized scroll speed

    // wheels roll with travel
    if (wheels.current) wheels.current.rotation.x -= d * 90;

    // firebox breathes, brightens with effort
    if (firebox.current) {
      phase.current += delta * 4;
      const flicker = reduced ? 0 : Math.sin(phase.current) * 0.18;
      firebox.current.intensity = 7 + flicker * 7 + speed * 10;
    }

    // steam: each puff trails behind (local -Y) and toward camera (+Z), then resets
    if (steam.current && !reduced) {
      steam.current.children.forEach((puff: THREE.Object3D, i: number) => {
        const m = puff as THREE.Mesh;
        const life = ((phase.current * 0.12 + i / STEAM_COUNT) % 1);
        m.position.y = 22 - life * 46;
        m.position.z = 16 + life * 10;
        m.position.x = Math.sin((i + life) * 6) * 3;
        const s = 0.5 + life * 2.4;
        m.scale.setScalar(s);
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - life) * 0.32 * (0.4 + speed);
      });
    }
  });

  return (
    <group>
      {/* firebox glow that pools onto the rails as it passes */}
      <pointLight ref={firebox} position={[0, -14, 7]} color={EMBER} intensity={8} distance={70} decay={1.6} />

      {/* steam */}
      {!reduced && (
        <group ref={steam}>
          {Array.from({ length: STEAM_COUNT }).map((_, i) => (
            <mesh key={i} position={[0, 22, 16]}>
              <sphereGeometry args={[3, 10, 10]} />
              <meshBasicMaterial color="#d8cdbb" transparent opacity={0.2} depthWrite={false} />
            </mesh>
          ))}
        </group>
      )}

      {/* footplate */}
      <mesh position={[0, -2, 1]}>
        <boxGeometry args={[34, 66, 5]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.7} roughness={0.5} />
      </mesh>

      {/* buffer beam + buffers at the nose */}
      <mesh position={[0, 34, 5]}>
        <boxGeometry args={[34, 5, 11]} />
        <meshStandardMaterial color={OXBLOOD} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-10, 36, 5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 4, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh position={[10, 36, 5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 4, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.35} />
      </mesh>

      {/* boiler */}
      <mesh position={[0, 6, 9]}>
        <cylinderGeometry args={[9, 9, 34, 24]} />
        <meshStandardMaterial color={STEEL} metalness={0.82} roughness={0.38} />
      </mesh>
      {/* smokebox (front, slightly fatter + darker) */}
      <mesh position={[0, 26, 9]}>
        <cylinderGeometry args={[9.4, 9.4, 8, 24]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.75} roughness={0.5} />
      </mesh>
      {/* smokebox door */}
      <mesh position={[0, 30.2, 9]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[7.5, 7.5, 1.5, 24]} />
        <meshStandardMaterial color="#15110d" metalness={0.6} roughness={0.6} />
      </mesh>

      {/* brass boiler bands */}
      {[0, 14].map((y) => (
        <mesh key={y} position={[0, y, 9]} rotation={[0, 0, 0]}>
          <torusGeometry args={[9.1, 0.9, 8, 28]} />
          <meshStandardMaterial color={BRASS} metalness={0.95} roughness={0.3} />
        </mesh>
      ))}

      {/* steam dome + sand dome (brass-capped) */}
      <mesh position={[0, 10, 17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4, 4.6, 5, 18]} />
        <meshStandardMaterial color={BRASS} metalness={0.92} roughness={0.32} />
      </mesh>

      {/* chimney (points toward camera) */}
      <mesh position={[0, 24, 18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3.2, 3.8, 9, 18]} />
        <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, 24, 22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3.9, 3.9, 1.6, 18]} />
        <meshStandardMaterial color={BRASS} metalness={0.95} roughness={0.3} />
      </mesh>

      {/* headlamp at the nose */}
      <mesh position={[0, 32, 12]}>
        <sphereGeometry args={[2.6, 14, 14]} />
        <meshStandardMaterial color={LAMP} emissive={LAMP} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>

      {/* cab */}
      <mesh position={[0, -18, 11]}>
        <boxGeometry args={[22, 20, 18]} />
        <meshStandardMaterial color={STEEL} metalness={0.78} roughness={0.42} />
      </mesh>
      {/* cab roof */}
      <mesh position={[0, -18, 21]}>
        <boxGeometry args={[25, 22, 2.4]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.7} roughness={0.5} />
      </mesh>
      {/* warm cab windows */}
      <mesh position={[11.2, -18, 12]}>
        <boxGeometry args={[0.6, 11, 8]} />
        <meshStandardMaterial color={EMBER} emissive={EMBER} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <mesh position={[-11.2, -18, 12]}>
        <boxGeometry args={[0.6, 11, 8]} />
        <meshStandardMaterial color={EMBER} emissive={EMBER} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>

      {/* wheels */}
      <group ref={wheels}>
        {[
          [-15, 12],
          [15, 12],
          [-15, -6],
          [15, -6],
          [-15, -20],
          [15, -20],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, 2]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[6.4, 6.4, 3, 20]} />
              <meshStandardMaterial color={STEEL_DARK} metalness={0.8} roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.7, 0]}>
              <cylinderGeometry args={[6.6, 6.6, 0.8, 20]} />
              <meshStandardMaterial color={BRASS} metalness={0.95} roughness={0.3} />
            </mesh>
            {/* spoke bar so rotation is visible */}
            <mesh>
              <boxGeometry args={[1.6, 11.5, 3.4]} />
              <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.35} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

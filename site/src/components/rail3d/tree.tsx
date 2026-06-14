"use client";

import * as THREE from "three";

/**
 * A small low-poly conifer for trackside checkpoints. Stands along local +Y.
 * Two variants (slightly different proportions) so adjacent stations differ.
 */

const TRUNK = "#3a2a1b";
const FOLIAGE = "#52602f";
const FOLIAGE_HI = "#6d7a3c";

type Props = {
  position?: [number, number, number];
  variant?: number;
  active?: boolean;
};

export function Tree({ position = [0, 0, 0], variant = 0, active = false }: Props) {
  const s = variant === 0 ? 1 : 0.88;
  const lit = active ? FOLIAGE_HI : FOLIAGE;
  return (
    <group position={position} scale={s}>
      {/* trunk — stands along +Y (up the page), perpendicular to the descending track */}
      <mesh position={[0, 8, 0]}>
        <cylinderGeometry args={[1.6, 2.2, 18, 8]} />
        <meshStandardMaterial color={TRUNK} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* stacked foliage cones */}
      <mesh position={[0, 20, 0]} castShadow>
        <coneGeometry args={[11, 18, 12]} />
        <meshStandardMaterial color={lit} roughness={0.85} metalness={0.05} flatShading />
      </mesh>
      <mesh position={[0, 30, 0]}>
        <coneGeometry args={[8.5, 15, 12]} />
        <meshStandardMaterial color={lit} roughness={0.85} metalness={0.05} flatShading />
      </mesh>
      <mesh position={[0, 39, 0]}>
        <coneGeometry args={[6, 12, 12]} />
        <meshStandardMaterial color={FOLIAGE_HI} roughness={0.85} metalness={0.05} flatShading />
      </mesh>
    </group>
  );
}

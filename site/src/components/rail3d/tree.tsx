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
  scale?: number;
};

export function Tree({ position = [0, 0, 0], variant = 0, active = false, scale = 1 }: Props) {
  const s = (variant === 0 ? 1 : 0.9) * scale;
  const lit = active ? FOLIAGE_HI : FOLIAGE;
  return (
    <group position={position} scale={s}>
      {/* trunk — stands along +Y (up the page), perpendicular to the descending track */}
      <mesh position={[0, 11, 0]}>
        <cylinderGeometry args={[2.4, 3.4, 26, 8]} />
        <meshStandardMaterial color={TRUNK} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* stacked foliage cones */}
      <mesh position={[0, 30, 0]}>
        <coneGeometry args={[17, 28, 12]} />
        <meshStandardMaterial color={lit} roughness={0.85} metalness={0.05} flatShading />
      </mesh>
      <mesh position={[0, 46, 0]}>
        <coneGeometry args={[13, 23, 12]} />
        <meshStandardMaterial color={lit} roughness={0.85} metalness={0.05} flatShading />
      </mesh>
      <mesh position={[0, 60, 0]}>
        <coneGeometry args={[9, 18, 12]} />
        <meshStandardMaterial color={FOLIAGE_HI} roughness={0.85} metalness={0.05} flatShading />
      </mesh>
    </group>
  );
}

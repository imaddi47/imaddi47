"use client";

import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

/**
 * Trackside nature, lining the descending rail. Everything here lives inside
 * the SnakeScene `world` group, so it rides the same scroll-anchored parallax
 * as the rails and the engine. Placement is seeded (stable across frames) and
 * hugs the rails on the outer side, sitting on the track's own plane so it
 * reads as scenery lining the line rather than objects floating in space.
 *
 * Every prop is drawn with GPU instancing: all rocks share one draw call, all
 * shrubs another, and so on. The whole scatter costs four draw calls total
 * regardless of how many props there are, which keeps weaker GPUs smooth.
 */

const TRUNK = "#3a2a1b";
const WOOD = "#4a3626";
const WOOD_HI = "#5a4632";
const ROCK = ["#5a5142", "#6b5d49", "#463f33"];
const LEAF = ["#52602f", "#6d7a3c", "#3f4a26", "#7a7338"];

/** Tiny deterministic PRNG so the scatter is stable between renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Instance = { m: THREE.Matrix4; color: THREE.Color };

type Props = {
  docHeight: number;
  trackX: (d: number) => number;
  zAmp: number;
  /** rough density: items per 1000px of document */
  density?: number;
};

const GAUGE_HALF = 16; // matches SnakeScene rail gauge
const KINDS = ["tree", "rocks", "bush", "grass", "stump"] as const;
const WEIGHTS = [3, 2, 3, 2, 1];

export function Scatter({ docHeight, trackX, zAmp, density = 5 }: Props) {
  const { rocks, bushes, cones, cylinders } = useMemo(() => {
    const rand = mulberry32(0x5eed ^ Math.round(docHeight));
    const top = 420; // leave the cover header clear
    const bottom = 240;
    const usable = Math.max(1, docHeight - top - bottom);
    const count = Math.min(90, Math.max(8, Math.round((usable / 1000) * density)));
    const bag = KINDS.flatMap((k, i) => Array(WEIGHTS[i]).fill(k) as (typeof KINDS)[number][]);

    const rocks: Instance[] = [];
    const bushes: Instance[] = [];
    const cones: Instance[] = []; // grass blades + tree foliage
    const cylinders: Instance[] = []; // stumps + tree trunks

    const v = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();

    // World transform of one prop part = item transform × local part transform.
    const part = (
      bucket: Instance[],
      item: THREE.Matrix4,
      pos: [number, number, number],
      rot: [number, number, number],
      scale: [number, number, number],
      hex: string,
    ) => {
      const local = new THREE.Matrix4().compose(
        v.set(pos[0], pos[1], pos[2]),
        q.setFromEuler(e.set(rot[0], rot[1], rot[2])),
        s.set(scale[0], scale[1], scale[2]),
      );
      bucket.push({ m: item.clone().multiply(local), color: new THREE.Color(hex) });
    };

    for (let i = 0; i < count; i++) {
      const d = top + ((i + rand() * 0.85) / count) * usable;
      const baseX = trackX(d);
      const sign = baseX === 0 ? (rand() < 0.5 ? -1 : 1) : Math.sign(baseX);
      const x = baseX + sign * (GAUGE_HALF + 8 + rand() * 56);
      const z = zAmp * Math.sin(d * 0.01) - 2 + (rand() - 0.5) * 6;
      const kind = bag[Math.floor(rand() * bag.length)];
      const scale = kind === "tree" ? 1.0 + rand() * 1.0 : 0.9 + rand() * 0.9;

      const item = new THREE.Matrix4().compose(
        new THREE.Vector3(x, -d, z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand() * Math.PI * 2, 0)),
        new THREE.Vector3(scale, scale, scale),
      );
      const rng = mulberry32(Math.floor(rand() * 1e9));

      if (kind === "rocks") {
        const lumps = 2 + Math.floor(rng() * 2);
        for (let j = 0; j < lumps; j++) {
          const r = 5 + rng() * 6;
          const sy = 0.7 + rng() * 0.4;
          part(rocks, item, [(rng() - 0.5) * 14, r * 0.45, (rng() - 0.5) * 12], [(rng() - 0.5) * 0.4, rng() * Math.PI, (rng() - 0.5) * 0.4], [r, r * sy, r], ROCK[j % ROCK.length]);
        }
      } else if (kind === "bush") {
        const blobs = 3 + Math.floor(rng() * 2);
        for (let j = 0; j < blobs; j++) {
          const r = 7 + rng() * 5;
          part(bushes, item, [(rng() - 0.5) * 16, r * 0.6 + rng() * 3, (rng() - 0.5) * 12], [rng() * Math.PI, rng() * Math.PI, 0], [r, r, r], LEAF[j % LEAF.length]);
        }
      } else if (kind === "grass") {
        const blades = 5 + Math.floor(rng() * 4);
        const c = LEAF[Math.floor(rng() * LEAF.length)];
        for (let j = 0; j < blades; j++) {
          const h = 9 + rng() * 9;
          const lean = (rng() - 0.5) * 0.5;
          part(cones, item, [(rng() - 0.5) * 12, h / 2, (rng() - 0.5) * 10], [lean, rng() * Math.PI, lean], [1.1, h, 1.1], c);
        }
      } else if (kind === "stump") {
        const h = 9 + rng() * 6;
        const r = 5 + rng() * 2;
        part(cylinders, item, [0, h / 2, 0], [0, 0, 0], [r, h, r], WOOD);
        part(cylinders, item, [0, h, 0], [0, 0, 0], [r * 0.9, 1.4, r * 0.9], WOOD_HI);
      } else {
        // tree: trunk (cylinder) + three stacked foliage cones
        part(cylinders, item, [0, 11, 0], [0, 0, 0], [3, 26, 3], TRUNK);
        part(cones, item, [0, 30, 0], [0, 0, 0], [17, 28, 17], LEAF[0]);
        part(cones, item, [0, 46, 0], [0, 0, 0], [13, 23, 13], LEAF[1]);
        part(cones, item, [0, 60, 0], [0, 0, 0], [9, 18, 9], LEAF[1]);
      }
    }
    return { rocks, bushes, cones, cylinders };
  }, [docHeight, trackX, zAmp, density]);

  const rockRef = useRef<THREE.InstancedMesh>(null);
  const bushRef = useRef<THREE.InstancedMesh>(null);
  const coneRef = useRef<THREE.InstancedMesh>(null);
  const cylRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const groups: [RefObject<THREE.InstancedMesh | null>, Instance[]][] = [
      [rockRef, rocks],
      [bushRef, bushes],
      [coneRef, cones],
      [cylRef, cylinders],
    ];
    for (const [ref, list] of groups) {
      const mesh = ref.current;
      if (!mesh) continue;
      for (let i = 0; i < list.length; i++) {
        mesh.setMatrixAt(i, list[i].m);
        mesh.setColorAt(i, list[i].color);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }, [rocks, bushes, cones, cylinders]);

  return (
    <group>
      {/* rocks — one draw call */}
      <instancedMesh ref={rockRef} args={[undefined, undefined, Math.max(1, rocks.length)]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial flatShading roughness={0.95} metalness={0.04} />
      </instancedMesh>
      {/* shrubs — one draw call */}
      <instancedMesh ref={bushRef} args={[undefined, undefined, Math.max(1, bushes.length)]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial flatShading roughness={0.88} metalness={0.04} />
      </instancedMesh>
      {/* grass blades + tree foliage — one draw call */}
      <instancedMesh ref={coneRef} args={[undefined, undefined, Math.max(1, cones.length)]}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial flatShading roughness={0.9} metalness={0.03} />
      </instancedMesh>
      {/* stumps + tree trunks — one draw call */}
      <instancedMesh ref={cylRef} args={[undefined, undefined, Math.max(1, cylinders.length)]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial flatShading roughness={0.92} metalness={0.04} />
      </instancedMesh>
    </group>
  );
}

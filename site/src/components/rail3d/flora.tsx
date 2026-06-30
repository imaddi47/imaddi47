"use client";

import { useMemo } from "react";
import { Tree } from "./tree";

/**
 * Trackside nature, lining the descending rail. Everything here lives inside
 * the SnakeScene `world` group, so it rides the same scroll-anchored parallax
 * as the rails and the engine. Placement is seeded (stable across frames) and
 * hugs the rails on the *outer* side — sitting on the track's own plane, like
 * the checkpoint trees — so it reads as scenery lining the line rather than
 * objects floating in space.
 */

const WOOD = "#3a2a1b";
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

/** A faceted boulder cluster — sits grounded, only a touch of tilt. */
function Rocks({ rng, scale = 1 }: { rng: () => number; scale?: number }) {
  const lumps = 2 + Math.floor(rng() * 2);
  return (
    <group scale={scale}>
      {Array.from({ length: lumps }, (_, i) => {
        const r = 5 + rng() * 6;
        return (
          <mesh
            key={i}
            position={[(rng() - 0.5) * 14, r * 0.45, (rng() - 0.5) * 12]}
            rotation={[(rng() - 0.5) * 0.4, rng() * Math.PI, (rng() - 0.5) * 0.4]}
            scale={[1, 0.7 + rng() * 0.4, 1]}
          >
            <dodecahedronGeometry args={[r, 0]} />
            <meshStandardMaterial color={ROCK[i % ROCK.length]} roughness={0.95} metalness={0.04} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

/** A rounded shrub — overlapping low-detail icosahedra, sitting on the ground. */
function Bush({ rng, scale = 1 }: { rng: () => number; scale?: number }) {
  const blobs = 3 + Math.floor(rng() * 2);
  return (
    <group scale={scale}>
      {Array.from({ length: blobs }, (_, i) => {
        const r = 7 + rng() * 5;
        return (
          <mesh
            key={i}
            position={[(rng() - 0.5) * 16, r * 0.6 + rng() * 3, (rng() - 0.5) * 12]}
            rotation={[rng() * Math.PI, rng() * Math.PI, 0]}
          >
            <icosahedronGeometry args={[r, 0]} />
            <meshStandardMaterial color={LEAF[i % LEAF.length]} roughness={0.88} metalness={0.04} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

/** A splayed tuft of grass blades, rooted at the ground. */
function GrassTuft({ rng, scale = 1 }: { rng: () => number; scale?: number }) {
  const blades = 5 + Math.floor(rng() * 4);
  const color = LEAF[Math.floor(rng() * LEAF.length)];
  return (
    <group scale={scale}>
      {Array.from({ length: blades }, (_, i) => {
        const h = 9 + rng() * 9;
        const lean = (rng() - 0.5) * 0.5;
        return (
          <mesh key={i} position={[(rng() - 0.5) * 12, h / 2, (rng() - 0.5) * 10]} rotation={[lean, rng() * Math.PI, lean]}>
            <coneGeometry args={[1.1, h, 4]} />
            <meshStandardMaterial color={color} roughness={0.9} metalness={0.03} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

/** A cut stump with a paler sawn top. */
function Stump({ rng, scale = 1 }: { rng: () => number; scale?: number }) {
  const h = 9 + rng() * 6;
  const r = 5 + rng() * 2;
  return (
    <group scale={scale}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[r * 0.9, r, h, 9]} />
        <meshStandardMaterial color={WOOD} roughness={0.92} metalness={0.04} flatShading />
      </mesh>
      <mesh position={[0, h, 0]}>
        <cylinderGeometry args={[r * 0.9, r * 0.9, 1.4, 9]} />
        <meshStandardMaterial color={WOOD_HI} roughness={0.85} metalness={0.04} flatShading />
      </mesh>
    </group>
  );
}

type Item = {
  kind: "tree" | "rocks" | "bush" | "grass" | "stump";
  pos: [number, number, number];
  rotY: number;
  scale: number;
  seed: number;
};

type Props = {
  docHeight: number;
  trackX: (d: number) => number;
  zAmp: number;
  /** rough density: items per 1000px of document */
  density?: number;
};

const GAUGE_HALF = 16; // matches SnakeScene rail gauge

export function Scatter({ docHeight, trackX, zAmp, density = 5 }: Props) {
  const items = useMemo(() => {
    const rand = mulberry32(0x5eed ^ Math.round(docHeight));
    const top = 420; // leave the cover header clear
    const bottom = 240;
    const usable = Math.max(1, docHeight - top - bottom);
    const count = Math.min(90, Math.max(8, Math.round((usable / 1000) * density)));
    const kinds: Item["kind"][] = ["tree", "rocks", "bush", "grass", "stump"];
    const weights = [3, 2, 3, 2, 1];
    const bag = kinds.flatMap((k, i) => Array(weights[i]).fill(k));

    const built: Item[] = [];
    for (let i = 0; i < count; i++) {
      const d = top + ((i + rand() * 0.85) / count) * usable;
      const baseX = trackX(d);
      const sign = baseX === 0 ? (rand() < 0.5 ? -1 : 1) : Math.sign(baseX);
      // hug the rails on the outer side, just past the sleepers
      const x = baseX + sign * (GAUGE_HALF + 8 + rand() * 56);
      // sit on the track's own plane (small jitter only) so nothing floats
      const z = zAmp * Math.sin(d * 0.01) - 2 + (rand() - 0.5) * 6;
      const kind = bag[Math.floor(rand() * bag.length)];
      const scale = kind === "tree" ? 1.0 + rand() * 1.0 : 0.9 + rand() * 0.9;
      built.push({ kind, pos: [x, -d, z], rotY: rand() * Math.PI * 2, scale, seed: Math.floor(rand() * 1e9) });
    }
    return built;
  }, [docHeight, trackX, zAmp, density]);

  return (
    <group>
      {items.map((it, i) => (
        <group key={i} position={it.pos} rotation={[0, it.rotY, 0]}>
          {it.kind === "tree" && <Tree variant={i % 2} scale={it.scale} />}
          {it.kind === "rocks" && <Rocks rng={mulberry32(it.seed)} scale={it.scale} />}
          {it.kind === "bush" && <Bush rng={mulberry32(it.seed)} scale={it.scale} />}
          {it.kind === "grass" && <GrassTuft rng={mulberry32(it.seed)} scale={it.scale} />}
          {it.kind === "stump" && <Stump rng={mulberry32(it.seed)} scale={it.scale} />}
        </group>
      ))}
    </group>
  );
}

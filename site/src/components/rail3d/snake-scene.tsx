"use client";

import { memo, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Html } from "@react-three/drei";
import * as THREE from "three";
import { Locomotive } from "./locomotive";
import { Tree } from "./tree";
import { Scatter } from "./flora";

export type SnakeNode = { y: number; x: number };
export type SnakeStation = { id: string; numeral: string; label: string; y: number; x: number };

type Props = {
  width: number;
  height: number; // viewport height
  docHeight: number;
  nodes: SnakeNode[]; // {y: docY, x: world x} alternating sides
  stations: SnakeStation[];
  scroll: RefObject<number>; // current scrollY
  progress: RefObject<number>; // 0..1
  activeId: string;
  reduced: boolean;
  onSelect: (id: string) => void;
};

const GAUGE = 32;
const RAIL_R = 3.1; // thicker rails
const RAIL_Z = 4; // rails ride above the sleepers
const RAIL_COLOR = "#e9dfce"; // theme secondary — pale "white" rails
const SLEEPER_COLOR = "#4a3c29";
const Z_AMP = 16;
const ENGINE_LEAD = 300; // engine rides ahead of the read line so it's in view from the cover
const ENGINE_SCALE = 1.55; // a chunkier, more present locomotive

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * One checkpoint on the line: a tree, a signal lamp, and a clickable label.
 * Memoised on `active` so a scroll that changes the active station only
 * re-renders the two stations whose state flipped — the other labels' drei
 * `Html` portals stay mounted instead of reconciling every frame, which is
 * what kept the scroll feeling janky.
 */
const Station = memo(function Station({
  station,
  active,
  onSelect,
}: {
  station: SnakeStation;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const inward = station.x <= 0 ? 1 : -1; // label points toward page centre
  return (
    <group position={[station.x, -station.y, Z_AMP * Math.sin(station.y * 0.01)]}>
      {/* a checkpoint tree on the outer side of the line */}
      <Tree position={[-58 * inward, -GAUGE / 2 - 10, 2]} variant={station.label.length % 2} active={active} scale={2.2} />
      <mesh position={[14 * inward, 0, 8]}>
        <cylinderGeometry args={[1.1, 1.1, 26, 8]} />
        <meshStandardMaterial color="#c8973f" metalness={0.85} roughness={0.4} />
      </mesh>
      <mesh position={[14 * inward, 13, 8]}>
        <sphereGeometry args={[2.6, 12, 12]} />
        <meshStandardMaterial
          color={active ? "#ffd27a" : "#6c5836"}
          emissive={active ? "#ffb347" : "#000000"}
          emissiveIntensity={active ? 2.4 : 0}
          toneMapped={false}
        />
      </mesh>
      <Html position={[22 * inward, 0, 8]} style={{ pointerEvents: "auto" }}>
        <button
          onClick={() => onSelect(station.id)}
          data-cursor="hover"
          className="flex items-center gap-2 whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
          style={{ transform: `translate(${inward < 0 ? "-100%" : "0"}, -50%)` }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 10, letterSpacing: 0.5, padding: "2px 6px", borderRadius: 3,
              color: active ? "var(--paper)" : "var(--ink)",
              background: active ? "var(--accent)" : "transparent",
              border: active ? "none" : "1px solid var(--rule-strong)",
            }}
          >
            {station.numeral}
          </span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 10, letterSpacing: 0.8, color: "var(--ink)", opacity: active ? 0.92 : 0.4 }}
          >
            {station.label}
          </span>
        </button>
      </Html>
    </group>
  );
});

export function SnakeScene({ width, height, docHeight, nodes, stations, scroll, progress, activeId, reduced, onSelect }: Props) {
  const world = useRef<THREE.Group>(null);
  const engine = useRef<THREE.Group>(null);
  const sleeperRef = useRef<THREE.InstancedMesh>(null);

  // trackX(docY): smooth alternation between the side nodes.
  const trackX = useMemo(() => {
    const pts = [...nodes].sort((a, b) => a.y - b.y);
    return (d: number) => {
      if (pts.length === 0) return 0;
      if (d <= pts[0].y) return pts[0].x;
      if (d >= pts[pts.length - 1].y) return pts[pts.length - 1].x;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        if (d >= a.y && d <= b.y) {
          const t = smoothstep((d - a.y) / Math.max(1, b.y - a.y));
          return a.x + (b.x - a.x) * t;
        }
      }
      return pts[pts.length - 1].x;
    };
  }, [nodes]);

  const point = useMemo(() => {
    return (d: number, out: THREE.Vector3) => out.set(trackX(d), -d, Z_AMP * Math.sin(d * 0.01));
  }, [trackX]);

  const { leftCurve, rightCurve, sleepers } = useMemo(() => {
    const N = Math.max(40, Math.min(420, Math.round(docHeight / 16)));
    const left: THREE.Vector3[] = [];
    const right: THREE.Vector3[] = [];
    const sleepers: { pos: THREE.Vector3; quat: THREE.Quaternion }[] = [];
    const c = new THREE.Vector3();
    const c2 = new THREE.Vector3();
    const up = new THREE.Vector3(0, 0, 1);
    for (let i = 0; i <= N; i++) {
      const d = (i / N) * docHeight;
      point(d, c);
      point(d + 2, c2);
      const tan = c2.clone().sub(c).normalize();
      const normal = new THREE.Vector3(-tan.y, tan.x, 0).normalize();
      const lp = c.clone().addScaledVector(normal, GAUGE / 2);
      const rp = c.clone().addScaledVector(normal, -GAUGE / 2);
      lp.z += RAIL_Z;
      rp.z += RAIL_Z;
      left.push(lp);
      right.push(rp);
      if (i % 6 === 0) {
        const zAxis = up.clone().addScaledVector(tan, -up.dot(tan)).normalize();
        const m = new THREE.Matrix4().makeBasis(normal, tan, zAxis.lengthSq() ? zAxis : up);
        sleepers.push({ pos: c.clone(), quat: new THREE.Quaternion().setFromRotationMatrix(m) });
      }
    }
    return {
      leftCurve: new THREE.CatmullRomCurve3(left),
      rightCurve: new THREE.CatmullRomCurve3(right),
      sleepers,
    };
  }, [point, docHeight]);

  // Push every sleeper into one instanced mesh — one draw call for the whole ladder.
  useLayoutEffect(() => {
    const mesh = sleeperRef.current;
    if (!mesh) return;
    const one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < sleepers.length; i++) {
      mesh.setMatrixAt(i, new THREE.Matrix4().compose(sleepers[i].pos, sleepers[i].quat, one));
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [sleepers]);

  const scratch = useMemo(
    () => ({
      c: new THREE.Vector3(),
      c2: new THREE.Vector3(),
      up: new THREE.Vector3(0, 0, 1),
      yA: new THREE.Vector3(),
      zA: new THREE.Vector3(),
      xA: new THREE.Vector3(),
      m: new THREE.Matrix4(),
    }),
    [],
  );

  const camera = useThree((s) => s.camera);

  useFrame((state) => {
    // Sample scroll at render time — the freshest value, matching exactly what
    // the compositor is painting this frame. Writing the refs here (this runs
    // before the child Locomotive's own useFrame) keeps the engine in lockstep.
    const scrollY = window.scrollY;
    scroll.current = scrollY;
    progress.current = Math.max(0, Math.min(1, scrollY / Math.max(1, docHeight - height)));

    if (world.current) world.current.position.y = scrollY + height / 2;
    const g = engine.current;
    const dE = Math.min(docHeight, progress.current * docHeight + ENGINE_LEAD);
    point(dE, scratch.c);
    point(dE + 2, scratch.c2);
    if (g) {
      scratch.yA.copy(scratch.c2).sub(scratch.c).normalize();
      scratch.zA.copy(scratch.up).addScaledVector(scratch.yA, -scratch.up.dot(scratch.yA)).normalize();
      if (scratch.zA.lengthSq() < 1e-4) scratch.zA.set(0, 0, 1);
      scratch.xA.crossVectors(scratch.yA, scratch.zA).normalize();
      scratch.zA.crossVectors(scratch.xA, scratch.yA).normalize();
      scratch.m.makeBasis(scratch.xA, scratch.yA, scratch.zA);
      g.quaternion.setFromRotationMatrix(scratch.m);
      g.position.copy(scratch.c);
    }

    // Gentle axonometric drift — biased toward the engine's current side so we
    // catch its profile, plus a slow idle sway. Small angles keep the track
    // inside its half-column.
    const t = reduced ? 0 : state.clock.elapsedTime;
    const bias = THREE.MathUtils.clamp(scratch.c.x / Math.max(1, width * 0.24), -1, 1);
    const yaw = THREE.MathUtils.degToRad(32 + Math.sin(t * 0.22) * 9 - bias * 15);
    const pitch = THREE.MathUtils.degToRad(36 + Math.sin(t * 0.17) * 6);
    const D = 1400;
    const cp = Math.cos(pitch);
    camera.position.set(Math.sin(yaw) * cp * D, Math.sin(pitch) * D, Math.cos(yaw) * cp * D);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.7} color="#6a5236" />
      <directionalLight position={[-80, 120, 160]} intensity={2.4} color="#ffe7c4" />
      <Environment resolution={64}>
        <Lightformer intensity={1.5} color="#ffd9a0" position={[-60, 60, 80]} scale={[80, 160, 1]} />
        <Lightformer intensity={0.5} color="#b4472b" position={[70, -40, 50]} scale={[70, 110, 1]} />
        <Lightformer intensity={0.3} color="#2a2620" position={[0, 0, -90]} scale={[300, 300, 1]} />
      </Environment>

      <group ref={world}>
        {/* trackside nature, scattered along the line and parallaxing with it */}
        <Scatter docHeight={docHeight} trackX={trackX} zAmp={Z_AMP} />

        <instancedMesh ref={sleeperRef} args={[undefined, undefined, Math.max(1, sleepers.length)]}>
          <boxGeometry args={[GAUGE + 18, 7, 5]} />
          <meshStandardMaterial color={SLEEPER_COLOR} metalness={0.15} roughness={0.92} />
        </instancedMesh>

        <mesh>
          <tubeGeometry args={[leftCurve, Math.min(340, sleepers.length * 4 + 40), RAIL_R, 8, false]} />
          <meshStandardMaterial color={RAIL_COLOR} metalness={0.45} roughness={0.42} envMapIntensity={1.1} />
        </mesh>
        <mesh>
          <tubeGeometry args={[rightCurve, Math.min(340, sleepers.length * 4 + 40), RAIL_R, 8, false]} />
          <meshStandardMaterial color={RAIL_COLOR} metalness={0.45} roughness={0.42} envMapIntensity={1.1} />
        </mesh>

        {stations.map((s) => (
          <Station key={s.id} station={s} active={s.id === activeId} onSelect={onSelect} />
        ))}

        <group ref={engine} scale={ENGINE_SCALE}>
          <Locomotive progress={progress} reduced={reduced} />
        </group>
      </group>
    </>
  );
}

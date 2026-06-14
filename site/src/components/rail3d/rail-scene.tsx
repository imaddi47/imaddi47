"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Html } from "@react-three/drei";
import * as THREE from "three";
import { Locomotive } from "./locomotive";

export type Station3D = {
  id: string;
  numeral: string;
  label: string;
  frac: number;
};

type Props = {
  width: number;
  height: number;
  stations: Station3D[];
  progress: RefObject<number>;
  activeId: string;
  reduced: boolean;
  onSelect: (id: string) => void;
};

const TOP_PAD = 150;
const BOT_PAD = 70;
const GAUGE = 26;
const STEEL = "#39322a";

function clamp(n: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, n));
}

export function RailScene({ width, height, stations, progress, activeId, reduced, onSelect }: Props) {
  const engine = useRef<THREE.Group>(null);
  const tDisp = useRef(progress.current ?? 0);

  const { curve, leftCurve, rightCurve, sleepers, cx } = useMemo(() => {
    const topY = height / 2 - TOP_PAD;
    const botY = -height / 2 + BOT_PAD;
    const cx = -width * 0.1;
    const ax = 18;
    const az = 22;
    const waves = 3;

    const N = 16;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      pts.push(
        new THREE.Vector3(
          cx + ax * Math.sin(t * Math.PI * waves),
          topY - t * (topY - botY),
          az * Math.sin(t * Math.PI * waves + 1.2),
        ),
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);

    const S = 200;
    const left: THREE.Vector3[] = [];
    const right: THREE.Vector3[] = [];
    const sleepers: { pos: THREE.Vector3; quat: THREE.Quaternion }[] = [];
    const up = new THREE.Vector3(0, 0, 1);
    for (let i = 0; i <= S; i++) {
      const u = i / S;
      const p = curve.getPointAt(u);
      const tan = curve.getTangentAt(u).normalize();
      const normal = new THREE.Vector3(-tan.y, tan.x, 0).normalize();
      left.push(p.clone().add(normal.clone().multiplyScalar(GAUGE / 2)));
      right.push(p.clone().add(normal.clone().multiplyScalar(-GAUGE / 2)));
      if (i % 8 === 0) {
        const zAxis = up.clone().sub(tan.clone().multiplyScalar(up.dot(tan))).normalize();
        const xAxis = new THREE.Vector3().crossVectors(normal, tan).normalize();
        const m = new THREE.Matrix4().makeBasis(normal, tan, zAxis.lengthSq() ? zAxis : up);
        void xAxis;
        const quat = new THREE.Quaternion().setFromRotationMatrix(m);
        sleepers.push({ pos: p.clone(), quat });
      }
    }
    return {
      curve,
      leftCurve: new THREE.CatmullRomCurve3(left),
      rightCurve: new THREE.CatmullRomCurve3(right),
      sleepers,
      cx,
    };
  }, [width, height]);

  const stationPts = useMemo(
    () =>
      stations.map((s) => ({
        ...s,
        p: curve.getPointAt(clamp(s.frac)),
      })),
    [stations, curve],
  );

  // scratch objects (avoid per-frame allocation)
  const scratch = useMemo(
    () => ({
      up: new THREE.Vector3(0, 0, 1),
      yAxis: new THREE.Vector3(),
      zAxis: new THREE.Vector3(),
      xAxis: new THREE.Vector3(),
      m: new THREE.Matrix4(),
    }),
    [],
  );

  useFrame(() => {
    const g = engine.current;
    if (!g) return;
    const target = clamp(progress.current ?? 0);
    tDisp.current += (target - tDisp.current) * (reduced ? 1 : 0.12);
    const t = clamp(tDisp.current);

    const pos = curve.getPointAt(t);
    const tan = curve.getTangentAt(t).normalize();
    scratch.yAxis.copy(tan);
    scratch.zAxis.copy(scratch.up).addScaledVector(tan, -scratch.up.dot(tan)).normalize();
    if (!isFinite(scratch.zAxis.x) || scratch.zAxis.lengthSq() < 1e-4) scratch.zAxis.set(0, 0, 1);
    scratch.xAxis.crossVectors(scratch.yAxis, scratch.zAxis).normalize();
    scratch.zAxis.crossVectors(scratch.xAxis, scratch.yAxis).normalize();
    scratch.m.makeBasis(scratch.xAxis, scratch.yAxis, scratch.zAxis);
    g.quaternion.setFromRotationMatrix(scratch.m);
    g.position.copy(pos);
  });

  return (
    <>
      {/* lighting — warm key, cool rim, low ambient */}
      <ambientLight intensity={0.65} color="#6a5236" />
      <directionalLight position={[-60, 80, 120]} intensity={2.1} color="#ffe7c4" />
      <directionalLight position={[80, -60, 40]} intensity={0.7} color="#9a5a44" />
      <pointLight position={[40, 30, 90]} intensity={120} color="#ffeccb" distance={400} decay={1.4} />

      {/* procedural environment for believable metal (no external HDR) */}
      <Environment resolution={64}>
        <Lightformer intensity={1.4} color="#ffd9a0" position={[-40, 40, 60]} scale={[60, 120, 1]} />
        <Lightformer intensity={0.5} color="#b4472b" position={[50, -30, 40]} scale={[50, 80, 1]} />
        <Lightformer intensity={0.3} color="#2a2620" position={[0, 0, -60]} scale={[200, 200, 1]} />
      </Environment>

      {/* sleepers */}
      {sleepers.map((s, i) => (
        <mesh key={i} position={s.pos} quaternion={s.quat}>
          <boxGeometry args={[GAUGE + 12, 4, 3.4]} />
          <meshStandardMaterial color="#2a2017" metalness={0.2} roughness={0.9} />
        </mesh>
      ))}

      {/* two rails */}
      <mesh>
        <tubeGeometry args={[leftCurve, 220, 1.7, 8, false]} />
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.35} envMapIntensity={1.2} />
      </mesh>
      <mesh>
        <tubeGeometry args={[rightCurve, 220, 1.7, 8, false]} />
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.35} envMapIntensity={1.2} />
      </mesh>

      {/* stations — a brass lamp post + a DOM label */}
      {stationPts.map((s) => {
        const active = s.id === activeId;
        return (
          <group key={s.id} position={s.p}>
            <mesh position={[14, 0, 6]}>
              <cylinderGeometry args={[1, 1, 22, 8]} />
              <meshStandardMaterial color="#c8973f" metalness={0.85} roughness={0.4} />
            </mesh>
            <mesh position={[14, 11, 6]}>
              <sphereGeometry args={[2.4, 12, 12]} />
              <meshStandardMaterial
                color={active ? "#ffd27a" : "#6c5836"}
                emissive={active ? "#ffb347" : "#000000"}
                emissiveIntensity={active ? 2.2 : 0}
                toneMapped={false}
              />
            </mesh>
            <Html position={[20, 0, 6]} center={false} distanceFactor={undefined} style={{ pointerEvents: "auto" }}>
              <button
                onClick={() => onSelect(s.id)}
                data-cursor="hover"
                className="flex items-center gap-2 whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
                style={{ transform: "translateY(-50%)" }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: 0.5,
                    padding: "2px 5px",
                    borderRadius: 3,
                    color: active ? "var(--paper)" : "var(--ink)",
                    background: active ? "var(--accent)" : "transparent",
                    border: active ? "none" : "1px solid var(--rule-strong)",
                  }}
                >
                  {s.numeral}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: 0.6,
                    color: "var(--ink)",
                    opacity: active ? 0.92 : 0.45,
                  }}
                >
                  {s.label}
                </span>
              </button>
            </Html>
          </group>
        );
      })}

      {/* the locomotive */}
      <group ref={engine}>
        <Locomotive progress={progress} reduced={reduced} />
      </group>
    </>
  );
}
